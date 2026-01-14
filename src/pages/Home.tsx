// src/pages/Home.tsx
import { ui } from "../utils/ui";
import { useApplications } from "../store/applicationStore"; // 이미 쓰고 있으면
import type { Application } from "../types/application";

function daysUntil(deadline: string) {
  const end = new Date(deadline + "T23:59:59").getTime();
  const diff = Math.ceil((end - Date.now()) / (1000 * 60 * 60 * 24));
  return diff;
}

function statusLabel(status: Application["status"]) {
  if (status === "writing") return "Writing";
  if (status === "submitted") return "Submitted";
  if (status === "passed") return "Passed";
  return "Failed";
}

export default function Home() {
  const apps = useApplications();

  const active = apps.filter(
    (a) => a.status === "writing" || a.status === "submitted"
  ).length;
  const dueThisWeek = apps.filter(
    (a) =>
      a.deadline && daysUntil(a.deadline) >= 0 && daysUntil(a.deadline) <= 7
  ).length;
  const passed = apps.filter((a) => a.status === "passed").length;

  const upcoming = [...apps]
    .filter((a) => a.deadline)
    .sort(
      (x, y) => new Date(x.deadline).getTime() - new Date(y.deadline).getTime()
    )
    .slice(0, 5);

  const recent = [...apps].slice(0, 6); // 지금은 임시: 나중에 updatedAt으로 정렬 추천

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={ui.card}>
          <div className={ui.muted}>Active</div>
          <div className="text-3xl font-bold mt-1">{active}</div>
          <div className="mt-2 text-xs text-slate-500">writing + submitted</div>
        </div>
        <div className={ui.card}>
          <div className={ui.muted}>Due in 7 days</div>
          <div className="text-3xl font-bold mt-1">{dueThisWeek}</div>
          <div className="mt-2 text-xs text-slate-500">
            deadlines approaching
          </div>
        </div>
        <div className={ui.card}>
          <div className={ui.muted}>Passed</div>
          <div className="text-3xl font-bold mt-1">{passed}</div>
          <div className="mt-2 text-xs text-slate-500">positive outcomes</div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={ui.card}>
          <div className="flex items-center justify-between">
            <div className={ui.cardTitle}>Upcoming deadlines</div>
            <div className={ui.muted}>Top 5</div>
          </div>
          <div className="mt-3 divide-y divide-slate-100">
            {upcoming.length === 0 ? (
              <div className={ui.muted}>No deadlines yet.</div>
            ) : (
              upcoming.map((a) => (
                <div
                  key={a.id}
                  className="py-3 flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">{a.companyName}</div>
                    <div className={ui.muted}>{a.jobTitle}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      {a.deadline}{" "}
                      <span className="text-slate-500">
                        (D-{Math.max(0, daysUntil(a.deadline))})
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      {statusLabel(a.status)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={ui.card}>
          <div className="flex items-center justify-between">
            <div className={ui.cardTitle}>Today focus</div>
            <button
              className={ui.btnSecondary}
              onClick={() => alert("TODO: add todo")}
            >
              + Add
            </button>
          </div>

          <div className="mt-3 space-y-3">
            {/* 실제 To-do는 다음 단계에서 store로 분리 */}
            {[
              "이력서 문장 다듬기",
              "자소서 1문단 수정",
              "지원 기업 2곳 JD 확인",
            ].map((t) => (
              <label
                key={t}
                className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 bg-slate-50"
              >
                <input type="checkbox" />
                <span className="text-sm">{t}</span>
              </label>
            ))}
          </div>

          <div className="mt-4 text-xs text-slate-500">
            Tip: “오늘 할 일”은 실사용에 제일 강력해. 내일 바로 체감됨.
          </div>
        </div>
      </section>

      <section className={ui.card}>
        <div className="flex items-center justify-between">
          <div className={ui.cardTitle}>Recent</div>
          <div className={ui.muted}>Last updates</div>
        </div>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
          {recent.length === 0 ? (
            <div className={ui.muted}>No activity.</div>
          ) : (
            recent.map((a) => (
              <div
                key={a.id}
                className="rounded-xl border border-slate-200 p-3 bg-white"
              >
                <div className="font-medium">{a.companyName}</div>
                <div className={ui.muted}>{a.jobTitle}</div>
                <div className="mt-2 flex gap-2">
                  <span className={ui.chip}>{statusLabel(a.status)}</span>
                  <span className={ui.chip}>
                    versions: {a.versions?.length ?? 0}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
