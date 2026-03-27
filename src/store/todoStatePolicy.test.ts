import { afterEach, describe, expect, it, vi } from "vitest";
import type { Todo } from "../types/todo";
import { todoReducer, type TodoStoreState } from "./todoStatePolicy";

const BASE_TODO: Todo = {
  id: "todo-1",
  text: "Apply to Naver",
  completed: false,
  createdAt: "2026-03-27T00:00:00.000Z",
};

function createState(todos: Todo[]): TodoStoreState {
  return { todos };
}

describe("todoStatePolicy", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("initializes state with payload", () => {
    const next = todoReducer(createState([]), {
      type: "INIT",
      payload: [BASE_TODO],
    });

    expect(next.todos).toEqual([BASE_TODO]);
  });

  it("prepends newly added todo", () => {
    const existing = { ...BASE_TODO, id: "todo-2" };
    const added = { ...BASE_TODO, id: "todo-3" };
    const next = todoReducer(createState([existing]), {
      type: "ADD",
      payload: added,
    });

    expect(next.todos.map((todo) => todo.id)).toEqual(["todo-3", "todo-2"]);
  });

  it("updates matching todo", () => {
    const next = todoReducer(createState([BASE_TODO]), {
      type: "UPDATE",
      payload: { id: "todo-1", patch: { text: "Apply to Kakao" } },
    });

    expect(next.todos[0].text).toBe("Apply to Kakao");
  });

  it("toggles incomplete todo to completed with completedAt", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-28T09:00:00.000Z"));

    const next = todoReducer(createState([BASE_TODO]), {
      type: "TOGGLE",
      payload: { id: "todo-1" },
    });

    expect(next.todos[0].completed).toBe(true);
    expect(next.todos[0].completedAt).toBe("2026-03-28T09:00:00.000Z");
  });

  it("toggles completed todo back to incomplete and clears completedAt", () => {
    const completed: Todo = {
      ...BASE_TODO,
      completed: true,
      completedAt: "2026-03-28T09:00:00.000Z",
    };

    const next = todoReducer(createState([completed]), {
      type: "TOGGLE",
      payload: { id: "todo-1" },
    });

    expect(next.todos[0].completed).toBe(false);
    expect(next.todos[0].completedAt).toBeUndefined();
  });

  it("removes matching todo", () => {
    const second = { ...BASE_TODO, id: "todo-2" };
    const next = todoReducer(createState([BASE_TODO, second]), {
      type: "REMOVE",
      payload: { id: "todo-1" },
    });

    expect(next.todos.map((todo) => todo.id)).toEqual(["todo-2"]);
  });
});
