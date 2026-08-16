/**
 * Types for the trigger-club-to-competition-scrape endpoint
 * POST /api/club/trigger-club-to-competition-scrape
 *
 * @deprecated Bulk club scrape — use GlobalDataWorkflowTriggerResponse via
 * triggerClubCompetitionRefresh and types in @/types/globalDataWorkflowTrigger.
 *
 * @see src/app/dashboard/data/.comms/admin-frontend-trigger-club-to-competition-integration.md
 *
 * Note: Single-club trigger uses trigger-club-single-scrape. Bulk runs use global workflow.
 */

import type { ClubScrapeTriggerOptions } from "@/types/clubScrapeTriggerOptions";

/** Request payload — omit `{}` for all clubs / all sports */
export interface TriggerClubToCompetitionScrapeRequest {
  clubId?: number;
  targets?: unknown[];
  options?: ClubScrapeTriggerOptions;
}

/** Success response (HTTP 200) */
export interface TriggerClubToCompetitionScrapeSuccessResponse {
  success: boolean;
  jobId: number;
  runId: string;
  message: string;
  queueName: string;
}
