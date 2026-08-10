"use server";

import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import type {
  TriggerGradesCompsSingleScrapeRequest,
  TriggerGradesCompsSingleScrapeSuccessResponse,
} from "@/types/triggerGradesCompsSingleScrape";

/**
 * Triggers a single-competition grades scrape by calling POST /api/competition/trigger-grades-comps-single-scrape.
 * CMS looks up the competition by ID, resolves PlayHQ grades URL from competition.url, and enqueues
 * a job to the Redis queue scrape:grades-comps-single. Bull-bridge-worker picks it up,
 * scrapes the PlayHQ grades page, and POSTs to /api/competition-grades/ingest.
 *
 * @param payload - { competitionId } — Strapi competition document ID
 * @returns The queued job response
 * @throws Error on validation (400) or server (500) errors
 * @see src/app/dashboard/competitions/[competitionID]/.comms/admin-frontend-trigger-grades-comps-single-integration.md
 */
export async function triggerGradesCompsSingleScrape(
  payload: TriggerGradesCompsSingleScrapeRequest
): Promise<TriggerGradesCompsSingleScrapeSuccessResponse> {
  try {
    const response =
      await axiosInstance.post<TriggerGradesCompsSingleScrapeSuccessResponse>(
        "/competition/trigger-grades-comps-single-scrape",
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
        : "Failed to trigger single competition grades scrape"
    );
  }
}
