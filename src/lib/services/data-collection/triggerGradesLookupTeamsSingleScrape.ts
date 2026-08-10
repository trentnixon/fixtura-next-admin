"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import type {
  TriggerGradesLookupTeamsSingleScrapeRequest,
  TriggerGradesLookupTeamsSingleScrapeSuccessResponse,
} from "@/types/triggerGradesLookupTeamsSingleScrape";

/**
 * Triggers a single-competition grades-teams scrape by calling POST /api/competition/trigger-grades-lookup-teams-single-scrape.
 * CMS enqueues a job to scrape:grades-lookup-teams-single. Bull-bridge-worker picks it up,
 * Python fetches grades from CMS via GET /api/grade-teams/by-competition, scrapes each grade's
 * ladder for teams, and POSTs to /api/grade-teams/response.
 *
 * @param payload - { competitionId } — Strapi competition document ID
 * @returns The queued job response
 * @throws Error on validation (400) or server (500) errors
 * @see src/app/dashboard/competitions/[competitionID]/.comms/admin-frontend-trigger-grades-lookup-teams-single-integration.md
 */
export async function triggerGradesLookupTeamsSingleScrape(
  payload: TriggerGradesLookupTeamsSingleScrapeRequest
): Promise<TriggerGradesLookupTeamsSingleScrapeSuccessResponse> {
  try {
    const response =
      await axiosInstance.post<TriggerGradesLookupTeamsSingleScrapeSuccessResponse>(
        "/competition/trigger-grades-lookup-teams-single-scrape",
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
        : "Failed to trigger grades lookup teams single scrape"
    );
  }
}
