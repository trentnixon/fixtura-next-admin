"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import type {
  TriggerRemoveFixturesScrapeRequest,
  TriggerRemoveFixturesScrapeSuccessResponse,
} from "@/types/triggerRemoveFixturesScrape";

/**
 * Triggers remove-fixtures scrape enqueue via POST /api/game-meta-data/trigger-remove-fixtures-scrape.
 * CMS enqueues scrape:remove-fixtures jobs (chunked). Enqueue-only v1.
 *
 * @param payload — accountId + sourceType + sourceId; optional sport, runId, dryRun
 * @returns Run summary with job rows
 * @throws Error on validation (400) or server (500)
 * @see .comms/admin-frontend-trigger-remove-fixtures-scrape-integration.md
 */
export async function triggerRemoveFixturesScrape(
  payload: TriggerRemoveFixturesScrapeRequest
): Promise<TriggerRemoveFixturesScrapeSuccessResponse> {
  try {
    const response =
      await axiosInstance.post<TriggerRemoveFixturesScrapeSuccessResponse>(
        "/game-meta-data/trigger-remove-fixtures-scrape",
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
        : "Failed to trigger remove-fixtures scrape"
    );
  }
}
