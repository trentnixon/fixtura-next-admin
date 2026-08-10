"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import type {
  TriggerGradesCompsScrapeRequest,
  TriggerGradesCompsScrapeSuccessResponse,
} from "@/types/triggerGradesCompsScrape";

/**
 * Triggers a grades-to-competition scrape by calling POST /api/competition/trigger-grades-comps-scrape.
 * CMS enqueues a job to the Redis queue scrape:grades-comps. Bull-bridge-worker picks it up,
 * scrapes PlayHQ grades pages, and POSTs to /api/competition-grades/ingest.
 *
 * @param payload - Optional. Empty {} = full run (all competitions). Or provide targets for specific competitions.
 * @returns The queued job response
 * @throws Error on validation (400) or server (500) errors
 * @see src/app/dashboard/data/.comms/admin-frontend-trigger-grades-comps-scrape-integration.md
 */
export async function triggerGradesCompsScrape(
  payload: TriggerGradesCompsScrapeRequest = {}
): Promise<TriggerGradesCompsScrapeSuccessResponse> {
  try {
    const response =
      await axiosInstance.post<TriggerGradesCompsScrapeSuccessResponse>(
        "/competition/trigger-grades-comps-scrape",
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
        : "Failed to trigger grades comps scrape"
    );
  }
}
