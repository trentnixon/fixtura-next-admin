/**
 * Types for the trigger-result-batch-scrape endpoint
 * POST /api/game-meta-data/trigger-result-batch-scrape
 *
 * CMS discovers resultable fixtures in a date window, filters PlayHQ game-centre URLs,
 * and enqueues Bull queue scrape:result-batch (chunks of up to five fixtures per job).
 *
 * @see src/app/dashboard/competitions/.comms/admin-frontend-trigger-result-batch-scrape-integration.md
 */

export interface TriggerResultBatchScrapeRequest {
  sourceType: "grade" | "competition";
  /** Strapi grade id when `sourceType` is `grade`; competition id when `competition` */
  sourceId: number;
  /** Default `cricket` (lowercase in queue payload) */
  sport?: string;
  /** Pass-through to job `options.dryRun` (default false) */
  dryRun?: boolean;
}

export interface TriggerResultBatchJobRow {
  jobId: string;
  bullJobId: number | string;
  batchIndex: number;
  targetCount: number;
}

export interface TriggerResultBatchScrapeSuccessResponse {
  success: true;
  runId: string;
  sourceType: "grade" | "competition";
  sourceId: number;
  queueName: "scrape:result-batch";
  daysBack: number;
  /** Resultable fixtures found before URL filtering */
  targetsDiscovered: number;
  /** Valid targets actually placed on Bull jobs */
  targetsEnqueued: number;
  /** Fixtures skipped (e.g. missing/invalid game-centre URL) */
  targetsSkipped: number;
  jobsQueued: number;
  batchTotal: number;
  jobs: TriggerResultBatchJobRow[];
  skipped?: Array<{ cmsFixtureId: number; reason: string }>;
  message: string;
}
