import { useCallback, useMemo } from "react";
import type { Application } from "../types/application";
import KanbanColumn from "./KanbanColumn";

type Status = Application["status"];

const COLUMNS: { key: Status; title: string; tone: string }[] = [
  { key: "writing", title: "작성 중", tone: "bg-sky-100 text-sky-700" },
  { key: "submitted", title: "지원 완료", tone: "bg-amber-100 text-amber-700" },
  { key: "passed", title: "합격", tone: "bg-emerald-100 text-emerald-700" },
  { key: "failed", title: "불합격", tone: "bg-rose-100 text-rose-700" },
];

export default function KanbanBoard({
  applications,
  onCardClick,
}: {
  applications: Application[];
  onCardClick?: (application: Application) => void;
}) {
  const grouped = useMemo(() => {
    const map: Record<Status, Application[]> = {
      writing: [],
      submitted: [],
      passed: [],
      failed: [],
    };

    for (const application of applications) {
      map[application.status].push(application);
    }

    for (const status of Object.keys(map) as Status[]) {
      map[status].sort((a, b) => {
        const left = a.deadline ? new Date(a.deadline).getTime() : Number.POSITIVE_INFINITY;
        const right = b.deadline ? new Date(b.deadline).getTime() : Number.POSITIVE_INFINITY;
        return left - right;
      });
    }

    return map;
  }, [applications]);

  const handleCardClick = useCallback(
    (application: Application) => {
      onCardClick?.(application);
    },
    [onCardClick]
  );

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {COLUMNS.map((column) => (
          <span
            key={column.key}
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${column.tone}`}
          >
            {column.title}: {grouped[column.key].length}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        {COLUMNS.map((column) => (
          <KanbanColumn
            key={column.key}
            title={column.title}
            status={column.key}
            applications={grouped[column.key]}
            onCardClick={handleCardClick}
          />
        ))}
      </div>
    </section>
  );
}
