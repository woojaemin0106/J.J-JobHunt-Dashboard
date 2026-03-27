import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  ApplicationProvider,
  useApplicationActions,
  useApplications,
} from "./applicationStore";
import { NoteProvider, useNoteActions, useNotes } from "./noteStore";
import { TodoProvider, useTodoActions, useTodos } from "./todoStore";
import { buildScopedStorageKey } from "../utils/scopedStorage";

vi.mock("./authStore", () => ({
  useAuth: () => ({
    user: {
      id: "user-1",
      email: "demo@example.com",
      name: "Demo",
    },
    isAuthenticated: true,
    isLoading: false,
  }),
}));

function ApplicationHarness() {
  const applications = useApplications();
  const { addApplication, updateApplication, removeApplication } =
    useApplicationActions();

  const first = applications[0];

  return (
    <div>
      <button
        type="button"
        data-testid="app-add"
        onClick={() =>
          addApplication({
            companyName: "Acme",
            jobTitle: "Frontend Developer",
            status: "writing",
            deadline: "2026-04-30",
            versions: [],
            createdAt: "2026-03-27T00:00:00.000Z",
          })
        }
      >
        add
      </button>
      <button
        type="button"
        data-testid="app-update"
        onClick={() => {
          if (!first) return;
          updateApplication(first.id, { companyName: "Acme Updated" });
        }}
      >
        update
      </button>
      <button
        type="button"
        data-testid="app-remove"
        onClick={() => {
          if (!first) return;
          removeApplication(first.id);
        }}
      >
        remove
      </button>
      <div data-testid="app-count">{applications.length}</div>
      <div data-testid="app-first">{first?.companyName ?? "none"}</div>
    </div>
  );
}

function NoteHarness() {
  const notes = useNotes();
  const { addNote, updateNote, removeNote } = useNoteActions();
  const first = notes[0];

  return (
    <div>
      <button
        type="button"
        data-testid="note-add"
        onClick={() =>
          addNote({
            title: "First Note",
            content: "Initial Content",
          })
        }
      >
        add
      </button>
      <button
        type="button"
        data-testid="note-update"
        onClick={() => {
          if (!first) return;
          updateNote(first.id, { title: "Updated Note" });
        }}
      >
        update
      </button>
      <button
        type="button"
        data-testid="note-remove"
        onClick={() => {
          if (!first) return;
          removeNote(first.id);
        }}
      >
        remove
      </button>
      <div data-testid="note-count">{notes.length}</div>
      <div data-testid="note-first">{first?.title ?? "none"}</div>
    </div>
  );
}

function TodoHarness() {
  const todos = useTodos();
  const { addTodo, toggleTodo, removeTodo } = useTodoActions();
  const first = todos[0];

  return (
    <div>
      <button type="button" data-testid="todo-add" onClick={() => addTodo("Prepare portfolio")}>
        add
      </button>
      <button
        type="button"
        data-testid="todo-toggle"
        onClick={() => {
          if (!first) return;
          toggleTodo(first.id);
        }}
      >
        toggle
      </button>
      <button
        type="button"
        data-testid="todo-remove"
        onClick={() => {
          if (!first) return;
          removeTodo(first.id);
        }}
      >
        remove
      </button>
      <div data-testid="todo-count">{todos.length}</div>
      <div data-testid="todo-completed">{String(first?.completed ?? false)}</div>
    </div>
  );
}

describe("basic CRUD integration", () => {
  it("handles application add/update/remove lifecycle", () => {
    localStorage.setItem(
      buildScopedStorageKey("applications", 2, "user-1"),
      JSON.stringify([])
    );

    render(
      <ApplicationProvider>
        <ApplicationHarness />
      </ApplicationProvider>
    );

    expect(screen.getByTestId("app-count")).toHaveTextContent("0");

    fireEvent.click(screen.getByTestId("app-add"));
    expect(screen.getByTestId("app-count")).toHaveTextContent("1");
    expect(screen.getByTestId("app-first")).toHaveTextContent("Acme");

    fireEvent.click(screen.getByTestId("app-update"));
    expect(screen.getByTestId("app-first")).toHaveTextContent("Acme Updated");

    fireEvent.click(screen.getByTestId("app-remove"));
    expect(screen.getByTestId("app-count")).toHaveTextContent("0");
  });

  it("handles note add/update/remove lifecycle", () => {
    render(
      <NoteProvider>
        <NoteHarness />
      </NoteProvider>
    );

    expect(screen.getByTestId("note-count")).toHaveTextContent("0");

    fireEvent.click(screen.getByTestId("note-add"));
    expect(screen.getByTestId("note-count")).toHaveTextContent("1");
    expect(screen.getByTestId("note-first")).toHaveTextContent("First Note");

    fireEvent.click(screen.getByTestId("note-update"));
    expect(screen.getByTestId("note-first")).toHaveTextContent("Updated Note");

    fireEvent.click(screen.getByTestId("note-remove"));
    expect(screen.getByTestId("note-count")).toHaveTextContent("0");
  });

  it("handles todo add/toggle/remove lifecycle", () => {
    render(
      <TodoProvider>
        <TodoHarness />
      </TodoProvider>
    );

    expect(screen.getByTestId("todo-count")).toHaveTextContent("0");

    fireEvent.click(screen.getByTestId("todo-add"));
    expect(screen.getByTestId("todo-count")).toHaveTextContent("1");
    expect(screen.getByTestId("todo-completed")).toHaveTextContent("false");

    fireEvent.click(screen.getByTestId("todo-toggle"));
    expect(screen.getByTestId("todo-completed")).toHaveTextContent("true");

    fireEvent.click(screen.getByTestId("todo-remove"));
    expect(screen.getByTestId("todo-count")).toHaveTextContent("0");
  });
});
