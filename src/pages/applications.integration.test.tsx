import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Applications from "./Applications";
import type { Application } from "../types/application";

const mockApplications: Application[] = [
  {
    id: "app-1",
    companyName: "Alpha Labs",
    jobTitle: "Frontend Engineer",
    status: "submitted",
    deadline: "2026-04-01",
    versions: [],
    createdAt: "2026-03-01T00:00:00.000Z",
  },
  {
    id: "app-2",
    companyName: "Beta Commerce",
    jobTitle: "Product Designer",
    status: "writing",
    deadline: "2026-04-02",
    versions: [],
    createdAt: "2026-03-02T00:00:00.000Z",
  },
  {
    id: "app-3",
    companyName: "Gamma AI",
    jobTitle: "Frontend Engineer",
    status: "passed",
    deadline: "2026-04-03",
    versions: [],
    createdAt: "2026-03-03T00:00:00.000Z",
  },
];

vi.mock("../store/applicationStore", () => ({
  useApplications: () => mockApplications,
}));

vi.mock("../kanban/KanbanBoard", () => ({
  default: ({ applications }: { applications: Application[] }) => (
    <div data-testid="kanban-visible-count">{applications.length}</div>
  ),
}));

vi.mock("../kanban/ApplicationModal", () => ({
  default: () => null,
}));

function renderApplications(initialEntry = "/applications") {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/applications" element={<Applications />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("Applications integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("applies query filter from URL search params", async () => {
    renderApplications("/applications?query=gamma");

    expect(await screen.findByTestId("applications-count")).toHaveTextContent("1 / 3");
    expect(screen.getByTestId("kanban-visible-count")).toHaveTextContent("1");
  });

  it("updates status filtering and reset flow", async () => {
    renderApplications("/applications");

    const statusSelect = await screen.findByTestId("applications-status-filter");
    const clearButton = screen.getByTestId("applications-clear-filters");

    expect(screen.getByTestId("applications-count")).toHaveTextContent("3 / 3");
    expect(clearButton).toBeDisabled();

    fireEvent.change(statusSelect, { target: { value: "passed" } });

    expect(screen.getByTestId("applications-count")).toHaveTextContent("1 / 3");
    expect(clearButton).not.toBeDisabled();

    fireEvent.click(clearButton);

    expect(screen.getByTestId("applications-count")).toHaveTextContent("3 / 3");
    expect(clearButton).toBeDisabled();
  });
});
