// src/pages/Home.tsx
import { useState, useMemo, useCallback, memo } from "react";
import { ui } from "../utils/ui";
import { useApplications } from "../store/applicationStore";
import { useTodos, useTodoActions } from "../store/todoStore";
import type { Application } from "../types/application";
import type { Todo } from "../types/todo";
import { getDaysUntil } from "../utils/date";

function statusLabel(status: Application["status"]) {
  if (status === "writing") return "Writing";
  if (status === "submitted") return "Submitted";
  if (status === "passed") return "Passed";
  return "Failed";
}

/**
 * Todo 아이템 컴포넌트
 * React.memo로 감싸서 해당 todo가 변경될 때만 리렌더링됩니다.
 */
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
    <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 bg-slate-50 hover:bg-slate-100 cursor-pointer">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="cursor-pointer"
      />
      <span className="text-sm flex-1">{todo.text}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(todo.id);
        }}
        className="text-xs text-rose-500 hover:text-rose-700"
      >
        삭제
      </button>
    </label>
  );
});

/**
 * 최근 활동 카드 컴포넌트
 * React.memo로 감싸서 해당 application이 변경될 때만 리렌더링됩니다.
 */
const RecentActivityCard = memo(function RecentActivityCard({
  application,
}: {
  application: Application;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-3 bg-white">
      <div className="font-medium">{application.companyName}</div>
      <div className={ui.muted}>{application.jobTitle}</div>
      <div className="mt-2 flex gap-2">
        <span className={ui.chip}>{statusLabel(application.status)}</span>
        <span className={ui.chip}>
          versions: {application.versions?.length ?? 0}
        </span>
      </div>
    </div>
  );
});

export default function Home() {
  const apps = useApplications();
  const todos = useTodos();
  const { addTodo, toggleTodo, removeTodo } = useTodoActions();
  const [newTodoText, setNewTodoText] = useState("");

  // useMemo로 통계 계산을 캐싱하여 apps가 변경될 때만 재계산
  const stats = useMemo(() => {
    const active = apps.filter(
      (a) => a.status === "writing" || a.status === "submitted"
    ).length;
    const dueThisWeek = apps.filter((a) => {
      const days = getDaysUntil(a.deadline);
      return days !== null && days >= 0 && days <= 7;
    }).length;
    const passed = apps.filter((a) => a.status === "passed").length;
    return { active, dueThisWeek, passed };
  }, [apps]);

  // useMemo로 upcoming 계산을 캐싱
  const upcoming = useMemo(() => {
    return [...apps]
      .filter((a) => a.deadline)
      .sort(
        (x, y) => new Date(x.deadline).getTime() - new Date(y.deadline).getTime()
      )
      .slice(0, 5);
  }, [apps]);

  // useMemo로 recent 계산을 캐싱
  const recent = useMemo(() => {
    return [...apps]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6);
  }, [apps]);
  
  // useMemo로 activeTodos 계산을 캐싱
  const activeTodos = useMemo(() => {
    return todos.filter((t) => !t.completed);
  }, [todos]);

  // useMemo로 completedCount 계산을 캐싱
  const completedCount = useMemo(() => {
    return todos.filter((t) => t.completed).length;
  }, [todos]);

  // useCallback으로 핸들러 함수들을 안정화
  const handleAddTodo = useCallback(() => {
    if (newTodoText.trim()) {
      addTodo(newTodoText.trim());
      setNewTodoText("");
    }
  }, [newTodoText, addTodo]);

  const handleToggleTodo = useCallback((id: string) => {
    toggleTodo(id);
  }, [toggleTodo]);

  const handleRemoveTodo = useCallback((id: string) => {
    removeTodo(id);
  }, [removeTodo]);

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={ui.card}>
          <div className={ui.muted}>지원 현황</div>
          <div className="text-3xl font-bold mt-1">{stats.active}</div>
          <div className="mt-2 text-xs text-slate-500">작성 중 + 제출되었습니다</div>
        </div>
        <div className={ui.card}>
          <div className={ui.muted}>지원 마감</div>
          <div className="text-3xl font-bold mt-1">{stats.dueThisWeek}</div>
          <div className="mt-2 text-xs text-slate-500">
            마감일이 다가오고 있습니다
          </div>
        </div>
        <div className={ui.card}>
          <div className={ui.muted}>합격</div>
          <div className="text-3xl font-bold mt-1">{stats.passed}</div>
          <div className="mt-2 text-xs text-slate-500">합격 되었습니다</div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={ui.card}>
          <div className="flex items-center justify-between">
            <div className={ui.cardTitle}>다가오는 마감일</div>
            <div className={ui.muted}>Top 5</div>
          </div>
          <div className="mt-3 divide-y divide-slate-100">
            {upcoming.length === 0 ? (
              <div className={ui.muted}>아직 마감일은 정해지지 않았습니다</div>
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
            <div className={ui.cardTitle}>오늘의 할 일</div>
            <button
              className={ui.btnSecondary}
              onClick={() => {
                const text = prompt("할 일을 입력하세요:");
                if (text) addTodo(text);
              }}
            >
              + 추가
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
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggleTodo}
                  onRemove={handleRemoveTodo}
                />
              ))
            )}
          </div>

          {completedCount > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-200">
              <div className="text-xs text-slate-400">
                완료된 할 일 {completedCount}개
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
          <div className={ui.cardTitle}>최근 활동</div>
          <div className={ui.muted}>마지막 업데이트</div>
        </div>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
          {recent.length === 0 ? (
            <div className={ui.muted}>활동 없음</div>
          ) : (
            recent.map((a) => (
              <RecentActivityCard key={a.id} application={a} />
            ))
          )}
        </div>
      </section>
    </div>
  );
}
