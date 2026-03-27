import { describe, expect, it } from "vitest";
import type { Application } from "../types/application";
import {
  applicationReducer,
  type ApplicationStoreState,
} from "./applicationStatePolicy";

const BASE_APPLICATION: Application = {
  id: "app-1",
  companyName: "Naver",
  jobTitle: "Frontend Engineer",
  status: "writing",
  deadline: "2026-04-30",
  versions: [],
  createdAt: "2026-03-27T00:00:00.000Z",
};

function createState(applications: Application[]): ApplicationStoreState {
  return { applications };
}

describe("applicationStatePolicy", () => {
  it("initializes state with payload", () => {
    const state = createState([]);
    const next = applicationReducer(state, {
      type: "INIT",
      payload: [BASE_APPLICATION],
    });

    expect(next.applications).toEqual([BASE_APPLICATION]);
  });

  it("prepends newly added application", () => {
    const existing = { ...BASE_APPLICATION, id: "app-2" };
    const added = { ...BASE_APPLICATION, id: "app-3" };
    const state = createState([existing]);
    const next = applicationReducer(state, { type: "ADD", payload: added });

    expect(next.applications.map((application) => application.id)).toEqual([
      "app-3",
      "app-2",
    ]);
  });

  it("updates matching application", () => {
    const state = createState([BASE_APPLICATION]);
    const next = applicationReducer(state, {
      type: "UPDATE",
      payload: {
        id: "app-1",
        patch: { companyName: "Kakao", status: "submitted" },
      },
    });

    expect(next.applications[0].companyName).toBe("Kakao");
    expect(next.applications[0].status).toBe("submitted");
  });

  it("removes matching application", () => {
    const second = { ...BASE_APPLICATION, id: "app-2" };
    const state = createState([BASE_APPLICATION, second]);
    const next = applicationReducer(state, {
      type: "REMOVE",
      payload: { id: "app-1" },
    });

    expect(next.applications.map((application) => application.id)).toEqual([
      "app-2",
    ]);
  });

  it("changes status for matching application", () => {
    const state = createState([BASE_APPLICATION]);
    const next = applicationReducer(state, {
      type: "CHANGE_STATUS",
      payload: { id: "app-1", status: "passed" },
    });

    expect(next.applications[0].status).toBe("passed");
  });
});
