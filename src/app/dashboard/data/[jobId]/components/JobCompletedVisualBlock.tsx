"use client";

import { useMemo, useState } from "react";
import type { LogEntry, LogMetrics, ScrapeIssue } from "@/types/scraperLogs";
import ChartCard from "@/components/modules/charts/ChartCard";
import { formatStepLabel } from "@/app/dashboard/notifications/issues/utils/notificationIssuesTableUi";
import {
  OverviewDataWorkspace,
  type WorkspaceMetricTile,
} from "@/app/dashboard/components/live-snapshot/OverviewDataWorkspace";
import { OverviewRecordPanel } from "@/app/dashboard/components/live-snapshot/OverviewRecordPanel";
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
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Copy,
  ExternalLink,
  FileJson,
} from "lucide-react";
import {
  aggregateIssuesByMessage,
  aggregateIssuesByStep,
  collectUniqueArtifactRefs,
  parseJobCompletedEntry,
} from "../utils/jobLogPayloadUtils";
import {
  CompletionIssuesList,
  issueTargetUrl,
} from "./CompletionIssueLog";
import { ReportedMetricsSummary } from "./ReportedThroughputMetrics";

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

function completionDurationMs(
  metrics: LogMetrics | undefined,
  metadata: Record<string, unknown> | null,
): number {
  const fromMetrics = metrics?.durationMs != null ? num(metrics.durationMs) : 0;
  if (fromMetrics > 0) return fromMetrics;
  return metadata?.durationMs != null ? num(metadata.durationMs) : 0;
}

function CompletionCapturePaths({
  issues,
  metadata,
}: {
  issues: ScrapeIssue[];
  metadata: Record<string, unknown> | null;
}) {
  const artifactRaw = metadata?.artifactCount;
  const reportedArtifactTotal =
    artifactRaw !== undefined &&
    artifactRaw !== null &&
    !Number.isNaN(Number(artifactRaw))
      ? Number(artifactRaw)
      : null;
  const artifactPaths = collectUniqueArtifactRefs(issues);

  if (
    artifactPaths.length === 0 &&
    (reportedArtifactTotal == null || reportedArtifactTotal <= 0)
  ) {
    return null;
  }

  return (
    <OverviewRecordPanel
      title="Capture file paths"
      description="Storage paths from the scraper payload — not hosted here unless NEXT_PUBLIC_SCRAPER_ARTIFACT_BASE_URL is configured"
    >
      <div className="space-y-2">
        {artifactPaths.length > 0 ? (
          <>
            <p className="text-xs text-muted-foreground">
              {artifactPaths.length} path
              {artifactPaths.length === 1 ? "" : "s"} from issues
              {reportedArtifactTotal != null &&
              reportedArtifactTotal !== artifactPaths.length
                ? ` · metadata total ${reportedArtifactTotal}`
                : ""}
            </p>
            <ul className="space-y-2 pl-0 list-none">
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
          </>
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
            on issues in this payload — paths may only exist in worker storage
            or a future API field.
          </p>
        )}
      </div>
    </OverviewRecordPanel>
  );
}

