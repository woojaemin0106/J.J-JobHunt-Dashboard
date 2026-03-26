import { describe, expect, it } from "vitest";
import {
  applyLoadingEnd,
  applySetUser,
  createInitialAuthContextState,
  type AuthContextState,
} from "./authStatePolicy";

const USER = {
  id: "user-1",
  email: "user@example.com",
  name: "User",
};

describe("authStatePolicy", () => {
  it("creates initial auth context state", () => {
    expect(createInitialAuthContextState()).toEqual({
      user: null,
      isAuthenticated: false,
      isLoading: true,
    });
  });

  it("applies user login transition", () => {
    const current = createInitialAuthContextState();
    const next = applySetUser(current, USER);

    expect(next).toEqual({
      user: USER,
      isAuthenticated: true,
      isLoading: false,
    });
  });

  it("applies logout transition", () => {
    const current: AuthContextState = {
      user: USER,
      isAuthenticated: true,
      isLoading: true,
    };
    const next = applySetUser(current, null);

    expect(next).toEqual({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  it("ends loading while keeping a consistent guest contract", () => {
    const current: AuthContextState = {
      user: null,
      isAuthenticated: true,
      isLoading: true,
    };
    const next = applyLoadingEnd(current);

    expect(next).toEqual({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  it("ends loading while keeping a consistent authenticated contract", () => {
    const current: AuthContextState = {
      user: USER,
      isAuthenticated: false,
      isLoading: true,
    };
    const next = applyLoadingEnd(current);

    expect(next).toEqual({
      user: USER,
      isAuthenticated: true,
      isLoading: false,
    });
  });
});
