/**
 * Types for the scraper logs list endpoint
 * GET /api/fixtura-scraper/logs
 *
 * @see src/app/dashboard/data/.comms/admin-frontend-scraper-logs-list-endpoint-guide.md
 * @see src/app/dashboard/data/.comms/admin-frontend-scraper-log-by-job-id-integration.md
 * @see src/app/dashboard/data/.comms/cms-response-admin-scraper-log-job-detail-api.md
 */

export type JobStatus =
  | "completed"
  | "retry_later"
  | "in_progress"
  | "unknown";

export interface EventCounts {
  dequeued?: number;
  started: number;
  heartbeat: number;
  retry_later: number;
  completed: number;
  failed?: number;
}

export interface LogEntry {
  id: number;
  event: string;
  scope: string | null;
  timestamp: string | null;
  queueName: string | null;
  jobId: string;
  runId: string | null;
  service: string | null;
  kind: string | null;
  bullJobId?: string | null;
  attempt?: number | null;
  cmsReceivedAt?: string | null;
  cmsProcessingDurationMs?: number | null;
  payload?: Record<string, unknown> | null;
  createdAt: string;
}

export interface JobSummary {
  jobId: string;
  runId: string | null;
  scope: string | null;
  queueName: string | null;
  service: string | null;
  kind: string | null;
  bullJobId?: string | null;
  attempt?: number | null;
  startedAt: string | null;
  latestAt: string | null;
  startedAtMs: number | null;
  latestAtMs: number | null;
  status: JobStatus;
  durationMs: number | null;
  durationFormatted: string | null;
  eventCounts: EventCounts;
  entryCount: number;
  entries?: LogEntry[];
}

export interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface DateRange {
  from: string | null;
  to: string | null;
  fromMs: number | null;
  toMs: number | null;
}

export interface Summary {
  totalJobs: number;
  byStatus: Record<JobStatus, number>;
  totalDurationMs: number;
  avgDurationMs: number | null;
}

export interface TimelineBucket {
  bucket: string;
  bucketMs: number | null;
  jobCount: number;
  totalDurationMs: number;
  byStatus: Record<string, number>;
}

export interface Timeline {
  byHour: TimelineBucket[];
  byDay: TimelineBucket[];
}

export interface ListLogsMeta {
  scope: string; // "all" when no scope filter
  pagination: Pagination;
  dateRange: DateRange;
  summary: Summary;
  timeline: Timeline;
}

export interface ListLogsResponse {
  data: JobSummary[];
  meta: ListLogsMeta;
}

/** Query params for fetchScraperLogs */
export interface FetchScraperLogsParams {
  scope?: string; // optional: omit for all scopes
  /** When set, CMS should return jobs matching this id (see by-job-id comms doc). */
  jobId?: string;
  queueName?: string;
  event?: string;
  timestamp_gte?: string;
  timestamp_lte?: string;
  pagination?: {
    page?: number;
    pageSize?: number;
  };
  include?: "entries";
}

/** Response shape for single-job detail fetch (normalized in fetchScraperLogByJobId). */
export interface ScraperLogByJobIdResponse {
  job: JobSummary;
  entries: LogEntry[];
}

/**
 * job.completed metrics (Python Metrics model — camelCase + snake_case ingest keys).
 */
export interface LogMetrics {
  fixturesTotal?: number;
  fixturesSucceeded?: number;
  fixturesFailed?: number;
  durationMs?: number;
  ingest_total?: number;
  ingest_success?: number;
  ingest_failed?: number;
  ingest_retried?: number;
}

/**
 * job.completed issue item (Python Issue model subset + forward-compat extras).
 */
export interface ScrapeIssue {
  severity?: string;
  message?: string;
  fixtureKey?: string;
  step?: string;
  selector?: string;
  /** Relative storage paths for debug captures (often PNG screenshots) tied to this issue. */
  artifactRefs?: string[];
  scope?: string;
  url?: string;
  missingItems?: string[];
  selectorsTried?: string[];
  remediation?: string;
  retryable?: boolean;
  failureClass?: string;
  botSignal?: boolean;
  selectorDriftSignal?: boolean;
}

/** Bull queue depth snapshot (worker metadata). */
export interface QueueCounts {
  waiting?: number;
  active?: number;
  delayed?: number;
  completed?: number;
  failed?: number;
  paused?: number;
}
