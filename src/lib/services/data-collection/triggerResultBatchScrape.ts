"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import type {
  TriggerResultBatchScrapeRequest,
  TriggerResultBatchScrapeSuccessResponse,
} from "@/types/triggerResultBatchScrape";

/**
 * Triggers batch result scrape via POST /api/game-meta-data/trigger-result-batch-scrape.
 * CMS enqueues scrape:result-batch jobs (up to five fixtures per chunk).
 *
 * @param payload — sourceType + sourceId; optional sport, dryRun
 * @returns Run summary with job rows
 * @throws Error on validation (400) or server (500)
 * @see src/app/dashboard/competitions/.comms/admin-frontend-trigger-result-batch-scrape-integration.md
 */
export async function triggerResultBatchScrape(
  payload: TriggerResultBatchScrapeRequest
): Promise<TriggerResultBatchScrapeSuccessResponse> {
  try {
    const response =
      await axiosInstance.post<TriggerResultBatchScrapeSuccessResponse>(
        "/game-meta-data/trigger-result-batch-scrape",
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
        : "Failed to trigger result-batch scrape"
    );
  }
}
