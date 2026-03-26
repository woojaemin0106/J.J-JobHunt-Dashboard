import type { Application } from "../types/application";

export const APPLICATION_SEARCH_PARAM_KEYS = {
  query: "query",
  status: "status",
  createNew: "new",
} as const;

export type ApplicationStatusFilter = "all" | Application["status"];

export const DEFAULT_APPLICATION_STATUS_FILTER: ApplicationStatusFilter = "all";

export function normalizeApplicationQuery(raw: string | null): string {
  return raw?.trim() ?? "";
}

export function normalizeApplicationStatus(
  raw: string | null
): ApplicationStatusFilter {
  if (
    raw === "writing" ||
    raw === "submitted" ||
    raw === "passed" ||
    raw === "failed"
  ) {
    return raw;
  }

  return DEFAULT_APPLICATION_STATUS_FILTER;
}

export function createApplicationSearchParams({
  query,
  status,
  createNew,
}: {
  query?: string;
  status?: ApplicationStatusFilter;
  createNew?: boolean;
}): URLSearchParams {
  const params = new URLSearchParams();
  const normalizedQuery = normalizeApplicationQuery(query ?? null);

  if (normalizedQuery) {
    params.set(APPLICATION_SEARCH_PARAM_KEYS.query, normalizedQuery);
  }

  if (status && status !== DEFAULT_APPLICATION_STATUS_FILTER) {
    params.set(APPLICATION_SEARCH_PARAM_KEYS.status, status);
  }

  if (createNew) {
    params.set(APPLICATION_SEARCH_PARAM_KEYS.createNew, "true");
  }

  return params;
}
