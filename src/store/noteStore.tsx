import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import type { Note } from "../types/note";
import { storage } from "../utils/storage";
import { generateId } from "../utils/id";

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

type Actions = {
  addNote: (input: Omit<Note, "id" | "createdAt" | "updatedAt">) => void;
  updateNote: (id: string, patch: Partial<Note>) => void;
  removeNote: (id: string) => void;
};

const StateCtx = createContext<State | null>(null);
const ActionsCtx = createContext<Actions | null>(null);

export function NoteProvider({ children }: { children: React.ReactNode }) {
  // 초기 상태를 localStorage에서 직접 가져오기
  const [state, dispatch] = useReducer(
    reducer,
    { notes: [] },
    () => {
      const fromStorage = storage.get<Note[]>(STORAGE_KEY);
      return { notes: fromStorage ?? [] };
    }
  );

  // 초기 로드 완료 여부를 추적하는 ref
  const isInitialized = useRef(false);

  useEffect(() => {
    // 첫 마운트 시에는 localStorage에서 이미 불러왔으므로 저장하지 않음
    if (!isInitialized.current) {
      isInitialized.current = true;
      return;
    }
    // 이후 상태 변경 시에만 localStorage에 저장
    storage.set(STORAGE_KEY, state.notes);
  }, [state.notes]);

  const actions = useMemo<Actions>(() => {
    return {
      addNote(input) {
        const now = new Date().toISOString();
        dispatch({
          type: "ADD",
          payload: { ...input, id: generateId(), createdAt: now, updatedAt: now },
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
