import { useEffect } from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthProvider, useAuth, useAuthActions } from "./authStore";

const getSessionMock = vi.fn();
const onAuthStateChangeMock = vi.fn();
const signInWithPasswordMock = vi.fn();
const signUpMock = vi.fn();
const signOutMock = vi.fn();
const GUEST_SESSION_STORAGE_KEY = "jj.jobhunt.auth.guest-session.v1";
let isSupabaseAvailable = true;

vi.mock("../supabase/supabase", () => ({
  get supabase() {
    if (!isSupabaseAvailable) return null;
    return {
      auth: {
        getSession: (...args: unknown[]) => getSessionMock(...args),
        onAuthStateChange: (...args: unknown[]) => onAuthStateChangeMock(...args),
        signInWithPassword: (...args: unknown[]) => signInWithPasswordMock(...args),
        signUp: (...args: unknown[]) => signUpMock(...args),
        signOut: (...args: unknown[]) => signOutMock(...args),
      },
    };
  },
  get supabaseConfigError() {
    return isSupabaseAvailable ? null : "Supabase unavailable in authStore test";
  },
}));

let latestActions: ReturnType<typeof useAuthActions> | null = null;

function AuthProbe() {
  const auth = useAuth();
  const actions = useAuthActions();

  useEffect(() => {
    latestActions = actions;
  }, [actions]);

  return (
    <div data-testid="auth-probe">
      {auth.isLoading ? "loading" : "ready"}:{String(auth.isAuthenticated)}:
      {auth.user?.email ?? "none"}
    </div>
  );
}

describe("authStore", () => {
  beforeEach(() => {
    isSupabaseAvailable = true;
    latestActions = null;
    localStorage.clear();

    getSessionMock.mockReset();
    onAuthStateChangeMock.mockReset();
    signInWithPasswordMock.mockReset();
    signUpMock.mockReset();
    signOutMock.mockReset();

    getSessionMock.mockResolvedValue({ data: { session: null }, error: null });
    onAuthStateChangeMock.mockReturnValue({
      data: {
        subscription: {
          unsubscribe: vi.fn(),
        },
      },
    });
    signInWithPasswordMock.mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    });
    signUpMock.mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    });
    signOutMock.mockResolvedValue({ error: null });

    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  async function renderAuthProvider() {
    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("auth-probe")).toHaveTextContent("ready:false:none");
    });
  }

  it("returns true on successful login", async () => {
    await renderAuthProvider();

    const result = await act(async () => {
      return latestActions!.login("demo@example.com", "password");
    });

    expect(result).toBe(true);
    expect(signInWithPasswordMock).toHaveBeenCalledWith({
      email: "demo@example.com",
      password: "password",
    });
  });

  it("returns false on failed login and signup", async () => {
    signInWithPasswordMock.mockResolvedValueOnce({
      data: { user: null },
      error: { message: "invalid credentials" },
    });
    signUpMock.mockResolvedValueOnce({
      data: { user: null },
      error: { message: "signup failed" },
    });

    await renderAuthProvider();

    const loginResult = await act(async () => {
      return latestActions!.login("demo@example.com", "wrong");
    });
    const signupResult = await act(async () => {
      return latestActions!.signup("demo@example.com", "password", "Demo");
    });

    expect(loginResult).toBe(false);
    expect(signupResult).toBe(false);
  });

  it("continues as guest and persists local guest session", async () => {
    await renderAuthProvider();

    act(() => {
      latestActions!.continueAsGuest();
    });

    expect(screen.getByTestId("auth-probe")).toHaveTextContent(
      "ready:true:guest@jj-jobhunt.local"
    );
    expect(localStorage.getItem(GUEST_SESSION_STORAGE_KEY)).toBe("true");
  });

  it("hydrates guest session from local storage and logs out locally", async () => {
    localStorage.setItem(GUEST_SESSION_STORAGE_KEY, "true");

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("auth-probe")).toHaveTextContent(
        "ready:true:guest@jj-jobhunt.local"
      );
    });

    await act(async () => {
      await latestActions!.logout();
    });

    expect(screen.getByTestId("auth-probe")).toHaveTextContent("ready:false:none");
    expect(localStorage.getItem(GUEST_SESSION_STORAGE_KEY)).toBeNull();
    expect(signOutMock).not.toHaveBeenCalled();
  });

  it("returns false for auth actions when supabase is unavailable", async () => {
    isSupabaseAvailable = false;

    render(
      <AuthProvider>
        <AuthProbe />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("auth-probe")).toHaveTextContent("ready:false:none");
    });

    const loginResult = await act(async () => {
      return latestActions!.login("demo@example.com", "password");
    });
    const signupResult = await act(async () => {
      return latestActions!.signup("demo@example.com", "password", "Demo");
    });

    await act(async () => {
      await latestActions!.logout();
    });

    expect(loginResult).toBe(false);
    expect(signupResult).toBe(false);
  });

  it("handles bootstrap error and still exits loading", async () => {
    getSessionMock.mockResolvedValueOnce({
      data: { session: null },
      error: { message: "bootstrap failed" },
    });

    await renderAuthProvider();
    expect(console.error).toHaveBeenCalled();
  });

  it("reacts to auth state change subscription events", async () => {
    let authStateHandler: ((event: string, session: unknown) => void) | null = null;
    onAuthStateChangeMock.mockImplementationOnce((handler: typeof authStateHandler) => {
      authStateHandler = handler;
      return {
        data: {
          subscription: {
            unsubscribe: vi.fn(),
          },
        },
      };
    });

    await renderAuthProvider();

    act(() => {
      authStateHandler?.("SIGNED_IN", {
        user: {
          id: "user-2",
          email: "signed-in@example.com",
          user_metadata: { full_name: "Signed In" },
        },
      });
    });

    expect(screen.getByTestId("auth-probe")).toHaveTextContent(
      "ready:true:signed-in@example.com"
    );

    act(() => {
      authStateHandler?.("SIGNED_OUT", null);
    });

    expect(screen.getByTestId("auth-probe")).toHaveTextContent("ready:false:none");
  });
});
