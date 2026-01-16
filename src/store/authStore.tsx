import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from "react";
import type { User, AuthState } from "../types/auth";
import { storage } from "../utils/storage";
import { generateId } from "../utils/id";

const STORAGE_KEY = "jj_jobhunt_auth_v1";

type Action =
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" }
  | { type: "INIT"; payload: User | null };

function reducer(state: AuthState, action: Action): AuthState {
  switch (action.type) {
    case "INIT":
      return {
        user: action.payload,
        isAuthenticated: action.payload !== null,
      };
    case "LOGIN":
      return {
        user: action.payload,
        isAuthenticated: true,
      };
    case "LOGOUT":
      return {
        user: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
}

type Actions = {
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name?: string) => Promise<boolean>;
  logout: () => void;
};

const StateCtx = createContext<AuthState | null>(null);
const ActionsCtx = createContext<Actions | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(
    reducer,
    { user: null, isAuthenticated: false },
    () => {
      const fromStorage = storage.get<User>(STORAGE_KEY);
      return {
        user: fromStorage,
        isAuthenticated: fromStorage !== null,
      };
    }
  );

  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      return;
    }
    if (state.user) {
      storage.set(STORAGE_KEY, state.user);
    } else {
      storage.remove(STORAGE_KEY);
    }
  }, [state.user]);

  const actions: Actions = {
    async login(email: string, password: string) {
      // 간단한 로그인 로직 (실제로는 API 호출)
      // 여기서는 localStorage에서 사용자 정보를 확인
      const users = storage.get<Array<{ email: string; password: string; user: User }>>("jj_jobhunt_users_v1") || [];
      const found = users.find(u => u.email === email && u.password === password);
      
      if (found) {
        dispatch({ type: "LOGIN", payload: found.user });
        return true;
      }
      return false;
    },
    async signup(email: string, password: string, name?: string) {
      // 간단한 회원가입 로직
      const users = storage.get<Array<{ email: string; password: string; user: User }>>("jj_jobhunt_users_v1") || [];
      
      // 중복 체크
      if (users.find(u => u.email === email)) {
        return false;
      }

      const newUser: User = {
        id: generateId(),
        email,
        name: name || email.split("@")[0],
      };

      users.push({
        email,
        password, // 실제로는 해시화해야 함
        user: newUser,
      });

      storage.set("jj_jobhunt_users_v1", users);
      dispatch({ type: "LOGIN", payload: newUser });
      return true;
    },
    logout() {
      dispatch({ type: "LOGOUT" });
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
