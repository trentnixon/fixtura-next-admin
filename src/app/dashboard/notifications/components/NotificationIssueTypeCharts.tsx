"use client";

import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { AlertTriangle, TrendingUp } from "lucide-react";
import { OverviewRecordPanel } from "@/app/dashboard/components/live-snapshot/OverviewRecordPanel";
import EmptyState from "@/components/ui-library/states/EmptyState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import LoadingState from "@/components/ui-library/states/LoadingState";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useNotificationIssues } from "@/hooks/data-collection/useNotificationIssues";
import { cn } from "@/lib/utils";
import type { FetchNotificationHealthParams } from "@/types/notificationHealth";
import { formatBucketLabel } from "./notificationHealthUi";
import {
  buildIssueTypeTimeline,
  dailyIssueTotals,
  toDailyIssueShare,
  type IssueTypeLane,
  type IssueTypeTimeline,
  type IssueTypeTrend,
} from "./issueTypeTimeline";

const TREND_LABEL: Record<IssueTypeTrend, string> = {
  growing: "Growing",
  steady: "Steady",
  falling: "Falling",
  fixed: "Fixed",
};

const TREND_CLASS: Record<IssueTypeTrend, string> = {
  growing: "text-error-700",
  steady: "text-slate-600",
  falling: "text-success-700",
  fixed: "text-success-800",
};

const LANE_COPY: Record<
  IssueTypeLane,
  { title: string; description: string; empty: string }
> = {
  error: {
    title: "Error types over time",
    description:
      "Daily UTC counts by error message. Page addresses are ignored, so the same error stays one line.",
    empty: "No error issues in this date range.",
  },
  warning: {
    title: "Warning types over time",
    description:
      "Daily UTC counts by warning message. Page addresses are ignored, so the same warning stays one line.",
    empty: "No warning issues in this date range.",
  },
};

function formatIssueShare(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "0%";
  if (value < 1) return "<1%";
  if (value < 10) {
    const rounded = Math.round(value * 10) / 10;
    return Number.isInteger(rounded) ? `${rounded}%` : `${rounded.toFixed(1)}%`;
  }
  return `${Math.round(value)}%`;
}

interface NotificationIssueTypeChartsProps {
  params: FetchNotificationHealthParams;
  enabled: boolean;
}

function IssueTypeChart({
  lane,
  timeline,
}: {
  lane: IssueTypeLane;
  timeline: IssueTypeTimeline;
}) {
  const copy = LANE_COPY[lane];
  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    for (const series of timeline.series) {
      config[series.key] = { label: series.label, color: series.color };
    }
    return config;
  }, [timeline.series]);

  const showDots = timeline.points.length <= 21;

  return (
    <OverviewRecordPanel
      title={copy.title}
      description={copy.description}
      badge={
        timeline.total > 0 ? (
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600">
            {timeline.total.toLocaleString()} issues
          </span>
        ) : null
      }
    >
      {timeline.series.length > 0 ? (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {timeline.series.map((series) => (
              <span
                key={series.key}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: series.color }}
                />
                <span className="max-w-[280px] truncate" title={series.label}>
                  {series.label}
                </span>
                <span className={cn("font-medium", TREND_CLASS[series.trend])}>
                  {TREND_LABEL[series.trend]}
                </span>
              </span>
            ))}
          </div>
          <ChartContainer config={chartConfig} className="h-[320px] w-full">
            <LineChart
              data={timeline.points}
              margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="bucket"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={formatBucketLabel}
                angle={-45}
                textAnchor="end"
                height={60}
                fontSize={12}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                fontSize={12}
                width={36}
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                labelFormatter={(label) => formatBucketLabel(String(label))}
              />
              {timeline.series.map((series) => (
                <Line
                  key={series.key}
                  type="monotone"
                  dataKey={series.key}
                  name={series.label}
                  stroke={`var(--color-${series.key})`}
                  strokeWidth={2}
                  dot={showDots ? { r: 2 } : false}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ChartContainer>
        </div>
      ) : (
        <EmptyState
          variant="minimal"
          title="No issues"
          description={copy.empty}
          icon={<TrendingUp className="h-8 w-8 text-muted-foreground" />}
        />
      )}
    </OverviewRecordPanel>
  );
}

