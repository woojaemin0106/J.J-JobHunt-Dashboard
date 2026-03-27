import { memo, useCallback } from "react";
import type { Application } from "../types/application";
import ApplicationCard from "./ApplicationCard";

type Status = Application["status"];

function statusTone(status: Status) {
  if (status === "writing") return "bg-sky-100 text-sky-700 border-sky-200";
  if (status === "submitted") return "bg-amber-100 text-amber-700 border-amber-200";
  if (status === "passed") return "bg-emerald-100 text-emerald-700 border-emerald-200";
  return "bg-rose-100 text-rose-700 border-rose-200";
}

const KanbanColumn = memo(function KanbanColumn({
  title,
  status,
  applications,
  onCardClick,
}: {
  title: string;
  status: Status;
  applications: Application[];
  onCardClick?: (application: Application) => void;
}) {
  const handleCardClick = useCallback(
    (application: Application) => {
      onCardClick?.(application);
    },
    [onCardClick]
  );

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/85 p-3 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${statusTone(
              status
            )}`}
          >
            {title}
          </span>
        </div>
        <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
          {applications.length}
        </span>
      </div>

      <div className="space-y-2">
        {applications.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-sm text-slate-500">
            항목 없음
          </div>
        ) : (
          applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onClick={() => handleCardClick(application)}
            />
          ))
        )}
      </div>
    </div>
  );
});

export default KanbanColumn;
