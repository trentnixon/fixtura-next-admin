/**
 * Types for the trigger-grades-lookup-teams-batch-scrape endpoint
 * POST /api/competition/trigger-grades-lookup-teams-batch-scrape
 *
 * @see src/app/dashboard/association/[id]/.comms/response/admin-frontend-trigger-grades-lookup-teams-batch-integration.md
 */

/** Request — provide associationId or gradeTeamsBatchContextId */
export interface TriggerGradesLookupTeamsBatchScrapeRequest {
  /** Strapi association id; validated in CMS */
  associationId?: number;
  /** Opaque batch context; in CMS equals association id string */
  gradeTeamsBatchContextId?: string;
  runId?: string;
  jobId?: string;
}

/** Success response (HTTP 200) */
export interface TriggerGradesLookupTeamsBatchScrapeSuccessResponse {
  success: boolean;
  jobId: number | string;
  runId: string;
  message: string;
  queueName: "scrape:grades-lookup-teams-batch";
  gradeTeamsBatchContextId: string;
}
