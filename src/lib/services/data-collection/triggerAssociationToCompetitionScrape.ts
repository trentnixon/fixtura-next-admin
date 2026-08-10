"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import type {
  TriggerAssociationToCompetitionScrapeRequest,
  TriggerAssociationToCompetitionScrapeSuccessResponse,
} from "@/types/triggerAssociationToCompetitionScrape";

/**
 * Triggers an association-to-competition scrape by calling POST /api/association-overview-queues/trigger-association-to-competition-scrape.
 * Enqueues a job to the Redis queue scrape:association-to-competition. Auth not required by endpoint.
 *
 * @param payload - Optional request payload (empty {} uses all defaults)
 * @returns The queued job response
 * @throws Error on validation (400) or server (500) errors
 * @see .comms/admin-llm-handoff-association-to-competition-trigger.md
 */
export async function triggerAssociationToCompetitionScrape(
  payload: TriggerAssociationToCompetitionScrapeRequest = {}
): Promise<TriggerAssociationToCompetitionScrapeSuccessResponse> {
  try {
    const response =
      await axiosInstance.post<TriggerAssociationToCompetitionScrapeSuccessResponse>(
        "/association-overview-queues/trigger-association-to-competition-scrape",
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
        : "Failed to trigger association to competition scrape"
    );
  }
}
