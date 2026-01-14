import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import type { Todo } from "../types/todo";
import { storage } from "../utils/storage";

const STORAGE_KEY = "jj_jobhunt_todos_v1";

type State = { todos: Todo[] };

type Action =
  | { type: "INIT"; payload: Todo[] }
  | { type: "ADD"; payload: Todo }
  | { type: "UPDATE"; payload: { id: string; patch: Partial<Todo> } }
  | { type: "REMOVE"; payload: { id: string } }
  | { type: "TOGGLE"; payload: { id: string } };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "INIT":
      return { todos: action.payload };
    case "ADD":
      return { todos: [action.payload, ...state.todos] };
    case "UPDATE":
      return {
        todos: state.todos.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload.patch } : t
        ),
      };
    case "REMOVE":
      return {
        todos: state.todos.filter((t) => t.id !== action.payload.id),
      };
    case "TOGGLE":
      return {
        todos: state.todos.map((t) =>
          t.id === action.payload.id
            ? {
                ...t,
                completed: !t.completed,
                completedAt: !t.completed
                  ? new Date().toISOString()
                  : undefined,
              }
            : t
        ),
      };
    default:
      return state;
  }
}

function makeId() {
  const c = (globalThis as any).crypto;
  if (c?.randomUUID) return c.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

type Actions = {
  addTodo: (text: string) => void;
  updateTodo: (id: string, patch: Partial<Todo>) => void;
  removeTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
};

const StateCtx = createContext<State | null>(null);
const ActionsCtx = createContext<Actions | null>(null);

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { todos: [] });

  useEffect(() => {
    const fromStorage = storage.get<Todo[]>(STORAGE_KEY);
    dispatch({ type: "INIT", payload: fromStorage ?? [] });
  }, []);

  useEffect(() => {
    storage.set(STORAGE_KEY, state.todos);
  }, [state.todos]);

  const actions = useMemo<Actions>(() => {
    return {
      addTodo(text) {
        dispatch({
          type: "ADD",
          payload: {
            id: makeId(),
            text,
            completed: false,
            createdAt: new Date().toISOString(),
          },
        });
      },
      updateTodo(id, patch) {
        dispatch({ type: "UPDATE", payload: { id, patch } });
      },
      removeTodo(id) {
        dispatch({ type: "REMOVE", payload: { id } });
      },
      toggleTodo(id) {
        dispatch({ type: "TOGGLE", payload: { id } });
      },
    };
  }, []);

  return (
    <StateCtx.Provider value={state}>
      <ActionsCtx.Provider value={actions}>{children}</ActionsCtx.Provider>
    </StateCtx.Provider>
  );
}

export function useTodos() {
  const ctx = useContext(StateCtx);
  if (!ctx) throw new Error("useTodos must be used within TodoProvider");
  return ctx.todos;
}

export function useTodoActions() {
  const ctx = useContext(ActionsCtx);
  if (!ctx)
    throw new Error("useTodoActions must be used within TodoProvider");
  return ctx;
}
