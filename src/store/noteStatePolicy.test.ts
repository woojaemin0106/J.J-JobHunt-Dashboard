import { afterEach, describe, expect, it, vi } from "vitest";
import type { Note } from "../types/note";
import { noteReducer, type NoteStoreState } from "./noteStatePolicy";

const BASE_NOTE: Note = {
  id: "note-1",
  title: "Interview prep",
  content: "Review project architecture",
  createdAt: "2026-03-27T00:00:00.000Z",
  updatedAt: "2026-03-27T00:00:00.000Z",
};

function createState(notes: Note[]): NoteStoreState {
  return { notes };
}

describe("noteStatePolicy", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("initializes state with payload", () => {
    const next = noteReducer(createState([]), {
      type: "INIT",
      payload: [BASE_NOTE],
    });

    expect(next.notes).toEqual([BASE_NOTE]);
  });

  it("prepends newly added note", () => {
    const existing = { ...BASE_NOTE, id: "note-2" };
    const added = { ...BASE_NOTE, id: "note-3" };
    const next = noteReducer(createState([existing]), {
      type: "ADD",
      payload: added,
    });

    expect(next.notes.map((note) => note.id)).toEqual(["note-3", "note-2"]);
  });

  it("updates matching note and refreshes updatedAt", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-28T12:34:56.000Z"));

    const next = noteReducer(createState([BASE_NOTE]), {
      type: "UPDATE",
      payload: {
        id: "note-1",
        patch: { title: "Interview prep updated" },
      },
    });

    expect(next.notes[0].title).toBe("Interview prep updated");
    expect(next.notes[0].updatedAt).toBe("2026-03-28T12:34:56.000Z");
  });

  it("removes matching note", () => {
    const second = { ...BASE_NOTE, id: "note-2" };
    const next = noteReducer(createState([BASE_NOTE, second]), {
      type: "REMOVE",
      payload: { id: "note-1" },
    });

    expect(next.notes.map((note) => note.id)).toEqual(["note-2"]);
  });
});
