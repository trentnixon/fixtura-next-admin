/**
 * Types for the trigger-grades-lookup-teams-scrape endpoint
 * POST /api/grade-teams/trigger-grades-lookup-teams-scrape
 *
 * CMS enqueues a job to scrape:grades-lookup-teams. Bull-bridge-worker scrapes
 * PlayHQ ladder pages for teams per grade and POSTs to /api/grade-teams/response.
 *
 * @see src/app/dashboard/competitions/[competitionID]/.comms/admin-frontend-trigger-grades-lookup-teams-integration.md
 */

/** A single grade target for direct scraping (optional). Use when scraping specific grades instead of all. */
export interface GradesLookupTeamsTarget {
  fixtureKey: string;
  fixtureId?: string;
  url: string;
  strapiId: number;
  competitionStrapiID?: number;
}

/** Scrape options */
export interface GradesLookupTeamsOptions {
  dryRun?: boolean;
  skipAccountSlot?: boolean;
  jobMaxConcurrency?: number;
}

/** Request payload — all fields optional. Empty body = full run (all grades from CMS) */
export interface TriggerGradesLookupTeamsScrapeRequest {
  jobId?: string;
  runId?: string;
  kind?: string;
  scope?: string;
  targets?: GradesLookupTeamsTarget[];
  options?: GradesLookupTeamsOptions;
}

/** Success response (HTTP 200) */
export interface TriggerGradesLookupTeamsScrapeSuccessResponse {
  success: boolean;
  jobId: number;
  runId: string;
  message: string;
  queueName: string;
}
