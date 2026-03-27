import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard", shortLabel: "DB" },
  { to: "/applications", label: "Applications", shortLabel: "AP" },
  { to: "/resume", label: "Resume", shortLabel: "RE" },
  { to: "/notes", label: "Notes", shortLabel: "NO" },
  { to: "/statistics", label: "Statistics", shortLabel: "ST" },
];

const linkBase =
  "group flex items-center gap-3 rounded-[14px] border border-transparent px-3 py-2.5 text-sm font-semibold text-slate-600 transition-all";
const linkIdle = "hover:border-slate-200 hover:bg-white hover:text-slate-900";
const linkActive =
  "border-blue-200/80 bg-gradient-to-r from-blue-50 to-emerald-50/40 text-slate-900 shadow-sm";

export default function Sidebar() {
  return (
    <div className="sticky top-0 h-screen overflow-y-auto p-4">
      <div className="mb-8 px-2">
        <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-700">
          Portfolio
        </div>
        <div className="mt-1 text-xl font-black tracking-tight text-slate-900">JOBFLUX</div>
        <p className="mt-2 text-sm text-slate-500">Focused tracker for job search execution.</p>
      </div>

      <nav className="space-y-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `${linkBase} ${isActive ? linkActive : linkIdle}`
            }
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-[10px] font-bold tracking-wide text-slate-600 group-hover:bg-slate-200">
              {item.shortLabel}
            </span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
