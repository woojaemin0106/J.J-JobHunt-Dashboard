import { describe, expect, it } from "vitest";
import {
  createApplicationSearchParams,
  DEFAULT_APPLICATION_STATUS_FILTER,
  normalizeApplicationQuery,
  normalizeApplicationStatus,
} from "./applicationsSearchParams";

describe("applicationsSearchParams", () => {
  it("normalizes query by trimming whitespace", () => {
    expect(normalizeApplicationQuery(null)).toBe("");
    expect(normalizeApplicationQuery("  backend engineer  ")).toBe(
      "backend engineer"
    );
  });

  it("normalizes status to default for invalid values", () => {
    expect(normalizeApplicationStatus(null)).toBe(
      DEFAULT_APPLICATION_STATUS_FILTER
    );
    expect(normalizeApplicationStatus("invalid-status")).toBe(
      DEFAULT_APPLICATION_STATUS_FILTER
    );
  });

  it("keeps valid status values", () => {
    expect(normalizeApplicationStatus("writing")).toBe("writing");
    expect(normalizeApplicationStatus("submitted")).toBe("submitted");
    expect(normalizeApplicationStatus("passed")).toBe("passed");
    expect(normalizeApplicationStatus("failed")).toBe("failed");
  });

  it("creates query params with query, status, and new flag", () => {
    const params = createApplicationSearchParams({
      query: "  naver  ",
      status: "submitted",
      createNew: true,
    });

    expect(params.toString()).toBe("query=naver&status=submitted&new=true");
  });

  it("omits default values from query params", () => {
    const params = createApplicationSearchParams({
      query: "   ",
      status: DEFAULT_APPLICATION_STATUS_FILTER,
      createNew: false,
    });

    expect(params.toString()).toBe("");
  });
});
