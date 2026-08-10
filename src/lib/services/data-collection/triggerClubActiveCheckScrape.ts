"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import type {
  TriggerClubActiveCheckScrapeRequest,
  TriggerClubActiveCheckScrapeSuccessResponse,
} from "@/types/triggerClubActiveCheckScrape";

/**
 * Triggers club active check (PlayHQ inactive-org detection) via
 * POST /api/club/trigger-club-active-check-scrape. Enqueues scrape:club-active-check.
 * Auth not required by endpoint.
 *
 * @param payload - Optional; omit or `{}` for full run
 * @returns The queued job response
 * @throws Error on validation (400) or server (500) errors
 * @see src/app/dashboard/data/.comms/admin-frontend-trigger-club-active-check-integration.md
 */
export async function triggerClubActiveCheckScrape(
  payload: TriggerClubActiveCheckScrapeRequest = {}
): Promise<TriggerClubActiveCheckScrapeSuccessResponse> {
  try {
    const response =
      await axiosInstance.post<TriggerClubActiveCheckScrapeSuccessResponse>(
        "/club/trigger-club-active-check-scrape",
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
        : "Failed to trigger club active check scrape"
    );
  }
}
