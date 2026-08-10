"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import type {
  TriggerClientsListScrapeRequest,
  TriggerClientsListScrapeSuccessResponse,
} from "@/types/triggerClientsListScrape";

/**
 * Triggers a clients list scrape by calling POST /api/data-collection/trigger-clients-list-scrape.
 * Enqueues a job to the Redis queue scrape:clients-list. Auth not required by endpoint.
 *
 * @param payload - Optional request payload (empty {} uses all defaults)
 * @returns The queued job response
 * @throws Error on validation (400) or server (500) errors
 */
export async function triggerClientsListScrape(
  payload: TriggerClientsListScrapeRequest = {}
): Promise<TriggerClientsListScrapeSuccessResponse> {
  try {
    const response =
      await axiosInstance.post<TriggerClientsListScrapeSuccessResponse>(
        "/data-collection/trigger-clients-list-scrape",
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
        : "Failed to trigger clients list scrape"
    );
  }
}
