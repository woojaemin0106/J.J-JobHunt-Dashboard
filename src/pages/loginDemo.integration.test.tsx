import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Login from "./Login";

const loginMock = vi.fn();
const continueAsGuestMock = vi.fn();
let mockSupabaseConfigured = true;
const mockDemoConfig = {
  enabled: true,
  email: "demo@example.com",
  password: "demo-password",
  isVisible: true,
};

vi.mock("../store/authStore", () => ({
  useAuthActions: () => ({
    login: (...args: unknown[]) => loginMock(...args),
    continueAsGuest: (...args: unknown[]) => continueAsGuestMock(...args),
  }),
}));

vi.mock("../supabase/supabase", () => ({
  get isSupabaseConfigured() {
    return mockSupabaseConfigured;
  },
}));

vi.mock("../config/demoAuth", () => ({
  get demoAuthConfig() {
    return mockDemoConfig;
  },
}));

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<div data-testid="home-route">Home</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("Login demo mode integration", () => {
  beforeEach(() => {
    loginMock.mockReset();
    loginMock.mockResolvedValue(true);
    continueAsGuestMock.mockReset();
    mockSupabaseConfigured = true;
    mockDemoConfig.enabled = true;
    mockDemoConfig.email = "demo@example.com";
    mockDemoConfig.password = "demo-password";
    mockDemoConfig.isVisible = true;
  });

  it("shows demo login button and signs in with demo credentials", async () => {
    renderLogin();

    fireEvent.click(screen.getByTestId("demo-login-button"));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith("demo@example.com", "demo-password");
    });
    expect(await screen.findByTestId("home-route")).toBeInTheDocument();
  });

  it("always shows one-click guest login and redirects", async () => {
    renderLogin();

    fireEvent.click(screen.getByTestId("guest-login-button"));

    expect(continueAsGuestMock).toHaveBeenCalledTimes(1);
    expect(await screen.findByTestId("home-route")).toBeInTheDocument();
  });

  it("hides demo login button when demo config is unavailable", () => {
    mockDemoConfig.enabled = false;
    mockDemoConfig.email = "";
    mockDemoConfig.password = "";
    mockDemoConfig.isVisible = false;

    renderLogin();

    expect(screen.getByTestId("guest-login-button")).toBeInTheDocument();
    expect(screen.queryByTestId("demo-login-button")).not.toBeInTheDocument();
    expect(screen.queryByTestId("demo-login-notice")).not.toBeInTheDocument();
  });

  it("shows recovery message when demo login fails", async () => {
    loginMock.mockResolvedValue(false);
    renderLogin();

    fireEvent.click(screen.getByTestId("demo-login-button"));

    expect(await screen.findByTestId("login-error-message")).toBeInTheDocument();
  });

  it("keeps guest login visible even when supabase is not configured", () => {
    mockSupabaseConfigured = false;
    mockDemoConfig.enabled = false;
    mockDemoConfig.email = "";
    mockDemoConfig.password = "";
    mockDemoConfig.isVisible = false;

    renderLogin();

    expect(screen.getByTestId("guest-login-button")).toBeInTheDocument();
    expect(screen.queryByTestId("demo-login-button")).not.toBeInTheDocument();
  });
});
