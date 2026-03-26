// src/layout/Header.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { ui } from "../utils/ui";
import { useAuth, useAuthActions } from "../store/authStore";
import {
  APPLICATION_SEARCH_PARAM_KEYS,
  createApplicationSearchParams,
  DEFAULT_APPLICATION_STATUS_FILTER,
  normalizeApplicationQuery,
  normalizeApplicationStatus,
} from "../pages/applicationsSearchParams";

function titleFromPath(pathname: string) {
  if (pathname === "/") return "홈";
  if (pathname.startsWith("/applications")) return "지원 현황";
  if (pathname.startsWith("/resume")) return "이력서 관리";
  if (pathname.startsWith("/notes")) return "메모장";
  if (pathname.startsWith("/statistics")) return "취업 통계";
  return "J.J JobHunt";
}

export default function Header() {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const title = titleFromPath(pathname);
  const { isAuthenticated, user } = useAuth();
  const { logout } = useAuthActions();
  const isApplicationsPage = pathname.startsWith("/applications");
  const currentSearchParams = new URLSearchParams(search);
  const currentQuery = isApplicationsPage
    ? normalizeApplicationQuery(
        currentSearchParams.get(APPLICATION_SEARCH_PARAM_KEYS.query)
      )
    : "";
  const currentStatus = isApplicationsPage
    ? normalizeApplicationStatus(
        currentSearchParams.get(APPLICATION_SEARCH_PARAM_KEYS.status)
      )
    : DEFAULT_APPLICATION_STATUS_FILTER;
  const searchInputKey = `${pathname}:${search}`;

  return (
    <>
      <div className="min-w-0 flex-shrink-0">
        <div className="text-base sm:text-lg font-semibold truncate">{title}</div>
      </div>

      <div className="hidden md:flex items-center gap-2 flex-1 min-w-0 max-w-xl mx-4">
        <input
          key={searchInputKey}
          className={ui.input}
          placeholder="회사·직무 검색…"
          defaultValue={currentQuery}
          onKeyDown={(e) => {
            if (e.key !== "Enter" || e.nativeEvent.isComposing) return;

            const query = normalizeApplicationQuery(e.currentTarget.value);
            const params = createApplicationSearchParams({
              query,
              status: currentStatus,
            });
            const nextSearch = params.toString();

            navigate({
              pathname: "/applications",
              search: nextSearch ? `?${nextSearch}` : "",
            });
          }}
        />
      </div>

      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        <button
          className={`${ui.btnSecondary} px-2 sm:px-4 text-xs sm:text-sm`}
          onClick={() => navigate("/applications")}
          title="지원 현황"
        >
          <span className="hidden sm:inline">지원 현황</span>
          <span className="sm:hidden">지원</span>
        </button>
        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-sm text-slate-600">
              {user?.name || user?.email}
            </span>
            <button
              className={`${ui.btnSecondary} px-2 sm:px-4 text-xs sm:text-sm`}
              onClick={logout}
              title="로그아웃"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <button
            className={`${ui.btnPrimary} px-2 sm:px-4 text-xs sm:text-sm`}
            onClick={() => navigate("/login")}
            title="로그인"
          >
            로그인
          </button>
        )}
      </div>
    </>
  );
}
