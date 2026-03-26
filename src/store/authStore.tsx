import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { supabase } from "../supabase/supabase";
import type { User, AuthState } from "../types/auth";

type Action =
  | { type: "SET_USER"; payload: User | null }
  | { type: "LOADING_END" };

type AuthContextState = AuthState & { isLoading: boolean };

function reducer(state: AuthContextState, action: Action): AuthContextState {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: action.payload !== null,
        isLoading: false,
      };
    case "LOADING_END":
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
}

type Actions = {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name?: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

const StateCtx = createContext<AuthContextState | null>(null);
const ActionsCtx = createContext<Actions | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    user: null,
    isAuthenticated: false,
    isLoading: true, // 초기 로딩 상태 추가
  });

  useEffect(() => {
    // 1. 초기 접속 시 현재 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const user: User = {
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata?.full_name || "",
        };
        dispatch({ type: "SET_USER", payload: user });
      } else {
        dispatch({ type: "LOADING_END" });
      }
    });

    // 2. 인증 상태 변경 감지 (로그인, 로그아웃 등 실시간 대응)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const user: User = {
          id: session.user.id,
          email: session.user.email || "",
          name: session.user.user_metadata?.full_name || "",
        };
        dispatch({ type: "SET_USER", payload: user });
      } else {
        dispatch({ type: "SET_USER", payload: null });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const actions: Actions = {
    async login(email, password) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          console.error("[auth] login failed:", error.message);
          return false;
        }
        return !!data.user;
      } catch (error) {
        console.error("[auth] login failed:", toErrorMessage(error));
        return false;
      }
    },

    async signup(email, password, name) {
      try {
        const { data, error } = await supabase.auth.signUp({
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
        return !!data.user;
      } catch (error) {
        console.error("[auth] signup failed:", toErrorMessage(error));
        return false;
      }
    },

    async logout() {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("[auth] logout failed:", error.message);
      }
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
