// src/kanban/ApplicationCard.tsx
import type { Application } from "../types/application";
import { ui } from "../utils/ui";
import { calculateDDay } from "../utils/date";

export default function ApplicationCard({
  application,
  onClick,
}: {
  application: Application;
  onClick?: () => void;
}) {
  const badge = calculateDDay(application.deadline);

  return (
    <div
      className={`${ui.card} ${onClick ? "cursor-pointer hover:shadow-md transition" : ""}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold">{application.companyName}</div>
          <div className={ui.muted}>{application.jobTitle}</div>
        </div>
        {badge && (
          <div className="text-xs font-semibold rounded-lg border px-2 py-1">
            {badge}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className={ui.muted}>Resume versions</div>
        <div className="text-sm font-semibold">
          {application.versions?.length ?? 0}
        </div>
      </div>
    </div>
  );
}
