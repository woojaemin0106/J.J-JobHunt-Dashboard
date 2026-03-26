import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { useAuth } from "./authStore";
import type { Todo } from "../types/todo";
import { generateId } from "../utils/id";
import { storage } from "../utils/storage";
import {
  buildScopeId,
  buildScopedStorageKey,
  migrateLegacyToScoped,
} from "../utils/scopedStorage";

const STORAGE_RESOURCE = "todos";
const LEGACY_STORAGE_KEY = "jj_jobhunt_todos_v1";
const STORAGE_VERSION = 2;
const LEGACY_VERSION = 1;

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

type Actions = {
  addTodo: (text: string) => void;
  updateTodo: (id: string, patch: Partial<Todo>) => void;
  removeTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
};

const StateCtx = createContext<State | null>(null);
const ActionsCtx = createContext<Actions | null>(null);

function loadTodos(scopeId: string): Todo[] {
  const scopedKey = buildScopedStorageKey(
    STORAGE_RESOURCE,
    STORAGE_VERSION,
    scopeId
  );
  const scopedData = storage.get<Todo[]>(scopedKey);
  if (scopedData !== null) return scopedData;

  if (scopeId !== "guest") {
    const migrated = migrateLegacyToScoped<Todo[]>({
      legacyKey: LEGACY_STORAGE_KEY,
      resource: STORAGE_RESOURCE,
      scopeId,
      fromVersion: LEGACY_VERSION,
      toVersion: STORAGE_VERSION,
    });

    if (migrated !== null) return migrated;
  }

  return [];
}

export function TodoProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const scopeId = buildScopeId(user?.id);
  const storageKey = useMemo(
    () => buildScopedStorageKey(STORAGE_RESOURCE, STORAGE_VERSION, scopeId),
    [scopeId]
  );

  const [state, dispatch] = useReducer(
    reducer,
    { todos: [] },
    () => ({ todos: loadTodos(scopeId) })
  );

  const previousScopeRef = useRef(scopeId);
  const skipPersistRef = useRef(false);

  useEffect(() => {
    if (previousScopeRef.current === scopeId) return;

    previousScopeRef.current = scopeId;
    skipPersistRef.current = true;
    dispatch({ type: "INIT", payload: loadTodos(scopeId) });
  }, [scopeId]);

  useEffect(() => {
    if (skipPersistRef.current) {
      skipPersistRef.current = false;
      return;
    }

    storage.set(storageKey, state.todos);
  }, [state.todos, storageKey]);

  const actions = useMemo<Actions>(() => {
    return {
      addTodo(text) {
        dispatch({
          type: "ADD",
          payload: {
            id: generateId(),
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
  if (!ctx) throw new Error("useTodoActions must be used within TodoProvider");
  return ctx;
}
