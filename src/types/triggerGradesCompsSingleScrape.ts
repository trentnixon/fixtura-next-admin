/**
 * Types for the trigger-grades-comps-single-scrape endpoint
 * POST /api/competition/trigger-grades-comps-single-scrape
 *
 * CMS looks up the competition by ID, resolves PlayHQ grades URL from competition.url,
 * and enqueues a job to scrape:grades-comps-single. Bull-bridge-worker scrapes
 * the PlayHQ grades page and POSTs to /api/competition-grades/ingest.
 *
 * @see src/app/dashboard/competitions/[competitionID]/.comms/admin-frontend-trigger-grades-comps-single-integration.md
 */

/** Request payload — competitionId required (Strapi competition document ID) */
export interface TriggerGradesCompsSingleScrapeRequest {
  competitionId: number;
}

/** Success response (HTTP 200) */
export interface TriggerGradesCompsSingleScrapeSuccessResponse {
  success: boolean;
  jobId: number;
  runId: string;
  message: string;
  queueName: string;
}
