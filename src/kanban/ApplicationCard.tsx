// src/kanban/ApplicationCard.tsx
import type { Application } from "../types/application";
import { ui } from "../utils/ui";

function dday(deadline: string) {
  if (!deadline) return null;
  const end = new Date(deadline + "T23:59:59").getTime();
  const now = Date.now();
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  if (diff < 0) return `D+${Math.abs(diff)}`;
  if (diff === 0) return "D-DAY";
  return `D-${diff}`;
}

export default function ApplicationCard({
  application,
}: {
  application: Application;
}) {
  const badge = dday(application.deadline);

  return (
    <div className={ui.card}>
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
