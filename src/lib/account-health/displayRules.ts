import type {
  AccountHealthAccountStatus,
  AccountHealthItem,
  AccountHealthRunStatus,
  AccountHealthRunSummary,
} from "@/types/accountHealth";
import { getAccountHealthScopeLabel } from "@/lib/account-health/scopeLabels";

export const EMPTY_RUN_RESULT_LABEL =
  "Completed: no current season data";

export function isHealthRunTerminal(status: AccountHealthRunStatus): boolean {
  return status === "completed" || status === "failed" || status === "finalized";
}

export function isHealthRunActive(status: AccountHealthRunStatus): boolean {
  return status === "pending" || status === "queued" || status === "running";
}

export function getSummaryEmptyReason(summary: AccountHealthRunSummary | null): {
  isEmptyResult: boolean;
  reasonDisplay: string | null;
} {
  if (!summary?.emptyResult) {
    return { isEmptyResult: false, reasonDisplay: null };
  }
  return {
    isEmptyResult: true,
    reasonDisplay:
      typeof summary.reason === "string" && summary.reason.trim() !== ""
        ? summary.reason
        : null,
  };
}

export function blockingItemHeadline(blockingItem: AccountHealthItem | null): string | null {
  if (!blockingItem) return null;

  const scopeLabel = getAccountHealthScopeLabel(blockingItem.scope);

  if (blockingItem.status === "failed") {
    return blockingItem.failureReason
      ? `${scopeLabel}: ${blockingItem.failureReason}`
      : `${scopeLabel}: failed`;
  }

  if (
    blockingItem.status === "pending" ||
    blockingItem.status === "queued" ||
    blockingItem.status === "running"
  ) {
    return `${scopeLabel}: In progress`;
  }

  return scopeLabel;
}

export function fixtureProgressLine(
  terminal: number,
  expected: number
): string {
  return `${terminal} / ${expected} fixture discovery rows processed`;
}

export function accountHealthStatusLabel(
  status: AccountHealthAccountStatus
): string {
  const map: Record<AccountHealthAccountStatus, string> = {
    not_started: "Not started",
    queued: "Queued",
    running: "Running",
    completed: "Completed",
    failed: "Failed",
  };
  return map[status] ?? status;
}

export function healthRunStatusLabel(
  status: AccountHealthRunStatus
): string {
  const map: Record<AccountHealthRunStatus, string> = {
    pending: "Pending",
    queued: "Queued",
    running: "Running",
    completed: "Completed",
    failed: "Failed",
    finalized: "Finalized",
  };
  return map[status] ?? status;
}

/** Badge styling for workflow run statuses (lists/panels; detail page uses healthRunPageStatusBadgeClass) */
export function healthRunStatusBadgeClass(
  status: AccountHealthRunStatus | string
): string {
  switch (status) {
    case "failed":
      return "border-brandError-300 bg-brandError-50 text-brandError-800";
    case "completed":
      return "border-brandSuccess-300 bg-brandSuccess-50 text-brandSuccess-800";
    case "finalized":
      return "border-brandAccent-300 bg-brandAccent-50 text-brandAccent-800";
    case "running":
      return "border-brandAccent-300 bg-brandAccent-50 text-brandAccent-800";
    case "queued":
    case "pending":
      return "border-brandInfo-300 bg-brandInfo-50 text-brandInfo-800";
    default:
      return "border-brandPrimary-200 bg-brandPrimary-50 text-brandPrimary-700";
  }
}
