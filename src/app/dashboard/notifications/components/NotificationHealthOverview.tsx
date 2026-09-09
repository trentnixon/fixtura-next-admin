"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bell,
  Bug,
  CalendarDays,
  CircleAlert,
  ListFilter,
  RefreshCw,
  Target,
  TrendingUp,
} from "lucide-react";
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts";
import ChartSummaryStats from "@/components/modules/charts/ChartSummaryStats";
import { DashboardLinkButton } from "@/app/dashboard/components/live-snapshot/DashboardLinkButton";
import {
  OverviewDataWorkspace,
  type WorkspaceMetricTile,
} from "@/app/dashboard/components/live-snapshot/OverviewDataWorkspace";
import { OverviewRecordPanel } from "@/app/dashboard/components/live-snapshot/OverviewRecordPanel";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { LabeledSegmentedControl } from "@/components/ui-library/forms/LabeledSegmentedControl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import ErrorState from "@/components/ui-library/states/ErrorState";
import LoadingState from "@/components/ui-library/states/LoadingState";
import { cn } from "@/lib/utils";
import type {
  NotificationHealthData,
  NotificationHealthMeta,
  NotificationHealthPresetDays,
} from "@/types/notificationHealth";
import type { NotificationIssuesLinkQuery } from "@/types/notificationIssues";
import { buildNotificationIssuesHref } from "../issues/utils/notificationIssuesUrl";
import {
  formatBucketLabel,
  formatRate,
  NOTIFICATION_HEALTH_CHART_CONFIG,
  PRESET_OPTIONS,
  sortRecordEntries,
} from "./notificationHealthUi";

export interface NotificationHealthOverviewProps {
  customRange: boolean;
  onCustomRangeChange: (value: boolean) => void;
  presetDays: NotificationHealthPresetDays;
  onPresetDaysChange: (days: NotificationHealthPresetDays) => void;
  dateFrom: string;
  onDateFromChange: (value: string) => void;
  dateTo: string;
  onDateToChange: (value: string) => void;
  queryEnabled: boolean;
  data: NotificationHealthData | undefined;
  meta: NotificationHealthMeta | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
  isFetching: boolean;
  issuesLinkQuery?: NotificationIssuesLinkQuery;
}

function share(count: number, total: number): string {
  if (total <= 0) return "0%";
  return `${Math.round((count / total) * 100)}%`;
}

