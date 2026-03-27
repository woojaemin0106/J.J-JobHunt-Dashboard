import { useLocation, useNavigate } from "react-router-dom";
import { useAuth, useAuthActions } from "../store/authStore";
import { ui } from "../utils/ui";
import {
  APPLICATION_SEARCH_PARAM_KEYS,
  createApplicationSearchParams,
  DEFAULT_APPLICATION_STATUS_FILTER,
  normalizeApplicationQuery,
  normalizeApplicationStatus,
} from "../pages/applicationsSearchParams";

function titleFromPath(pathname: string) {
  if (pathname === "/") return "대시보드";
  if (pathname.startsWith("/applications")) return "지원 현황";
  if (pathname.startsWith("/resume")) return "이력서";
  if (pathname.startsWith("/notes")) return "메모";
  if (pathname.startsWith("/statistics")) return "통계";
  return "JJ 취업준비 대시보드";
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
        <div className="text-base font-black tracking-tight text-slate-900 sm:text-lg">
          {title}
        </div>
      </div>

      <div className="hidden flex-1 items-center gap-2 md:flex md:max-w-xl">
        <input
          key={searchInputKey}
          className={`${ui.input} h-10 bg-white/85`}
          placeholder="회사명/직무 검색 후 Enter"
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

      <div className="flex items-center gap-2">
        <button
          className={`${ui.btnSecondary} px-3 py-2 text-xs sm:text-sm`}
          onClick={() => navigate("/applications")}
          title="지원 현황으로 이동"
        >
          지원 현황
        </button>
        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <span className="hidden max-w-36 truncate text-sm text-slate-600 lg:inline">
              {user?.name || user?.email}
            </span>
            <button
              className={`${ui.btnSecondary} px-3 py-2 text-xs sm:text-sm`}
              onClick={logout}
              title="로그아웃"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <button
            className={`${ui.btnPrimary} px-3 py-2 text-xs sm:text-sm`}
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
