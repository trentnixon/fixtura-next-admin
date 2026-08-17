"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bell,
  Bug,
  CalendarDays,
  CircleAlert,
  RefreshCw,
  Target,
  TrendingUp,
} from "lucide-react";
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts";
import ChartCard from "@/components/modules/charts/ChartCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface OperationalMetricProps {
  label: string;
  value: string | number;
  meta: string;
  icon: ReactNode;
  tone: string;
}

function OperationalMetric({
  label,
  value,
  meta,
  icon,
  tone,
}: OperationalMetricProps) {
  return (
    <Card className={cn("border shadow-sm", tone)}>
      <CardContent className="flex min-h-[96px] items-center gap-3 p-3.5">
        <div className="rounded-md bg-white/75 p-2">{icon}</div>
        <div className="min-w-0">
          <div className="text-xs font-medium opacity-75">{label}</div>
          <div className="truncate text-xl font-bold leading-tight tabular-nums">
            {typeof value === "number" ? value.toLocaleString() : value}
          </div>
          <div className="truncate text-xs opacity-75">{meta}</div>
        </div>
      </CardContent>
    </Card>
  );
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

  return (
    <div id="notification-health" className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-end">
        <div className="flex items-center gap-2 pb-2">
          <Switch
            id="notification-health-custom"
            checked={customRange}
            onCheckedChange={onCustomRangeChange}
          />
          <Label htmlFor="notification-health-custom">Custom range</Label>
        </div>

        {!customRange ? (
          <Select
            value={String(presetDays)}
            onValueChange={(value) =>
              onPresetDaysChange(Number(value) as NotificationHealthPresetDays)
            }
          >
            <SelectTrigger
              id="notification-range"
              aria-label="Notification period"
              className="w-[170px]"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRESET_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <div className="flex flex-wrap items-end gap-2">
            <div className="space-y-1">
              <Label htmlFor="nh-from" className="text-xs">
                From (UTC)
              </Label>
              <Input
                id="nh-from"
                type="date"
                value={dateFrom}
                onChange={(event) => onDateFromChange(event.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="nh-to" className="text-xs">
                To (UTC)
              </Label>
              <Input
                id="nh-to"
                type="date"
                value={dateTo}
                onChange={(event) => onDateToChange(event.target.value)}
              />
            </div>
          </div>
        )}

        {issuesLinkQuery ? (
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link href={buildNotificationIssuesHref(issuesLinkQuery)}>
              View issues
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        ) : null}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching || !queryEnabled}
          className="gap-2"
        >
          <RefreshCw className={cn("h-4 w-4", isFetching && "animate-spin")} />
          Refresh
        </Button>
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
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <OperationalMetric
              label="Fatal notifications"
              value={data.notifications.fatalCount}
              meta={`${share(data.notifications.fatalCount, notificationCount)} of notifications`}
              icon={<AlertTriangle className="h-4 w-4" />}
              tone="border-error-200 bg-error-50 text-error-800"
            />
            <OperationalMetric
              label="Issue rows"
              value={issueCount}
              meta={`${data.issues.retryableCount.toLocaleString()} retryable · ${share(data.issues.retryableCount, issueCount)}`}
              icon={<Bell className="h-4 w-4" />}
              tone="border-warning-200 bg-warning-50 text-warning-800"
            />
            <OperationalMetric
              label="Fixtures failed"
              value={data.metricsSums.fixturesFailed}
              meta={`${data.metricsSums.fixturesTotal.toLocaleString()} fixtures in failing runs`}
              icon={<Activity className="h-4 w-4" />}
              tone="border-info-200 bg-info-50 text-info-800"
            />
            <OperationalMetric
              label="Weighted error rate"
              value={formatRate(data.rates.weightedFixtureErrorRate)}
              meta={`${data.issues.selectorDriftCount.toLocaleString()} selector drift signals`}
              icon={<TrendingUp className="h-4 w-4" />}
              tone="border-slate-200 bg-slate-50 text-slate-800"
            />
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">
            <ChartCard
              title="Notifications over time"
              description="Daily UTC buckets comparing notification volume with failed fixtures"
              icon={TrendingUp}
              chartConfig={NOTIFICATION_HEALTH_CHART_CONFIG}
              chartClassName="h-[320px]"
              summaryStats={[
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
              emptyStateMessage="No notification timeline for this date range"
            >
              {timelineData.length > 0 ? (
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
                    labelFormatter={(label) => formatBucketLabel(String(label))}
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
              ) : null}
            </ChartCard>

            <Card className="border-slate-200 shadow-none">
              <CardHeader className="p-4 pb-3">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-base">Needs attention</CardTitle>
                  <Badge variant="outline">Top signals</Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 px-4 pb-4 pt-0">
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
                  <div className="rounded-md border border-dashed border-slate-200 py-10 text-center text-sm text-muted-foreground">
                    No failure signals need attention in this date range.
                  </div>
                )}

                {data.issues.selectorDriftCount > 0 && issuesLinkQuery ? (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <Link
                      href={buildNotificationIssuesHref(issuesLinkQuery, {
                        selectorDrift: true,
                      })}
                    >
                      Review {data.issues.selectorDriftCount.toLocaleString()}{" "}
                      selector drift signals
                    </Link>
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  );
}
