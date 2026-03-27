import { beforeEach, describe, expect, it, vi } from "vitest";
import { storage } from "./storage";

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("stores and reads values", () => {
    storage.set("unit-key", { name: "jj" });
    expect(storage.get<{ name: string }>("unit-key")).toEqual({ name: "jj" });
  });

  it("returns null when key does not exist", () => {
    expect(storage.get("missing-key")).toBeNull();
  });

  it("handles set errors safely", () => {
    const circular: { self?: unknown } = {};
    circular.self = circular;
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    storage.set("circular-key", circular);

    expect(errorSpy).toHaveBeenCalled();
    expect(localStorage.getItem("circular-key")).toBeNull();
  });

  it("handles parse errors safely", () => {
    localStorage.setItem("broken-json-key", "{not-json");
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    const value = storage.get("broken-json-key");

    expect(value).toBeNull();
    expect(errorSpy).toHaveBeenCalled();
  });

  it("removes and clears values", () => {
    storage.set("a", 1);
    storage.set("b", 2);

    storage.remove("a");
    expect(storage.get("a")).toBeNull();

    storage.clear();
    expect(storage.get("b")).toBeNull();
  });
});
