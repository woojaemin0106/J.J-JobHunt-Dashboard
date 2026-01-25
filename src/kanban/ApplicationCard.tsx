// src/kanban/ApplicationCard.tsx
import { memo } from "react";
import type { Application } from "../types/application";
import { ui } from "../utils/ui";
import { calculateDDay } from "../utils/date";

/**
 * 지원 카드 컴포넌트
 * React.memo로 감싸서 props가 변경되지 않으면 리렌더링을 방지합니다.
 * - application 객체나 onClick 함수가 동일하면 리렌더링 스킵
 * - 다른 카드가 수정되어도 이 카드는 리렌더링되지 않음
 */
const ApplicationCard = memo(function ApplicationCard({
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
});

export default ApplicationCard;
