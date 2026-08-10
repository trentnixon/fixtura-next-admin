/**
 * Types for the trigger-association-single-scrape endpoint
 * POST /api/association-overview-queues/trigger-association-single-scrape
 *
 * @see src/app/dashboard/association/[id]/.comms/admin-frontend-trigger-association-single-integration.md
 */

/** Request payload — associationId required */
export interface TriggerAssociationSingleScrapeRequest {
  associationId: number;
}

/** Success response (HTTP 200) */
export interface TriggerAssociationSingleScrapeSuccessResponse {
  success: boolean;
  jobId: number;
  runId: string;
  message: string;
  queueName: string;
}