function IssueMixColumn({
  title,
  timeline,
  issueTotal,
}: {
  title: string;
  timeline: IssueTypeTimeline;
  issueTotal: number;
}) {
  const share =
    issueTotal > 0 ? (timeline.total / issueTotal) * 100 : 0;

  return (
    <div className="flex flex-col gap-3">
      <div>
        <div className="text-xs font-medium text-muted-foreground">{title}</div>
        <div className="mt-1 text-2xl font-bold leading-none text-slate-950">
          {formatIssueShare(share)}
        </div>
        <div className="mt-2 text-xs text-slate-500">
          {timeline.total.toLocaleString()} of {issueTotal.toLocaleString()}{" "}
          reported issues
        </div>
      </div>
      {timeline.series.length > 0 ? (
        <div className="space-y-2">
          {timeline.series.map((series) => {
            const typeShare =
              issueTotal > 0 ? (series.total / issueTotal) * 100 : 0;
            return (
              <div
                key={series.key}
                className="flex items-center gap-3 text-sm"
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: series.color }}
                />
                <span className="min-w-0 flex-1 truncate" title={series.label}>
                  {series.label}
                </span>
                <span className="shrink-0 tabular-nums text-slate-900">
                  {formatIssueShare(typeShare)}
                </span>
                <span className="w-14 shrink-0 text-right text-xs tabular-nums text-slate-500">
                  {series.total.toLocaleString()}
                </span>
                <span
                  className={cn(
                    "w-16 shrink-0 text-right text-xs font-medium",
                    TREND_CLASS[series.trend],
                  )}
                >
                  {TREND_LABEL[series.trend]}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">None in this range.</p>
      )}
    </div>
  );
}

function IssueMixStats({
  errors,
  warnings,
  issueTotal,
}: {
  errors: IssueTypeTimeline;
  warnings: IssueTypeTimeline;
  issueTotal: number;
}) {
  return (
    <OverviewRecordPanel
      title="Issue mix"
      description="Share of reported errors and warnings in this range. Clean scrapes are not stored here, so this is not a percent of every fixture processed."
      badge={
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600">
          {issueTotal.toLocaleString()} issues
        </span>
      }
    >
      <div className="grid gap-6 md:grid-cols-2">
        <IssueMixColumn title="Errors" timeline={errors} issueTotal={issueTotal} />
        <IssueMixColumn
          title="Warnings"
          timeline={warnings}
          issueTotal={issueTotal}
        />
      </div>
    </OverviewRecordPanel>
  );
}

export function NotificationIssueTypeCharts({
  params,
  enabled,
}: NotificationIssueTypeChartsProps) {
  const { data, meta, isLoading, error, refetch } = useNotificationIssues({
    params,
    enabled,
    includeArtifacts: false,
  });

  const window = useMemo(
    () =>
      data
        ? { fromMs: data.window.fromMs, toMs: data.window.toMs }
        : undefined,
    [data],
  );

  const errors = useMemo(
    () => buildIssueTypeTimeline(data?.issues ?? [], "error", window),
    [data?.issues, window],
  );
  const warnings = useMemo(
    () => buildIssueTypeTimeline(data?.issues ?? [], "warning", window),
    [data?.issues, window],
  );
  const dayTotals = useMemo(
    () => dailyIssueTotals([errors, warnings]),
    [errors, warnings],
  );
  const errorShare = useMemo(
    () => toDailyIssueShare(errors, dayTotals),
    [errors, dayTotals],
  );
  const warningShare = useMemo(
    () => toDailyIssueShare(warnings, dayTotals),
    [warnings, dayTotals],
  );
  const issueTotal = errors.total + warnings.total;

  if (!enabled) return null;

  const incomplete =
    meta?.notificationsTruncated === true ||
    (data != null && data.issues.length < data.pagination.totalIssues);

  return (
    <div className="flex flex-col gap-4">
      {incomplete ? (
        <div
          className="rounded-md border border-warning-200 bg-warning-50 px-4 py-3 text-sm text-warning-900"
          role="status"
        >
          <div className="flex gap-2">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <span>
              Type trends use a capped issue sample. Narrow the date range for
              a complete picture.
            </span>
          </div>
        </div>
      ) : null}

      {isLoading ? <LoadingState message="Loading issue type trends…" /> : null}

      {error && !isLoading ? (
        <ErrorState
          title="Could not load issue type trends"
          error={error}
          onRetry={() => refetch()}
        />
      ) : null}

      {data && !isLoading ? (
        <>
          <div className="grid gap-4 xl:grid-cols-2">
            <IssueTypeChart lane="error" timeline={errors} />
            <IssueTypeChart lane="warning" timeline={warnings} />
          </div>
          <IssueMixStats
            errors={errorShare}
            warnings={warningShare}
            issueTotal={issueTotal}
          />
        </>
      ) : null}
    </div>
  );
}
