import type { Note } from "../types/note";

export type NoteStoreState = { notes: Note[] };

export type NoteStoreAction =
  | { type: "INIT"; payload: Note[] }
  | { type: "ADD"; payload: Note }
  | { type: "UPDATE"; payload: { id: string; patch: Partial<Note> } }
  | { type: "REMOVE"; payload: { id: string } };

export function noteReducer(
  state: NoteStoreState,
  action: NoteStoreAction
): NoteStoreState {
  switch (action.type) {
    case "INIT":
      return { notes: action.payload };
    case "ADD":
      return { notes: [action.payload, ...state.notes] };
    case "UPDATE":
      return {
        notes: state.notes.map((note) =>
          note.id === action.payload.id
            ? { ...note, ...action.payload.patch, updatedAt: new Date().toISOString() }
            : note
        ),
      };
    case "REMOVE":
      return {
        notes: state.notes.filter((note) => note.id !== action.payload.id),
      };
    default:
      return state;
  }
}
