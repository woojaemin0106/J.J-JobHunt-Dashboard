import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider, useAuth } from "./authStore";

const getSessionMock = vi.fn();
const onAuthStateChangeMock = vi.fn();
const GUEST_SESSION_STORAGE_KEY = "jj.jobhunt.auth.guest-session.v1";
let isSupabaseAvailable = true;

vi.mock("../supabase/supabase", () => ({
  get supabase() {
    if (!isSupabaseAvailable) return null;
    return {
      auth: {
        getSession: (...args: unknown[]) => getSessionMock(...args),
        onAuthStateChange: (...args: unknown[]) => onAuthStateChangeMock(...args),
        signInWithPassword: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
      },
    };
  },
  get supabaseConfigError() {
    return isSupabaseAvailable ? null : "Supabase is unavailable for test";
  },
}));

function AuthProbe() {
  const { isLoading, isAuthenticated } = useAuth();
  return (
    <div data-testid="auth-bootstrap-state">
      {isLoading ? "loading" : "ready"}:{String(isAuthenticated)}
    </div>
  );
}

describe("AuthProvider bootstrap integration", () => {
  beforeEach(() => {
    isSupabaseAvailable = true;
    localStorage.clear();
    getSessionMock.mockReset();
    onAuthStateChangeMock.mockReset();
    onAuthStateChangeMock.mockReturnValue({
      data: {
        subscription: {
          unsubscribe: vi.fn(),
        },
      },
    });
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("stops loading immediately when Supabase is unavailable", async () => {
    isSupabaseAvailable = false;

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("auth-bootstrap-state")).toHaveTextContent("ready:false");
    });
  });

  it("hydrates guest mode immediately when guest session exists", async () => {
    localStorage.setItem(GUEST_SESSION_STORAGE_KEY, "true");
    isSupabaseAvailable = false;

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("auth-bootstrap-state")).toHaveTextContent("ready:true");
    });
  });

  it("hydrates authenticated state when bootstrap session exists", async () => {
    getSessionMock.mockResolvedValue({
      data: {
        session: {
          user: {
            id: "user-1",
            email: "demo@example.com",
            user_metadata: { full_name: "Demo User" },
          },
        },
      },
      error: null,
    });

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("auth-bootstrap-state")).toHaveTextContent("ready:true");
    });
  });
});
