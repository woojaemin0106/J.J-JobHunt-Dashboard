// src/layout/Header.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { ui } from "../utils/ui";

function titleFromPath(pathname: string) {
  if (pathname === "/") return "Dashboard";
  if (pathname.startsWith("/applications")) return "Applications";
  if (pathname.startsWith("/resume")) return "Resume Hub";
  return "J.J Dashboard";
}

export default function Header() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const title = titleFromPath(pathname);

  return (
    <>
      <div>
        <div className="text-lg font-semibold">{title}</div>
        <div className={ui.muted}>Auto-deployed on Vercel</div>
      </div>

      <div className="flex items-center gap-2">
        {/* 지금은 자리만. 나중에 모달 연결 */}
        <button
          className={ui.btnSecondary}
          onClick={() => navigate("/applications")}
        >
          Go to Kanban
        </button>
        <button
          className={ui.btnPrimary}
          onClick={() => alert("TODO: New item")}
        >
          New
        </button>
      </div>
    </>
  );
}
