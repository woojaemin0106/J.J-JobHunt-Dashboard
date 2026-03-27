import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { LoadingScreen } from "../components/StateCards";
import { useAuth } from "../store/authStore";
import {
  getProtectedRouteAction,
  getPublicOnlyRouteAction,
} from "./routeGuardPolicy";

function AuthLoadingScreen() {
  return (
    <LoadingScreen
      testId="auth-loading-screen"
      title="인증 상태 확인 중"
      description="잠시만 기다려 주세요. 안전하게 인증 상태를 확인하고 있습니다."
    />
  );
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const action = getProtectedRouteAction({ isAuthenticated, isLoading });

  if (action === "loading") return <AuthLoadingScreen />;
  if (action === "redirect-login") return <Navigate to="/login" replace />;

  return <>{children}</>;
}

export function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const action = getPublicOnlyRouteAction({ isAuthenticated, isLoading });

  if (action === "loading") return <AuthLoadingScreen />;
  if (action === "redirect-home") return <Navigate to="/" replace />;

  return <>{children}</>;
}
