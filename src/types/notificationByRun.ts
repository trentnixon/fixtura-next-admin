/**
 * Types for per-run notification lookup
 * GET /api/fixtura-scraper/notifications/by-run/:jobId/:runId
 *
 * @see src/app/dashboard/data/.comms/admin-frontend-notification-by-run-handoff.md
 */

/** Strapi entityService shape for fixtura-scraper-notification (pragmatic JSON fields). */
export interface ScraperNotificationByRun {
  id?: number;
  jobId?: string;
  runId?: string | null;
  service?: string | null;
  timestamp?: string | null;
  scope?: string | null;
  queueName?: string | null;
  kind?: string | null;
  fatal?: boolean;
  metrics?: Record<string, unknown> | null;
  issues?: unknown[] | null;
  errorRate?: number | null;
  scraperLog?: Record<string, unknown> | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface NotificationByRunMeta {
  duplicateCount: number;
  returnedLatestByCreatedAt: boolean;
}

export interface NotificationByRunResponse {
  data: ScraperNotificationByRun;
  meta: NotificationByRunMeta;
}
