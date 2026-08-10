/**
 * Types for the trigger-result-single-scrape endpoint
 * POST /api/game-meta-data/trigger-result-single-scrape
 *
 * CMS resolves `urlToScoreCard`, validates a PlayHQ game-centre URL, and enqueues
 * Bull queue scrape:result-single.
 *
 * @see src/app/dashboard/fixtures/[id]/.docs/handoff/admin-frontend-trigger-result-single-scrape-integration.md
 */

/** Request payload — either cmsFixtureId or fixtureId required (positive integer) */
export interface TriggerResultSingleScrapeRequest {
  /** Strapi game-meta-data document id (required if fixtureId omitted) */
  cmsFixtureId?: number;
  /** Alias of cmsFixtureId */
  fixtureId?: number;
  /** Override PlayHQ URL; default is fixture urlToScoreCard */
  url?: string;
  /** Default cricket (lowercase in queue payload) */
  sport?: string;
  /** Pass-through to job options.dryRun */
  dryRun?: boolean;
  /** Pass-through to job options.metadataOnly */
  metadataOnly?: boolean;
}

/** Success response (HTTP 200) */
export interface TriggerResultSingleScrapeSuccessResponse {
  success: boolean;
  /** Correlates with scraper logs (e.g. result-single:81406:1739000000000) */
  jobId: string;
  bullJobId: number | string;
  runId: string;
  cmsFixtureId: number;
  queueName: "scrape:result-single";
  message: string;
}
