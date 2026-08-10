/**
 * Types for the trigger-grades-comps-scrape endpoint
 * POST /api/competition/trigger-grades-comps-scrape
 *
 * CMS enqueues a job to scrape:grades-comps. Bull-bridge-worker scrapes
 * PlayHQ grades pages and POSTs to /api/competition-grades/ingest.
 *
 * @see src/app/dashboard/data/.comms/admin-frontend-trigger-grades-comps-scrape-integration.md
 */

/** A single competition target for direct scraping (optional) */
export interface GradesCompsTarget {
  fixtureKey: string;
  fixtureId?: string;
  url: string;
  strapiId: number;
}

/** Scrape options */
export interface GradesCompsOptions {
  dryRun?: boolean;
  skipAccountSlot?: boolean;
  jobMaxConcurrency?: number;
}

/** Request payload — all fields optional. Empty body = full run (all competitions) */
export interface TriggerGradesCompsScrapeRequest {
  jobId?: string;
  runId?: string;
  kind?: string;
  scope?: string;
  targets?: GradesCompsTarget[];
  options?: GradesCompsOptions;
}

/** Success response (HTTP 200) */
export interface TriggerGradesCompsScrapeSuccessResponse {
  success: boolean;
  jobId: number;
  runId: string;
  message: string;
  queueName: string;
}
