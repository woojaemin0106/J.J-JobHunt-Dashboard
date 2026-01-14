import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import type { Note } from "../types/note";
import { storage } from "../utils/storage";

const STORAGE_KEY = "jj_jobhunt_notes_v1";

type State = { notes: Note[] };

type Action =
  | { type: "INIT"; payload: Note[] }
  | { type: "ADD"; payload: Note }
  | { type: "UPDATE"; payload: { id: string; patch: Partial<Note> } }
  | { type: "REMOVE"; payload: { id: string } };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "INIT":
      return { notes: action.payload };
    case "ADD":
      return { notes: [action.payload, ...state.notes] };
    case "UPDATE":
      return {
        notes: state.notes.map((n) =>
          n.id === action.payload.id
            ? { ...n, ...action.payload.patch, updatedAt: new Date().toISOString() }
            : n
        ),
      };
    case "REMOVE":
      return {
        notes: state.notes.filter((n) => n.id !== action.payload.id),
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
  addNote: (input: Omit<Note, "id" | "createdAt" | "updatedAt">) => void;
  updateNote: (id: string, patch: Partial<Note>) => void;
  removeNote: (id: string) => void;
};

const StateCtx = createContext<State | null>(null);
const ActionsCtx = createContext<Actions | null>(null);

export function NoteProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { notes: [] });

  useEffect(() => {
    const fromStorage = storage.get<Note[]>(STORAGE_KEY);
    dispatch({ type: "INIT", payload: fromStorage ?? [] });
  }, []);

  useEffect(() => {
    storage.set(STORAGE_KEY, state.notes);
  }, [state.notes]);

  const actions = useMemo<Actions>(() => {
    return {
      addNote(input) {
        const now = new Date().toISOString();
        dispatch({
          type: "ADD",
          payload: { ...input, id: makeId(), createdAt: now, updatedAt: now },
        });
      },
      updateNote(id, patch) {
        dispatch({ type: "UPDATE", payload: { id, patch } });
      },
      removeNote(id) {
        dispatch({ type: "REMOVE", payload: { id } });
      },
    };
  }, []);

  return (
    <StateCtx.Provider value={state}>
      <ActionsCtx.Provider value={actions}>{children}</ActionsCtx.Provider>
    </StateCtx.Provider>
  );
}

export function useNotes() {
  const ctx = useContext(StateCtx);
  if (!ctx) throw new Error("useNotes must be used within NoteProvider");
  return ctx.notes;
}

export function useNoteActions() {
  const ctx = useContext(ActionsCtx);
  if (!ctx)
    throw new Error("useNoteActions must be used within NoteProvider");
  return ctx;
}
