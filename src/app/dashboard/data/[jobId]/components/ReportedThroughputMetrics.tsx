"use client";

import { Badge } from "@/components/ui/badge";
import type { LogMetrics } from "@/types/scraperLogs";
import { formatDurationReadable } from "@/utils/chart-formatters";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export const THROUGHPUT_METRIC_KEYS = new Set([
  "fixturesTotal",
  "fixturesSucceeded",
  "fixturesFailed",
  "durationMs",
  "ingest_total",
  "ingest_success",
  "ingest_failed",
  "ingest_retried",
]);

function num(v: unknown): number {
  return typeof v === "number" && !Number.isNaN(v) ? v : 0;
}

function formatSuccessRate(rate: number | null): string {
  if (rate == null || Number.isNaN(rate)) return "—";
  return `${Math.round(rate * 100)}%`;
}

function ThroughputMetricsPanel({
  title,
  description,
  total,
  succeeded,
  failed,
  retried,
}: {
  title: string;
  description: string;
  total: number;
  succeeded: number;
  failed: number;
  retried?: number;
}) {
  const denominator = total > 0 ? total : succeeded + failed;
  const succeededPercent =
    denominator > 0 ? Math.min((succeeded / denominator) * 100, 100) : 0;
  const failedPercent =
    denominator > 0
      ? Math.min((failed / denominator) * 100, 100 - succeededPercent)
      : 0;
  const unreportedPercent = Math.max(0, 100 - succeededPercent - failedPercent);
  const successRate = denominator > 0 ? succeeded / denominator : null;

  const statTiles = [
    { label: "Total", value: total, tone: "text-slate-900" },
    { label: "Succeeded", value: succeeded, tone: "text-emerald-700" },
    { label: "Failed", value: failed, tone: "text-red-700" },
    ...(retried != null
      ? [{ label: "Retried", value: retried, tone: "text-amber-700" }]
      : []),
  ];

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
        <Badge
          variant="outline"
          className="shrink-0 border-slate-200 bg-slate-50 text-slate-700"
        >
          {formatSuccessRate(successRate)} success
        </Badge>
      </div>

      {denominator > 0 ? (
        <div className="mt-4 space-y-2">
          <div
            className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100"
            role="img"
            aria-label={`${succeeded.toLocaleString()} succeeded, ${failed.toLocaleString()} failed`}
          >
            <div
              className="h-full bg-emerald-500"
              style={{ width: `${succeededPercent}%` }}
            />
            <div
              className="h-full bg-red-500"
              style={{ width: `${failedPercent}%` }}
            />
            {unreportedPercent > 0 ? (
              <div
                className="h-full bg-slate-300"
                style={{ width: `${unreportedPercent}%` }}
              />
            ) : null}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Succeeded {Math.round(succeededPercent)}%
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Failed {Math.round(failedPercent)}%
            </span>
            {unreportedPercent > 0 ? (
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-slate-300" />
                Unreported {Math.round(unreportedPercent)}%
              </span>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statTiles.map((tile) => (
          <div
            key={tile.label}
            className="rounded-md border border-slate-200 bg-slate-50/70 px-3 py-2.5"
          >
            <div className="text-xs text-muted-foreground">{tile.label}</div>
            <div
              className={cn(
                "mt-0.5 text-lg font-semibold tabular-nums",
                tile.tone,
              )}
            >
              {tile.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function asLogMetrics(
  metrics: Record<string, unknown> | null | undefined,
): LogMetrics | null {
  if (!metrics || typeof metrics !== "object" || Array.isArray(metrics)) {
    return null;
  }
  return metrics as LogMetrics;
}

interface ReportedMetricsSummaryProps {
  metrics: LogMetrics;
  description?: string;
  fixtureDescription?: string;
  ingestDescription?: string;
}

export function ReportedMetricsSummary({
  metrics,
  description = "Success rates and counts from the completion payload",
  fixtureDescription = "Fixture processing reported on completion",
  ingestDescription = "Downstream ingest reported on completion",
}: ReportedMetricsSummaryProps) {
  const durationMs = num(metrics.durationMs);
  const fixturesTotal = num(metrics.fixturesTotal);
  const fixturesSucceeded = num(metrics.fixturesSucceeded);
  const fixturesFailed = num(metrics.fixturesFailed);
  const ingestTotal = num(metrics.ingest_total);
  const ingestSuccess = num(metrics.ingest_success);
  const ingestFailed = num(metrics.ingest_failed);
  const ingestRetried = num(metrics.ingest_retried);

  const hasFixtures =
    fixturesTotal > 0 || fixturesSucceeded > 0 || fixturesFailed > 0;
  const hasIngest =
    ingestTotal > 0 ||
    ingestSuccess > 0 ||
    ingestFailed > 0 ||
    ingestRetried > 0;
  const hasDuration = durationMs > 0;

  if (!hasFixtures && !hasIngest && !hasDuration) return null;

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-foreground">Reported metrics</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>

      {hasDuration ? (
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/60 px-4 py-3">
          <div className="rounded-md bg-violet-50 p-2 text-violet-700">
            <Clock className="h-4 w-4" aria-hidden />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Scrape duration
            </p>
            <p className="text-xl font-bold tabular-nums text-slate-950">
              {formatDurationReadable(durationMs)}
            </p>
          </div>
        </div>
      ) : null}

      {hasFixtures || hasIngest ? (
        <div
          className={cn(
            "grid gap-4",
            hasFixtures && hasIngest ? "lg:grid-cols-2" : "grid-cols-1",
          )}
        >
          {hasFixtures ? (
            <ThroughputMetricsPanel
              title="Fixtures"
              description={fixtureDescription}
              total={fixturesTotal}
              succeeded={fixturesSucceeded}
              failed={fixturesFailed}
            />
          ) : null}
          {hasIngest ? (
            <ThroughputMetricsPanel
              title="Ingest"
              description={ingestDescription}
              total={ingestTotal}
              succeeded={ingestSuccess}
              failed={ingestFailed}
              retried={ingestRetried}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