/** Headline completion outcome — throughput detail lives on the Metrics tab. */
function CompletionAtAGlance({
  metrics,
  fatal,
  metadata,
  issueCount,
}: {
  metrics: LogMetrics | undefined;
  fatal: boolean | undefined;
  metadata: Record<string, unknown> | null;
  issueCount: number;
}) {
  const durationMs = completionDurationMs(metrics, metadata);
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

  const headlineMetrics = useMemo((): WorkspaceMetricTile[] => {
    return [
      {
        id: "outcome",
        label: "Outcome",
        value:
          fatal === true
            ? "Fatal"
            : fatal === false
              ? "Non-fatal"
              : "Not specified",
        meta:
          fatal === true
            ? "Completion flagged as fatal"
            : fatal === false
              ? "Completed without fatal flag"
              : "Fatal flag not set",
      },
      {
        id: "duration",
        label: "Scrape duration",
        value:
          durationMs > 0 ? formatDurationReadable(durationMs) : "—",
        meta: "Wall-clock scrape time",
      },
      {
        id: "artifacts",
        label: "Artifacts",
        value: artifacts ?? "—",
        meta:
          reportedArtifactTotal != null
            ? `${reportedArtifactTotal.toLocaleString()} reported in metadata`
            : "Capture file count",
      },
      {
        id: "issues",
        label: "Issues",
        value: issueCount.toLocaleString(),
        meta: issueCount === 1 ? "Issue on completion" : "Issues on completion",
      },
    ];
  }, [
    artifacts,
    durationMs,
    fatal,
    issueCount,
    reportedArtifactTotal,
  ]);

  return (
    <div className="space-y-4">
      <OverviewDataWorkspace
        title="Completion snapshot"
        description="Headline outcome and throughput from the job.completed event"
        icon={CheckCircle2}
        badge={
          fatal === true ? (
            <Badge variant="destructive">Fatal</Badge>
          ) : fatal === false ? (
            <Badge
              variant="outline"
              className="border-emerald-200 bg-emerald-50 text-emerald-800"
            >
              Non-fatal
            </Badge>
          ) : null
        }
        metrics={headlineMetrics}
        columns={4}
      />
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

function severityBarFill(severity: string): string {
  switch (severity.toUpperCase()) {
    case "FATAL":
    case "ERROR":
      return "hsl(0, 72%, 50%)";
    case "WARN":
      return "hsl(38, 92%, 50%)";
    case "INFO":
      return "hsl(199, 89%, 48%)";
    case "DEBUG":
      return "hsl(262, 52%, 47%)";
    default:
      return "hsl(215, 16%, 47%)";
  }
}

function IssueSeverityChart({ issues }: { issues: ScrapeIssue[] }) {
  const rows = issueSeverityRows(issues);
  const data = rows.map((row) => ({
    name: row.label,
    value: row.count,
    fill: severityBarFill(row.label),
  }));

  const chartConfig = {
    value: { label: "Issues", color: "hsl(221, 83%, 53%)" },
  } satisfies ChartConfig;

  if (data.length === 0) {
    return (
      <ChartCard
        title="Issues by severity"
        description="Issue counts from the completion payload"
        chartConfig={chartConfig}
        emptyStateMessage="No issues recorded"
      />
    );
  }

  return (
    <ChartCard
      title="Issues by severity"
      description={`${issues.length.toLocaleString()} total · from the issues array, not fixture metrics`}
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

const stepBarFills = [
  "hsl(25, 95%, 48%)",
  "hsl(199, 89%, 48%)",
  "hsl(262, 52%, 47%)",
  "hsl(142, 76%, 36%)",
];

function IssueStepChart({ issues }: { issues: ScrapeIssue[] }) {
  const rows = aggregateIssuesByStep(issues);
  const data = rows.map((row, index) => ({
    name: formatStepLabel(row.step),
    stepKey: row.step,
    value: row.count,
    fill: stepBarFills[index % stepBarFills.length],
  }));

  const chartConfig = {
    value: { label: "Issues", color: "hsl(221, 83%, 53%)" },
  } satisfies ChartConfig;

  if (data.length === 0) {
    return (
      <ChartCard
        title="Issues by pipeline step"
        description="Where issues were raised in the scrape pipeline"
        chartConfig={chartConfig}
        emptyStateMessage="No pipeline step data"
      />
    );
  }

  return (
    <ChartCard
      title="Issues by pipeline step"
      description="Pipeline step on each issue row"
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
        <ChartTooltip
          content={<ChartTooltipContent />}
          labelFormatter={(_, payload) => {
            const stepKey = (payload?.[0]?.payload as { stepKey?: string })
              ?.stepKey;
            return stepKey ?? "";
          }}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
          {data.map((d) => (
            <Cell key={d.stepKey} fill={d.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartCard>
  );
}

function MetricStatTile({
  label,
  value,
  tone = "text-slate-900",
}: {
  label: string;
  value: string | number;
  tone?: string;
}) {
  return (
    <div className="rounded-md border border-slate-200 bg-slate-50/70 px-3 py-2.5">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={cn("mt-0.5 text-lg font-semibold tabular-nums", tone)}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>
    </div>
  );
}

function IssueDistributionPanel({
  title,
  description,
  rows,
  getBarFill,
}: {
  title: string;
  description: string;
  rows: { key: string; label: string; count: number }[];
  getBarFill: (key: string, index: number) => string;
}) {
  const total = rows.reduce((sum, row) => sum + row.count, 0);
  if (total === 0) return null;

  const topRow = rows[0];

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
        {topRow ? (
          <Badge
            variant="outline"
            className="shrink-0 border-slate-200 bg-slate-50 text-slate-700"
          >
            Top: {topRow.label} ({topRow.count.toLocaleString()})
          </Badge>
        ) : null}
      </div>

      <div className="mt-4 space-y-2">
        <div
          className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100"
          role="img"
          aria-label={rows
            .map((row) => `${row.label} ${row.count}`)
            .join(", ")}
        >
          {rows.map((row, index) => (
            <div
              key={row.key}
              className="h-full"
              style={{
                width: `${Math.max((row.count / total) * 100, row.count > 0 ? 4 : 0)}%`,
                backgroundColor: getBarFill(row.key, index),
              }}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {rows.map((row, index) => (
            <span key={row.key} className="inline-flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: getBarFill(row.key, index) }}
              />
              {row.label} {Math.round((row.count / total) * 100)}%
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {rows.map((row) => (
          <MetricStatTile
            key={row.key}
            label={row.label}
            value={row.count}
          />
        ))}
      </div>
    </section>
  );
}

function IssueMetricsSnapshot({ issues }: { issues: ScrapeIssue[] }) {
  if (issues.length === 0) return null;

  const severities = issueSeverityRows(issues);
  const steps = aggregateIssuesByStep(issues);
  const messages = aggregateIssuesByMessage(issues, 100);
  const uniqueUrls = new Set(
    issues.map((issue) => issueTargetUrl(issue)).filter(Boolean),
  ).size;

  const severityRows = severities.map((row) => ({
    key: row.label,
    label: row.label,
    count: row.count,
  }));
  const stepRows = steps.map((row) => ({
    key: row.step,
    label: formatStepLabel(row.step),
    count: row.count,
  }));

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-foreground">Issue metrics</p>
        <p className="text-xs text-muted-foreground">
          Counts derived from the issues array on job.completed
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <MetricStatTile label="Total issues" value={issues.length} />
        <MetricStatTile label="Unique URLs" value={uniqueUrls} />
        <MetricStatTile label="Message types" value={messages.length} />
      </div>

      <div
        className={cn(
          "grid gap-4",
          severityRows.length > 0 && stepRows.length > 0
            ? "lg:grid-cols-2"
            : "grid-cols-1",
        )}
      >
        {severityRows.length > 0 ? (
          <IssueDistributionPanel
            title="By severity"
            description="How issues are classified"
            rows={severityRows}
            getBarFill={(key) => severityBarFill(key)}
          />
        ) : null}
        {stepRows.length > 0 ? (
          <IssueDistributionPanel
            title="By pipeline step"
            description="Where in the scrape pipeline issues were raised"
            rows={stepRows}
            getBarFill={(_key, index) =>
              stepBarFills[index % stepBarFills.length]
            }
          />
        ) : null}
      </div>
    </div>
  );
}

function BreakdownPanel({
  title,
  rows,
  mono = false,
  tone,
  wrap = false,
  emptyMessage = "No data",
}: {
  title: string;
  rows: { label: string; count: number; href?: string }[];
  mono?: boolean;
  tone: "rose" | "amber" | "blue";
  wrap?: boolean;
  emptyMessage?: string;
}) {
  const max = Math.max(...rows.map((row) => row.count), 1);
  const tones = {
    rose: "bg-error-500",
    amber: "bg-warning-500",
    blue: "bg-info-500",
  };

  if (rows.length === 0) {
    return (
      <section className="rounded-lg border border-dashed border-slate-200 bg-slate-50/40 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">{emptyMessage}</p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <div className="mt-3 space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="min-w-0">
            <div
              className={cn(
                "flex gap-3 text-xs",
                wrap ? "items-start" : "items-center justify-between",
              )}
            >
              {row.href ? (
                <a
                  href={row.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex min-w-0 flex-1 items-start gap-1 text-info-700 hover:underline",
                    mono && "font-mono",
                    wrap ? "break-all leading-relaxed" : "truncate",
                  )}
                  title={row.label}
                >
                  <span className={wrap ? "min-w-0 break-words" : "truncate"}>
                    {row.label}
                  </span>
                  <ExternalLink className="mt-0.5 h-3 w-3 shrink-0" />
                </a>
              ) : (
                <span
                  className={cn(
                    "min-w-0 flex-1 text-slate-800",
                    mono && "font-mono",
                    wrap ? "break-words leading-relaxed" : "truncate",
                  )}
                  title={row.label}
                >
                  {row.label}
                </span>
              )}
              <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-slate-900">
                {row.count.toLocaleString()}
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
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

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <BreakdownPanel
        title="Severity"
        rows={severities}
        tone="rose"
        mono
        emptyMessage="No severity data"
      />
      <BreakdownPanel
        title="Pipeline step"
        rows={steps}
        tone="amber"
        mono
        emptyMessage="No pipeline step data"
      />
    </div>
  );
}

function IssueTopMessagesBreakdown({ issues }: { issues: ScrapeIssue[] }) {
  const messages = aggregateIssuesByMessage(issues, 6).map((row) => ({
    label: row.message,
    count: row.count,
  }));

  return (
    <BreakdownPanel
      title="Top messages"
      rows={messages}
      tone="blue"
      wrap
      emptyMessage="No repeated messages"
    />
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
    <OverviewRecordPanel
      title="Additional metadata"
      description="Extra completion metadata not already shown in charts or snapshot"
    >
      <div className="overflow-x-auto rounded-md border border-slate-200">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
              <TableHead className="h-9 text-xs font-semibold">Key</TableHead>
              <TableHead className="h-9 text-xs font-semibold">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {extraEntries.map(([k, v]) => (
              <TableRow key={k}>
                <TableCell className="align-top py-2 font-mono text-xs">
                  {k}
                </TableCell>
                <TableCell className="break-all py-2 text-xs">
                  {typeof v === "object"
                    ? JSON.stringify(v, null, 2)
                    : String(v)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </OverviewRecordPanel>
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
    <OverviewRecordPanel
      title="Raw metadata JSON"
      description="Full completion metadata object from the log entry"
      action={
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 border-slate-200 bg-slate-50 shadow-none"
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
      }
    >
      <pre className="max-h-[min(70vh,560px)] overflow-auto rounded-md bg-slate-950 p-4 text-[11px] leading-relaxed text-slate-100">
        {json}
      </pre>
    </OverviewRecordPanel>
  );
}

/** Top-level detail tabs (summary lives on Overview). */
export const jobCompletionTabs = [
  { value: "metrics", label: "Metrics", icon: BarChart3 },
  { value: "issues", label: "Issues", icon: AlertTriangle },
  { value: "metadata", label: "Metadata", icon: FileJson },
] as const;

export type JobCompletionDetailTab =
  (typeof jobCompletionTabs)[number]["value"];

export type JobCompletionTab = JobCompletionDetailTab | "summary";

export function completionIssueCount(entry: LogEntry): number {
  return parseJobCompletedEntry(entry).issues?.length ?? 0;
}

export function JobCompletionMissingState() {
  return (
    <OverviewRecordPanel
      title="Completion"
      description="Latest job.completed payload and summary metrics"
    >
      <p className="text-sm text-muted-foreground">
        No completion event found. This job may still be running or stopped
        before completion.
      </p>
    </OverviewRecordPanel>
  );
}

interface JobCompletionTabPanelProps {
  entry: LogEntry;
  tab: JobCompletionTab;
}

/** Single completion view panel (summary, metrics, issues, or metadata). */
export function JobCompletionTabPanel({ entry, tab }: JobCompletionTabPanelProps) {
  const parsed = parseJobCompletedEntry(entry);
  const { metrics, fatal, metadata } = parsed;
  const issues = parsed.issues ?? [];
  const reportedAt = entry.timestamp ?? entry.createdAt;

  switch (tab) {
    case "summary":
      return (
        <div className="space-y-4">
          <CompletionAtAGlance
            metrics={metrics}
            fatal={fatal}
            metadata={metadata}
            issueCount={issues.length}
          />
        </div>
      );

    case "metrics":
      return (
        <div className="space-y-6">
          {metrics || issues.length > 0 ? (
            <>
              {metrics ? (
                <OverviewRecordPanel
                  title="Fixture & ingest"
                  description="Throughput counts from the completion metrics object"
                >
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <FixturesOutcomeChart metrics={metrics} />
                    <IngestOutcomeChart metrics={metrics} />
                  </div>
                  <div className="mt-4">
                    <ReportedMetricsSummary metrics={metrics} />
                  </div>
                </OverviewRecordPanel>
              ) : null}

              {issues.length > 0 ? (
                <OverviewRecordPanel
                  title="Issue outcomes"
                  description="Counts derived from the issues array — warnings and validation failures may not appear in fixture metrics"
                  badge={
                    <Badge variant="outline">
                      {issues.length.toLocaleString()} issue
                      {issues.length === 1 ? "" : "s"}
                    </Badge>
                  }
                >
                  <div
                    id="job-completion-issue-analysis"
                    className="space-y-4 scroll-mt-24"
                  >
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      <IssueSeverityChart issues={issues} />
                      <IssueStepChart issues={issues} />
                    </div>
                    <IssueMetricsSnapshot issues={issues} />
                    <IssueDiagnosticBreakdown issues={issues} />
                  </div>
                </OverviewRecordPanel>
              ) : null}
            </>
          ) : (
            <OverviewRecordPanel
              title="Completion metrics"
              description="Fixture, ingest, and issue outcome counts from job.completed"
            >
              <p className="text-sm text-muted-foreground">
                No completion metrics or issues were attached to this
                job.completed event.
              </p>
            </OverviewRecordPanel>
          )}
        </div>
      );

    case "issues":
      return (
        <div className="space-y-6">
          {issues.length > 0 ? (
            <IssueTopMessagesBreakdown issues={issues} />
          ) : null}

          <CompletionCapturePaths issues={issues} metadata={metadata} />

          {issues.length > 0 ? (
            <OverviewRecordPanel
              title="Issue log"
              description="Each failure record from the job.completed payload"
              badge={
                <Badge variant="outline">
                  {issues.length.toLocaleString()} issue
                  {issues.length === 1 ? "" : "s"}
                </Badge>
              }
            >
              <CompletionIssuesList
                issues={issues}
                reportedAt={reportedAt}
                jobId={entry.jobId}
              />
            </OverviewRecordPanel>
          ) : (
            <OverviewRecordPanel
              title="Issues"
              description="Failure records attached to this completion event"
            >
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                No issues on this completion event.
              </p>
            </OverviewRecordPanel>
          )}
        </div>
      );

    case "metadata":
      return (
        <div className="space-y-4">
          {metadata ? (
            <>
              <CompletedMetadataBreakdown metadata={metadata} />
              <RawMetadataJson metadata={metadata} />
            </>
          ) : (
            <OverviewRecordPanel
              title="Metadata"
              description="Additional completion fields and raw payload"
            >
              <p className="text-sm text-muted-foreground">
                No metadata object on this completion event.
              </p>
            </OverviewRecordPanel>
          )}
        </div>
      );
  }
}
