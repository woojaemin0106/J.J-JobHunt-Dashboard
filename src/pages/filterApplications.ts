import type { Application } from "../types/application";
import type { ApplicationStatusFilter } from "./applicationsSearchParams";
import { normalizeApplicationQuery } from "./applicationsSearchParams";

export function filterApplications(
  applications: Application[],
  {
    query,
    status,
  }: {
    query: string;
    status: ApplicationStatusFilter;
  }
): Application[] {
  const normalizedQuery = normalizeApplicationQuery(query).toLowerCase();

  return applications.filter((application) => {
    const matchesStatus = status === "all" || application.status === status;
    if (!matchesStatus) return false;

    if (!normalizedQuery) return true;

    const companyName = application.companyName.toLowerCase();
    const jobTitle = application.jobTitle.toLowerCase();
    return (
      companyName.includes(normalizedQuery) ||
      jobTitle.includes(normalizedQuery)
    );
  });
}
