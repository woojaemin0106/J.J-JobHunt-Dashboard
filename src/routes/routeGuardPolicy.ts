export type RouteGuardState = {
  isAuthenticated: boolean;
  isLoading: boolean;
};

export type ProtectedRouteAction = "loading" | "allow" | "redirect-login";
export type PublicOnlyRouteAction = "loading" | "allow" | "redirect-home";

export function getProtectedRouteAction({
  isAuthenticated,
  isLoading,
}: RouteGuardState): ProtectedRouteAction {
  if (isLoading) return "loading";
  if (!isAuthenticated) return "redirect-login";
  return "allow";
}

export function getPublicOnlyRouteAction({
  isAuthenticated,
  isLoading,
}: RouteGuardState): PublicOnlyRouteAction {
  if (isLoading) return "loading";
  if (isAuthenticated) return "redirect-home";
  return "allow";
}
