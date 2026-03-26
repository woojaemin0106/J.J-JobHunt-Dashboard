import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import { useAuth } from "./authStore";
import type { Note } from "../types/note";
import { generateId } from "../utils/id";
import { storage } from "../utils/storage";
import {
  buildScopeId,
  buildScopedStorageKey,
  migrateLegacyToScoped,
} from "../utils/scopedStorage";

const STORAGE_RESOURCE = "notes";
const LEGACY_STORAGE_KEY = "jj_jobhunt_notes_v1";
const STORAGE_VERSION = 2;
const LEGACY_VERSION = 1;

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

function loadNotes(scopeId: string): Note[] {
  const scopedKey = buildScopedStorageKey(
    STORAGE_RESOURCE,
    STORAGE_VERSION,
    scopeId
  );
  const scopedData = storage.get<Note[]>(scopedKey);
  if (scopedData !== null) return scopedData;

  if (scopeId !== "guest") {
    const migrated = migrateLegacyToScoped<Note[]>({
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

export function NoteProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const scopeId = buildScopeId(user?.id);
  const storageKey = useMemo(
    () => buildScopedStorageKey(STORAGE_RESOURCE, STORAGE_VERSION, scopeId),
    [scopeId]
  );

  const [state, dispatch] = useReducer(
    reducer,
    { notes: [] },
    () => ({ notes: loadNotes(scopeId) })
  );

  const previousScopeRef = useRef(scopeId);
  const skipPersistRef = useRef(false);

  useEffect(() => {
    if (previousScopeRef.current === scopeId) return;

    previousScopeRef.current = scopeId;
    skipPersistRef.current = true;
    dispatch({ type: "INIT", payload: loadNotes(scopeId) });
  }, [scopeId]);

  useEffect(() => {
    if (skipPersistRef.current) {
      skipPersistRef.current = false;
      return;
    }

    storage.set(storageKey, state.notes);
  }, [state.notes, storageKey]);

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
  if (!ctx) throw new Error("useNoteActions must be used within NoteProvider");
  return ctx;
}
