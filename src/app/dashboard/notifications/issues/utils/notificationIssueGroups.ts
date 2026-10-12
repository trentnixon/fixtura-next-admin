import type { NotificationIssueRow } from "@/types/notificationIssues";

export type NormalizedIssueSeverity = "FATAL" | "ERROR" | "WARN" | "OTHER";

export function normalizeIssueSeverity(
  severity: string | null | undefined,
): NormalizedIssueSeverity {
  const t = (severity ?? "").trim().toUpperCase();
  if (t === "FATAL") return "FATAL";
  if (t === "ERROR") return "ERROR";
  if (t === "WARN" || t === "WARNING") return "WARN";
  return "OTHER";
}

/** Scraper often emits validation and hard scrape breaks as WARN; still track as failures. */
export function stepIndicatesTrackedFailure(
  step: string | null | undefined,
): boolean {
  if (!step) return false;
  const s = step.toLowerCase();
  return (
    s.includes("validation") ||
    s.includes("not_found") ||
    s.includes("upstream_error") ||
    s.includes("timeout") ||
    s.includes("selector_drift") ||
    s.includes("extraction")
  );
}

export function isFailureSignatureRow(row: NotificationIssueRow): boolean {
  const n = normalizeIssueSeverity(row.severity);
  if (n === "ERROR" || n === "FATAL") return true;
  if (n === "WARN" && stepIndicatesTrackedFailure(row.step)) return true;
  return false;
}

export function isWarningRow(row: NotificationIssueRow): boolean {
  return normalizeIssueSeverity(row.severity) === "WARN";
}

export type IssueCardTone = "failure" | "warning";

/** Red vs yellow card styling from the representative issue row. */
export function issueGroupCardTone(row: NotificationIssueRow): IssueCardTone {
  if (row.notification.fatal) return "failure";
  const n = normalizeIssueSeverity(row.severity);
  if (n === "ERROR" || n === "FATAL") return "failure";
  return "warning";
}

export function failureGroupKey(step: string | null, message: string | null): string {
  return `${step ?? ""}\0${(message ?? "").trim()}`;
}

export function runKey(row: NotificationIssueRow): string {
  const jobId = row.notification.jobId ?? "";
  const runId = row.notification.runId ?? "";
  return `${row.notification.id}:${jobId}:${runId}`;
}

function createdAtMs(iso: string | null | undefined): number {
  if (!iso) return 0;
  const ms = Date.parse(iso);
  return Number.isFinite(ms) ? ms : 0;
}

export interface IssueRunRef {
  notificationId: number;
  jobId: string | null;
  runId: string | null;
  createdAt: string | null;
  row: NotificationIssueRow;
}

export interface FailureIssueGroup {
  kind: "failure";
  key: string;
  step: string | null;
  message: string;
  primaryRun: IssueRunRef;
  otherRuns: IssueRunRef[];
  nestedWarnings: NotificationIssueRow[];
  representativeRow: NotificationIssueRow;
}

export interface WarningIssueGroup {
  kind: "warning";
  key: string;
  step: string | null;
  message: string;
  primaryRun: IssueRunRef;
  otherRuns: IssueRunRef[];
  representativeRow: NotificationIssueRow;
}

export interface GroupedNotificationIssues {
  failures: FailureIssueGroup[];
  warnings: WarningIssueGroup[];
}

function rowToRunRef(row: NotificationIssueRow): IssueRunRef {
  return {
    notificationId: row.notification.id,
    jobId: row.notification.jobId,
    runId: row.notification.runId,
    createdAt: row.notification.createdAt,
    row,
  };
}

function sortRunRefsDesc(runs: IssueRunRef[]): IssueRunRef[] {
  return [...runs].sort(
    (a, b) => createdAtMs(b.createdAt) - createdAtMs(a.createdAt),
  );
}

function dedupeRunRefs(runs: IssueRunRef[]): IssueRunRef[] {
  const byKey = new Map<string, IssueRunRef>();
  for (const run of runs) {
    const key = `${run.notificationId}:${run.jobId ?? ""}:${run.runId ?? ""}`;
    const existing = byKey.get(key);
    if (!existing || createdAtMs(run.createdAt) > createdAtMs(existing.createdAt)) {
      byKey.set(key, run);
    }
  }
  return sortRunRefsDesc([...byKey.values()]);
}

