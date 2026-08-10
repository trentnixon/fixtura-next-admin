/**
 * Types for the trigger-association-to-competition-scrape endpoint
 * POST /api/association-overview-queues/trigger-association-to-competition-scrape
 *
 * @see .comms/admin-llm-handoff-association-to-competition-trigger.md
 */

/** Association scrape options */
export interface AssociationScrapeOptions {
  dryRun?: boolean;
  skipAccountSlot?: boolean;
  jobMaxConcurrency?: number;
}

/** Request payload — all fields optional */
export interface TriggerAssociationToCompetitionScrapeRequest {
  accountId?: number;
  jobId?: string;
  runId?: string;
  options?: AssociationScrapeOptions;
}

/** Success response (HTTP 200) */
export interface TriggerAssociationToCompetitionScrapeSuccessResponse {
  success: boolean;
  jobId: number;
  runId: string;
  message: string;
  queueName: string;
}
