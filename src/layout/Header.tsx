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
  if (pathname === "/") return "Dashboard";
  if (pathname.startsWith("/applications")) return "Applications";
  if (pathname.startsWith("/resume")) return "Resume";
  if (pathname.startsWith("/notes")) return "Notes";
  if (pathname.startsWith("/statistics")) return "Statistics";
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
        <div className="text-base font-black tracking-tight text-slate-900 sm:text-lg">
          {title}
        </div>
      </div>

      <div className="hidden flex-1 items-center gap-2 md:flex md:max-w-xl">
        <input
          key={searchInputKey}
          className={ui.input}
          placeholder="Search company or role and press Enter"
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
          title="Go to applications"
        >
          Applications
        </button>
        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <span className="hidden max-w-36 truncate text-sm text-slate-600 lg:inline">
              {user?.name || user?.email}
            </span>
            <button
              className={`${ui.btnSecondary} px-3 py-2 text-xs sm:text-sm`}
              onClick={logout}
              title="Logout"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            className={`${ui.btnPrimary} px-3 py-2 text-xs sm:text-sm`}
            onClick={() => navigate("/login")}
            title="Login"
          >
            Login
          </button>
        )}
      </div>
    </>
  );
}
