import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { storage } from "./storage";
import {
  buildMigrationMarkerKey,
  buildScopeId,
  buildScopedStorageKey,
  migrateLegacyToScoped,
} from "./scopedStorage";

describe("scopedStorage", () => {
  const inMemoryStorage = new Map<string, unknown>();

  beforeEach(() => {
    inMemoryStorage.clear();

    vi.spyOn(storage, "get").mockImplementation((key: string) => {
      if (!inMemoryStorage.has(key)) return null;
      return inMemoryStorage.get(key) as never;
    });

    vi.spyOn(storage, "set").mockImplementation((key: string, value: unknown) => {
      inMemoryStorage.set(key, value);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    inMemoryStorage.clear();
  });

  it("builds guest scope when user id is absent", () => {
    expect(buildScopeId(undefined)).toBe("guest");
    expect(buildScopeId(null)).toBe("guest");
  });

  it("builds user scope when user id exists", () => {
    expect(buildScopeId("user-123")).toBe("user-123");
  });

  it("builds scoped storage and migration marker keys", () => {
    expect(buildScopedStorageKey("applications", 2, "user-123")).toBe(
      "jj.jobhunt.applications.v2.user:user-123"
    );
    expect(buildMigrationMarkerKey("applications", 1, 2, "user-123")).toBe(
      "jj.jobhunt.migration.applications.v1-to-v2.user:user-123"
    );
  });

  it("migrates legacy data to scoped key once and keeps legacy data untouched", () => {
    const legacyKey = "jj_jobhunt_applications_v1";
    const legacyData = [{ id: "app-1" }];
    inMemoryStorage.set(legacyKey, legacyData);

    const migrated = migrateLegacyToScoped<{ id: string }[]>({
      legacyKey,
      resource: "applications",
      scopeId: "user-1",
      fromVersion: 1,
      toVersion: 2,
    });

    const scopedKey = buildScopedStorageKey("applications", 2, "user-1");
    const markerKey = buildMigrationMarkerKey("applications", 1, 2, "user-1");

    expect(migrated).toEqual(legacyData);
    expect(inMemoryStorage.get(scopedKey)).toEqual(legacyData);
    expect(inMemoryStorage.get(markerKey)).toBe(true);
    expect(inMemoryStorage.get(legacyKey)).toEqual(legacyData);
  });

  it("does not run migration again when marker exists", () => {
    const legacyKey = "jj_jobhunt_applications_v1";
    const scopeId = "user-2";
    const scopedKey = buildScopedStorageKey("applications", 2, scopeId);
    const markerKey = buildMigrationMarkerKey("applications", 1, 2, scopeId);

    inMemoryStorage.set(legacyKey, [{ id: "legacy-app" }]);
    inMemoryStorage.set(markerKey, true);

    const migrated = migrateLegacyToScoped<{ id: string }[]>({
      legacyKey,
      resource: "applications",
      scopeId,
      fromVersion: 1,
      toVersion: 2,
    });

    expect(migrated).toBeNull();
    expect(inMemoryStorage.has(scopedKey)).toBe(false);
  });

  it("writes marker even when legacy data is absent to stay idempotent", () => {
    const legacyKey = "jj_jobhunt_notes_v1";
    const scopeId = "user-3";
    const markerKey = buildMigrationMarkerKey("notes", 1, 2, scopeId);

    const migrated = migrateLegacyToScoped<unknown[]>({
      legacyKey,
      resource: "notes",
      scopeId,
      fromVersion: 1,
      toVersion: 2,
    });

    expect(migrated).toBeNull();
    expect(inMemoryStorage.get(markerKey)).toBe(true);
  });
});
