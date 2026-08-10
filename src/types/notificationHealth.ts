/**
 * Types for notification health aggregate
 * GET /api/fixtura-scraper/notifications/health
 *
 * @see src/app/dashboard/data/.comms/admin-frontend-notification-health-handoff.md
 */

/** Allowed preset window lengths (rolling, ending now). */
export type NotificationHealthPresetDays = 7 | 14 | 30 | 60;

/** Mutually exclusive: preset `days` OR explicit createdAt range — never both. */
export type FetchNotificationHealthParams =
  | { mode: "preset"; days: NotificationHealthPresetDays }
  | {
      mode: "range";
      createdAt_gte?: string;
      createdAt_lte?: string;
    };

export interface NotificationHealthWindow {
  from: string;
  to: string;
  fromMs: number;
  toMs: number;
}

export interface NotificationHealthNotifications {
  notificationCount: number;
  fatalCount: number;
  nonFatalCount: number;
}

/** Sums of metrics JSON fields across rows (missing/non-numeric → 0). */
export interface NotificationHealthMetricsSums {
  fixturesTotal: number;
  fixturesSucceeded: number;
  fixturesFailed: number;
  durationMs: number;
  ingest_total: number;
  ingest_success: number;
  ingest_failed: number;
  ingest_retried: number;
}

export interface NotificationHealthRates {
  /** null when sum(fixturesTotal) === 0 */
  weightedFixtureErrorRate: number | null;
  avgErrorRate: number | null;
}

export interface NotificationHealthByDimension {
  byService: Record<string, number>;
  byScope: Record<string, number>;
  byQueueName: Record<string, number>;
  byKind: Record<string, number>;
}

export interface NotificationHealthIssueTopMessage {
  message: string;
  count: number;
}

export interface NotificationHealthIssues {
  totalIssueRows: number;
  byStep: Record<string, number>;
  bySeverity: Record<string, number>;
  byIssueScope: Record<string, number>;
  topMessages: NotificationHealthIssueTopMessage[];
  retryableCount: number;
  selectorDriftCount: number;
}

export interface NotificationHealthTimelineDayBucket {
  bucket: string;
  bucketMs: number;
  notificationCount: number;
  fixturesFailed: number;
}

export interface NotificationHealthData {
  window: NotificationHealthWindow;
  notifications: NotificationHealthNotifications;
  metricsSums: NotificationHealthMetricsSums;
  rates: NotificationHealthRates;
  byDimension: NotificationHealthByDimension;
  issues: NotificationHealthIssues;
  timeline: {
    byDay: NotificationHealthTimelineDayBucket[];
  };
}

export interface NotificationHealthMeta {
  truncated: boolean;
  maxEntries: number;
}

export interface NotificationHealthResponse {
  data: NotificationHealthData;
  meta: NotificationHealthMeta;
}
