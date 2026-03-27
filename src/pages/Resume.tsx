import { memo, useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ui } from "../utils/ui";
import { useApplications, useApplicationActions } from "../store/applicationStore";
import type { Application, ResumeVersion } from "../types/application";
import { generateId } from "../utils/id";
import ConfirmDialog from "../components/ConfirmDialog";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function statusLabel(status: Application["status"]) {
  if (status === "writing") return "작성 중";
  if (status === "submitted") return "지원 완료";
  if (status === "passed") return "합격";
  return "불합격";
}

function statusTone(status: Application["status"]) {
  if (status === "writing") return "text-sky-700 bg-sky-100 border-sky-200";
  if (status === "submitted") {
    return "text-amber-700 bg-amber-100 border-amber-200";
  }
  if (status === "passed") {
    return "text-emerald-700 bg-emerald-100 border-emerald-200";
  }
  return "text-rose-700 bg-rose-100 border-rose-200";
}

const ApplicationListItem = memo(function ApplicationListItem({
  application,
  isSelected,
  onSelect,
}: {
  application: Application;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      type="button"
      className={`w-full rounded-2xl border p-3 text-left transition ${
        isSelected
          ? "border-[color:var(--jj-color-brand)] bg-sky-50/70 shadow-[var(--jj-shadow-soft)]"
          : "border-slate-200 bg-white hover:border-sky-200 hover:bg-sky-50/40"
      }`}
      onClick={() => onSelect(application.id)}
      aria-pressed={isSelected}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate text-sm font-bold text-slate-900">
            {application.companyName}
          </div>
          <div className="mt-0.5 truncate text-xs text-slate-500">
            {application.jobTitle}
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${statusTone(
            application.status
          )}`}
        >
          {statusLabel(application.status)}
        </span>
      </div>
      <div className="mt-3 text-xs font-medium text-slate-500">
        버전 {application.versions.length}개
      </div>
    </button>
  );
});

const ResumeVersionCard = memo(function ResumeVersionCard({
  version,
  onDelete,
}: {
  version: ResumeVersion;
  onDelete: (id: string) => void;
}) {
  return (
    <article className={`${ui.card} space-y-3`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">{version.versionName}</h3>
          <p className="mt-1 text-xs text-slate-500">수정일 {formatDate(version.updatedAt)}</p>
        </div>
        <button type="button" className={ui.btnDanger} onClick={() => onDelete(version.id)}>
          삭제
        </button>
      </div>
      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 text-sm leading-relaxed text-slate-700">
        {version.content.trim().length > 0 ? (
          <p className="whitespace-pre-wrap">{version.content}</p>
        ) : (
          <p className={ui.muted}>작성된 내용이 없습니다.</p>
        )}
      </div>
    </article>
  );
});

export default function Resume() {
  const navigate = useNavigate();
  const applications = useApplications();
  const { updateApplication } = useApplicationActions();

  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newVersionName, setNewVersionName] = useState("");
  const [newVersionContent, setNewVersionContent] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    versionId: string | null;
  }>({ isOpen: false, versionId: null });

  const selectedApplication = useMemo(() => {
    if (applications.length === 0) return null;
    if (!selectedApplicationId) return applications[0];
    return (
      applications.find((application) => application.id === selectedApplicationId) ??
      applications[0]
    );
  }, [applications, selectedApplicationId]);

  const totalVersionCount = useMemo(() => {
    return applications.reduce((sum, application) => sum + application.versions.length, 0);
  }, [applications]);

  const sortedVersions = useMemo(() => {
    if (!selectedApplication) return [];
    return [...selectedApplication.versions].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [selectedApplication]);

  const closeCreateForm = useCallback(() => {
    setIsCreateOpen(false);
    setNewVersionName("");
    setNewVersionContent("");
  }, []);

  const handleSelectApplication = useCallback(
    (id: string) => {
      setSelectedApplicationId(id);
      closeCreateForm();
    },
    [closeCreateForm]
  );

  const handleAddVersion = useCallback(() => {
    if (!selectedApplication) return;

    const versionName = newVersionName.trim();
    if (versionName.length === 0) return;

    const nextVersion: ResumeVersion = {
      id: generateId(),
      versionName,
      content: newVersionContent.trim(),
      updatedAt: new Date().toISOString(),
    };

    updateApplication(selectedApplication.id, {
      versions: [...selectedApplication.versions, nextVersion],
    });
    closeCreateForm();
  }, [
    closeCreateForm,
    newVersionContent,
    newVersionName,
    selectedApplication,
    updateApplication,
  ]);

  const handleDeleteVersion = useCallback((versionId: string) => {
    setDeleteConfirm({ isOpen: true, versionId });
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!selectedApplication || !deleteConfirm.versionId) return;

    updateApplication(selectedApplication.id, {
      versions: selectedApplication.versions.filter(
        (version) => version.id !== deleteConfirm.versionId
      ),
    });
    setDeleteConfirm({ isOpen: false, versionId: null });
  }, [deleteConfirm.versionId, selectedApplication, updateApplication]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200/70 bg-gradient-to-r from-emerald-900 to-sky-900 p-6 text-white shadow-[var(--jj-shadow-soft)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
              Resume version lab
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
              지원 공고별 이력서 버전을 체계적으로 관리하세요
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-emerald-100/95">
              포지션에 맞는 핵심 경험을 분리해두면 지원 속도와 완성도를 함께 높일 수
              있습니다.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-2">
              <div className="text-[11px] text-emerald-100/80">지원 건수</div>
              <div className="text-lg font-black">{applications.length}</div>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-2">
              <div className="text-[11px] text-emerald-100/80">총 버전 수</div>
              <div className="text-lg font-black">{totalVersionCount}</div>
            </div>
          </div>
        </div>
      </section>

      {applications.length === 0 ? (
        <section className={ui.card}>
          <h3 className={ui.cardTitle}>아직 등록된 지원서가 없습니다</h3>
          <p className="mt-2 text-sm text-slate-500">
            먼저 지원 현황 페이지에서 공고를 추가한 뒤 이력서 버전을 연결해 주세요.
          </p>
          <button
            type="button"
            className={`${ui.btnPrimary} mt-4`}
            onClick={() => navigate("/applications")}
          >
            지원 현황으로 이동
          </button>
        </section>
      ) : (
        <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <aside className={`${ui.card} xl:col-span-4`}>
            <div className="flex items-center justify-between">
              <h3 className={ui.cardTitle}>지원 목록</h3>
              <span className={ui.chip}>{applications.length}건</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              왼쪽에서 공고를 선택하면 연결된 이력서 버전을 볼 수 있습니다.
            </p>
            <div className="mt-4 space-y-2">
              {applications.map((application) => (
                <ApplicationListItem
                  key={application.id}
                  application={application}
                  isSelected={selectedApplication?.id === application.id}
                  onSelect={handleSelectApplication}
                />
              ))}
            </div>
          </aside>

          <div className="space-y-4 xl:col-span-8">
            {selectedApplication ? (
              <>
                <div className={ui.card}>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">
                        {selectedApplication.companyName}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {selectedApplication.jobTitle}
                      </p>
                      <p className="mt-2 text-xs font-semibold text-slate-600">
                        저장된 버전 {selectedApplication.versions.length}개
                      </p>
                    </div>
                    <button
                      type="button"
                      className={ui.btnPrimary}
                      onClick={() => setIsCreateOpen((current) => !current)}
                    >
                      {isCreateOpen ? "입력 닫기" : "+ 새 버전 추가"}
                    </button>
                  </div>
                </div>

                {isCreateOpen ? (
                  <div className={ui.card}>
                    <h4 className="text-sm font-bold text-slate-900">새 이력서 버전</h4>
                    <div className="mt-3 space-y-3">
                      <input
                        type="text"
                        className={ui.input}
                        placeholder="예: 백엔드 집중형, 신입 공통형"
                        value={newVersionName}
                        onChange={(event) => setNewVersionName(event.target.value)}
                      />
                      <textarea
                        className={ui.input}
                        rows={10}
                        placeholder="이 버전에서 강조할 경험, 프로젝트, 성과를 작성하세요."
                        value={newVersionContent}
                        onChange={(event) => setNewVersionContent(event.target.value)}
                      />
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className={ui.btnPrimary}
                          onClick={handleAddVersion}
                        >
                          버전 저장
                        </button>
                        <button
                          type="button"
                          className={ui.btnSecondary}
                          onClick={closeCreateForm}
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="space-y-3">
                  {sortedVersions.length === 0 ? (
                    <div className={ui.card}>
                      <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                        이 공고에 연결된 이력서 버전이 아직 없습니다.
                      </div>
                    </div>
                  ) : (
                    sortedVersions.map((version) => (
                      <ResumeVersionCard
                        key={version.id}
                        version={version}
                        onDelete={handleDeleteVersion}
                      />
                    ))
                  )}
                </div>
              </>
            ) : (
              <div className={ui.card}>
                <p className={ui.muted}>지원 항목을 선택해 이력서 버전을 관리해 주세요.</p>
              </div>
            )}
          </div>
        </section>
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="이력서 버전 삭제"
        message="선택한 이력서 버전을 삭제하시겠습니까? 삭제 후에는 되돌릴 수 없습니다."
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, versionId: null })}
      />
    </div>
  );
}
