import { useMemo, useState, type ChangeEvent } from "react";
import { useSearchParams } from "react-router-dom";
import KanbanBoard from "../kanban/KanbanBoard";
import ApplicationModal from "../kanban/ApplicationModal";
import { useApplications } from "../store/applicationStore";
import type { Application } from "../types/application";
import { ui } from "../utils/ui";
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

  const filteredApplications = useMemo(() => {
    return filterApplications(applications, { query: queryFilter, status: statusFilter });
  }, [applications, queryFilter, statusFilter]);

  const handleAddNew = () => setModalState({ type: "create" });
  const handleCardClick = (application: Application) =>
    setModalState({ type: "edit", application });

  const handleCloseModal = () => {
    setModalState(null);
    if (!isOpenByQuery) return;

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete(APPLICATION_SEARCH_PARAM_KEYS.createNew);
    setSearchParams(nextParams, { replace: true });
  };

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
    const nextParams = createApplicationSearchParams({ createNew: isOpenByQuery });
    setSearchParams(nextParams, { replace: true });
  };

  return (
    <div className="space-y-5">
      <section className="rounded-3xl border border-slate-200/70 bg-gradient-to-r from-sky-900 to-blue-900 p-6 text-white shadow-[var(--jj-shadow-soft)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-200">
              지원 파이프라인
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
              지원 현황 보드
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-sky-100/90">
              작성 중부터 결과까지, 상태 흐름을 명확하게 관리하세요.
            </p>
          </div>
          <button
            type="button"
            className={ui.btnOnDark}
            onClick={handleAddNew}
          >
            + 지원 추가
          </button>
        </div>
      </section>

      <section className={ui.card}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <div>
              <label
                className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                htmlFor="status-filter"
              >
                상태 필터
              </label>
              <select
                id="status-filter"
                data-testid="applications-status-filter"
                className={`${ui.select} min-w-44`}
                value={statusFilter}
                onChange={handleStatusFilterChange}
              >
                <option value="all">전체 상태</option>
                <option value="writing">작성 중</option>
                <option value="submitted">지원 완료</option>
                <option value="passed">합격</option>
                <option value="failed">불합격</option>
              </select>
            </div>
            <button
              type="button"
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

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-600">
            표시{" "}
            <span className="text-slate-900" data-testid="applications-count">
              {filteredApplications.length} / {applications.length}
            </span>
          </div>
        </div>
      </section>

      {applications.length === 0 ? (
        <section className={ui.card}>
          <h3 className={ui.cardTitle}>지원 현황 보드를 시작해보세요</h3>
          <p className="mt-2 text-sm text-slate-500">
            첫 지원 회사를 등록하면 상태별로 진행 현황을 추적할 수 있습니다.
          </p>
          <button type="button" className={`${ui.btnPrimary} mt-4`} onClick={handleAddNew}>
            + 첫 지원 추가
          </button>
        </section>
      ) : null}

      {applications.length > 0 && filteredApplications.length === 0 ? (
        <section className={ui.card}>
          <h3 className={ui.cardTitle}>조건에 맞는 결과가 없습니다</h3>
          <p className="mt-2 text-sm text-slate-500">
            다른 상태를 선택하거나 필터를 초기화해 전체 항목을 확인하세요.
          </p>
        </section>
      ) : null}

      <KanbanBoard applications={filteredApplications} onCardClick={handleCardClick} />

      <ApplicationModal
        key={modalKey}
        application={selectedApplication}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
