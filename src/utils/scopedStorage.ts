import { storage } from "./storage";

const STORAGE_PREFIX = "jj.jobhunt";

export function buildScopeId(userId?: string | null): string {
  return userId ?? "guest";
}

export function buildScopedStorageKey(
  resource: string,
  version: number,
  scopeId: string
): string {
  return `${STORAGE_PREFIX}.${resource}.v${version}.user:${scopeId}`;
}

export function buildMigrationMarkerKey(
  resource: string,
  fromVersion: number,
  toVersion: number,
  scopeId: string
): string {
  return `${STORAGE_PREFIX}.migration.${resource}.v${fromVersion}-to-v${toVersion}.user:${scopeId}`;
}

export function migrateLegacyToScoped<T>({
  legacyKey,
  resource,
  scopeId,
  fromVersion,
  toVersion,
}: {
  legacyKey: string;
  resource: string;
  scopeId: string;
  fromVersion: number;
  toVersion: number;
}): T | null {
  const markerKey = buildMigrationMarkerKey(
    resource,
    fromVersion,
    toVersion,
    scopeId
  );

  if (storage.get<boolean>(markerKey)) {
    return null;
  }

  // Mark first to keep migration idempotent even when legacy data is absent.
  storage.set(markerKey, true);

  const legacyData = storage.get<T>(legacyKey);
  if (legacyData === null) return null;

  const scopedKey = buildScopedStorageKey(resource, toVersion, scopeId);
  storage.set(scopedKey, legacyData);
  return legacyData;
}
