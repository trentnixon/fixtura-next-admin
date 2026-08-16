"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import type {
  TriggerClubToCompetitionScrapeRequest,
  TriggerClubToCompetitionScrapeSuccessResponse,
} from "@/types/triggerClubToCompetitionScrape";

/**
 * @deprecated Use triggerClubCompetitionRefresh for bulk full-catalogue runs.
 *
 * Triggers a club-to-competition scrape by calling POST /api/club/trigger-club-to-competition-scrape.
 * Enqueues a job to the Redis queue scrape:club-to-competition. Auth not required by endpoint.
 *
 * @param payload - Optional. Omit for all clubs. Future: clubId for single-club (club detail page)
 * @returns The queued job response
 * @throws Error on validation (400) or server (500) errors
 * @see src/app/dashboard/data/.comms/admin-frontend-trigger-club-to-competition-integration.md
 */
export async function triggerClubToCompetitionScrape(
  payload: TriggerClubToCompetitionScrapeRequest = {}
): Promise<TriggerClubToCompetitionScrapeSuccessResponse> {
  try {
    const response =
      await axiosInstance.post<TriggerClubToCompetitionScrapeSuccessResponse>(
        "/club/trigger-club-to-competition-scrape",
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
        : "Failed to trigger club to competition scrape"
    );
  }
}
