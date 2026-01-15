// src/kanban/KanbanBoard.tsx
import { useMemo } from "react";
import KanbanColumn from "./KanbanColumn";
import type { Application } from "../types/application";
import { useApplications } from "../store/applicationStore";

type Status = Application["status"];

const COLUMNS: { key: Status; title: string }[] = [
  { key: "writing", title: "작성 중" },
  { key: "submitted", title: "지원 완료" },
  { key: "passed", title: "합격" },
  { key: "failed", title: "불합격" },
];

export default function KanbanBoard({
  onCardClick,
}: {
  onCardClick?: (application: Application) => void;
}) {
  const applications = useApplications();

  const grouped = useMemo(() => {
    const map: Record<Status, Application[]> = {
      writing: [],
      submitted: [],
      passed: [],
      failed: [],
    };

    for (const a of applications) map[a.status].push(a);

    // deadline 가까운 순 정렬 (string이지만 Date 파싱 가능)
    for (const k of Object.keys(map) as Status[]) {
      map[k].sort((x, y) => {
        const xd = x.deadline
          ? new Date(x.deadline).getTime()
          : Number.POSITIVE_INFINITY;
        const yd = y.deadline
          ? new Date(y.deadline).getTime()
          : Number.POSITIVE_INFINITY;
        return xd - yd;
      });
    }

    return map;
  }, [applications]);

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {COLUMNS.map(({ key, title }) => (
          <KanbanColumn
            key={key}
            title={title}
            status={key}
            applications={grouped[key]}
            onCardClick={onCardClick}
          />
        ))}
      </div>
    </section>
  );
}