function rowsByNotificationId(
  issues: NotificationIssueRow[],
): Map<number, NotificationIssueRow[]> {
  const map = new Map<number, NotificationIssueRow[]>();
  for (const row of issues) {
    const id = row.notification.id;
    const list = map.get(id) ?? [];
    list.push(row);
    map.set(id, list);
  }
  return map;
}

function notificationIsFailedRun(
  notificationId: number,
  byNotif: Map<number, NotificationIssueRow[]>,
): boolean {
  const rows = byNotif.get(notificationId) ?? [];
  if (rows.some((r) => r.notification.fatal)) return true;
  return rows.some(isFailureSignatureRow);
}

function buildRunRefsFromRows(rows: NotificationIssueRow[]): {
  primary: IssueRunRef;
  others: IssueRunRef[];
} {
  const deduped = dedupeRunRefs(rows.map(rowToRunRef));
  const [primary, ...others] = deduped;
  return {
    primary: primary ?? rowToRunRef(rows[0]!),
    others,
  };
}

export interface GroupNotificationIssuesOptions {
  /** Step filter from health drill-down: group every loaded row as a failure. */
  stepFocus?: string;
}

function groupAllRowsAsFailures(
  issues: NotificationIssueRow[],
): GroupedNotificationIssues {
  const failureGroupsMap = new Map<
    string,
    { step: string | null; message: string; rows: NotificationIssueRow[] }
  >();

  for (const row of issues) {
    const message = (row.message ?? "").trim() || "No issue message supplied";
    const key = failureGroupKey(row.step, message);
    const existing = failureGroupsMap.get(key);
    if (existing) {
      existing.rows.push(row);
    } else {
      failureGroupsMap.set(key, {
        step: row.step,
        message,
        rows: [row],
      });
    }
  }

  const failures: FailureIssueGroup[] = [];

  for (const [key, group] of failureGroupsMap) {
    const { primary, others } = buildRunRefsFromRows(group.rows);
    failures.push({
      kind: "failure",
      key,
      step: group.step,
      message: group.message,
      primaryRun: primary,
      otherRuns: others,
      nestedWarnings: [],
      representativeRow: primary.row,
    });
  }

  failures.sort(
    (a, b) =>
      createdAtMs(b.primaryRun.createdAt) - createdAtMs(a.primaryRun.createdAt),
  );

  return { failures, warnings: [] };
}

/**
 * Groups loaded issue rows into failure cards (step + message) and standalone warnings.
 * Operates on the current page only; CMS sort/filter is required for window-wide ordering.
 */
