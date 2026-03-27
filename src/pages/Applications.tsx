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
              Pipeline management
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
              Applications Kanban
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-sky-100/90">
              Track every opportunity from writing to result with a clear status flow.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur transition hover:bg-white/20"
            onClick={handleAddNew}
          >
            + Add Application
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
                Status Filter
              </label>
              <select
                id="status-filter"
                data-testid="applications-status-filter"
                className={`${ui.select} min-w-44`}
                value={statusFilter}
                onChange={handleStatusFilterChange}
              >
                <option value="all">All status</option>
                <option value="writing">Writing</option>
                <option value="submitted">Submitted</option>
                <option value="passed">Passed</option>
                <option value="failed">Failed</option>
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
              Clear Filters
            </button>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-600">
            Showing{" "}
            <span className="text-slate-900" data-testid="applications-count">
              {filteredApplications.length} / {applications.length}
            </span>
          </div>
        </div>
      </section>

      {applications.length === 0 ? (
        <section className={ui.card}>
          <h3 className={ui.cardTitle}>Start your application board</h3>
          <p className="mt-2 text-sm text-slate-500">
            Add your first company and track progress through each stage.
          </p>
          <button type="button" className={`${ui.btnPrimary} mt-4`} onClick={handleAddNew}>
            + Create First Application
          </button>
        </section>
      ) : null}

      {applications.length > 0 && filteredApplications.length === 0 ? (
        <section className={ui.card}>
          <h3 className={ui.cardTitle}>No matching result</h3>
          <p className="mt-2 text-sm text-slate-500">
            Try another status filter or clear filters to see all applications.
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
