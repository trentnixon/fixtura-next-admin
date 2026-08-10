/**
 * Types for the trigger-grades-batch-scrape endpoint
 * POST /api/competition/trigger-grades-batch-scrape
 *
 * @see .comms/Strapi/requests/admin-frontend-trigger-grades-batch-scrape-integration.md
 */

/** Request — provide associationId or gradesBatchContextId */
export interface TriggerGradesBatchScrapeRequest {
  /** Validates association exists in CMS */
  associationId?: number;
  /** Opaque batch key; CMS uses association id string when not using associationId */
  gradesBatchContextId?: string;
  runId?: string;
  jobId?: string;
}

/** Success response (HTTP 200) — Strapi returns JSON not wrapped in { data } */
export interface TriggerGradesBatchScrapeSuccessResponse {
  success: true;
  jobId: number;
  runId: string;
  message: string;
  queueName: "scrape:grades-batch";
  gradesBatchContextId: string;
}
