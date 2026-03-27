// src/kanban/ApplicationModal.tsx
import { useState } from "react";
import type { Application } from "../types/application";
import { ui } from "../utils/ui";
import { useApplicationActions } from "../store/applicationStore";

type Status = Application["status"];

interface ApplicationModalProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
}

type FormData = {
  companyName: string;
  jobTitle: string;
  status: Status;
  deadline: string;
};

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: "writing", label: "Writing" },
  { value: "submitted", label: "Submitted" },
  { value: "passed", label: "Passed" },
  { value: "failed", label: "Failed" },
];

function createInitialFormData(application: Application | null): FormData {
  if (!application) {
    return {
      companyName: "",
      jobTitle: "",
      status: "writing",
      deadline: "",
    };
  }

  return {
    companyName: application.companyName,
    jobTitle: application.jobTitle,
    status: application.status,
    deadline: application.deadline || "",
  };
}

export default function ApplicationModal({
  application,
  isOpen,
  onClose,
}: ApplicationModalProps) {
  const { addApplication, updateApplication } = useApplicationActions();
  const [formData, setFormData] = useState<FormData>(() =>
    createInitialFormData(application)
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (application) {
      updateApplication(application.id, formData);
    } else {
      addApplication({
        ...formData,
        versions: [],
        createdAt: new Date().toISOString(),
      });
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">
              {application ? "지원 수정" : "새 지원 추가"}
            </h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              회사명 *
            </label>
            <input
              type="text"
              required
              className={ui.input}
              value={formData.companyName}
              onChange={(e) =>
                setFormData({ ...formData, companyName: e.target.value })
              }
              placeholder="예: Naver"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              직무 *
            </label>
            <input
              type="text"
              required
              className={ui.input}
              value={formData.jobTitle}
              onChange={(e) =>
                setFormData({ ...formData, jobTitle: e.target.value })
              }
              placeholder="예: Frontend Developer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              상태 *
            </label>
            <select
              className={ui.select}
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as Status })
              }
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              마감일
            </label>
            <input
              type="date"
              className={ui.input}
              value={formData.deadline}
              onChange={(e) =>
                setFormData({ ...formData, deadline: e.target.value })
              }
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className={ui.btnPrimary}>
              {application ? "수정" : "추가"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={ui.btnSecondary}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
