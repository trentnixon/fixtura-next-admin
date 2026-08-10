/**
 * Types for the trigger-grades-lookup-teams-single-scrape endpoint
 * POST /api/competition/trigger-grades-lookup-teams-single-scrape
 *
 * Python fetches grades for this competition from CMS via GET /api/grade-teams/by-competition,
 * then scrapes each grade's ladder for teams and POSTs to /api/grade-teams/response.
 *
 * @see src/app/dashboard/competitions/[competitionID]/.comms/admin-frontend-trigger-grades-lookup-teams-single-integration.md
 */

/** Request payload — competitionId required (Strapi competition document ID) */
export interface TriggerGradesLookupTeamsSingleScrapeRequest {
  competitionId: number;
}

/** Success response (HTTP 200) */
export interface TriggerGradesLookupTeamsSingleScrapeSuccessResponse {
  success: boolean;
  jobId: number;
  runId: string;
  message: string;
  queueName: string;
}
