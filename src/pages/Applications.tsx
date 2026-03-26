import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ui } from "../utils/ui";
import KanbanBoard from "../kanban/KanbanBoard";
import ApplicationModal from "../kanban/ApplicationModal";
import type { Application } from "../types/application";
import {
  APPLICATION_SEARCH_PARAM_KEYS,
} from "./applicationsSearchParams";

type ModalState =
  | { type: "create" }
  | { type: "edit"; application: Application }
  | null;

export default function Applications() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [modalState, setModalState] = useState<ModalState>(null);

  const isOpenByQuery =
    searchParams.get(APPLICATION_SEARCH_PARAM_KEYS.createNew) === "true";
  const isModalOpen = modalState !== null || isOpenByQuery;
  const selectedApplication =
    modalState?.type === "edit" ? modalState.application : null;
  const modalKey =
    modalState?.type === "edit"
      ? `edit-${modalState.application.id}`
      : isModalOpen
      ? "create"
      : "closed";

  const handleAddNew = () => {
    setModalState({ type: "create" });
  };

  const handleCardClick = (app: Application) => {
    setModalState({ type: "edit", application: app });
  };

  const handleCloseModal = () => {
    setModalState(null);
    if (isOpenByQuery) {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete(APPLICATION_SEARCH_PARAM_KEYS.createNew);
      setSearchParams(nextParams, { replace: true });
    }
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
        key={modalKey}
        application={selectedApplication}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
