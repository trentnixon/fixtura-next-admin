/**
 * Types for the trigger-clients-list-scrape endpoint
 * POST /api/data-collection/trigger-clients-list-scrape
 *
 * @see .comms/admin-frontend-trigger-clients-list-scrape-integration.md
 */

/** A single target URL for the scraper (Option B: explicit targets) */
export interface ScrapeTarget {
  fixtureKey: string;
  url: string;
}

/** Scrape options */
export interface ScrapeOptions {
  dryRun?: boolean;
  playhqMaxPages?: number;
}

/** Request payload — all fields optional */
export interface TriggerClientsListScrapeRequest {
  accountId?: number | null;
  jobId?: string;
  runId?: string;
  kind?: string;
  scope?: string;
  targets?: ScrapeTarget[];
  options?: ScrapeOptions;
}

/** Success response (HTTP 200) */
export interface TriggerClientsListScrapeSuccessResponse {
  success: boolean;
  jobId: number;
  runId: string;
  message: string;
  queueName: string;
}
