// src/pages/Resume.tsx
import { useState, useCallback, useMemo, memo } from "react";
import { ui } from "../utils/ui";
import { useApplications, useApplicationActions } from "../store/applicationStore";
import type { Application, ResumeVersion } from "../types/application";
import { generateId } from "../utils/id";
import ConfirmDialog from "../components/ConfirmDialog";

/**
 * 지원 목록 아이템 컴포넌트
 * React.memo로 감싸서 해당 application이 변경될 때만 리렌더링됩니다.
 */
const ApplicationListItem = memo(function ApplicationListItem({
  app,
  isSelected,
  onSelect,
}: {
  app: Application;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      onClick={() => onSelect(app.id)}
      className={`w-full text-left p-3 rounded-xl border transition ${
        isSelected
          ? "border-indigo-500 bg-indigo-50"
          : "border-slate-200 hover:bg-slate-50"
      }`}
    >
      <div className="font-medium">{app.companyName}</div>
      <div className="text-sm text-slate-500">{app.jobTitle}</div>
      <div className="text-xs text-slate-400 mt-1">
        버전 {app.versions?.length || 0}개
      </div>
    </button>
  );
});

/**
 * 이력서 버전 카드 컴포넌트
 * React.memo로 감싸서 해당 version이 변경될 때만 리렌더링됩니다.
 */
const ResumeVersionCard = memo(function ResumeVersionCard({
  version,
  onDelete,
}: {
  version: ResumeVersion;
  onDelete: (id: string) => void;
}) {
  return (
    <div className={ui.card}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-semibold">{version.versionName}</div>
          <div className="text-xs text-slate-400 mt-1">
            {new Date(version.updatedAt).toLocaleDateString("ko-KR")}
          </div>
        </div>
        <button
          className={ui.btnDanger}
          onClick={() => onDelete(version.id)}
        >
          삭제
        </button>
      </div>
      <div className="text-sm text-slate-600 whitespace-pre-wrap border-t border-slate-100 pt-3">
        {version.content || <span className={ui.muted}>내용 없음</span>}
      </div>
    </div>
  );
});

export default function Resume() {
  const applications = useApplications();
  const { updateApplication } = useApplicationActions();
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [newVersionName, setNewVersionName] = useState("");
  const [newVersionContent, setNewVersionContent] = useState("");
  const [showNewForm, setShowNewForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    versionId: string | null;
  }>({ isOpen: false, versionId: null });

  // useMemo로 selectedApplication 탐색을 캐싱
  const selectedApplication = useMemo(() => {
    return applications.find((a) => a.id === selectedApp);
  }, [applications, selectedApp]);

  // useCallback으로 핸들러 함수들을 안정화
  const handleSelectApp = useCallback((id: string) => {
    setSelectedApp(id);
    setShowNewForm(false);
  }, []);

  const handleAddVersion = useCallback(() => {
    if (!selectedApplication || !newVersionName.trim()) return;

    const newVersion: ResumeVersion = {
      id: generateId(),
      versionName: newVersionName,
      content: newVersionContent,
      updatedAt: new Date().toISOString(),
    };

    updateApplication(selectedApplication.id, {
      versions: [...(selectedApplication.versions || []), newVersion],
    });

    setNewVersionName("");
    setNewVersionContent("");
    setShowNewForm(false);
  }, [selectedApplication, newVersionName, newVersionContent, updateApplication]);

  const handleDeleteVersion = useCallback((versionId: string) => {
    setDeleteConfirm({ isOpen: true, versionId });
  }, []);

  const confirmDelete = useCallback(() => {
    if (!selectedApplication || !deleteConfirm.versionId) return;
    updateApplication(selectedApplication.id, {
      versions: selectedApplication.versions.filter(
        (v) => v.id !== deleteConfirm.versionId
      ),
    });
    setDeleteConfirm({ isOpen: false, versionId: null });
  }, [selectedApplication, deleteConfirm.versionId, updateApplication]);

  return (
    <div className="space-y-4">
      <div className={ui.card}>
        <div className={ui.cardTitle}>이력서 버전 관리</div>
        <div className={ui.muted}>
          각 지원별로 이력서 버전을 관리할 수 있습니다
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <div className={ui.card}>
            <div className={ui.cardTitle}>지원 목록</div>
            <div className="mt-3 space-y-2">
              {applications.length === 0 ? (
                <div className={ui.muted}>지원 내역이 없습니다.</div>
              ) : (
                applications.map((app) => (
                  <ApplicationListItem
                    key={app.id}
                    app={app}
                    isSelected={selectedApp === app.id}
                    onSelect={handleSelectApp}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedApplication ? (
            <div className="space-y-4">
              <div className={ui.card}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className={ui.cardTitle}>
                      {selectedApplication.companyName}
                    </div>
                    <div className={ui.muted}>
                      {selectedApplication.jobTitle}
                    </div>
                  </div>
                  <button
                    className={ui.btnPrimary}
                    onClick={() => setShowNewForm(!showNewForm)}
                  >
                    + 새 버전 추가
                  </button>
                </div>
              </div>

              {showNewForm && (
                <div className={ui.card}>
                  <div className="space-y-3">
                    <input
                      type="text"
                      className={ui.input}
                      placeholder="버전 이름 (예: 신입용 초안, 경력 강조형)"
                      value={newVersionName}
                      onChange={(e) => setNewVersionName(e.target.value)}
                    />
                    <textarea
                      className={ui.input}
                      rows={10}
                      placeholder="이력서 내용"
                      value={newVersionContent}
                      onChange={(e) => setNewVersionContent(e.target.value)}
                    />
                    <div className="flex gap-3">
                      <button
                        className={ui.btnPrimary}
                        onClick={handleAddVersion}
                      >
                        저장
                      </button>
                      <button
                        className={ui.btnSecondary}
                        onClick={() => {
                          setShowNewForm(false);
                          setNewVersionName("");
                          setNewVersionContent("");
                        }}
                      >
                        취소
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {selectedApplication.versions?.length === 0 ? (
                  <div className={ui.card}>
                    <div className={ui.muted}>버전이 없습니다.</div>
                  </div>
                ) : (
                  selectedApplication.versions?.map((version) => (
                    <ResumeVersionCard
                      key={version.id}
                      version={version}
                      onDelete={handleDeleteVersion}
                    />
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className={ui.card}>
              <div className={ui.muted}>
                왼쪽에서 지원을 선택하여 이력서 버전을 관리하세요.
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        title="이력서 버전 삭제"
        message="정말 이 이력서 버전을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmText="삭제"
        cancelText="취소"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, versionId: null })}
      />
    </div>
  );
}
