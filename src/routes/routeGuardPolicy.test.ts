import { describe, expect, it } from "vitest";
import {
  getProtectedRouteAction,
  getPublicOnlyRouteAction,
} from "./routeGuardPolicy";

describe("routeGuardPolicy", () => {
  describe("getProtectedRouteAction", () => {
    it("returns loading while auth state is being resolved", () => {
      expect(
        getProtectedRouteAction({
          isAuthenticated: false,
          isLoading: true,
        })
      ).toBe("loading");
    });

    it("redirects unauthenticated users to login", () => {
      expect(
        getProtectedRouteAction({
          isAuthenticated: false,
          isLoading: false,
        })
      ).toBe("redirect-login");
    });

    it("allows authenticated users", () => {
      expect(
        getProtectedRouteAction({
          isAuthenticated: true,
          isLoading: false,
        })
      ).toBe("allow");
    });
  });

  describe("getPublicOnlyRouteAction", () => {
    it("returns loading while auth state is being resolved", () => {
      expect(
        getPublicOnlyRouteAction({
          isAuthenticated: false,
          isLoading: true,
        })
      ).toBe("loading");
    });

    it("allows unauthenticated users", () => {
      expect(
        getPublicOnlyRouteAction({
          isAuthenticated: false,
          isLoading: false,
        })
      ).toBe("allow");
    });

    it("redirects authenticated users to home", () => {
      expect(
        getPublicOnlyRouteAction({
          isAuthenticated: true,
          isLoading: false,
        })
      ).toBe("redirect-home");
    });
  });
});
