// src/layout/Sidebar.tsx
import { NavLink } from "react-router-dom";
import { ui } from "../utils/ui";

const linkBase = "block rounded-xl px-3 py-2 text-sm font-medium transition";

const linkActive = "bg-slate-100";
const linkIdle = "hover:bg-slate-50";

export default function Sidebar() {
  return (
    <div className="p-4">
      <div className="mb-6">
        <div className="text-xl font-bold">JOBFLUX</div>
        <div className={ui.muted}>한 눈에서 보는 취업 준비</div>
      </div>

      <nav className="space-y-1">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkIdle}`
          }
        >
          홈
        </NavLink>

        <NavLink
          to="/applications"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkIdle}`
          }
        >
          지원 현황
        </NavLink>

        <NavLink
          to="/resume"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkIdle}`
          }
        >
          이력서 관리
        </NavLink>

        <NavLink
          to="/notes"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkIdle}`
          }
        >
          메모장
        </NavLink>

        <NavLink
          to="/statistics"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkIdle}`
          }
        >
          취업 통계
        </NavLink>
      </nav>
    </div>
  );
}
