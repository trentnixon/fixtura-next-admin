import type {
  AccountAssetRunDetail,
  AccountAssetRunItem,
  AccountAssetRunItemScope,
  AccountAssetRunItemStatus,
  AccountAssetRunStatus,
} from "@/types/accountAssetRun";
import { getAccountAssetRunScopeLabel } from "@/lib/account-asset-run/scopeLabels";

/** Canonical workflow step order for display */
export const ASSET_RUN_SCOPE_ORDER: AccountAssetRunItemScope[] = [
  "eligibility_check",
  "grades_comps_refresh",
  "result_batch_scrape",
  "remove_fixtures_scrape",
  "asset_creation",
  "asset_completion",
];

const SCOPE_ORDER_INDEX = new Map(
  ASSET_RUN_SCOPE_ORDER.map((scope, index) => [scope, index])
);

/** Run status → scope hint for derived blocking item */
const RUN_STATUS_TO_SCOPE: Partial<
  Record<AccountAssetRunStatus | string, AccountAssetRunItemScope>
> = {
  scraping_results: "result_batch_scrape",
  checking_upcoming_fixtures: "remove_fixtures_scrape",
  creating_assets: "asset_creation",
  running: "asset_creation",
  queued: "eligibility_check",
  pending: "eligibility_check",
};

const ACTIVE_ITEM_STATUSES: AccountAssetRunItemStatus[] = [
  "pending",
  "queued",
  "running",
];

/** Run is in-flight and should trigger polling refresh */
export function isAssetRunActive(status: AccountAssetRunStatus | string): boolean {
  return (
    status === "queued" ||
    status === "running" ||
    status === "scraping_results" ||
    status === "checking_upcoming_fixtures" ||
    status === "creating_assets" ||
    status === "pending"
  );
}

export function isAssetRunTerminal(
  status: AccountAssetRunStatus | string
): boolean {
  return status === "completed" || status === "failed" || status === "cancelled";
}

export function assetRunStatusLabel(status: AccountAssetRunStatus | string): string {
  const map: Record<string, string> = {
    pending: "Pending",
    queued: "Queued",
    running: "Running",
    scraping_results: "Scraping results",
    checking_upcoming_fixtures: "Checking upcoming fixtures",
    creating_assets: "Creating assets",
    completed: "Completed",
    failed: "Failed",
    cancelled: "Cancelled",
  };
  return map[status] ?? String(status).replace(/_/g, " ");
}

/** Legacy blue badges — prefer assetRunPageStatusBadgeClass on detail/panel */
export function assetRunStatusBadgeClass(
  status: AccountAssetRunStatus | string
): string {
  switch (status) {
    case "failed":
    case "cancelled":
      return "border-red-300 bg-red-50 text-red-800";
    case "completed":
      return "border-green-300 bg-green-50 text-green-800";
    case "scraping_results":
    case "checking_upcoming_fixtures":
    case "creating_assets":
    case "running":
    case "queued":
    case "pending":
      return "border-blue-300 bg-blue-50 text-blue-800";
    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

export function sortAssetRunItems(items: AccountAssetRunItem[]): AccountAssetRunItem[] {
  return [...items].sort((a, b) => {
    const ai = SCOPE_ORDER_INDEX.get(a.scope as AccountAssetRunItemScope) ?? 999;
    const bi = SCOPE_ORDER_INDEX.get(b.scope as AccountAssetRunItemScope) ?? 999;
    if (ai !== bi) return ai - bi;
    return a.id - b.id;
  });
}

export function getAssetRunStepIndex(scope: string): number {
  const idx = SCOPE_ORDER_INDEX.get(scope as AccountAssetRunItemScope);
  return idx != null ? idx + 1 : 0;
}

export function getAssetRunSummaryMeta(summary: Record<string, unknown> | null): {
  mode: string | null;
  trigger: string | null;
  force: boolean | null;
} {
  if (!summary) {
    return { mode: null, trigger: null, force: null };
  }
  const mode = typeof summary.mode === "string" ? summary.mode : null;
  const trigger = typeof summary.trigger === "string" ? summary.trigger : null;
  const force =
    typeof summary.force === "boolean"
      ? summary.force
      : summary.force === "true"
        ? true
        : summary.force === "false"
          ? false
          : null;
  return { mode, trigger, force };
}

export function deriveBlockingItem(
  run: AccountAssetRunDetail
): AccountAssetRunItem | null {
  if (isAssetRunTerminal(run.status)) return null;

  const items = run.items ?? [];
  const scopeHint = RUN_STATUS_TO_SCOPE[run.status];
  if (scopeHint) {
    const byStatus = items.find(
      (i) =>
        i.scope === scopeHint &&
        ACTIVE_ITEM_STATUSES.includes(i.status as AccountAssetRunItemStatus)
    );
    if (byStatus) return byStatus;
    const byScope = items.find((i) => i.scope === scopeHint);
    if (byScope && byScope.status !== "completed" && byScope.status !== "skipped") {
      return byScope;
    }
  }

  const sorted = sortAssetRunItems(items);
  return (
    sorted.find((i) =>
      ACTIVE_ITEM_STATUSES.includes(i.status as AccountAssetRunItemStatus)
    ) ?? null
  );
}

export function assetRunBlockingItemHeadline(
  item: AccountAssetRunItem | null
): string | null {
  if (!item) return null;

  const scopeLabel = getAccountAssetRunScopeLabel(item.scope);

  if (item.status === "failed") {
    return item.failureReason
      ? `${scopeLabel}: ${item.failureReason}`
      : `${scopeLabel}: failed`;
  }

  if (ACTIVE_ITEM_STATUSES.includes(item.status as AccountAssetRunItemStatus)) {
    return `${scopeLabel}: In progress`;
  }

  if (item.status === "skipped") {
    return `${scopeLabel}: Skipped`;
  }

  return scopeLabel;
}
