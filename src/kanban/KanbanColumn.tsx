// src/kanban/KanbanColumn.tsx
import { memo, useCallback } from "react";
import type { Application } from "../types/application";
import ApplicationCard from "./ApplicationCard";
import { ui } from "../utils/ui";

type Status = Application["status"];

/**
 * 칸반 컬럼 컴포넌트
 * React.memo로 감싸서 해당 status의 applications가 변경될 때만 리렌더링됩니다.
 * - 다른 status의 applications가 변경되어도 이 컬럼은 리렌더링되지 않음
 */
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
  // useCallback으로 onClick 핸들러를 안정화하여 ApplicationCard 리렌더링 방지
  const handleCardClick = useCallback(
    (app: Application) => {
      onCardClick?.(app);
    },
    [onCardClick]
  );

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
            <div className={ui.muted}>등록된 항목이 없습니다</div>
          </div>
        ) : (
          applications.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              onClick={() => handleCardClick(app)}
            />
          ))
        )}
      </div>
    </div>
  );
});

export default KanbanColumn;
