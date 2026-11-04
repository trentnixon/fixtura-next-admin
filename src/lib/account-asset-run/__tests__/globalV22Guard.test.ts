import { describe, expect, it } from "vitest";
import type { AccountAssetRunItem } from "@/types/accountAssetRun";
import {
  buildAssetRunDisplaySteps,
  formatGlobalV22GuardReason,
  getGlobalV22GuardBlockedWithoutResultItem,
  parseGlobalV22GuardBlocked,
} from "@/lib/account-asset-run/globalV22Guard";

const guardSummary = {
  globalV22GuardBlocked: {
    at: "2026-11-03T22:55:10.673Z",
    reason: "global_v22_result_run_active",
    matchReason: "scraping_results",
    blockingRunId: 548,
    blockingRunKey: "account-asset-run:705:605:…",
    blockingRunStatus: "scraping_results",
  },
};

function item(
  partial: Pick<AccountAssetRunItem, "id" | "scope"> &
    Partial<AccountAssetRunItem>
): AccountAssetRunItem {
  return {
    id: partial.id,
    scope: partial.scope,
    status: partial.status ?? "completed",
    targetType: partial.targetType ?? null,
    targetId: partial.targetId ?? null,
    runId: partial.runId ?? null,
    bullJobId: partial.bullJobId ?? null,
    bullJobIds: partial.bullJobIds ?? null,
    startedAt: partial.startedAt ?? null,
    completedAt: partial.completedAt ?? null,
    failedAt: partial.failedAt ?? null,
    failureReason: partial.failureReason ?? null,
    resultSummary: partial.resultSummary ?? null,
  };
}

describe("parseGlobalV22GuardBlocked", () => {
  it("returns parsed guard when summary.globalV22GuardBlocked is valid", () => {
    expect(parseGlobalV22GuardBlocked(guardSummary)).toEqual({
      at: "2026-11-03T22:55:10.673Z",
      reason: "global_v22_result_run_active",
      matchReason: "scraping_results",
      blockingRunId: 548,
      blockingRunKey: "account-asset-run:705:605:…",
      blockingRunStatus: "scraping_results",
    });
  });

  it("returns null when guard is absent or blockingRunId invalid", () => {
    expect(parseGlobalV22GuardBlocked(null)).toBeNull();
    expect(parseGlobalV22GuardBlocked({})).toBeNull();
    expect(
      parseGlobalV22GuardBlocked({
        globalV22GuardBlocked: { reason: "x", blockingRunId: 0 },
      })
    ).toBeNull();
  });
});

describe("formatGlobalV22GuardReason", () => {
  it("humanizes known reason codes", () => {
    expect(formatGlobalV22GuardReason("global_v22_result_run_active")).toBe(
      "Global v2.2 result scrape already active"
    );
  });
});

describe("buildAssetRunDisplaySteps", () => {
  const steps12And4 = [
    item({ id: 1, scope: "eligibility_check" }),
    item({ id: 2, scope: "grades_comps_refresh" }),
    item({ id: 4, scope: "remove_fixtures_scrape" }),
  ];

  it("inserts synthetic step 3 between grades and remove-fixtures when guard set", () => {
    const display = buildAssetRunDisplaySteps(steps12And4, guardSummary);
    expect(display).toHaveLength(4);
    expect(display[0]).toMatchObject({ kind: "item", item: { scope: "eligibility_check" } });
    expect(display[1]).toMatchObject({ kind: "item", item: { scope: "grades_comps_refresh" } });
    expect(display[2]).toMatchObject({
      kind: "synthetic_guard_blocked",
      guard: { blockingRunId: 548 },
    });
    expect(display[3]).toMatchObject({
      kind: "item",
      item: { scope: "remove_fixtures_scrape" },
    });
  });

  it("does not insert synthetic row when result_batch_scrape item exists", () => {
    const withResult = [
      ...steps12And4.slice(0, 2),
      item({ id: 3, scope: "result_batch_scrape", status: "running" }),
      steps12And4[2],
    ];
    const display = buildAssetRunDisplaySteps(withResult, guardSummary);
    expect(display.every((s) => s.kind === "item")).toBe(true);
    expect(display).toHaveLength(4);
  });

  it("appends synthetic step when guard set but only early items exist", () => {
    const earlyOnly = steps12And4.slice(0, 2);
    const display = buildAssetRunDisplaySteps(earlyOnly, guardSummary);
    expect(display).toHaveLength(3);
    expect(display[2]).toMatchObject({ kind: "synthetic_guard_blocked" });
  });
});

describe("getGlobalV22GuardBlockedWithoutResultItem", () => {
  it("returns null when guard summary exists but result item is present", () => {
    const items = [
      item({ id: 3, scope: "result_batch_scrape", status: "running" }),
    ];
    expect(getGlobalV22GuardBlockedWithoutResultItem(items, guardSummary)).toBeNull();
  });
});
