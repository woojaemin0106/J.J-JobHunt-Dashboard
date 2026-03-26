import { describe, expect, it } from "vitest";
import type { Application } from "../types/application";
import { filterApplications } from "./filterApplications";

const SAMPLE_APPLICATIONS: Application[] = [
  {
    id: "app-1",
    companyName: "Naver",
    jobTitle: "Frontend Engineer",
    status: "writing",
    deadline: "2026-04-10",
    versions: [],
    createdAt: "2026-03-20T00:00:00.000Z",
  },
  {
    id: "app-2",
    companyName: "Kakao",
    jobTitle: "Backend Engineer",
    status: "submitted",
    deadline: "2026-04-08",
    versions: [],
    createdAt: "2026-03-18T00:00:00.000Z",
  },
  {
    id: "app-3",
    companyName: "Toss",
    jobTitle: "Data Analyst",
    status: "passed",
    deadline: "2026-04-01",
    versions: [],
    createdAt: "2026-03-15T00:00:00.000Z",
  },
];

describe("filterApplications", () => {
  it("returns all applications for empty query and all status", () => {
    const result = filterApplications(SAMPLE_APPLICATIONS, {
      query: "",
      status: "all",
    });

    expect(result).toHaveLength(3);
  });

  it("filters by status", () => {
    const result = filterApplications(SAMPLE_APPLICATIONS, {
      query: "",
      status: "submitted",
    });

    expect(result.map((application) => application.id)).toEqual(["app-2"]);
  });

  it("filters by company name query (case-insensitive)", () => {
    const result = filterApplications(SAMPLE_APPLICATIONS, {
      query: "naVer",
      status: "all",
    });

    expect(result.map((application) => application.id)).toEqual(["app-1"]);
  });

  it("filters by job title query", () => {
    const result = filterApplications(SAMPLE_APPLICATIONS, {
      query: "analyst",
      status: "all",
    });

    expect(result.map((application) => application.id)).toEqual(["app-3"]);
  });

  it("combines query and status filters", () => {
    const result = filterApplications(SAMPLE_APPLICATIONS, {
      query: "engineer",
      status: "submitted",
    });

    expect(result.map((application) => application.id)).toEqual(["app-2"]);
  });

  it("returns empty array when no matches exist", () => {
    const result = filterApplications(SAMPLE_APPLICATIONS, {
      query: "ios",
      status: "all",
    });

    expect(result).toHaveLength(0);
  });
});
