// src/layout/Header.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { ui } from "../utils/ui";

function titleFromPath(pathname: string) {
  if (pathname === "/") return "Dashboard";
  if (pathname.startsWith("/applications")) return "Applications";
  if (pathname.startsWith("/resume")) return "Resume Hub";
  if (pathname.startsWith("/notes")) return "Notes";
  if (pathname.startsWith("/statistics")) return "Statistics";
  return "J.J JobHunt";
}

export default function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const title = titleFromPath(pathname);

  return (
    <>
      <div className="min-w-[220px]">
        <div className="text-lg font-semibold">{title}</div>
        <div className={ui.muted}>Track, apply, iterate.</div>
      </div>

      <div className="flex items-center gap-2 w-full max-w-xl">
        <input
          className={ui.input}
          placeholder="Search company, role..."
          onKeyDown={(e) => {
            if (e.key === "Enter") navigate("/applications");
          }}
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          className={ui.btnSecondary}
          onClick={() => navigate("/applications")}
        >
          Pipeline
        </button>
        <button
          className={ui.btnPrimary}
          onClick={() => alert("TODO: Open New Application modal")}
        >
          + New
        </button>
      </div>
    </>
  );
}