export function groupNotificationIssues(
  issues: NotificationIssueRow[],
  options?: GroupNotificationIssuesOptions,
): GroupedNotificationIssues {
  if (issues.length === 0) {
    return { failures: [], warnings: [] };
  }

  if (options?.stepFocus) {
    return groupAllRowsAsFailures(issues);
  }

  const byNotif = rowsByNotificationId(issues);
  const failedNotificationIds = new Set<number>();
  for (const id of byNotif.keys()) {
    if (notificationIsFailedRun(id, byNotif)) {
      failedNotificationIds.add(id);
    }
  }

  const failureRows = issues.filter(isFailureSignatureRow);
  const warningRows = issues.filter(isWarningRow);

  const failureGroupsMap = new Map<
    string,
    { step: string | null; message: string; rows: NotificationIssueRow[] }
  >();

  for (const row of failureRows) {
    const message = (row.message ?? "").trim() || "No issue message supplied";
    const key = failureGroupKey(row.step, message);
    const existing = failureGroupsMap.get(key);
    if (existing) {
      existing.rows.push(row);
    } else {
      failureGroupsMap.set(key, {
        step: row.step,
        message,
        rows: [row],
      });
    }
  }

  const cardKeyByNotificationId = new Map<number, string>();

  for (const [key, group] of failureGroupsMap) {
    const byNotifInGroup = new Map<number, NotificationIssueRow[]>();
    for (const row of group.rows) {
      const list = byNotifInGroup.get(row.notification.id) ?? [];
      list.push(row);
      byNotifInGroup.set(row.notification.id, list);
    }
    for (const [notifId, notifRows] of byNotifInGroup) {
      const newest = sortRunRefsDesc(notifRows.map(rowToRunRef))[0]?.row;
      if (!newest) continue;
      const existingKey = cardKeyByNotificationId.get(notifId);
      if (!existingKey) {
        cardKeyByNotificationId.set(notifId, key);
        continue;
      }
      const existingNewest = failureGroupsMap
        .get(existingKey)!
        .rows.filter((r) => r.notification.id === notifId)
        .sort(
          (a, b) =>
            createdAtMs(b.notification.createdAt) -
            createdAtMs(a.notification.createdAt),
        )[0];
      if (
        createdAtMs(newest.notification.createdAt) >
        createdAtMs(existingNewest?.notification.createdAt)
      ) {
        cardKeyByNotificationId.set(notifId, key);
      }
    }
  }

  const fatalOnlyNotifications = [...byNotif.entries()].filter(
    ([, rows]) =>
      rows.some((r) => r.notification.fatal) &&
      !rows.some(isFailureSignatureRow),
  );

  for (const [notifId, rows] of fatalOnlyNotifications) {
    const warnOnRun = rows.filter(isWarningRow);
    const sorted = sortRunRefsDesc(
      (warnOnRun.length > 0 ? warnOnRun : rows).map(rowToRunRef),
    );
    const anchor = sorted[0]?.row ?? rows[0]!;
    const message =
      (anchor.message ?? "").trim() || "Fatal run (no error message)";
    const key = `fatal-only:${failureGroupKey(anchor.step, message)}:${notifId}`;
    failureGroupsMap.set(key, {
      step: anchor.step,
      message,
      rows: [anchor],
    });
    cardKeyByNotificationId.set(notifId, key);
  }

  const nestedByFailureKey = new Map<string, NotificationIssueRow[]>();

  for (const warn of warningRows) {
    const notifId = warn.notification.id;
    if (!failedNotificationIds.has(notifId)) continue;
    const cardKey = cardKeyByNotificationId.get(notifId);
    if (!cardKey) continue;
    const list = nestedByFailureKey.get(cardKey) ?? [];
    list.push(warn);
    nestedByFailureKey.set(cardKey, list);
  }

  const failures: FailureIssueGroup[] = [];

  for (const [key, group] of failureGroupsMap) {
    const { primary, others } = buildRunRefsFromRows(group.rows);
    const nested = nestedByFailureKey.get(key) ?? [];
    const nestedForOtherRuns = nested.filter(
      (w) => w.notification.id !== primary.row.notification.id,
    );
    const nestedForPrimary = nested.filter(
      (w) => w.notification.id === primary.row.notification.id,
    );
    const allNested = [...nestedForPrimary, ...nestedForOtherRuns];

    failures.push({
      kind: "failure",
      key,
      step: group.step,
      message: group.message,
      primaryRun: primary,
      otherRuns: others,
      nestedWarnings: dedupeWarningRows(allNested),
      representativeRow: primary.row,
    });
  }

  failures.sort(
    (a, b) =>
      createdAtMs(b.primaryRun.createdAt) - createdAtMs(a.primaryRun.createdAt),
  );

  const standaloneWarnings = warningRows.filter(
    (w) => !failedNotificationIds.has(w.notification.id),
  );

  const warningGroupsMap = new Map<
    string,
    { step: string | null; message: string; rows: NotificationIssueRow[] }
  >();

  for (const row of standaloneWarnings) {
    const message = (row.message ?? "").trim() || "No issue message supplied";
    const key = failureGroupKey(row.step, message);
    const existing = warningGroupsMap.get(key);
    if (existing) {
      existing.rows.push(row);
    } else {
      warningGroupsMap.set(key, {
        step: row.step,
        message,
        rows: [row],
      });
    }
  }

  const warnings: WarningIssueGroup[] = [];

  for (const [key, group] of warningGroupsMap) {
    const { primary, others } = buildRunRefsFromRows(group.rows);
    warnings.push({
      kind: "warning",
      key,
      step: group.step,
      message: group.message,
      primaryRun: primary,
      otherRuns: others,
      representativeRow: primary.row,
    });
  }

  warnings.sort(
    (a, b) =>
      createdAtMs(b.primaryRun.createdAt) - createdAtMs(a.primaryRun.createdAt),
  );

  return { failures, warnings };
}

function dedupeWarningRows(rows: NotificationIssueRow[]): NotificationIssueRow[] {
  const seen = new Set<string>();
  const out: NotificationIssueRow[] = [];
  for (const row of rows) {
    const k = `${row.notification.id}:${row.issueIndex}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(row);
  }
  return out;
}

export function countGroupedRuns(group: FailureIssueGroup | WarningIssueGroup): number {
  return 1 + group.otherRuns.length;
}
