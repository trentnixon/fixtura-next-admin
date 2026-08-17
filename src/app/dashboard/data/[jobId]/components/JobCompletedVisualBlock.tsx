"use client";

import { useState, type ReactNode } from "react";
import type { LogEntry, LogMetrics, ScrapeIssue } from "@/types/scraperLogs";
import ChartCard from "@/components/modules/charts/ChartCard";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { formatDurationReadable } from "@/utils/chart-formatters";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  ExternalLink,
  Layers,
  Package,
  Timer,
  Upload,
} from "lucide-react";
import {
  aggregateIssuesByMessage,
  aggregateIssuesByStep,
  collectUniqueArtifactRefs,
  parseJobCompletedEntry,
} from "../utils/jobLogPayloadUtils";

/** If set, artifact paths from issues become clickable (see env example in repo docs). */
const SCRAPER_ARTIFACT_BASE_URL =
  typeof process.env.NEXT_PUBLIC_SCRAPER_ARTIFACT_BASE_URL === "string"
    ? process.env.NEXT_PUBLIC_SCRAPER_ARTIFACT_BASE_URL.replace(/\/$/, "")
    : "";

function artifactFileHref(relativePath: string): string | null {
  if (!SCRAPER_ARTIFACT_BASE_URL) return null;
  const path = relativePath.replace(/^\//, "");
  return `${SCRAPER_ARTIFACT_BASE_URL}/${path}`;
}

function num(v: unknown): number {
  return typeof v === "number" && !Number.isNaN(v) ? v : 0;
}

function StatTile({
  icon,
  label,
  children,
  className,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex min-h-[76px] gap-2.5 rounded-lg border bg-white p-3 ${className ?? ""}`}
    >
      <div className="text-muted-foreground shrink-0 mt-0.5">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </p>
        <div className="mt-1 text-sm font-semibold leading-snug">
          {children}
        </div>
      </div>
    </div>
  );
}

function completionDurationMs(
  metrics: LogMetrics | undefined,
  metadata: Record<string, unknown> | null,
): number {
  const fromMetrics = metrics?.durationMs != null ? num(metrics.durationMs) : 0;
  if (fromMetrics > 0) return fromMetrics;
  return metadata?.durationMs != null ? num(metadata.durationMs) : 0;
}

/** Prominent one-off stats + meta-friendly summary at top of completion block. */
function CompletionAtAGlance({
  metrics,
  fatal,
  metadata,
  issueCount,
  issues,
}: {
  metrics: LogMetrics | undefined;
  fatal: boolean | undefined;
  metadata: Record<string, unknown> | null;
  issueCount: number;
  issues: ScrapeIssue[];
}) {
  const durationMs = completionDurationMs(metrics, metadata);
  const succeeded = metrics != null ? num(metrics.fixturesSucceeded) : 0;
  const failedFx = metrics != null ? num(metrics.fixturesFailed) : 0;
  const fixturesTotal = metrics != null ? num(metrics.fixturesTotal) : 0;
  const ingestOk = metrics != null ? num(metrics.ingest_success) : 0;
  const ingestFail = metrics != null ? num(metrics.ingest_failed) : 0;
  const ingestTotal = metrics != null ? num(metrics.ingest_total) : 0;
  const ingestRetry = metrics != null ? num(metrics.ingest_retried) : 0;
  const artifactRaw = metadata?.artifactCount;
  const artifacts =
    artifactRaw !== undefined && artifactRaw !== null
      ? String(artifactRaw)
      : null;
  const reportedArtifactTotal =
    artifactRaw !== undefined &&
    artifactRaw !== null &&
    !Number.isNaN(Number(artifactRaw))
      ? Number(artifactRaw)
      : null;
  const artifactPaths = collectUniqueArtifactRefs(issues);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 xl:grid-cols-8">
        <StatTile
          icon={
            fatal === true ? (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            ) : fatal === false ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            )
          }
          label="Outcome"
          className={
            fatal === true
              ? "border-red-200 bg-red-50/50"
              : fatal === false
                ? "border-emerald-200/80 bg-emerald-50/40"
                : ""
          }
        >
          <span className="flex flex-wrap items-center gap-2">
            {fatal !== undefined ? (
              <Badge
                variant={fatal ? "destructive" : "default"}
                className={
                  fatal
                    ? "bg-red-100 text-red-900 border-red-200"
                    : "bg-emerald-100 text-emerald-900 border-emerald-200"
                }
              >
                {fatal ? "Fatal" : "Non-fatal"}
              </Badge>
            ) : (
              <span className="text-xs text-muted-foreground">
                Not specified
              </span>
            )}
          </span>
        </StatTile>

        <StatTile icon={<Timer className="h-4 w-4" />} label="Scrape duration">
          {durationMs > 0 ? (
            <span className="tabular-nums text-base tracking-tight">
              {formatDurationReadable(durationMs)}
            </span>
          ) : (
            "—"
          )}
        </StatTile>

        <StatTile icon={<Package className="h-4 w-4" />} label="Artifacts">
          {artifacts ?? "—"}
        </StatTile>

        <StatTile icon={<AlertTriangle className="h-4 w-4" />} label="Issues">
          <span className="tabular-nums text-base">{issueCount}</span>
        </StatTile>
        {(artifactPaths.length > 0 ||
          (reportedArtifactTotal != null && reportedArtifactTotal > 0)) && (
          <div className="order-last col-span-full space-y-2 rounded-lg border border-dashed bg-slate-50/70 px-3 py-2">
            <p className="text-xs font-medium text-foreground">
              Capture file paths
            </p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              These are storage paths from the scraper (often PNGs for failed
              steps). They are not hosted by this admin app unless{" "}
              <code className="rounded bg-muted px-1 text-[10px]">
                NEXT_PUBLIC_SCRAPER_ARTIFACT_BASE_URL
              </code>{" "}
              is configured to point at the server or bucket that serves them.
            </p>
            {artifactPaths.length > 0 ? (
              <details className="group">
                <summary className="cursor-pointer text-xs font-medium text-foreground hover:underline">
                  {artifactPaths.length} path
                  {artifactPaths.length === 1 ? "" : "s"} from issues
                  {reportedArtifactTotal != null &&
                  reportedArtifactTotal !== artifactPaths.length
                    ? ` · metadata total ${reportedArtifactTotal}`
                    : ""}
                </summary>
                <ul className="mt-2 space-y-2 pl-0 list-none border-t border-border/60 pt-2">
                  {artifactPaths.map((p) => {
                    const href = artifactFileHref(p);
                    return (
                      <li key={p} className="text-xs font-mono break-all">
                        {href ? (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-start gap-1.5 text-sky-700 hover:underline"
                          >
                            <ExternalLink
                              className="h-3.5 w-3.5 shrink-0 mt-0.5"
                              aria-hidden
                            />
                            {p}
                          </a>
                        ) : (
                          <span className="text-foreground">{p}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </details>
            ) : (
              <p className="text-xs text-muted-foreground">
                Metadata reports{" "}
                <span className="font-semibold tabular-nums text-foreground">
                  {reportedArtifactTotal}
                </span>{" "}
                file(s), but no{" "}
                <code className="rounded bg-muted px-1 text-[10px]">
                  artifactRefs
                </code>{" "}
                on issues in this payload — paths may only exist in worker
                storage or a future API field.
              </p>
            )}
          </div>
        )}

        <div className="contents">
          <StatTile
            icon={<Layers className="h-4 w-4" />}
            label="Fixtures"
            className="col-span-2 xl:col-span-2"
          >
            {fixturesTotal > 0 || succeeded > 0 || failedFx > 0 ? (
              <div className="space-y-1 font-normal">
                <p className="tabular-nums">
                  <span className="text-emerald-700 font-semibold">
                    {succeeded.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground font-medium"> ok</span>
                  <span className="text-muted-foreground"> · </span>
                  <span className="text-red-700 font-semibold">
                    {failedFx.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground font-medium">
                    {" "}
                    failed
                  </span>
                </p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  {fixturesTotal > 0
                    ? `${fixturesTotal.toLocaleString()} total in scope`
                    : null}
                </p>
              </div>
            ) : (
              "—"
            )}
          </StatTile>

          <StatTile
            icon={<Upload className="h-4 w-4" />}
            label="Ingest"
            className="col-span-2 xl:col-span-2"
          >
            {ingestOk > 0 ||
            ingestFail > 0 ||
            ingestTotal > 0 ||
            ingestRetry > 0 ? (
              <div className="space-y-1 font-normal">
                <p className="tabular-nums text-sm">
                  <span className="font-semibold text-sky-800">
                    {ingestOk.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground"> success</span>
                  <span className="text-muted-foreground"> · </span>
                  <span className="font-semibold text-amber-800">
                    {ingestFail.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground"> failed</span>
                  {ingestRetry > 0 ? (
                    <>
                      <span className="text-muted-foreground"> · </span>
                      <span className="font-semibold">
                        {ingestRetry.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground"> retried</span>
                    </>
                  ) : null}
                </p>
                {ingestTotal > 0 ? (
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {ingestTotal.toLocaleString()} total
                  </p>
                ) : null}
              </div>
            ) : (
              "—"
            )}
          </StatTile>
        </div>
      </div>
    </div>
  );
}

function FixturesOutcomeChart({ metrics }: { metrics: LogMetrics }) {
  const succeeded = num(metrics.fixturesSucceeded);
  const failed = num(metrics.fixturesFailed);
  const total = num(metrics.fixturesTotal);
  const data = [
    { name: "Succeeded", value: succeeded, fill: "hsl(142, 76%, 36%)" },
    { name: "Failed", value: failed, fill: "hsl(0, 72%, 50%)" },
  ];

  const chartConfig = {
    value: { label: "Fixtures", color: "hsl(221, 83%, 53%)" },
  } satisfies ChartConfig;

  if (succeeded === 0 && failed === 0 && total === 0) {
    return (
      <ChartCard
        title="Fixtures"
        description="Fixture outcomes"
        chartConfig={chartConfig}
        emptyStateMessage="No fixture metrics"
      />
    );
  }

  return (
    <ChartCard
      title="Fixtures"
      description={`Total ${total || succeeded + failed} · green = succeeded, red = failed`}
      chartConfig={chartConfig}
      chartClassName="h-[200px]"
    >
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
        <YAxis
          tickLine={false}
          axisLine={false}
          fontSize={12}
          allowDecimals={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={56}>
          {data.map((d) => (
            <Cell key={d.name} fill={d.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartCard>
  );
}

function IngestOutcomeChart({ metrics }: { metrics: LogMetrics }) {
  const success = num(metrics.ingest_success);
  const ingestFailed = num(metrics.ingest_failed);
  const retried = num(metrics.ingest_retried);
  const total = num(metrics.ingest_total);

  const data = [
    { name: "Ingest OK", value: success, fill: "hsl(199, 89%, 48%)" },
    { name: "Ingest fail", value: ingestFailed, fill: "hsl(25, 95%, 48%)" },
    { name: "Retried", value: retried, fill: "hsl(48, 96%, 40%)" },
  ];

  const chartConfig = {
    value: { label: "Records", color: "hsl(221, 83%, 53%)" },
  } satisfies ChartConfig;

  if (success === 0 && ingestFailed === 0 && retried === 0 && total === 0) {
    return (
      <ChartCard
        title="Ingest"
        description="Downstream ingest counts"
        chartConfig={chartConfig}
        emptyStateMessage="No ingest metrics"
      />
    );
  }

  return (
    <ChartCard
      title="Ingest"
      description={
        total > 0
          ? `ingest_total ${total} (snake_case fields from scraper)`
          : "Success, failed, and retried record counts"
      }
      chartConfig={chartConfig}
      chartClassName="h-[200px]"
    >
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          fontSize={11}
          interval={0}
          angle={-15}
          textAnchor="end"
          height={52}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          fontSize={12}
          allowDecimals={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
          {data.map((d) => (
            <Cell key={d.name} fill={d.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartCard>
  );
}

function issueSeverityRows(issues: ScrapeIssue[]) {
  const counts = new Map<string, number>();
  for (const issue of issues) {
    const s = (issue.severity ?? "unknown").toUpperCase();
    counts.set(s, (counts.get(s) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

function BreakdownPanel({
  title,
  rows,
  mono = false,
  tone,
}: {
  title: string;
  rows: { label: string; count: number; href?: string }[];
  mono?: boolean;
  tone: "rose" | "amber" | "blue";
}) {
  const max = Math.max(...rows.map((row) => row.count), 1);
  const tones = {
    rose: "bg-error-500",
    amber: "bg-warning-500",
    blue: "bg-info-500",
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-3.5">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <div className="mt-3 space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="min-w-0">
            <div className="flex items-center justify-between gap-3 text-xs">
              {row.href ? (
                <a
                  href={row.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex min-w-0 items-center gap-1 truncate text-info-700 hover:underline ${mono ? "font-mono" : ""}`}
                  title={row.label}
                >
                  <span className="truncate">{row.label}</span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
              ) : (
                <span
                  className={`truncate text-slate-800 ${mono ? "font-mono" : ""}`}
                  title={row.label}
                >
                  {row.label}
                </span>
              )}
              <span className="shrink-0 font-semibold tabular-nums text-slate-900">
                {row.count.toLocaleString()}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${tones[tone]}`}
                style={{ width: `${Math.max((row.count / max) * 100, 6)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function IssueDiagnosticBreakdown({ issues }: { issues: ScrapeIssue[] }) {
  const severities = issueSeverityRows(issues);
  const steps = aggregateIssuesByStep(issues).map((row) => ({
    label: row.step,
    count: row.count,
  }));
  const messages = aggregateIssuesByMessage(issues, 6).map((row) => ({
    label: row.message,
    count: row.count,
  }));
  const targetCounts = new Map<string, number>();
  for (const issue of issues) {
    const url = issueTargetUrl(issue);
    if (url) targetCounts.set(url, (targetCounts.get(url) ?? 0) + 1);
  }
  const targets = Array.from(targetCounts.entries())
    .map(([url, count]) => ({ label: url, href: url, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <div
      className={`grid gap-3 lg:grid-cols-2 ${targets.length > 0 ? "xl:grid-cols-4" : "xl:grid-cols-3"}`}
    >
      <BreakdownPanel title="Severity" rows={severities} tone="rose" mono />
      <BreakdownPanel title="Pipeline step" rows={steps} tone="amber" mono />
      <BreakdownPanel title="Messages" rows={messages} tone="blue" />
      {targets.length > 0 ? (
        <BreakdownPanel title="Affected URLs" rows={targets} tone="blue" mono />
      ) : null}
    </div>
  );
}

function issueTargetUrl(issue: ScrapeIssue): string | null {
  const u = issue.url?.trim();
  return u && u.length > 0 ? u : null;
}

function normalizeSeverityKey(severity: string | undefined): string {
  const t = (severity ?? "").trim().toUpperCase();
  return t || "OTHER";
}

function severitySectionBadgeClass(key: string): string {
  switch (key) {
    case "FATAL":
      return "bg-red-100 text-red-900 border-red-200";
    case "ERROR":
      return "bg-orange-100 text-orange-950 border-orange-200";
    case "WARN":
      return "bg-amber-100 text-amber-950 border-amber-200";
    case "INFO":
      return "bg-sky-100 text-sky-950 border-sky-200";
    case "DEBUG":
      return "bg-violet-100 text-violet-950 border-violet-200";
    default:
      return "bg-muted text-foreground border-border";
  }
}

function issueTime(
  issue: ScrapeIssue,
  reportedAt: string | null,
): { label: "Occurred" | "Reported"; value: string } {
  const raw = issue as ScrapeIssue & {
    timestamp?: string;
    occurredAt?: string;
    createdAt?: string;
  };
  const occurredAt = raw.occurredAt ?? raw.timestamp ?? raw.createdAt;
  const value = occurredAt ?? reportedAt;

  if (!value) return { label: "Reported", value: "Time unavailable" };

  const date = new Date(value);
  return {
    label: occurredAt ? "Occurred" : "Reported",
    value: Number.isNaN(date.getTime()) ? value : date.toLocaleString(),
  };
}

function IssuesDetailTable({
  issues,
  reportedAt,
}: {
  issues: ScrapeIssue[];
  reportedAt: string | null;
}) {
  if (issues.length === 0) {
    return <p className="text-sm text-muted-foreground">No issues recorded.</p>;
  }

  return (
    <div className="divide-y divide-slate-200 overflow-hidden rounded-lg border border-slate-200 bg-white">
      {issues.map((issue, index) => {
        const severity = normalizeSeverityKey(issue.severity);
        const targetUrl = issueTargetUrl(issue);
        const isHttp = targetUrl != null && /^https?:\/\//i.test(targetUrl);
        const time = issueTime(issue, reportedAt);

        return (
          <article
            key={`${severity}-${issue.message ?? "issue"}-${index}`}
            className="grid gap-4 p-4 xl:grid-cols-[minmax(0,1.35fr)_190px_minmax(280px,1fr)]"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={`text-[10px] ${severitySectionBadgeClass(severity)}`}
                >
                  {severity}
                </Badge>
                {issue.step ? (
                  <Badge variant="secondary" className="font-mono text-[10px]">
                    {issue.step}
                  </Badge>
                ) : null}
              </div>
              <p className="mt-2 break-words text-sm font-medium leading-snug text-slate-900">
                {issue.message?.trim() || "No issue message supplied"}
              </p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                {issue.fixtureKey ? (
                  <span className="font-mono">Fixture {issue.fixtureKey}</span>
                ) : null}
                {issue.failureClass ? (
                  <span className="font-mono">{issue.failureClass}</span>
                ) : null}
                {issue.retryable != null ? (
                  <span>{issue.retryable ? "Retryable" : "Not retryable"}</span>
                ) : null}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                {time.label}
              </p>
              <p className="mt-1 text-xs text-slate-800">{time.value}</p>
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Affected URL
              </p>
              <div className="mt-1 break-all text-xs">
                {targetUrl ? (
                  isHttp ? (
                    <a
                      href={targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-start gap-1 text-info-700 hover:underline"
                    >
                      <ExternalLink
                        className="mt-0.5 h-3 w-3 shrink-0"
                        aria-hidden
                      />
                      {targetUrl}
                    </a>
                  ) : (
                    <span className="font-mono text-muted-foreground">
                      {targetUrl}
                    </span>
                  )
                ) : (
                  <span className="text-muted-foreground">No URL supplied</span>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function MetadataMetricsSnapshot({
  metricsUnknown,
}: {
  metricsUnknown: unknown;
}) {
  if (
    !metricsUnknown ||
    typeof metricsUnknown !== "object" ||
    Array.isArray(metricsUnknown)
  ) {
    return null;
  }
  const m = metricsUnknown as LogMetrics;
  const rows = [
    ["fixturesTotal", m.fixturesTotal],
    ["fixturesSucceeded", m.fixturesSucceeded],
    ["fixturesFailed", m.fixturesFailed],
    ["durationMs", m.durationMs],
    ["ingest_total", m.ingest_total],
    ["ingest_success", m.ingest_success],
    ["ingest_failed", m.ingest_failed],
    ["ingest_retried", m.ingest_retried],
  ].filter(([, v]) => v != null);

  if (rows.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <div className="border-b bg-slate-50 px-3 py-2">
        <p className="text-sm font-medium text-foreground">Reported metrics</p>
        <p className="text-[11px] text-muted-foreground">
          Raw values used by the outcome charts
        </p>
      </div>
      <div className="px-3 py-2">
        <Table>
          <TableBody>
            {rows.map(([k, v]) => (
              <TableRow key={String(k)}>
                <TableCell className="font-mono text-xs py-1 w-[40%]">
                  {k}
                </TableCell>
                <TableCell className="text-xs py-1 tabular-nums">
                  {k === "durationMs"
                    ? formatDurationReadable(
                        typeof v === "number" ? v : Number(v),
                      )
                    : String(v)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

/** Additional completion metadata not already represented by metrics. */
function CompletedMetadataBreakdown({
  metadata,
}: {
  metadata: Record<string, unknown> | null;
}) {
  if (!metadata || Object.keys(metadata).length === 0) {
    return null;
  }

  const extraEntries = Object.entries(metadata).filter(
    ([k]) =>
      !["metrics", "issues", "fatal", "durationMs", "artifactCount"].includes(
        k,
      ),
  );

  if (extraEntries.length === 0) return null;

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-foreground">Additional metadata</p>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-50">
              <TableHead className="h-9 text-xs">Key</TableHead>
              <TableHead className="h-9 text-xs">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {extraEntries.map(([k, v]) => (
              <TableRow key={k}>
                <TableCell className="font-mono text-xs align-top py-2">
                  {k}
                </TableCell>
                <TableCell className="text-xs break-all py-2">
                  {typeof v === "object"
                    ? JSON.stringify(v, null, 2)
                    : String(v)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function RawMetadataJson({ metadata }: { metadata: Record<string, unknown> }) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle",
  );
  const json = JSON.stringify(metadata, null, 2);

  const copyJson = async () => {
    try {
      await navigator.clipboard.writeText(json);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }

    window.setTimeout(() => setCopyState("idle"), 2000);
  };

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-3 py-2">
        <p className="text-sm font-medium text-slate-900">Raw metadata JSON</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1.5"
          onClick={copyJson}
        >
          {copyState === "copied" ? (
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
          {copyState === "copied"
            ? "Copied"
            : copyState === "error"
              ? "Copy failed"
              : "Copy JSON"}
        </Button>
      </div>
      <pre className="max-h-[min(70vh,560px)] overflow-auto bg-slate-950 p-4 text-[11px] leading-relaxed text-slate-100">
        {json}
      </pre>
    </section>
  );
}

interface JobCompletedVisualBlockProps {
  entry: LogEntry;
  /** When true, omit duplicate summary stats at top (compact inline view) */
  compact?: boolean;
}

/**
 * Charts + structured metadata + issues for job.completed.
 */
export function JobCompletedVisualBlock({
  entry,
  compact = false,
}: JobCompletedVisualBlockProps) {
  const parsed = parseJobCompletedEntry(entry);
  const { metrics, fatal, metadata } = parsed;
  const issues = parsed.issues ?? [];

  return (
    <div className="space-y-8">
      {!compact && (
        <CompletionAtAGlance
          metrics={metrics}
          fatal={fatal}
          metadata={metadata}
          issueCount={issues.length}
          issues={issues}
        />
      )}

      {metrics && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Outcomes</p>
          <div
            className={`grid grid-cols-1 gap-4 ${metadata?.metrics ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}
          >
            <FixturesOutcomeChart metrics={metrics} />
            <IngestOutcomeChart metrics={metrics} />
            <MetadataMetricsSnapshot metricsUnknown={metadata?.metrics} />
          </div>
        </div>
      )}

      {issues.length > 0 && (
        <div
          id="job-completion-issue-analysis"
          className="space-y-4 scroll-mt-24"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-foreground">
              Issue analysis
            </p>
            <Badge variant="outline">
              {issues.length.toLocaleString()} issue
              {issues.length === 1 ? "" : "s"}
            </Badge>
          </div>
          <IssueDiagnosticBreakdown issues={issues} />
          <div className="space-y-2">
            <p className="text-sm font-medium">All issues</p>
            <IssuesDetailTable
              issues={issues}
              reportedAt={entry.timestamp ?? entry.createdAt}
            />
          </div>
        </div>
      )}

      {issues.length === 0 && (
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          No issues on this completion event.
        </p>
      )}

      <CompletedMetadataBreakdown metadata={metadata} />

      {metadata && <RawMetadataJson metadata={metadata} />}
    </div>
  );
}
