"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import type {
  TriggerResultSingleScrapeRequest,
  TriggerResultSingleScrapeSuccessResponse,
} from "@/types/triggerResultSingleScrape";

/**
 * Triggers a single-fixture result scrape via POST /api/game-meta-data/trigger-result-single-scrape.
 * CMS resolves urlToScoreCard, validates PlayHQ game-centre URL, enqueues scrape:result-single.
 *
 * @param payload — cmsFixtureId or fixtureId plus optional overrides
 * @returns Queued job response
 * @throws Error on validation (400) or server (500)
 * @see src/app/dashboard/fixtures/[id]/.docs/handoff/admin-frontend-trigger-result-single-scrape-integration.md
 */
export async function triggerResultSingleScrape(
  payload: TriggerResultSingleScrapeRequest
): Promise<TriggerResultSingleScrapeSuccessResponse> {
  try {
    const response =
      await axiosInstance.post<TriggerResultSingleScrapeSuccessResponse>(
        "/game-meta-data/trigger-result-single-scrape",
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
        : "Failed to trigger result-single scrape"
    );
  }
}
