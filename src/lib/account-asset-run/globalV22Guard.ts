import {
  getAssetRunStepIndex,
  sortAssetRunItems,
} from "@/lib/account-asset-run/displayRules";
import type {
  AccountAssetRunItem,
  GlobalV22GuardBlocked,
} from "@/types/accountAssetRun";

export type AccountAssetRunDisplayStep =
  | { kind: "item"; item: AccountAssetRunItem }
  | { kind: "synthetic_guard_blocked"; guard: GlobalV22GuardBlocked };

const GLOBAL_V22_GUARD_REASON_LABELS: Record<string, string> = {
  global_v22_result_run_active: "Global v2.2 result scrape already active",
};

function readString(value: unknown): string | null {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

function readPositiveInt(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return null;
}

export function parseGlobalV22GuardBlocked(
  summary: Record<string, unknown> | null
): GlobalV22GuardBlocked | null {
  if (!summary) return null;
  const raw = summary.globalV22GuardBlocked;
  if (!raw || typeof raw !== "object") return null;

  const block = raw as Record<string, unknown>;
  const blockingRunId = readPositiveInt(block.blockingRunId);
  const reason = readString(block.reason);
  const at = readString(block.at);
  if (blockingRunId == null || !reason || !at) return null;

  return {
    at,
    reason,
    matchReason: readString(block.matchReason) ?? undefined,
    blockingRunId,
    blockingRunKey: readString(block.blockingRunKey) ?? undefined,
    blockingRunStatus: readString(block.blockingRunStatus) ?? undefined,
  };
}

/** Guard metadata applies to UX only when CMS did not create a result_batch_scrape item. */
export function getGlobalV22GuardBlockedWithoutResultItem(
  items: AccountAssetRunItem[],
  summary: Record<string, unknown> | null
): GlobalV22GuardBlocked | null {
  const guard = parseGlobalV22GuardBlocked(summary);
  if (!guard) return null;
  if (items.some((i) => i.scope === "result_batch_scrape")) return null;
  return guard;
}

export function formatGlobalV22GuardReason(reason: string): string {
  return GLOBAL_V22_GUARD_REASON_LABELS[reason] ?? reason.replace(/_/g, " ");
}

function itemsToDisplaySteps(
  items: AccountAssetRunItem[]
): AccountAssetRunDisplayStep[] {
  return items.map((item) => ({ kind: "item", item }));
}

/**
 * When CMS blocks stage 3 (no result_batch_scrape item), insert a synthetic Step 3 row.
 */
export function buildAssetRunDisplaySteps(
  items: AccountAssetRunItem[],
  summary: Record<string, unknown> | null
): AccountAssetRunDisplayStep[] {
  const sorted = sortAssetRunItems(items);
  const guard = getGlobalV22GuardBlockedWithoutResultItem(items, summary);
  if (!guard) {
    return itemsToDisplaySteps(sorted);
  }

  const insertAt = sorted.findIndex((i) => getAssetRunStepIndex(i.scope) >= 4);
  const at = insertAt === -1 ? sorted.length : insertAt;
  const synthetic: AccountAssetRunDisplayStep = {
    kind: "synthetic_guard_blocked",
    guard,
  };

  return [
    ...itemsToDisplaySteps(sorted.slice(0, at)),
    synthetic,
    ...itemsToDisplaySteps(sorted.slice(at)),
  ];
}
