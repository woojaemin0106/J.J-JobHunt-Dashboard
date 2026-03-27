import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProtectedRoute, PublicOnlyRoute } from "./RouteGuards";
import type { User } from "../types/auth";

type MockAuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

const mockAuthState: MockAuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
};

vi.mock("../store/authStore", () => ({
  useAuth: () => mockAuthState,
}));

describe("RouteGuards integration", () => {
  beforeEach(() => {
    mockAuthState.user = null;
    mockAuthState.isAuthenticated = false;
    mockAuthState.isLoading = false;
  });

  it("redirects unauthenticated users away from protected routes", async () => {
    render(
      <MemoryRouter initialEntries={["/applications"]}>
        <Routes>
          <Route
            path="/applications"
            element={
              <ProtectedRoute>
                <div data-testid="protected-content">Protected Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByTestId("login-page")).toBeInTheDocument();
    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
  });

  it("redirects authenticated users away from public-only routes", async () => {
    mockAuthState.isAuthenticated = true;
    mockAuthState.user = { id: "user-1", email: "demo@example.com", name: "Demo" };

    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <div data-testid="public-content">Public Content</div>
              </PublicOnlyRoute>
            }
          />
          <Route path="/" element={<div data-testid="home-page">Home Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByTestId("home-page")).toBeInTheDocument();
    expect(screen.queryByTestId("public-content")).not.toBeInTheDocument();
  });

  it("shows loading screen while auth state is resolving", () => {
    mockAuthState.isLoading = true;

    render(
      <MemoryRouter initialEntries={["/applications"]}>
        <Routes>
          <Route
            path="/applications"
            element={
              <ProtectedRoute>
                <div data-testid="protected-content">Protected Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId("auth-loading-screen")).toBeInTheDocument();
    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
  });
});
