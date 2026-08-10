/**
 * Types for notification issues list
 * GET /api/fixtura-scraper/notifications/issues
 *
 * @see src/app/dashboard/data/.comms/admin-frontend-notification-issues-handoff.md
 */

import type { NotificationHealthPresetDays } from "@/types/notificationHealth";

/** Mutually exclusive: preset `days` OR explicit createdAt range — never both. */
export type FetchNotificationIssuesWindowParams =
  | { mode: "preset"; days: NotificationHealthPresetDays }
  | {
      mode: "range";
      createdAt_gte?: string;
      createdAt_lte?: string;
    };

export interface FetchNotificationIssuesFilters {
  scope?: string;
  service?: string;
  queueName?: string;
  kind?: string;
  jobId?: string;
  runId?: string;
  step?: string;
  issueScope?: string;
  retryable?: boolean;
  selectorDrift?: boolean;
  message?: string;
  page?: number;
  pageSize?: number;
  includeArtifacts?: boolean;
}

export type FetchNotificationIssuesParams = FetchNotificationIssuesWindowParams &
  FetchNotificationIssuesFilters;

export interface NotificationIssueContext {
  id: number;
  jobId: string | null;
  runId: string | null;
  service: string | null;
  scope: string | null;
  queueName: string | null;
  kind: string | null;
  fatal: boolean;
  errorRate: number | null;
  createdAt: string | null;
  scraperLogId: number | null;
}

export interface NotificationIssueArtifact {
  id: number;
  artifactType: string | null;
  fixtureKey: string | null;
  runId: string | null;
  contentType: string | null;
  fileUrl: string | null;
}

export interface NotificationIssueRow {
  issueIndex: number;
  step: string | null;
  severity: string | null;
  message: string | null;
  url: string | null;
  issueScope: string | null;
  retryable: boolean;
  selectorDriftSignal: boolean;
  fixtureKey: string | null;
  extra: Record<string, unknown>;
  notification: NotificationIssueContext;
  artifacts: NotificationIssueArtifact[];
}

export interface NotificationIssuesWindow {
  from: string;
  to: string;
  fromMs: number;
  toMs: number;
}

export interface NotificationIssuesPagination {
  page: number;
  pageSize: number;
  totalIssues: number;
  totalNotifications: number;
  pageCount: number;
}

export interface NotificationIssuesFacets {
  byStep: Record<string, number>;
  byIssueScope: Record<string, number>;
  retryableCount: number;
  selectorDriftCount: number;
}

export interface NotificationIssuesData {
  window: NotificationIssuesWindow;
  issues: NotificationIssueRow[];
  pagination: NotificationIssuesPagination;
  facets: NotificationIssuesFacets;
}

export interface NotificationIssuesMeta {
  notificationsScanned: number;
  notificationsTruncated: boolean;
  maxNotifications: number;
  artifactsIncluded: boolean;
}

export interface NotificationIssuesResponse {
  data: NotificationIssuesData;
  meta: NotificationIssuesMeta;
}

/** Base query for linking from health breakdown to issues route. */
export type NotificationIssuesLinkQuery =
  | { days: NotificationHealthPresetDays }
  | { createdAt_gte: string; createdAt_lte: string };
