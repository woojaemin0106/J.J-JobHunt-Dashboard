import { memo, useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Application } from "../types/application";
import type { Todo } from "../types/todo";
import { useApplications } from "../store/applicationStore";
import { useTodoActions, useTodos } from "../store/todoStore";
import { getDaysUntil } from "../utils/date";
import { ui } from "../utils/ui";

function statusLabel(status: Application["status"]) {
  if (status === "writing") return "작성 중";
  if (status === "submitted") return "지원 완료";
  if (status === "passed") return "합격";
  return "불합격";
}

function statusTone(status: Application["status"]) {
  if (status === "writing") return "text-sky-700 bg-sky-100 border-sky-200";
  if (status === "submitted") return "text-amber-700 bg-amber-100 border-amber-200";
  if (status === "passed") return "text-emerald-700 bg-emerald-100 border-emerald-200";
  return "text-rose-700 bg-rose-100 border-rose-200";
}

const TodoItem = memo(function TodoItem({
  todo,
  onToggle,
  onRemove,
}: {
  todo: Todo;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="h-4 w-4 cursor-pointer accent-[var(--jj-color-brand)]"
      />
      <span className={`flex-1 text-sm ${todo.completed ? "text-slate-400 line-through" : ""}`}>
        {todo.text}
      </span>
      <button
        type="button"
        onClick={() => onRemove(todo.id)}
        className="text-xs font-semibold text-slate-400 transition group-hover:text-rose-600"
      >
        삭제
      </button>
    </div>
  );
});

const RecentActivityCard = memo(function RecentActivityCard({
  application,
}: {
  application: Application;
}) {
  const dday = getDaysUntil(application.deadline);
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm font-bold text-slate-900">{application.companyName}</div>
          <div className="mt-0.5 text-xs text-slate-500">{application.jobTitle}</div>
        </div>
        <span
          className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${statusTone(
            application.status
          )}`}
        >
          {statusLabel(application.status)}
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
        <span>버전 {application.versions.length}</span>
        <span>{dday === null ? "마감일 없음" : `D-${Math.max(0, dday)}`}</span>
      </div>
    </div>
  );
});

export default function Home() {
  const navigate = useNavigate();
  const applications = useApplications();
  const todos = useTodos();
  const { addTodo, removeTodo, toggleTodo } = useTodoActions();
  const [newTodoText, setNewTodoText] = useState("");

  const stats = useMemo(() => {
    const writing = applications.filter((app) => app.status === "writing").length;
    const submitted = applications.filter((app) => app.status === "submitted").length;
    const passed = applications.filter((app) => app.status === "passed").length;
    const dueThisWeek = applications.filter((app) => {
      const days = getDaysUntil(app.deadline);
      return days !== null && days >= 0 && days <= 7;
    }).length;
    return { writing, submitted, passed, dueThisWeek };
  }, [applications]);

  const upcoming = useMemo(() => {
    return [...applications]
      .filter((app) => app.deadline)
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 6);
  }, [applications]);

  const recent = useMemo(() => {
    return [...applications]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6);
  }, [applications]);

  const activeTodos = useMemo(() => todos.filter((todo) => !todo.completed), [todos]);
  const completedTodosCount = useMemo(
    () => todos.filter((todo) => todo.completed).length,
    [todos]
  );

  const handleAddTodo = useCallback(() => {
    const text = newTodoText.trim();
    if (!text) return;
    addTodo(text);
    setNewTodoText("");
  }, [addTodo, newTodoText]);

  const handleToggleTodo = useCallback((id: string) => toggleTodo(id), [toggleTodo]);
  const handleRemoveTodo = useCallback((id: string) => removeTodo(id), [removeTodo]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200/70 bg-gradient-to-r from-blue-950 to-sky-900 p-6 text-white shadow-[var(--jj-shadow-soft)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-200">
              Weekly command center
            </div>
            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
              이번 주 취업 준비 흐름을 한 번에 정리하세요.
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-sky-100/90">
              마감일, 상태 전환, 후속 액션을 한 화면에서 관리할 수 있습니다.
            </p>
          </div>
          <button
            type="button"
            className={ui.btnOnDark}
            onClick={() => navigate("/applications")}
          >
            지원 보드 열기
          </button>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className={ui.card}>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">작성 중</div>
          <div className="mt-2 text-3xl font-black text-slate-900">{stats.writing}</div>
        </div>
        <div className={ui.card}>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            지원 완료
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900">{stats.submitted}</div>
        </div>
        <div className={ui.card}>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">합격</div>
          <div className="mt-2 text-3xl font-black text-slate-900">{stats.passed}</div>
        </div>
        <div className={ui.card}>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            이번 주 마감
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900">{stats.dueThisWeek}</div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className={`${ui.card} xl:col-span-7`}>
          <div className="flex items-center justify-between">
            <div>
              <div className={ui.cardTitle}>Upcoming Deadlines</div>
              <div className={ui.muted}>마감이 임박한 지원을 먼저 처리하세요.</div>
            </div>
            <button
              type="button"
              className={`${ui.btnSecondary} px-3 py-2 text-xs`}
              onClick={() => navigate("/applications")}
            >
              관리하기
            </button>
          </div>
          <div className="mt-4 space-y-2">
            {upcoming.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                마감일이 설정된 항목이 아직 없습니다.
              </div>
            ) : (
              upcoming.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold text-slate-900">{app.companyName}</div>
                    <div className="truncate text-xs text-slate-500">{app.jobTitle}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-slate-800">
                      D-{Math.max(0, getDaysUntil(app.deadline) ?? 0)}
                    </div>
                    <div className="text-[11px] text-slate-500">{app.deadline}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={`${ui.card} xl:col-span-5`}>
          <div className="flex items-center justify-between">
            <div>
              <div className={ui.cardTitle}>Today Focus</div>
              <div className={ui.muted}>오늘 끝낼 핵심 액션을 기록하고 완료하세요.</div>
            </div>
            <div className="text-xs font-semibold text-slate-500">
              완료 {completedTodosCount}
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              className={ui.input}
              placeholder="할 일을 입력하고 Enter"
              value={newTodoText}
              onChange={(event) => setNewTodoText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleAddTodo();
              }}
            />
            <button type="button" className={`${ui.btnPrimary} px-4`} onClick={handleAddTodo}>
              추가
            </button>
          </div>
          <div className="mt-4 space-y-2">
            {activeTodos.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                진행 중인 할 일이 없습니다. 첫 할 일을 추가해보세요.
              </div>
            ) : (
              activeTodos.slice(0, 6).map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggleTodo}
                  onRemove={handleRemoveTodo}
                />
              ))
            )}
          </div>
        </div>
      </section>

      <section className={ui.card}>
        <div className="flex items-center justify-between">
          <div>
            <div className={ui.cardTitle}>Recent Activity</div>
            <div className={ui.muted}>최근 업데이트된 지원 항목을 확인하세요.</div>
          </div>
          <button
            type="button"
            className={`${ui.btnSecondary} px-3 py-2 text-xs`}
            onClick={() => navigate("/applications")}
          >
            전체 보기
          </button>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {recent.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
              아직 최근 활동이 없습니다.
            </div>
          ) : (
            recent.map((application) => (
              <RecentActivityCard key={application.id} application={application} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
