/**
 * Types for the trigger-remove-fixtures-scrape endpoint
 * POST /api/game-meta-data/trigger-remove-fixtures-scrape
 *
 * CMS discovers fixtures for the grade/competition scope, validates PlayHQ scorecard URLs,
 * and enqueues Bull queue scrape:remove-fixtures (chunked jobs). Enqueue-only v1 — CMS does not delete fixtures.
 *
 * @see .comms/admin-frontend-trigger-remove-fixtures-scrape-integration.md
 */

export interface TriggerRemoveFixturesScrapeRequest {
  /** CMS Fixtura account id (required for correlation; must be linked to source association) */
  accountId: number;
  sourceType: "grade" | "competition";
  /** Grade id when `sourceType` is `grade`; competition id when `competition` */
  sourceId: number;
  /** Routes to sport-specific fixture collection; default `cricket` → `game-meta-data` */
  sport?: string;
  /** Overrides default generated run key */
  runId?: string;
  /** Discovery only: no Bull add when true */
  dryRun?: boolean;
}

export interface TriggerRemoveFixturesJobRow {
  jobId: string;
  bullJobId: number | string;
  batchIndex: number;
  targetCount: number;
}

export interface TriggerRemoveFixturesScrapeSuccessResponse {
  success: true;
  runId: string;
  accountId: number;
  sourceType: "grade" | "competition";
  sourceId: number;
  queueName: "scrape:remove-fixtures";
  targetsDiscovered: number;
  targetsEnqueued: number;
  targetsSkipped: number;
  jobsQueued: number;
  batchTotal: number;
  jobs: TriggerRemoveFixturesJobRow[];
  dryRun?: boolean;
  skipped?: Array<{ cmsFixtureId: number; reason: string }>;
  message: string;
}
