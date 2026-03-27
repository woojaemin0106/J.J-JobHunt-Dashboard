import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "react";
import {
  supabase,
  supabaseConfigError,
} from "../supabase/supabase";
import type { User } from "../types/auth";
import { storage } from "../utils/storage";
import {
  applyLoadingEnd,
  applySetUser,
  createInitialAuthContextState,
  type AuthContextState,
} from "./authStatePolicy";

type Action =
  | { type: "SET_USER"; payload: User | null }
  | { type: "LOADING_END" };

function reducer(state: AuthContextState, action: Action): AuthContextState {
  switch (action.type) {
    case "SET_USER":
      return applySetUser(state, action.payload);
    case "LOADING_END":
      return applyLoadingEnd(state);
    default:
      return state;
  }
}

type Actions = {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  continueAsGuest: () => void;
};

const AUTH_BOOTSTRAP_TIMEOUT_MS = 6000;
const GUEST_SESSION_STORAGE_KEY = "jj.jobhunt.auth.guest-session.v1";
const GUEST_USER: User = {
  id: "guest",
  email: "guest@jj-jobhunt.local",
  name: "Interview Guest",
};

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

function mapSupabaseUserToUser(user: {
  id: string;
  email?: string | null;
  user_metadata?: { full_name?: string };
}): User {
  return {
    id: user.id,
    email: user.email || "",
    name: user.user_metadata?.full_name || "",
  };
}

function getAuthServiceUnavailableReason(): string {
  return supabaseConfigError ?? "Supabase 인증 서비스에 연결할 수 없습니다.";
}

function hasGuestSession(): boolean {
  return storage.get<boolean>(GUEST_SESSION_STORAGE_KEY) === true;
}

function persistGuestSession(): void {
  storage.set(GUEST_SESSION_STORAGE_KEY, true);
}

function clearGuestSession(): void {
  storage.remove(GUEST_SESSION_STORAGE_KEY);
}

const StateCtx = createContext<AuthContextState | null>(null);
const ActionsCtx = createContext<Actions | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, createInitialAuthContextState());

  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | null = null;

    const finishLoading = () => {
      if (!isMounted) return;
      dispatch({ type: "LOADING_END" });
    };

    if (hasGuestSession()) {
      dispatch({ type: "SET_USER", payload: GUEST_USER });
      return () => {
        isMounted = false;
      };
    }

    if (!supabase) {
      console.error("[auth] bootstrap skipped:", getAuthServiceUnavailableReason());
      finishLoading();
      return () => {
        isMounted = false;
      };
    }
    const authClient = supabase.auth;

    const getSessionWithTimeout = async () => {
      let timeoutId: ReturnType<typeof setTimeout> | null = null;

      try {
        const timeoutPromise = new Promise<never>((_, reject) => {
          timeoutId = setTimeout(() => {
            reject(
              new Error(
                `auth bootstrap timeout (${AUTH_BOOTSTRAP_TIMEOUT_MS}ms)`
              )
            );
          }, AUTH_BOOTSTRAP_TIMEOUT_MS);
        });

        return await Promise.race([authClient.getSession(), timeoutPromise]);
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
      }
    };

    const bootstrap = async () => {
      try {
        const { data: { session }, error } = await getSessionWithTimeout();
        if (!isMounted) return;

        if (error) {
          console.error("[auth] initial session check failed:", error.message);
          finishLoading();
        } else if (session?.user) {
          clearGuestSession();
          dispatch({ type: "SET_USER", payload: mapSupabaseUserToUser(session.user) });
        } else {
          finishLoading();
        }
      } catch (error) {
        console.error("[auth] initial session check failed:", toErrorMessage(error));
        finishLoading();
      }

      if (!isMounted) return;

      const { data: { subscription } } = authClient.onAuthStateChange(
        (_event, session) => {
          if (!isMounted) return;

          if (session?.user) {
            clearGuestSession();
            dispatch({
              type: "SET_USER",
              payload: mapSupabaseUserToUser(session.user),
            });
          } else {
            clearGuestSession();
            dispatch({ type: "SET_USER", payload: null });
          }
        }
      );

      unsubscribe = () => subscription.unsubscribe();
    };

    void bootstrap();

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, []);

  const actions: Actions = {
    async login(email, password) {
      if (!supabase) {
        console.error("[auth] login skipped:", getAuthServiceUnavailableReason());
        return false;
      }
      const authClient = supabase.auth;

      try {
        const { data, error } = await authClient.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error("[auth] login failed:", error.message);
          return false;
        }
        if (data.user) {
          clearGuestSession();
        }
        return !!data.user;
      } catch (error) {
        console.error("[auth] login failed:", toErrorMessage(error));
        return false;
      }
    },

    async signup(email, password, name) {
      if (!supabase) {
        console.error("[auth] signup skipped:", getAuthServiceUnavailableReason());
        return false;
      }
      const authClient = supabase.auth;

      try {
        const { data, error } = await authClient.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        });

        if (error) {
          console.error("[auth] signup failed:", error.message);
          return false;
        }
        if (data.user) {
          clearGuestSession();
        }
        return !!data.user;
      } catch (error) {
        console.error("[auth] signup failed:", toErrorMessage(error));
        return false;
      }
    },

    async logout() {
      if (hasGuestSession() || state.user?.id === GUEST_USER.id) {
        clearGuestSession();
        dispatch({ type: "SET_USER", payload: null });
        return;
      }

      if (!supabase) {
        console.error("[auth] logout skipped:", getAuthServiceUnavailableReason());
        return;
      }
      const authClient = supabase.auth;

      const { error } = await authClient.signOut();
      if (error) {
        console.error("[auth] logout failed:", error.message);
      }
    },

    continueAsGuest() {
      persistGuestSession();
      dispatch({ type: "SET_USER", payload: GUEST_USER });
    },
  };

  return (
    <StateCtx.Provider value={state}>
      <ActionsCtx.Provider value={actions}>{children}</ActionsCtx.Provider>
    </StateCtx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(StateCtx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function useAuthActions() {
  const ctx = useContext(ActionsCtx);
  if (!ctx) throw new Error("useAuthActions must be used within AuthProvider");
  return ctx;
}
