// src/kanban/KanbanColumn.tsx
import type { Application } from "../types/application";
import ApplicationCard from "./ApplicationCard";
import { ui } from "../utils/ui";

type Status = Application["status"];

export default function KanbanColumn({
  title,
  status,
  applications,
}: {
  title: string;
  status: Status;
  applications: Application[];
}) {
  return (
    <div className="space-y-3">
      <div className={ui.card}>
        <div className="flex items-center justify-between">
          <div className="font-semibold">{title}</div>
          <div className="text-sm text-slate-500">{applications.length}</div>
        </div>
        <div className="mt-1 text-xs text-slate-500">{status}</div>
      </div>

      <div className="space-y-3">
        {applications.length === 0 ? (
          <div className={ui.card}>
            <div className={ui.muted}>No items yet</div>
          </div>
        ) : (
          applications.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))
        )}
      </div>
    </div>
  );
}
