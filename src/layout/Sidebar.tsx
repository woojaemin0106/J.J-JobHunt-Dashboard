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
        <div className="text-xl font-bold">J.J Dashboard</div>
        <div className={ui.muted}>Job hunt in one place</div>
      </div>

      <nav className="space-y-1">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkIdle}`
          }
        >
          Home
        </NavLink>

        <NavLink
          to="/applications"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkIdle}`
          }
        >
          Applications
        </NavLink>

        <NavLink
          to="/resume"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkIdle}`
          }
        >
          Resume Hub
        </NavLink>
      </nav>
    </div>
  );
}
