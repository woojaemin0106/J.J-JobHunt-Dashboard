import { useMemo, useState, type ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { ui } from "../utils/ui";
import KanbanBoard from "../kanban/KanbanBoard";
import ApplicationModal from "../kanban/ApplicationModal";
import type { Application } from "../types/application";
import { useApplications } from "../store/applicationStore";
import { filterApplications } from "./filterApplications";
import {
  APPLICATION_SEARCH_PARAM_KEYS,
  createApplicationSearchParams,
  DEFAULT_APPLICATION_STATUS_FILTER,
  normalizeApplicationQuery,
  normalizeApplicationStatus,
} from "./applicationsSearchParams";

type ModalState =
  | { type: "create" }
  | { type: "edit"; application: Application }
  | null;

export default function Applications() {
  const applications = useApplications();
  const [searchParams, setSearchParams] = useSearchParams();
  const [modalState, setModalState] = useState<ModalState>(null);
  const queryFilter = normalizeApplicationQuery(
    searchParams.get(APPLICATION_SEARCH_PARAM_KEYS.query)
  );
  const statusFilter = normalizeApplicationStatus(
    searchParams.get(APPLICATION_SEARCH_PARAM_KEYS.status)
  );
  const hasActiveFilters =
    queryFilter.length > 0 || statusFilter !== DEFAULT_APPLICATION_STATUS_FILTER;

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

  const filteredApplications = useMemo(() => {
    return filterApplications(applications, {
      query: queryFilter,
      status: statusFilter,
    });
  }, [applications, queryFilter, statusFilter]);

  const handleStatusFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextStatus = normalizeApplicationStatus(event.target.value);
    const nextParams = createApplicationSearchParams({
      query: queryFilter,
      status: nextStatus,
      createNew: isOpenByQuery,
    });
    setSearchParams(nextParams, { replace: true });
  };

  const handleClearFilters = () => {
    const nextParams = createApplicationSearchParams({
      createNew: isOpenByQuery,
    });
    setSearchParams(nextParams, { replace: true });
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

        <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label className="text-sm text-slate-600" htmlFor="status-filter">
              상태 필터
            </label>
            <select
              id="status-filter"
              data-testid="applications-status-filter"
              className={`${ui.input} sm:w-48`}
              value={statusFilter}
              onChange={handleStatusFilterChange}
            >
              <option value="all">전체 상태</option>
              <option value="writing">작성 중</option>
              <option value="submitted">지원 완료</option>
              <option value="passed">합격</option>
              <option value="failed">불합격</option>
            </select>
            <button
              data-testid="applications-clear-filters"
              className={`${ui.btnSecondary} ${
                hasActiveFilters ? "" : "cursor-not-allowed opacity-60"
              }`}
              onClick={handleClearFilters}
              disabled={!hasActiveFilters}
            >
              필터 초기화
            </button>
          </div>

          <div className="text-sm text-slate-600" data-testid="applications-count">
            {filteredApplications.length} / {applications.length}건 표시
          </div>
        </div>
      </div>

      {applications.length > 0 && filteredApplications.length === 0 ? (
        <div className={ui.card}>
          <div className={ui.cardTitle}>검색 결과가 없습니다</div>
          <div className={ui.muted}>
            다른 검색어를 입력하거나 상태 필터를 초기화해 주세요.
          </div>
        </div>
      ) : null}

      <KanbanBoard
        applications={filteredApplications}
        onCardClick={handleCardClick}
      />

      <ApplicationModal
        key={modalKey}
        application={selectedApplication}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
