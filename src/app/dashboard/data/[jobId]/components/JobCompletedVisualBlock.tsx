"use client";

import type { ReactNode } from "react";
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
import {
  AlertTriangle,
  CheckCircle2,
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
  hint,
  className,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex min-h-20 gap-3 rounded-lg border bg-white p-3 ${className ?? ""}`}
    >
      <div className="text-muted-foreground shrink-0 mt-0.5">{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </p>
        <div className="mt-1 text-sm font-semibold leading-snug">
          {children}
        </div>
        {hint != null && hint !== "" && (
          <p className="mt-1 text-[10px] text-muted-foreground">{hint}</p>
        )}
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
      <p className="text-sm font-medium text-foreground">At a glance</p>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
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
              ? "border-red-200 bg-red-50/50 lg:col-span-2"
              : fatal === false
                ? "border-emerald-200/80 bg-emerald-50/40 lg:col-span-2"
                : "lg:col-span-2"
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
            {fatal === false && (
              <span className="text-xs font-normal text-muted-foreground">
                Job completed without fatal flag
              </span>
            )}
            {fatal === true && (
              <span className="text-xs font-normal text-muted-foreground">
                Check issues below
              </span>
            )}
          </span>
        </StatTile>

        <StatTile
          icon={<Timer className="h-4 w-4" />}
          label="Scrape duration"
          hint="Total run time from job completion payload"
        >
          {durationMs > 0 ? (
            <span className="tabular-nums text-base tracking-tight">
              {formatDurationReadable(durationMs)}
            </span>
          ) : (
            "—"
          )}
        </StatTile>

        <StatTile
          icon={<Package className="h-4 w-4" />}
          label="Artifacts"
          hint="Capture files the scraper saved (e.g. screenshots). Total from completion metadata; paths are listed below when issues reference them."
        >
          {artifacts ?? "—"}
        </StatTile>

        <StatTile
          icon={<AlertTriangle className="h-4 w-4" />}
          label="Issues"
          hint="Warnings & errors from job.completed (one row per item). Charts and the full table are in Issue analysis below."
        >
          <span className="tabular-nums text-base">{issueCount}</span>
        </StatTile>
      </div>

      {(artifactPaths.length > 0 ||
        (reportedArtifactTotal != null && reportedArtifactTotal > 0)) && (
        <div className="space-y-2 rounded-lg border border-dashed bg-slate-50/70 px-3 py-2">
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
              on issues in this payload — paths may only exist in worker storage
              or a future API field.
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <StatTile
          icon={<Layers className="h-4 w-4" />}
          label="Fixtures"
          hint="fixturesSucceeded / fixturesFailed / fixturesTotal"
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
          hint="ingest_success / ingest_failed / ingest_total · ingest_retried"
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
                  {ingestTotal.toLocaleString()} ingest_total
                </p>
              ) : null}
            </div>
          ) : (
            "—"
          )}
        </StatTile>
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

const STEP_CHART_COLORS = [
  "hsl(221, 83%, 48%)",
  "hsl(142, 76%, 36%)",
  "hsl(25, 95%, 45%)",
  "hsl(280, 65%, 48%)",
  "hsl(199, 89%, 42%)",
  "hsl(48, 96%, 38%)",
];

function IssuesByStepChart({ issues }: { issues: ScrapeIssue[] }) {
  const rows = aggregateIssuesByStep(issues);
  const data = rows.map((r, i) => ({
    ...r,
    fill: STEP_CHART_COLORS[i % STEP_CHART_COLORS.length],
  }));

  const chartConfig = {
    count: { label: "Issues", color: "hsl(221, 83%, 53%)" },
  } satisfies ChartConfig;

  if (data.length === 0) {
    return null;
  }

  return (
    <ChartCard
      title="Issues by step"
      description="Pipeline step where each issue was recorded"
      chartConfig={chartConfig}
      chartClassName="h-[min(320px,28vh)] min-h-[200px]"
    >
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 8, right: 20, left: 4, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tickLine={false} axisLine={false} fontSize={11} />
        <YAxis
          type="category"
          dataKey="step"
          width={120}
          tickLine={false}
          axisLine={false}
          fontSize={10}
          tickFormatter={(v) =>
            String(v).length > 18 ? `${String(v).slice(0, 16)}…` : String(v)
          }
        />
        <ChartTooltip
          content={<ChartTooltipContent />}
          formatter={(value: number) => [value, "Issues"]}
          labelFormatter={(_, payload) => {
            const p = payload?.[0]?.payload as { step?: string } | undefined;
            return p?.step ?? "";
          }}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={26}>
          {data.map((d) => (
            <Cell key={d.step} fill={d.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartCard>
  );
}

function IssuesByMessageChart({ issues }: { issues: ScrapeIssue[] }) {
  const rows = aggregateIssuesByMessage(issues, 16);
  const data = rows.map((r, i) => ({
    ...r,
    fill: STEP_CHART_COLORS[i % STEP_CHART_COLORS.length],
  }));

  const chartConfig = {
    count: { label: "Count", color: "hsl(221, 83%, 53%)" },
  } satisfies ChartConfig;

  if (data.length === 0) {
    return null;
  }

  return (
    <ChartCard
      title="Top issue messages"
      description="Grouped identical messages (hover for full text)"
      chartConfig={chartConfig}
      chartClassName="h-[min(400px,40vh)] min-h-[220px]"
    >
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 8, right: 16, left: 4, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tickLine={false} axisLine={false} fontSize={11} />
        <YAxis
          type="category"
          dataKey="shortLabel"
          width={200}
          tickLine={false}
          axisLine={false}
          fontSize={9}
        />
        <ChartTooltip
          content={<ChartTooltipContent />}
          formatter={(value: number) => [value, "Count"]}
          labelFormatter={(_, payload) => {
            const p = payload?.[0]?.payload as { message?: string } | undefined;
            return p?.message ?? "";
          }}
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={22}>
          {data.map((d) => (
            <Cell key={d.message} fill={d.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartCard>
  );
}

function IssueSeverityChart({ issues }: { issues: ScrapeIssue[] }) {
  const counts = new Map<string, number>();
  for (const i of issues) {
    const s = (i.severity ?? "unknown").toUpperCase();
    counts.set(s, (counts.get(s) ?? 0) + 1);
  }
  const data = Array.from(counts.entries()).map(([name, value]) => ({
    name,
    value,
    fill:
      name === "FATAL"
        ? "hsl(0, 72%, 45%)"
        : name === "ERROR" || name === "ERR"
          ? "hsl(25, 95%, 48%)"
          : "hsl(221, 83%, 53%)",
  }));

  const chartConfig = {
    value: { label: "Issues", color: "hsl(221, 83%, 53%)" },
  } satisfies ChartConfig;

  if (data.length === 0) {
    return null;
  }

  return (
    <ChartCard
      title="Issues by severity"
      description={`${issues.length} issue(s) logged`}
      chartConfig={chartConfig}
      chartClassName="h-[180px]"
    >
      <BarChart
        layout="vertical"
        data={data}
        margin={{ top: 8, right: 24, left: 8, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} />
        <YAxis
          type="category"
          dataKey="name"
          width={72}
          tickLine={false}
          axisLine={false}
          fontSize={11}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={28}>
          {data.map((d) => (
            <Cell key={d.name} fill={d.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartCard>
  );
}

function issueTargetUrl(issue: ScrapeIssue): string | null {
  const u = issue.url?.trim();
  return u && u.length > 0 ? u : null;
}

const SEVERITY_TITLE_ORDER = [
  "FATAL",
  "ERROR",
  "WARN",
  "INFO",
  "DEBUG",
] as const;

function normalizeSeverityKey(severity: string | undefined): string {
  const t = (severity ?? "").trim().toUpperCase();
  return t || "OTHER";
}

function severitySectionSortKey(key: string): number {
  const i = SEVERITY_TITLE_ORDER.indexOf(
    key as (typeof SEVERITY_TITLE_ORDER)[number],
  );
  if (i >= 0) return i;
  if (key === "OTHER") return 90;
  return 50 + (key.charCodeAt(0) % 40);
}

function groupIssuesBySeverityThenMessage(issues: ScrapeIssue[]): {
  severityKey: string;
  severityLabel: string;
  messageGroups: { message: string; rows: ScrapeIssue[] }[];
  totalInSeverity: number;
}[] {
  const bySev = new Map<string, ScrapeIssue[]>();
  for (const issue of issues) {
    const k = normalizeSeverityKey(issue.severity);
    if (!bySev.has(k)) bySev.set(k, []);
    bySev.get(k)!.push(issue);
  }

  const sevKeys = [...bySev.keys()].sort((a, b) => {
    const da = severitySectionSortKey(a);
    const db = severitySectionSortKey(b);
    if (da !== db) return da - db;
    return a.localeCompare(b);
  });

  return sevKeys.map((severityKey) => {
    const list = bySev.get(severityKey)!;
    const byMsg = new Map<string, ScrapeIssue[]>();
    for (const issue of list) {
      const mk = (issue.message ?? "").trim() || "(no message)";
      if (!byMsg.has(mk)) byMsg.set(mk, []);
      byMsg.get(mk)!.push(issue);
    }
    const messageKeys = [...byMsg.keys()].sort((a, b) => {
      const ca = byMsg.get(a)!.length;
      const cb = byMsg.get(b)!.length;
      if (cb !== ca) return cb - ca;
      return a.localeCompare(b);
    });
    return {
      severityKey,
      severityLabel:
        severityKey === "OTHER" ? "Other / unset severity" : severityKey,
      messageGroups: messageKeys.map((message) => ({
        message,
        rows: byMsg.get(message)!,
      })),
      totalInSeverity: list.length,
    };
  });
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

function IssueRowCells({ issue }: { issue: ScrapeIssue }) {
  const targetUrl = issueTargetUrl(issue);
  const isHttp = targetUrl != null && /^https?:\/\//i.test(targetUrl);
  return (
    <TableRow>
      <TableCell className="text-xs align-top break-all max-w-[min(420px,45vw)]">
        {targetUrl ? (
          isHttp ? (
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-700 hover:underline inline-flex items-start gap-1"
            >
              <ExternalLink className="h-3 w-3 shrink-0 mt-0.5" aria-hidden />
              {targetUrl}
            </a>
          ) : (
            <span className="font-mono text-muted-foreground">{targetUrl}</span>
          )
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell className="text-xs hidden sm:table-cell font-mono whitespace-nowrap align-top">
        {issue.step ?? "—"}
      </TableCell>
      <TableCell className="text-xs hidden md:table-cell font-mono align-top">
        {issue.fixtureKey ?? "—"}
      </TableCell>
      <TableCell className="text-xs hidden lg:table-cell font-mono whitespace-nowrap align-top">
        {issue.failureClass ?? "—"}
      </TableCell>
      <TableCell className="text-xs hidden xl:table-cell text-center align-top">
        {issue.retryable === true
          ? "yes"
          : issue.retryable === false
            ? "no"
            : "—"}
      </TableCell>
      <TableCell className="text-xs hidden xl:table-cell text-center align-top">
        {issue.selectorDriftSignal === true
          ? "yes"
          : issue.selectorDriftSignal === false
            ? "no"
            : "—"}
      </TableCell>
    </TableRow>
  );
}

function IssuesGroupedTableHeader() {
  return (
    <TableHeader>
      <TableRow className="bg-slate-50 hover:bg-slate-50">
        <TableHead className="sticky top-0 z-10 min-w-[180px] max-w-[min(420px,45vw)] bg-slate-50 text-xs">
          URL
        </TableHead>
        <TableHead className="sticky top-0 z-10 hidden bg-slate-50 text-xs sm:table-cell">
          Step
        </TableHead>
        <TableHead className="sticky top-0 z-10 hidden bg-slate-50 text-xs md:table-cell">
          Fixture
        </TableHead>
        <TableHead className="sticky top-0 z-10 hidden bg-slate-50 text-xs lg:table-cell">
          Class
        </TableHead>
        <TableHead className="sticky top-0 z-10 hidden bg-slate-50 text-center text-xs xl:table-cell">
          Retry
        </TableHead>
        <TableHead className="sticky top-0 z-10 hidden bg-slate-50 text-center text-xs xl:table-cell">
          Drift
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}

function IssuesDetailTable({ issues }: { issues: ScrapeIssue[] }) {
  if (issues.length === 0) {
    return <p className="text-sm text-muted-foreground">No issues recorded.</p>;
  }

  const sections = groupIssuesBySeverityThenMessage(issues);

  return (
    <div className="space-y-10">
      {sections.map((section) => (
        <section
          key={section.severityKey}
          className="space-y-5"
          aria-labelledby={`issue-sev-${section.severityKey}`}
        >
          <div className="flex flex-wrap items-center gap-3 border-b border-border pb-2">
            <h3
              id={`issue-sev-${section.severityKey}`}
              className="text-lg font-semibold font-mono tracking-tight text-foreground"
            >
              {section.severityLabel}
            </h3>
            <Badge
              variant="outline"
              className={`text-xs tabular-nums ${severitySectionBadgeClass(section.severityKey)}`}
            >
              {section.totalInSeverity}{" "}
              {section.totalInSeverity === 1 ? "issue" : "issues"}
            </Badge>
          </div>

          <div className="space-y-6 pl-0 sm:pl-1">
            {section.messageGroups.map(({ message, rows }, mi) => (
              <div
                key={`${section.severityKey}-msg-${mi}`}
                className="space-y-2"
              >
                <div>
                  <p className="text-sm font-medium text-foreground leading-snug break-words">
                    {message}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {rows.length} row{rows.length === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="rounded-md border overflow-x-auto max-h-[min(400px,50vh)] overflow-y-auto">
                  <Table>
                    <IssuesGroupedTableHeader />
                    <TableBody>
                      {rows.map((issue, ri) => (
                        <IssueRowCells
                          key={`${section.severityKey}-${message}-${ri}-${issue.fixtureKey ?? ""}-${issue.step ?? ""}`}
                          issue={issue}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
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
    <details className="rounded-lg border bg-card">
      <summary className="cursor-pointer text-sm font-medium px-3 py-2 hover:bg-muted/40">
        metadata.metrics snapshot (same numbers as charts when mirrored)
      </summary>
      <div className="px-3 pb-3">
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
    </details>
  );
}

/** Verification: snapshot table, extra keys only (stats live in At a glance). */
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

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-foreground">
        Metadata verification
      </p>
      <p className="text-xs text-muted-foreground">
        Cross-check{" "}
        <code className="rounded bg-muted px-1">metadata.metrics</code> against
        the charts above. Any keys below are additional fields on the completion
        blob (not shown in At a glance).
      </p>

      <MetadataMetricsSnapshot metricsUnknown={metadata.metrics} />

      {extraEntries.length > 0 && (
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
      )}
    </div>
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
          <p className="text-sm font-medium text-foreground">Outcome charts</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FixturesOutcomeChart metrics={metrics} />
            <IngestOutcomeChart metrics={metrics} />
          </div>
        </div>
      )}

      {issues.length > 0 && (
        <div
          id="job-completion-issue-analysis"
          className="space-y-4 scroll-mt-24"
        >
          <div>
            <p className="text-sm font-medium text-foreground">
              Issue analysis
            </p>
            <p className="text-xs text-muted-foreground mt-1 max-w-3xl">
              Same {issues.length} record{issues.length === 1 ? "" : "s"} as the
              Issues count above: each row is a problem the scraper logged
              (timeout, 404, ingest failure, detached frame, etc.). The{" "}
              <strong className="text-foreground">URL</strong> column is the
              page that was being scraped when the scraper includes{" "}
              <code className="rounded bg-muted px-1 text-[10px]">url</code> on
              the issue; if it shows —, the payload did not include a target URL
              for that row.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
            <IssueSeverityChart issues={issues} />
            <IssuesByStepChart issues={issues} />
            <IssuesByMessageChart issues={issues} />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">All issues</p>
            <p className="text-xs text-muted-foreground">
              Grouped by severity, then by message. Each message has its own
              table (URL, step, fixture, …).
            </p>
            <IssuesDetailTable issues={issues} />
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

      {metadata && (
        <details className="text-xs group">
          <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
            Raw metadata JSON (full blob)
          </summary>
          <pre className="mt-2 p-3 rounded-md bg-muted/60 overflow-x-auto text-[11px] max-h-[min(70vh,560px)] overflow-y-auto">
            {JSON.stringify(metadata, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
