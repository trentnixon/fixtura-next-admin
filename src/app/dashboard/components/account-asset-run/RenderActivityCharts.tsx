"use client";

import type { ReactNode } from "react";
import { Activity, Clock, Gauge, Timer } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { formatDurationMs } from "@/lib/account-health/globalRunAnalytics";
import { isAssetRunActive } from "@/lib/account-asset-run/displayRules";
import { parseRunKeyStartedAt } from "@/lib/account-asset-run/globalRunAnalytics";
import { useLiveRunClock } from "@/hooks/account-asset-run/useLiveRunClock";
import type {
  AccountAssetRunRenderActivityMeta,
  AccountAssetRunRenderActivityRow,
} from "@/types/accountAssetRun";

const chartConfig = {
  minutes: {
    label: "Time taken",
    color: "hsl(221, 83%, 53%)",
  },
} satisfies ChartConfig;

const statusColors = {
  running: "#2563eb",
  completed: "#16a34a",
  failed: "#dc2626",
  other: "#64748b",
} as const;

type TimelineRow = {
  id: number;
  label: string;
  status: string;
  startedAtMs: number;
  finishedAtMs: number;
  durationMs: number;
  durationLabel: string;
};

function parseMs(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const parsed = Date.parse(iso);
  return Number.isFinite(parsed) ? parsed : null;
}

function accountDisplayName(row: AccountAssetRunRenderActivityRow): string {
  const name = row.account.name?.trim();
  return name || `Account ${row.account.id}`;
}

function resolveStartedAtMs(
  row: AccountAssetRunRenderActivityRow,
): number | null {
  return (
    parseMs(row.run.startedAt) ?? parseMs(parseRunKeyStartedAt(row.run.runKey))
  );
}

function resolveFinishedAtMs(
  row: AccountAssetRunRenderActivityRow,
  nowMs: number,
): number | null {
  return (
    parseMs(row.run.finishedAt) ??
    parseMs(row.run.completedAt) ??
    parseMs(row.run.failedAt) ??
    (isAssetRunActive(row.run.status) ? nowMs : null)
  );
}

function resolveDurationMs(
  row: AccountAssetRunRenderActivityRow,
  nowMs: number,
): number | null {
  if (row.run.durationMs != null) return row.run.durationMs;

  const start = resolveStartedAtMs(row);
  const end = resolveFinishedAtMs(row, nowMs);
  if (start == null || end == null || end < start) return null;
  return end - start;
}

function statusColor(status: string): string {
  if (status === "completed") return statusColors.completed;
  if (status === "failed") return statusColors.failed;
  if (isAssetRunActive(status)) return statusColors.running;
  return statusColors.other;
}

function formatShortTime(ms: number): string {
  return new Date(ms).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildTimelineRows(
  rows: AccountAssetRunRenderActivityRow[],
  nowMs: number,
): TimelineRow[] {
  return rows
    .map((row) => {
      const startedAtMs = resolveStartedAtMs(row);
      const finishedAtMs = resolveFinishedAtMs(row, nowMs);
      const durationMs = resolveDurationMs(row, nowMs);

      if (
        startedAtMs == null ||
        finishedAtMs == null ||
        durationMs == null ||
        finishedAtMs < startedAtMs
      ) {
        return null;
      }

      return {
        id: row.run.id,
        label: accountDisplayName(row),
        status: row.run.status,
        startedAtMs,
        finishedAtMs,
        durationMs,
        durationLabel: `${formatDurationMs(durationMs)}${
          isAssetRunActive(row.run.status) ? " running" : ""
        }`,
      };
    })
    .filter((row): row is TimelineRow => row !== null);
}

function percentile(sorted: number[], p: number): number | null {
  if (sorted.length === 0) return null;
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(index, sorted.length - 1))] ?? null;
}

interface RenderActivityChartsProps {
  rows: AccountAssetRunRenderActivityRow[];
  meta?: AccountAssetRunRenderActivityMeta;
}

