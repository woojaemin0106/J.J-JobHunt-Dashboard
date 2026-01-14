// src/pages/Resume.tsx
import { useState } from "react";
import { ui } from "../utils/ui";
import { useApplications, useApplicationActions } from "../store/applicationStore";
import type { ResumeVersion } from "../types/application";

export default function Resume() {
  const applications = useApplications();
  const { updateApplication } = useApplicationActions();
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [newVersionName, setNewVersionName] = useState("");
  const [newVersionContent, setNewVersionContent] = useState("");
  const [showNewForm, setShowNewForm] = useState(false);

  const selectedApplication = applications.find((a) => a.id === selectedApp);

  const handleAddVersion = () => {
    if (!selectedApplication || !newVersionName.trim()) return;

    const newVersion: ResumeVersion = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
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
  };

  const handleDeleteVersion = (versionId: string) => {
    if (!selectedApplication) return;
    if (!confirm("이력서 버전을 삭제하시겠습니까?")) return;

    updateApplication(selectedApplication.id, {
      versions: selectedApplication.versions.filter((v) => v.id !== versionId),
    });
  };

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
                  <button
                    key={app.id}
                    onClick={() => {
                      setSelectedApp(app.id);
                      setShowNewForm(false);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition ${
                      selectedApp === app.id
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
                    <div key={version.id} className={ui.card}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-semibold">
                            {version.versionName}
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            {new Date(version.updatedAt).toLocaleDateString(
                              "ko-KR"
                            )}
                          </div>
                        </div>
                        <button
                          className={ui.btnDanger}
                          onClick={() => handleDeleteVersion(version.id)}
                        >
                          삭제
                        </button>
                      </div>
                      <div className="text-sm text-slate-600 whitespace-pre-wrap border-t border-slate-100 pt-3">
                        {version.content || (
                          <span className={ui.muted}>내용 없음</span>
                        )}
                      </div>
                    </div>
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
    </div>
  );
}
