import type { LogEntry, LogMetrics, ScrapeIssue } from "@/types/scraperLogs";

/** Deduped paths from `issue.artifactRefs` (scraper capture files, often screenshots). */
export function collectUniqueArtifactRefs(issues: ScrapeIssue[]): string[] {
  const set = new Set<string>();
  for (const i of issues) {
    const refs = i.artifactRefs;
    if (!Array.isArray(refs)) continue;
    for (const r of refs) {
      if (typeof r === "string" && r.trim()) set.add(r.trim());
    }
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

export function asRecord(v: unknown): Record<string, unknown> | null {
  return v && typeof v === "object" && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : null;
}

export function mergedEventFields(entry: LogEntry): Record<string, unknown> {
  const p =
    entry.payload &&
    typeof entry.payload === "object" &&
    !Array.isArray(entry.payload)
      ? { ...(entry.payload as Record<string, unknown>) }
      : {};

  const fill = (key: string, v: unknown) => {
    if (v != null && p[key] == null) p[key] = v;
  };
  fill("event", entry.event);
  fill("jobId", entry.jobId);
  fill("runId", entry.runId);
  fill("scope", entry.scope);
  fill("queueName", entry.queueName);
  fill("service", entry.service);
  fill("kind", entry.kind);
  fill("bullJobId", entry.bullJobId);
  fill("attempt", entry.attempt);
  fill("timestamp", entry.timestamp);
  return p;
}

export function findLatestCompletedEntry(
  entries: LogEntry[]
): LogEntry | null {
  const completed = entries.filter((e) => e.event === "job.completed");
  if (completed.length === 0) return null;
  return completed.sort(
    (a, b) =>
      new Date(b.timestamp ?? b.createdAt).getTime() -
      new Date(a.timestamp ?? a.createdAt).getTime()
  )[0];
}

export interface ParsedJobCompleted {
  metrics: LogMetrics | undefined;
  issues: ScrapeIssue[] | undefined;
  fatal: boolean | undefined;
  metadata: Record<string, unknown> | null;
  merged: Record<string, unknown>;
}

export function parseJobCompletedEntry(entry: LogEntry): ParsedJobCompleted {
  const m = mergedEventFields(entry);
  const metadata = asRecord(m.metadata);
  const metrics = (m.metrics ?? metadata?.metrics) as LogMetrics | undefined;
  const issuesRaw = m.issues ?? metadata?.issues;
  const issues = Array.isArray(issuesRaw)
    ? (issuesRaw as ScrapeIssue[])
    : undefined;
  const fatal = m.fatal ?? metadata?.fatal;
  const fatalBool = typeof fatal === "boolean" ? fatal : undefined;

  return {
    metrics: metrics && typeof metrics === "object" && !Array.isArray(metrics)
      ? metrics
      : undefined,
    issues,
    fatal: fatalBool,
    metadata,
    merged: m,
  };
}

/** Short labels for chart axis */
export function shortEventLabel(event: string): string {
  return event.replace(/^job\./, "").replace(/^cms\./, "cms.");
}

export function aggregateEventCounts(
  entries: LogEntry[]
): { name: string; shortName: string; count: number }[] {
  const map = new Map<string, number>();
  for (const e of entries) {
    map.set(e.event, (map.get(e.event) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([name, count]) => ({
      name,
      shortName: shortEventLabel(name),
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

export interface HeartbeatPoint {
  sequence: number;
  elapsedMs: number | null;
  atMs: number;
  label: string;
}

/** Wall-clock gap between consecutive heartbeats (from log timestamps). */
export interface HeartbeatGap {
  /** 1-based index of this heartbeat in the ordered series (second HB = 2, …). */
  heartbeatIndex: number;
  afterSequence: number;
  gapMs: number;
  atLabel: string;
}

export function buildHeartbeatGaps(series: HeartbeatPoint[]): HeartbeatGap[] {
  const gaps: HeartbeatGap[] = [];
  for (let i = 1; i < series.length; i++) {
    const gapMs = Math.max(0, series[i].atMs - series[i - 1].atMs);
    gaps.push({
      heartbeatIndex: i + 1,
      afterSequence: series[i].sequence,
      gapMs,
      atLabel: series[i].label,
    });
  }
  return gaps;
}

/** Count issues per pipeline step (e.g. content_wait, page_not_found, ingest). */
export function aggregateIssuesByStep(
  issues: ScrapeIssue[]
): { step: string; count: number }[] {
  const map = new Map<string, number>();
  for (const i of issues) {
    const step = i.step?.trim() || "unknown";
    map.set(step, (map.get(step) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([step, count]) => ({ step, count }))
    .sort((a, b) => b.count - a.count);
}

/** Top recurring issue messages (truncated label for charts). */
export function aggregateIssuesByMessage(
  issues: ScrapeIssue[],
  limit = 14
): { message: string; shortLabel: string; count: number }[] {
  const map = new Map<string, number>();
  for (const i of issues) {
    const m = (i.message ?? "").trim() || "(empty)";
    map.set(m, (map.get(m) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([message, count]) => ({
      message,
      count,
      shortLabel:
        message.length > 48 ? `${message.slice(0, 45)}…` : message,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function buildHeartbeatSeries(entries: LogEntry[]): HeartbeatPoint[] {
  const sorted = [...entries].sort(
    (a, b) =>
      new Date(a.timestamp ?? a.createdAt).getTime() -
      new Date(b.timestamp ?? b.createdAt).getTime()
  );
  const points: HeartbeatPoint[] = [];
  let idx = 0;
  for (const e of sorted) {
    if (e.event !== "job.heartbeat") continue;
    const m = mergedEventFields(e);
    const meta = asRecord(m.metadata);
    const elapsed =
      typeof meta?.elapsedMs === "number"
        ? meta.elapsedMs
        : typeof m.elapsedMs === "number"
          ? (m.elapsedMs as number)
          : null;
    const atMs = new Date(e.timestamp ?? e.createdAt).getTime();
    if (Number.isNaN(atMs)) continue;
    idx += 1;
    points.push({
      sequence:
        typeof meta?.heartbeatSequence === "number"
          ? meta.heartbeatSequence
          : idx,
      elapsedMs: elapsed,
      atMs,
      label: new Date(e.timestamp ?? e.createdAt).toLocaleTimeString(),
    });
  }
  return points;
}
