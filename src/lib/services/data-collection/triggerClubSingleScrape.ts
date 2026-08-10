"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import type {
  TriggerClubSingleScrapeRequest,
  TriggerClubSingleScrapeSuccessResponse,
} from "@/types/triggerClubSingleScrape";

/**
 * Triggers a single-club scrape by calling POST /api/club/trigger-club-single-scrape.
 * CMS looks up the club by ID, resolves PlayHQ URL from club.href, and enqueues
 * a job to the Redis queue scrape:club-single. Bull-bridge-worker picks it up,
 * scrapes the PlayHQ page, and POSTs to club-to-competition ingest.
 *
 * @param payload - { clubId } — Strapi club document ID
 * @returns The queued job response
 * @throws Error on validation (400) or server (500) errors
 * @see src/app/dashboard/club/[id]/.comms/admin-frontend-trigger-club-single-integration.md
 */
export async function triggerClubSingleScrape(
  payload: TriggerClubSingleScrapeRequest
): Promise<TriggerClubSingleScrapeSuccessResponse> {
  try {
    const response =
      await axiosInstance.post<TriggerClubSingleScrapeSuccessResponse>(
        "/club/trigger-club-single-scrape",
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
        : "Failed to trigger single club scrape"
    );
  }
}
