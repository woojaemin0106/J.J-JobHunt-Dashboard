// src/pages/Home.tsx
import { useState } from "react";
import { ui } from "../utils/ui";
import { useApplications } from "../store/applicationStore";
import { useTodos, useTodoActions } from "../store/todoStore";
import type { Application } from "../types/application";
import { getDaysUntil } from "../utils/date";

function statusLabel(status: Application["status"]) {
  if (status === "writing") return "Writing";
  if (status === "submitted") return "Submitted";
  if (status === "passed") return "Passed";
  return "Failed";
}

export default function Home() {
  const apps = useApplications();
  const todos = useTodos();
  const { addTodo, toggleTodo, removeTodo } = useTodoActions();
  const [newTodoText, setNewTodoText] = useState("");

  const active = apps.filter(
    (a) => a.status === "writing" || a.status === "submitted"
  ).length;
  const dueThisWeek = apps.filter((a) => {
    const days = getDaysUntil(a.deadline);
    return days !== null && days >= 0 && days <= 7;
  }).length;
  const passed = apps.filter((a) => a.status === "passed").length;

  const upcoming = [...apps]
    .filter((a) => a.deadline)
    .sort(
      (x, y) => new Date(x.deadline).getTime() - new Date(y.deadline).getTime()
    )
    .slice(0, 5);

  const recent = [...apps]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);
  
  const activeTodos = todos.filter((t) => !t.completed);
  
  const handleAddTodo = () => {
    if (newTodoText.trim()) {
      addTodo(newTodoText.trim());
      setNewTodoText("");
    }
  };

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
                        (D-{Math.max(0, getDaysUntil(a.deadline) ?? 0)})
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
          <div className="flex items-center justify-between mb-3">
            <div className={ui.cardTitle}>Today focus</div>
            <button
              className={ui.btnSecondary}
              onClick={() => {
                const text = prompt("할 일을 입력하세요:");
                if (text) addTodo(text);
              }}
            >
              + Add
            </button>
          </div>

          <div className="space-y-2 mb-3">
            <input
              type="text"
              className={ui.input}
              placeholder="할 일을 입력하고 Enter를 누르세요"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddTodo();
              }}
            />
          </div>

          <div className="mt-3 space-y-2">
            {activeTodos.length === 0 ? (
              <div className={ui.muted}>할 일이 없습니다.</div>
            ) : (
              activeTodos.slice(0, 5).map((todo) => (
                <label
                  key={todo.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 bg-slate-50 hover:bg-slate-100 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="cursor-pointer"
                  />
                  <span className="text-sm flex-1">{todo.text}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTodo(todo.id);
                    }}
                    className="text-xs text-rose-500 hover:text-rose-700"
                  >
                    삭제
                  </button>
                </label>
              ))
            )}
          </div>

          {todos.filter((t) => t.completed).length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-200">
              <div className="text-xs text-slate-400">
                완료된 할 일 {todos.filter((t) => t.completed).length}개
              </div>
            </div>
          )}

          <div className="mt-4 text-xs text-slate-500">
            Tip: "오늘 할 일"은 실사용에 제일 강력해. 내일 바로 체감됨.
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
