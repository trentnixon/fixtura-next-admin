"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import type {
  TriggerGradesLookupTeamsScrapeRequest,
  TriggerGradesLookupTeamsScrapeSuccessResponse,
} from "@/types/triggerGradesLookupTeamsScrape";

/**
 * Triggers a grade-teams scrape by calling POST /api/grade-teams/trigger-grades-lookup-teams-scrape.
 * CMS enqueues a job to the Redis queue scrape:grades-lookup-teams. Bull-bridge-worker picks it up,
 * scrapes PlayHQ ladder pages for teams per grade, and POSTs to /api/grade-teams/response.
 *
 * @param payload - Optional. Empty {} = full run (all grades from CMS). Or provide targets for specific grades.
 * @returns The queued job response
 * @throws Error on validation (400) or server (500) errors
 * @see src/app/dashboard/competitions/[competitionID]/.comms/admin-frontend-trigger-grades-lookup-teams-integration.md
 */
export async function triggerGradesLookupTeamsScrape(
  payload: TriggerGradesLookupTeamsScrapeRequest = {}
): Promise<TriggerGradesLookupTeamsScrapeSuccessResponse> {
  try {
    const response =
      await axiosInstance.post<TriggerGradesLookupTeamsScrapeSuccessResponse>(
        "/grade-teams/trigger-grades-lookup-teams-scrape",
        payload
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
        : "Failed to trigger grades lookup teams scrape"
    );
  }
}
