import type { ContactFormSubmission } from "@/types/contact-form";
import type { NotificationHealthData } from "@/types/notificationHealth";
import type { RerenderRequest } from "@/types/rerender-request";

export const OVERVIEW_ACTION_QUEUE_LIMIT = 5;

export interface NotificationHealthAttentionSummary {
  fatalCount: number;
  totalIssueRows: number;
  retryableCount: number;
  selectorDriftCount: number;
  fixturesFailed: number;
  hasAttention: boolean;
  summaryParts: string[];
}

function sortByNewestTimestamp(
  left: string | null | undefined,
  right: string | null | undefined
): number {
  const leftMs = left ? Date.parse(left) : 0;
  const rightMs = right ? Date.parse(right) : 0;
  return rightMs - leftMs;
}

export function getUnhandledRerenderRequests(
  requests: RerenderRequest[],
  limit = OVERVIEW_ACTION_QUEUE_LIMIT
): RerenderRequest[] {
  return requests
    .filter((request) => !request.hasBeenHandled)
    .sort((left, right) => sortByNewestTimestamp(left.createdAt, right.createdAt))
    .slice(0, limit);
}

export function countUnhandledRerenderRequests(
  requests: RerenderRequest[]
): number {
  return requests.filter((request) => !request.hasBeenHandled).length;
}

export function getContactFormActionQueue(
  submissions: ContactFormSubmission[],
  limit = OVERVIEW_ACTION_QUEUE_LIMIT
): ContactFormSubmission[] {
  return submissions
    .filter((submission) => !submission.hasSeen || !submission.Acknowledged)
    .sort((left, right) =>
      sortByNewestTimestamp(left.timestamp, right.timestamp)
    )
    .slice(0, limit);
}

export function countContactFormActionQueue(
  submissions: ContactFormSubmission[]
): number {
  return submissions.filter(
    (submission) => !submission.hasSeen || !submission.Acknowledged
  ).length;
}

export function countUnseenContactSubmissions(
  submissions: ContactFormSubmission[]
): number {
  return submissions.filter((submission) => !submission.hasSeen).length;
}

export function summarizeNotificationHealthAttention(
  data: NotificationHealthData | undefined
): NotificationHealthAttentionSummary {
  if (!data) {
    return {
      fatalCount: 0,
      totalIssueRows: 0,
      retryableCount: 0,
      selectorDriftCount: 0,
      fixturesFailed: 0,
      hasAttention: false,
      summaryParts: [],
    };
  }

  const fatalCount = data.notifications.fatalCount;
  const totalIssueRows = data.issues.totalIssueRows;
  const retryableCount = data.issues.retryableCount;
  const selectorDriftCount = data.issues.selectorDriftCount;
  const fixturesFailed = data.metricsSums.fixturesFailed;

  const summaryParts = [
    fatalCount > 0 ? `${fatalCount} fatal` : null,
    totalIssueRows > 0 ? `${totalIssueRows} issue rows` : null,
    retryableCount > 0 ? `${retryableCount} retryable` : null,
    selectorDriftCount > 0 ? `${selectorDriftCount} selector drift` : null,
  ].filter((part): part is string => part != null);

  return {
    fatalCount,
    totalIssueRows,
    retryableCount,
    selectorDriftCount,
    fixturesFailed,
    hasAttention:
      fatalCount > 0 ||
      totalIssueRows > 0 ||
      retryableCount > 0 ||
      selectorDriftCount > 0 ||
      fixturesFailed > 0,
    summaryParts,
  };
}

export function countVisibleOverviewPanels(flags: boolean[]): number {
  return flags.filter(Boolean).length;
}

export function formatRenderSystemStatus(
  status: "nominal" | "warning" | "degraded"
): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function overviewAttentionGridClass(panelCount: number): string {
  if (panelCount <= 0) return "hidden";
  if (panelCount === 1) return "grid grid-cols-1 gap-6 max-w-xl";
  if (panelCount === 2) return "grid grid-cols-1 gap-6 xl:grid-cols-2";
  return "grid grid-cols-1 gap-6 xl:grid-cols-2 2xl:grid-cols-3";
}
