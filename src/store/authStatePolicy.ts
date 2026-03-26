import type { User } from "../types/auth";

export type AuthContextState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

export function createInitialAuthContextState(): AuthContextState {
  return {
    user: null,
    isAuthenticated: false,
    isLoading: true,
  };
}

export function applySetUser(
  state: AuthContextState,
  user: User | null
): AuthContextState {
  return {
    ...state,
    user,
    isAuthenticated: user !== null,
    isLoading: false,
  };
}

export function applyLoadingEnd(state: AuthContextState): AuthContextState {
  return {
    ...state,
    // Keep the contract consistent even if previous state was malformed.
    isAuthenticated: state.user !== null,
    isLoading: false,
  };
}
