"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import type {
  FetchScraperLogsParams,
  ListLogsResponse,
} from "@/types/scraperLogs";

/**
 * Scope values for the scraper logs API filter.
 * API expects underscore scope keys (clients_list, club_active_check, etc.).
 * Note: association-single jobs are grouped under association_to_competition.
 */
const SCOPES = [
  "clients_list",
  "association_to_competition",
  "club_to_competition",
  "grades_comps",
  "grades_lookup_teams",
  "club_active_check",
] as const;

/**
 * Fetches scraper logs from the CMS endpoint.
 * GET /api/fixtura-scraper/logs
 *
 * @param params - Query params; scope is optional (omit for all scopes)
 * @returns Typed ListLogsResponse with data and meta
 * @throws Error on 400, 500 or invalid params
 * @see src/app/dashboard/data/.comms/admin-frontend-scraper-logs-list-endpoint-guide.md
 */
export async function fetchScraperLogs(
  params: FetchScraperLogsParams
): Promise<ListLogsResponse> {
  const {
    scope,
    jobId,
    queueName,
    event,
    timestamp_gte,
    timestamp_lte,
    pagination,
    include,
  } = params;

  const trimmedScope =
    scope && typeof scope === "string" ? scope.trim() : undefined;
  if (trimmedScope && trimmedScope.length > 0 && !SCOPES.includes(trimmedScope as (typeof SCOPES)[number])) {
    throw new Error(
      `scope must be one of: ${SCOPES.join(", ")} or omitted for all. Received: ${trimmedScope}`
    );
  }

  if (pagination) {
    const page = pagination.page ?? 1;
    const pageSize = pagination.pageSize ?? 25;
    if (page < 1) {
      throw new Error("pagination[page] must be >= 1");
    }
    if (pageSize < 1 || pageSize > 100) {
      throw new Error("pagination[pageSize] must be 1-100");
    }
  }

  try {
    const queryParams: Record<string, string | number> = {};

    if (trimmedScope && trimmedScope.length > 0) {
      queryParams.scope = trimmedScope;
    }
    const trimmedJobId =
      jobId && typeof jobId === "string" ? jobId.trim() : undefined;
    if (trimmedJobId) {
      queryParams.jobId = trimmedJobId;
    }
    if (queueName) queryParams.queueName = queueName;
    if (event) queryParams.event = event;
    if (timestamp_gte) queryParams.timestamp_gte = timestamp_gte;
    if (timestamp_lte) queryParams.timestamp_lte = timestamp_lte;
    if (include) queryParams.include = include;

    if (pagination) {
      queryParams["pagination[page]"] = pagination.page ?? 1;
      queryParams["pagination[pageSize]"] = pagination.pageSize ?? 25;
    }

    const response = await axiosInstance.get<ListLogsResponse>(
      "fixtura-scraper/logs",
      { params: queryParams }
    );

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage =
        (error.response?.data as { error?: { message?: string } })?.error
          ?.message ??
        (error.response?.data as { message?: string })?.message ??
        error.message ??
        `Request failed: ${error.response?.status ?? "Unknown"}`;

      throw new Error(errorMessage);
    }
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to fetch scraper logs"
    );
  }
}
