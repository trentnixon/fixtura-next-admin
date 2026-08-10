/**
 * Types for the trigger-club-active-check-scrape endpoint
 * POST /api/club/trigger-club-active-check-scrape
 *
 * @see src/app/dashboard/data/.comms/admin-frontend-trigger-club-active-check-integration.md
 */

import type { ClubScrapeTriggerOptions } from "@/types/clubScrapeTriggerOptions";

/** Request payload — empty `{}` queues a full run; all fields optional */
export interface TriggerClubActiveCheckScrapeRequest {
  jobId?: string;
  runId?: string;
  kind?: "fixture";
  scope?: "club_active_check";
  targets?: unknown[];
  options?: ClubScrapeTriggerOptions;
}

/** Success response (HTTP 200) */
export interface TriggerClubActiveCheckScrapeSuccessResponse {
  success: boolean;
  jobId: number;
  runId: string;
  message: string;
  queueName: "scrape:club-active-check";
}
