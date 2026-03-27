import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Home from "./Home";
import type { User } from "../types/auth";
import type { Application } from "../types/application";
import type { Todo } from "../types/todo";

let mockUser: User | null = null;

const mockDemoConfig = {
  enabled: true,
  email: "demo@example.com",
  password: "demo-password",
  isVisible: true,
};

const mockApplications: Application[] = [];
const mockTodos: Todo[] = [];
const addTodoMock = vi.fn();
const removeTodoMock = vi.fn();
const toggleTodoMock = vi.fn();

vi.mock("../store/authStore", () => ({
  useAuth: () => ({
    user: mockUser,
    isAuthenticated: Boolean(mockUser),
    isLoading: false,
  }),
}));

vi.mock("../config/demoAuth", () => ({
  get demoAuthConfig() {
    return mockDemoConfig;
  },
}));

vi.mock("../store/applicationStore", () => ({
  useApplications: () => mockApplications,
}));

vi.mock("../store/todoStore", () => ({
  useTodos: () => mockTodos,
  useTodoActions: () => ({
    addTodo: addTodoMock,
    removeTodo: removeTodoMock,
    toggleTodo: toggleTodoMock,
  }),
}));

function renderHome() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/applications" element={<div data-testid="applications-route" />} />
        <Route path="/notes" element={<div data-testid="notes-route" />} />
        <Route path="/statistics" element={<div data-testid="statistics-route" />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("Home demo quick flow integration", () => {
  beforeEach(() => {
    mockUser = null;
    mockDemoConfig.enabled = true;
    mockDemoConfig.email = "demo@example.com";
    mockDemoConfig.password = "demo-password";
    mockDemoConfig.isVisible = true;
    addTodoMock.mockReset();
    removeTodoMock.mockReset();
    toggleTodoMock.mockReset();
  });

  it("shows quick flow panel for guest session", () => {
    mockUser = {
      id: "guest",
      email: "guest@jj-jobhunt.local",
      name: "Interview Guest",
    };

    renderHome();

    expect(screen.getByTestId("home-demo-quickflow")).toBeInTheDocument();
    expect(screen.getByTestId("demo-flow-step-applications")).toBeInTheDocument();
  });

  it("shows quick flow panel for configured demo account", () => {
    mockUser = {
      id: "user-demo",
      email: "demo@example.com",
      name: "Demo User",
    };

    renderHome();

    expect(screen.getByTestId("home-demo-quickflow")).toBeInTheDocument();
  });

  it("hides quick flow panel for regular account", () => {
    mockUser = {
      id: "user-real",
      email: "real@example.com",
      name: "Real User",
    };

    renderHome();

    expect(screen.queryByTestId("home-demo-quickflow")).not.toBeInTheDocument();
  });

  it("navigates through quick flow buttons", () => {
    mockUser = {
      id: "guest",
      email: "guest@jj-jobhunt.local",
      name: "Interview Guest",
    };

    renderHome();

    fireEvent.click(screen.getByTestId("demo-flow-step-applications"));
    expect(screen.getByTestId("applications-route")).toBeInTheDocument();
  });
});