export function RenderActivityCharts({
  rows,
  meta,
}: RenderActivityChartsProps) {
  const hasActive = rows.some((row) => isAssetRunActive(row.run.status));
  const nowMs = useLiveRunClock(hasActive);
  const timelineRows = buildTimelineRows(rows, nowMs);
  const slowestRows = [...timelineRows]
    .sort((a, b) => b.durationMs - a.durationMs)
    .slice(0, 10);

  if (timelineRows.length === 0) {
    return (
      <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-muted-foreground">
        No timing data available for these rows yet.
      </div>
    );
  }

  const durations = timelineRows
    .map((row) => row.durationMs)
    .sort((a, b) => a - b);
  const averageMs = Math.round(
    durations.reduce((sum, value) => sum + value, 0) / durations.length,
  );
  const longest = slowestRows[0];
  const medianMs = percentile(durations, 50);
  const runningCount = timelineRows.filter((row) =>
    isAssetRunActive(row.status),
  ).length;
  const firstStartedAtMs = Math.min(
    ...timelineRows.map((row) => row.startedAtMs),
  );
  const lastFinishedAtMs = Math.max(
    ...timelineRows.map((row) => row.finishedAtMs),
  );
  const totalProcessingSpanMs = Math.max(
    lastFinishedAtMs - firstStartedAtMs,
    0,
  );

  const slowestChartData = slowestRows.map((row) => ({
    name: `#${row.id}`,
    label: row.label,
    status: row.status,
    minutes: Math.round((row.durationMs / 60_000) * 10) / 10,
    durationLabel: row.durationLabel,
    fill: statusColor(row.status),
  }));

  const domainStart =
    parseMs(meta?.from) ??
    Math.min(...timelineRows.map((row) => row.startedAtMs));
  const domainEnd =
    parseMs(meta?.to) ??
    Math.max(...timelineRows.map((row) => row.finishedAtMs), nowMs);
  const domainSpan = Math.max(domainEnd - domainStart, 1);
  const timelineDisplayRows = [...timelineRows]
    .sort((a, b) => a.startedAtMs - b.startedAtMs)
    .slice(0, 18);
  const tickCount = 4;
  const ticks = Array.from({ length: tickCount + 1 }, (_, index) => {
    const value = domainStart + (domainSpan / tickCount) * index;
    return {
      value,
      left: `${(index / tickCount) * 100}%`,
      label: formatShortTime(value),
    };
  });

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
        <TimingStat
          label="Longest"
          value={longest?.durationLabel ?? "-"}
          detail={longest ? `${longest.label} - run #${longest.id}` : "No runs"}
          icon={<Timer className="h-4 w-4 text-amber-600" />}
        />
        <TimingStat
          label="Avg org time"
          value={formatDurationMs(averageMs)}
          detail={`${timelineRows.length} timed runs in view`}
          icon={<Gauge className="h-4 w-4 text-blue-600" />}
        />
        <TimingStat
          label="Total span"
          value={formatDurationMs(totalProcessingSpanMs)}
          detail={`${formatShortTime(firstStartedAtMs)} to ${formatShortTime(
            lastFinishedAtMs,
          )}`}
          icon={<Activity className="h-4 w-4 text-emerald-600" />}
        />
        <TimingStat
          label="Median"
          value={formatDurationMs(medianMs)}
          detail="Typical visible run"
          icon={<Clock className="h-4 w-4 text-violet-600" />}
        />
        <TimingStat
          label="Running"
          value={String(runningCount)}
          detail="Live elapsed bars use current time"
          icon={<Timer className="h-4 w-4 text-slate-600" />}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-md border border-slate-200 bg-white p-4">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Slowest runs
            </h3>
            <p className="text-xs text-muted-foreground">
              Longest durations from the currently selected rows.
            </p>
          </div>
          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <BarChart
              data={slowestChartData}
              layout="vertical"
              margin={{ top: 4, right: 16, left: 0, bottom: 4 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-slate-200"
              />
              <XAxis type="number" tick={{ fontSize: 11 }} unit="m" />
              <YAxis
                type="category"
                dataKey="name"
                width={54}
                tick={{ fontSize: 11 }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(_, payload) => {
                      const row = payload?.[0]?.payload as
                        | (typeof slowestChartData)[0]
                        | undefined;
                      return row ? `${row.label} - run ${row.name}` : "";
                    }}
                    formatter={(_, __, item) => {
                      const row = item.payload as (typeof slowestChartData)[0];
                      return [row.durationLabel, "Time taken"];
                    }}
                  />
                }
              />
              <Bar dataKey="minutes" name="Time taken" radius={[0, 3, 3, 0]}>
                {slowestChartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-4">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Started to ended overlap
            </h3>
            <p className="text-xs text-muted-foreground">
              Bars share one time scale so simultaneous work lines up.
            </p>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[620px]">
              <div className="relative ml-[150px] h-6 border-b border-slate-200">
                {ticks.map((tick) => (
                  <div
                    key={tick.value}
                    className="absolute top-0 -translate-x-1/2 text-[10px] text-muted-foreground"
                    style={{ left: tick.left }}
                  >
                    {tick.label}
                  </div>
                ))}
              </div>
              <div className="space-y-2 pt-2">
                {timelineDisplayRows.map((row) => {
                  const left = Math.max(
                    0,
                    ((row.startedAtMs - domainStart) / domainSpan) * 100,
                  );
                  const right = Math.min(
                    100,
                    ((row.finishedAtMs - domainStart) / domainSpan) * 100,
                  );
                  const width = Math.max(right - left, 0.8);

                  return (
                    <div
                      key={row.id}
                      className="grid grid-cols-[140px_1fr] gap-3"
                    >
                      <div className="min-w-0 text-right">
                        <div className="truncate text-xs font-medium text-slate-900">
                          {row.label}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          #{row.id} - {row.durationLabel}
                        </div>
                      </div>
                      <div
                        className="relative h-9 rounded-sm bg-slate-50"
                        title={`${row.label} #${row.id}: ${formatShortTime(
                          row.startedAtMs,
                        )} to ${formatShortTime(row.finishedAtMs)} - ${
                          row.durationLabel
                        }`}
                      >
                        {ticks.map((tick) => (
                          <span
                            key={`${row.id}-${tick.value}`}
                            className="absolute top-0 h-full border-l border-slate-200"
                            style={{ left: tick.left }}
                          />
                        ))}
                        <span
                          className="absolute top-2 h-5 rounded-full"
                          style={{
                            left: `${left}%`,
                            width: `${width}%`,
                            backgroundColor: statusColor(row.status),
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              {timelineRows.length > timelineDisplayRows.length && (
                <p className="mt-3 text-xs text-muted-foreground">
                  Showing first {timelineDisplayRows.length} runs by start time.
                  Increase page size or page through for more.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimingStat({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: ReactNode;
}) {
  return (
    <div className="flex min-h-[104px] items-center justify-between gap-3 rounded-md border border-slate-200 bg-white px-4 py-3">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 truncate text-lg font-semibold text-slate-900">
          {value}
        </p>
        <p className="truncate text-xs text-muted-foreground">{detail}</p>
      </div>
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-50">
        {icon}
      </div>
    </div>
  );
}
