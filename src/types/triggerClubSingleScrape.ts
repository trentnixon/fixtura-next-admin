/**
 * Types for the trigger-club-single-scrape endpoint
 * POST /api/club/trigger-club-single-scrape
 *
 * CMS looks up the club by ID, resolves PlayHQ URL from club.href,
 * and enqueues a job to scrape:club-single. Bull-bridge-worker scrapes
 * the PlayHQ page and POSTs to club-to-competition ingest.
 *
 * @see src/app/dashboard/club/[id]/.comms/admin-frontend-trigger-club-single-integration.md
 */

/** Request payload — clubId required (Strapi club document ID) */
export interface TriggerClubSingleScrapeRequest {
  clubId: number;
}

/** Success response (HTTP 200) */
export interface TriggerClubSingleScrapeSuccessResponse {
  success: boolean;
  jobId: number;
  runId: string;
  message: string;
  queueName: string;
}
