import type { AccountLookupItem } from "@/types/adminAccountLookup";

export type AccountSnapshotSummaryCounts = {
  total: number;
  active: number;
  inactive: number;
  expiring30: number;
  expiring60: number;
  sportCount: number;
  sportDetail: string;
  setupComplete: number;
  setupPending: number;
  setupPercentage: number;
};

export type AccountSnapshotOperationCounts = {
  refreshFailed: number;
  refreshNotStarted: number;
  refreshInProgress: number;
  renderingNow: number;
  startSequenceOpen: number;
  startSequenceComplete: number;
};

export function countAccountSnapshotSummary(
  accounts: AccountLookupItem[],
): AccountSnapshotSummaryCounts {
  const total = accounts.length;
  const active = accounts.filter((account) => account.hasActiveOrder).length;
  const expiring30 = accounts.filter(
    (account) =>
      account.hasActiveOrder &&
      account.daysLeftOnSubscription !== null &&
      account.daysLeftOnSubscription <= 30,
  ).length;
  const expiring60 = accounts.filter(
    (account) =>
      account.hasActiveOrder &&
      account.daysLeftOnSubscription !== null &&
      account.daysLeftOnSubscription <= 60 &&
      account.daysLeftOnSubscription > 30,
  ).length;
  const sportCounts: Record<string, number> = {};
  for (const account of accounts) {
    const sport = account.Sport || "Unknown";
    sportCounts[sport] = (sportCounts[sport] || 0) + 1;
  }
  const setupComplete = accounts.filter((account) => account.isSetup).length;
  const sportDetail =
    Object.entries(sportCounts)
      .slice(0, 2)
      .map(([sport, count]) => `${sport}: ${count}`)
      .join(" / ") || "No sport data";

  return {
    total,
    active,
    inactive: total - active,
    expiring30,
    expiring60,
    sportCount: Object.keys(sportCounts).length,
    sportDetail,
    setupComplete,
    setupPending: total - setupComplete,
    setupPercentage: total > 0 ? Math.round((setupComplete / total) * 100) : 0,
  };
}

export function countAccountSnapshotOperations(
  accounts: AccountLookupItem[],
): AccountSnapshotOperationCounts {
  let refreshFailed = 0;
  let refreshNotStarted = 0;
  let refreshInProgress = 0;
  let renderingNow = 0;
  let startSequenceOpen = 0;

  for (const account of accounts) {
    if (account.accountHealthStatus === "failed") refreshFailed += 1;
    if (account.accountHealthStatus === "not_started") refreshNotStarted += 1;
    if (
      account.accountHealthStatus === "queued" ||
      account.accountHealthStatus === "running"
    ) {
      refreshInProgress += 1;
    }
    if (account.isSchedulerRendering || account.renderProcessingSince !== null) {
      renderingNow += 1;
    }
    if (!account.hasCompletedStartSequence) startSequenceOpen += 1;
  }

  return {
    refreshFailed,
    refreshNotStarted,
    refreshInProgress,
    renderingNow,
    startSequenceOpen,
    startSequenceComplete: accounts.length - startSequenceOpen,
  };
}
