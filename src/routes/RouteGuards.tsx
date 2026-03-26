import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../store/authStore";
import {
  getProtectedRouteAction,
  getPublicOnlyRouteAction,
} from "./routeGuardPolicy";

function AuthLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center text-slate-500">
      인증 상태를 확인하는 중...
    </div>
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
