import { KanbanBoard } from "../kanban/KanbanBoard";
import { ui } from "../utils/ui";

export default function Applications() {
  return (
    <div className="space-y-4">
      <div className={ui.card}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className={ui.cardTitle}>Pipeline</div>
            <div className={ui.muted}>지원 현황을 단계별로 관리</div>
          </div>
          {/* 나중에 모달 연결 */}
          <button
            className={ui.btnPrimary}
            onClick={() => alert("TODO: Open modal")}
          >
            + New Application
          </button>
        </div>
      </div>

      <KanbanBoard />
    </div>
  );
}
