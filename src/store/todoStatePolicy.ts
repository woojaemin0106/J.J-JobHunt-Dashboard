import type { Todo } from "../types/todo";

export type TodoStoreState = { todos: Todo[] };

export type TodoStoreAction =
  | { type: "INIT"; payload: Todo[] }
  | { type: "ADD"; payload: Todo }
  | { type: "UPDATE"; payload: { id: string; patch: Partial<Todo> } }
  | { type: "REMOVE"; payload: { id: string } }
  | { type: "TOGGLE"; payload: { id: string } };

export function todoReducer(
  state: TodoStoreState,
  action: TodoStoreAction
): TodoStoreState {
  switch (action.type) {
    case "INIT":
      return { todos: action.payload };
    case "ADD":
      return { todos: [action.payload, ...state.todos] };
    case "UPDATE":
      return {
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id ? { ...todo, ...action.payload.patch } : todo
        ),
      };
    case "REMOVE":
      return {
        todos: state.todos.filter((todo) => todo.id !== action.payload.id),
      };
    case "TOGGLE":
      return {
        todos: state.todos.map((todo) =>
          todo.id === action.payload.id
            ? {
                ...todo,
                completed: !todo.completed,
                completedAt: !todo.completed ? new Date().toISOString() : undefined,
              }
            : todo
        ),
      };
    default:
      return state;
  }
}
