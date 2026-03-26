// src/kanban/KanbanBoard.tsx
import { useMemo, useCallback } from "react";
import KanbanColumn from "./KanbanColumn";
import type { Application } from "../types/application";

type Status = Application["status"];

const COLUMNS: { key: Status; title: string }[] = [
  { key: "writing", title: "작성 중" },
  { key: "submitted", title: "지원 완료" },
  { key: "passed", title: "합격" },
  { key: "failed", title: "불합격" },
];

export default function KanbanBoard({
  applications,
  onCardClick,
}: {
  applications: Application[];
  onCardClick?: (application: Application) => void;
}) {
  // useMemo로 그룹핑 결과를 캐싱하여 applications가 변경될 때만 재계산
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

  // useCallback으로 onCardClick 핸들러를 안정화하여 KanbanColumn 리렌더링 방지
  const handleCardClick = useCallback(
    (application: Application) => {
      onCardClick?.(application);
    },
    [onCardClick]
  );

  return (
    <section className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {COLUMNS.map(({ key, title }) => (
          <KanbanColumn
            key={key}
            title={title}
            status={key}
            applications={grouped[key]}
            onCardClick={handleCardClick}
          />
        ))}
      </div>
    </section>
  );
}
