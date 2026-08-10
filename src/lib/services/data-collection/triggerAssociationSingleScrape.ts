"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import type {
  TriggerAssociationSingleScrapeRequest,
  TriggerAssociationSingleScrapeSuccessResponse,
} from "@/types/triggerAssociationSingleScrape";

/**
 * Triggers a single-association scrape by calling POST /api/association-overview-queues/trigger-association-single-scrape.
 * CMS looks up the association by ID, resolves the PlayHQ URL from association.href, and enqueues a job to scrape:association-single.
 * Auth not required by endpoint.
 *
 * @param payload - Request payload with associationId (required)
 * @returns The queued job response
 * @throws Error on validation (400) or server (500) errors
 * @see src/app/dashboard/association/[id]/.comms/admin-frontend-trigger-association-single-integration.md
 */
export async function triggerAssociationSingleScrape(
  payload: TriggerAssociationSingleScrapeRequest
): Promise<TriggerAssociationSingleScrapeSuccessResponse> {
  try {
    const response =
      await axiosInstance.post<TriggerAssociationSingleScrapeSuccessResponse>(
        "/association-overview-queues/trigger-association-single-scrape",
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
        : "Failed to trigger single association scrape"
    );
  }
}
