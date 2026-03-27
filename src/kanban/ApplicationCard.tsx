import { memo } from "react";
import type { Application } from "../types/application";
import { calculateDDay } from "../utils/date";

function statusAccent(status: Application["status"]) {
  if (status === "writing") return "border-l-sky-400";
  if (status === "submitted") return "border-l-amber-400";
  if (status === "passed") return "border-l-emerald-400";
  return "border-l-rose-400";
}

const ApplicationCard = memo(function ApplicationCard({
  application,
  onClick,
}: {
  application: Application;
  onClick?: () => void;
}) {
  const dday = calculateDDay(application.deadline);

  return (
    <button
      type="button"
      className={`w-full rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${statusAccent(
        application.status
      )} border-l-4 ${onClick ? "cursor-pointer" : "cursor-default"}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-sm font-bold text-slate-900">{application.companyName}</div>
          <div className="truncate text-xs text-slate-500">{application.jobTitle}</div>
        </div>
        {dday ? (
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
            {dday}
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>Versions {application.versions.length}</span>
        <span>{application.deadline || "No deadline"}</span>
      </div>
    </button>
  );
});

export default ApplicationCard;
