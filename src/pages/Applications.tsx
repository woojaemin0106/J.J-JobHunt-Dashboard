import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ui } from "../utils/ui";
import KanbanBoard from "../kanban/KanbanBoard";
import ApplicationModal from "../kanban/ApplicationModal";
import type { Application } from "../types/application";

export default function Applications() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);

  // URL query parameter를 확인하여 모달 열기
  useEffect(() => {
    if (searchParams.get("new") === "true") {
      setIsModalOpen(true);
      setSelectedApplication(null);
      // URL에서 query parameter 제거
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleAddNew = () => {
    setSelectedApplication(null);
    setIsModalOpen(true);
  };

  const handleCardClick = (app: Application) => {
    setSelectedApplication(app);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
  };

  return (
    <div className="space-y-4">
      <div className={ui.card}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className={ui.cardTitle}>지원 현황</div>
            <div className={ui.muted}>지원 현황을 단계별로 관리</div>
          </div>
          <button className={ui.btnPrimary} onClick={handleAddNew}>
            + 새 지원 추가
          </button>
        </div>
      </div>

      <KanbanBoard onCardClick={handleCardClick} />

      <ApplicationModal
        application={selectedApplication}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