export function NotificationHealthOverview({
  customRange,
  onCustomRangeChange,
  presetDays,
  onPresetDaysChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  queryEnabled,
  data,
  meta,
  isLoading,
  error,
  refetch,
  isFetching,
  issuesLinkQuery,
}: NotificationHealthOverviewProps) {
  const timelineData = data?.timeline.byDay ?? [];
  const topStep = sortRecordEntries(data?.issues.byStep ?? {})[0];
  const topService = sortRecordEntries(data?.byDimension.byService ?? {})[0];
  const topMessage = data?.issues.topMessages[0];
  const notificationCount = data?.notifications.notificationCount ?? 0;
  const issueCount = data?.issues.totalIssueRows ?? 0;

  const issueHref = (
    filters?: Record<string, string | number | boolean | undefined>,
  ) =>
    issuesLinkQuery
      ? buildNotificationIssuesHref(issuesLinkQuery, filters)
      : undefined;

  const attentionItems = data
    ? [
        topMessage
          ? {
              label: "Most common message",
              value: topMessage.message,
              meta: `${topMessage.count.toLocaleString()} occurrences`,
              href: issueHref({ message: topMessage.message }),
              icon: CircleAlert,
              tone: "bg-error-50 text-error-700",
            }
          : null,
        topStep
          ? {
              label: "Leading failure step",
              value: topStep.key,
              meta: `${topStep.count.toLocaleString()} issue rows`,
              href: issueHref({ step: topStep.key }),
              icon: Bug,
              tone: "bg-warning-50 text-warning-700",
            }
          : null,
        topService
          ? {
              label: "Most affected service",
              value: topService.key,
              meta: `${topService.count.toLocaleString()} notifications`,
              href: issueHref({ service: topService.key }),
              icon: Target,
              tone: "bg-info-50 text-info-700",
            }
          : null,
      ].filter((item) => item != null)
    : [];

  const metrics = useMemo((): WorkspaceMetricTile[] => {
    if (!data) return [];
    return [
      {
        id: "fatal",
        label: "Fatal notifications",
        value: data.notifications.fatalCount.toLocaleString(),
        meta: `${share(data.notifications.fatalCount, notificationCount)} of notifications`,
      },
      {
        id: "issues",
        label: "Issue rows",
        value: issueCount.toLocaleString(),
        meta: `${data.issues.retryableCount.toLocaleString()} retryable · ${share(data.issues.retryableCount, issueCount)}`,
      },
      {
        id: "fixtures",
        label: "Fixtures failed",
        value: data.metricsSums.fixturesFailed.toLocaleString(),
        meta: `${data.metricsSums.fixturesTotal.toLocaleString()} fixtures in failing runs`,
      },
      {
        id: "error-rate",
        label: "Weighted error rate",
        value: formatRate(data.rates.weightedFixtureErrorRate),
        meta: `${data.issues.selectorDriftCount.toLocaleString()} selector drift signals`,
      },
    ];
  }, [data, issueCount, notificationCount]);

  const presetSegmentOptions = PRESET_OPTIONS.map((option) => ({
    value: String(option.value),
    label: `${option.value}d`,
  }));

  return (
    <div id="notification-health" className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-full border border-slate-200 bg-slate-50/60 px-4 py-2 lg:flex-row lg:flex-wrap lg:items-center">
        <div className="flex shrink-0 items-center gap-2">
          <Switch
            id="notification-health-custom"
            checked={customRange}
            onCheckedChange={onCustomRangeChange}
          />
          <Label htmlFor="notification-health-custom" className="text-sm">
            Custom range
          </Label>
        </div>

        {!customRange ? (
          <LabeledSegmentedControl
            label="Period"
            value={String(presetDays)}
            onValueChange={(value) =>
              onPresetDaysChange(Number(value) as NotificationHealthPresetDays)
            }
            options={presetSegmentOptions}
            className="min-w-0 shrink-0"
            shellClassName="h-auto shrink-0 rounded-full"
            ariaLabel="Notification period"
          />
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <Input
              id="nh-from"
              type="date"
              value={dateFrom}
              onChange={(event) => onDateFromChange(event.target.value)}
              aria-label="From (UTC)"
              className="w-auto rounded-full border-transparent bg-white shadow-none"
            />
            <span className="text-sm text-muted-foreground">–</span>
            <Input
              id="nh-to"
              type="date"
              value={dateTo}
              onChange={(event) => onDateToChange(event.target.value)}
              aria-label="To (UTC)"
              className="w-auto rounded-full border-transparent bg-white shadow-none"
            />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
          {issuesLinkQuery ? (
            <DashboardLinkButton
              href={buildNotificationIssuesHref(issuesLinkQuery)}
              icon={ListFilter}
              trailingIcon="arrow"
            >
              View issues
            </DashboardLinkButton>
          ) : null}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching || !queryEnabled}
            className="gap-2 rounded-full border-slate-200 bg-white text-slate-700 shadow-none hover:bg-slate-100 hover:text-slate-900"
          >
            <RefreshCw
              className={cn("h-4 w-4", isFetching && "animate-spin")}
            />
            Refresh
          </Button>
        </div>
      </div>

      {!queryEnabled && customRange ? (
        <div className="rounded-md border border-warning-200 bg-warning-50 px-4 py-3 text-sm text-warning-900">
          Choose both start and end dates to load health data.
        </div>
      ) : null}

      {meta?.truncated ? (
        <div
          className="rounded-md border border-warning-200 bg-warning-50 px-4 py-3 text-sm text-warning-900"
          role="status"
        >
          <div className="flex gap-2">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <span>
              Results are capped at {meta.maxEntries.toLocaleString()} rows.
              Narrow the date range for complete aggregates.
            </span>
          </div>
        </div>
      ) : null}

      {isLoading ? (
        <LoadingState message="Loading notification health…" />
      ) : null}

      {error && !isLoading ? (
        <ErrorState
          title="Could not load notification health"
          error={error}
          onRetry={() => refetch()}
        />
      ) : null}

      {data && !isLoading ? (
        <>
          <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
            <OverviewRecordPanel
              title="Notifications over time"
              description="Daily UTC buckets comparing notification volume with failed fixtures"
              badge={
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600">
                  {notificationCount.toLocaleString()} total
                </span>
              }
            >
              {timelineData.length > 0 ? (
                <div className="space-y-4">
                  <ChartSummaryStats
                    stats={[
                      {
                        icon: CalendarDays,
                        label: "Date range",
                        value: `${new Date(data.window.from).toLocaleDateString()} – ${new Date(data.window.to).toLocaleDateString()}`,
                      },
                      {
                        icon: Bell,
                        label: "Notifications",
                        value: notificationCount.toLocaleString(),
                      },
                    ]}
                  />
                  <ChartContainer
                    config={NOTIFICATION_HEALTH_CHART_CONFIG}
                    className="h-[320px] w-full"
                  >
                    <LineChart
                      data={timelineData}
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
                        yAxisId="left"
                        tickLine={false}
                        axisLine={false}
                        fontSize={12}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        tickLine={false}
                        axisLine={false}
                        fontSize={12}
                      />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        labelFormatter={(label) =>
                          formatBucketLabel(String(label))
                        }
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="notificationCount"
                        stroke="hsl(221, 83%, 53%)"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        name="Notifications"
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="fixturesFailed"
                        stroke="hsl(0, 72%, 51%)"
                        strokeWidth={2}
                        dot={{ r: 3 }}
                        name="Fixtures failed"
                      />
                    </LineChart>
                  </ChartContainer>
                </div>
              ) : (
                <EmptyState
                  variant="minimal"
                  title="No timeline data"
                  description="No notification timeline for this date range."
                  icon={<TrendingUp className="h-8 w-8 text-muted-foreground" />}
                />
              )}
            </OverviewRecordPanel>

            <OverviewRecordPanel
              title="Needs attention"
              description="Top failure signals in the selected window"
              badge={
                <Badge variant="outline" className="border-slate-200 bg-slate-50">
                  Top signals
                </Badge>
              }
            >
              <div className="flex flex-col gap-2">
                {attentionItems.length > 0 ? (
                  attentionItems.map((item) => {
                    const Icon = item.icon;
                    const content = (
                      <div className="flex items-start gap-3 rounded-md border border-slate-200 p-3 transition hover:border-slate-300 hover:bg-slate-50">
                        <div className={cn("rounded-md p-2", item.tone)}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs text-muted-foreground">
                            {item.label}
                          </div>
                          <div
                            className="truncate text-sm font-semibold text-slate-900"
                            title={item.value}
                          >
                            {item.value}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {item.meta}
                          </div>
                        </div>
                        {item.href ? (
                          <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                        ) : null}
                      </div>
                    );

                    return item.href ? (
                      <Link key={item.label} href={item.href}>
                        {content}
                      </Link>
                    ) : (
                      <div key={item.label}>{content}</div>
                    );
                  })
                ) : (
                  <EmptyState
                    variant="minimal"
                    title="All clear"
                    description="No failure signals need attention in this date range."
                    icon={<Activity className="h-8 w-8 text-muted-foreground" />}
                  />
                )}

                {data.issues.selectorDriftCount > 0 && issuesLinkQuery ? (
                  <DashboardLinkButton
                    href={buildNotificationIssuesHref(issuesLinkQuery, {
                      selectorDrift: true,
                    })}
                    className="w-full justify-center"
                    trailingIcon="arrow"
                  >
                    Review {data.issues.selectorDriftCount.toLocaleString()}{" "}
                    selector drift signals
                  </DashboardLinkButton>
                ) : null}
              </div>
            </OverviewRecordPanel>
          </div>

          <OverviewDataWorkspace
            title="Failure snapshot"
            description={`${new Date(data.window.from).toLocaleDateString()} – ${new Date(data.window.to).toLocaleDateString()} · ${notificationCount.toLocaleString()} notifications`}
            icon={Bell}
            badge={
              data.notifications.fatalCount > 0 ? (
                <Badge
                  variant="outline"
                  className="border-error-200 bg-error-50 text-error-800"
                >
                  {data.notifications.fatalCount.toLocaleString()} fatal
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="border-slate-200 bg-slate-50 text-slate-700"
                >
                  {data.notifications.nonFatalCount.toLocaleString()} non-fatal
                </Badge>
              )
            }
            metrics={metrics}
            columns={4}
            footer={
              <span className="text-xs text-muted-foreground">
                {formatRate(data.rates.avgErrorRate)} average row error rate
              </span>
            }
          />
        </>
      ) : null}
    </div>
  );
}
