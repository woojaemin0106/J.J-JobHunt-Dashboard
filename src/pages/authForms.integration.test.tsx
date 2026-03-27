import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Login from "./Login";
import Signup from "./Signup";
import { ERROR_MESSAGES } from "../utils/errorMessages";

const loginMock = vi.fn();
const signupMock = vi.fn();
const continueAsGuestMock = vi.fn();

let mockSupabaseConfigured = true;
const mockDemoConfig = {
  enabled: true,
  email: "demo@example.com",
  password: "demo-password",
  isVisible: false,
};

vi.mock("../store/authStore", () => ({
  useAuthActions: () => ({
    login: (...args: unknown[]) => loginMock(...args),
    signup: (...args: unknown[]) => signupMock(...args),
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

function renderLoginRoute() {
  return render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<div data-testid="home-route">Home</div>} />
      </Routes>
    </MemoryRouter>
  );
}

function renderSignupRoute() {
  return render(
    <MemoryRouter initialEntries={["/signup"]}>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<div data-testid="home-route">Home</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("Auth forms integration", () => {
  beforeEach(() => {
    loginMock.mockReset();
    signupMock.mockReset();
    continueAsGuestMock.mockReset();
    loginMock.mockResolvedValue(true);
    signupMock.mockResolvedValue(true);
    mockSupabaseConfigured = true;
    mockDemoConfig.isVisible = false;
  });

  it("submits login form and redirects to home on success", async () => {
    renderLoginRoute();

    fireEvent.change(screen.getByLabelText(/이메일/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/비밀번호/i), {
      target: { value: "pass1234" },
    });

    fireEvent.click(screen.getByTestId("login-submit-button"));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith("user@example.com", "pass1234");
    });

    expect(await screen.findByTestId("home-route")).toBeInTheDocument();
  });

  it("shows service unavailable guidance when supabase is not configured", () => {
    mockSupabaseConfigured = false;
    renderLoginRoute();

    expect(screen.getByText(ERROR_MESSAGES.auth.serviceUnavailable)).toBeInTheDocument();
    expect(screen.getByTestId("login-submit-button")).toBeDisabled();
  });

  it("submits signup form and redirects to home on success", async () => {
    renderSignupRoute();

    fireEvent.change(screen.getByLabelText(/이름/i), {
      target: { value: "  Demo User  " },
    });
    fireEvent.change(screen.getByLabelText(/이메일/i), {
      target: { value: "  demo@example.com  " },
    });
    fireEvent.change(screen.getByLabelText(/비밀번호/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByTestId("signup-submit-button"));

    await waitFor(() => {
      expect(signupMock).toHaveBeenCalledWith(
        "demo@example.com",
        "password123",
        "Demo User"
      );
    });

    expect(await screen.findByTestId("home-route")).toBeInTheDocument();
  });

  it("shows recovery message when signup fails", async () => {
    signupMock.mockResolvedValue(false);
    renderSignupRoute();

    fireEvent.change(screen.getByLabelText(/이메일/i), {
      target: { value: "demo@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/비밀번호/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByTestId("signup-submit-button"));

    expect(await screen.findByTestId("signup-error-message")).toBeInTheDocument();
    expect(screen.getByText(ERROR_MESSAGES.auth.signupFailed)).toBeInTheDocument();
  });
});
