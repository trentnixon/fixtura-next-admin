"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import ChartCard from "@/components/modules/charts/ChartCard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import type {
  NotificationHealthData,
  NotificationHealthMeta,
  NotificationHealthPresetDays,
} from "@/types/notificationHealth";
import {
  Activity,
  AlertTriangle,
  Bell,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatBucketLabel,
  formatRate,
  NOTIFICATION_HEALTH_CHART_CONFIG,
  PRESET_OPTIONS,
  StatCard,
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
}: NotificationHealthOverviewProps) {
  const timelineData = data?.timeline.byDay ?? [];

  return (
    <div id="notification-health">
    <SectionContainer
      title="Notification health"
      description="Failure notifications from scraper job.completed issues/fatal and direct CMS posts. Empty periods mean no failure notifications—not proof that all scrapes succeeded."
      icon={<Bell className="h-6 w-6 text-slate-600" />}
      action={
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
      }
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Switch
                id="notification-health-custom"
                checked={customRange}
                onCheckedChange={onCustomRangeChange}
              />
              <Label htmlFor="notification-health-custom">
                Custom date range
              </Label>
            </div>
            {!customRange ? (
              <Select
                value={String(presetDays)}
                onValueChange={(v) =>
                  onPresetDaysChange(Number(v) as NotificationHealthPresetDays)
                }
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Window" />
                </SelectTrigger>
                <SelectContent>
                  {PRESET_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={String(o.value)}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="flex flex-wrap items-end gap-3">
                <div className="space-y-1">
                  <Label htmlFor="nh-from" className="text-xs">
                    From (UTC date)
                  </Label>
                  <Input
                    id="nh-from"
                    type="date"
                    value={dateFrom}
                    onChange={(e) => onDateFromChange(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="nh-to" className="text-xs">
                    To (UTC date)
                  </Label>
                  <Input
                    id="nh-to"
                    type="date"
                    value={dateTo}
                    onChange={(e) => onDateToChange(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
          {data?.window && (
            <p className="text-sm text-slate-500">
              Window:{" "}
              <span className="font-medium text-slate-700">
                {new Date(data.window.from).toLocaleString()} —{" "}
                {new Date(data.window.to).toLocaleString()}
              </span>
            </p>
          )}
        </div>

        {!queryEnabled && customRange && (
          <p className="text-sm text-amber-700">
            Choose start and end dates to load health data.
          </p>
        )}

        {meta?.truncated && (
          <div
            className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
            role="status"
          >
            <div className="flex gap-2">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <span>
                Results capped at {meta.maxEntries.toLocaleString()} rows;
                aggregates reflect only loaded rows. Narrow the date range if
                you need full coverage.
              </span>
            </div>
          </div>
        )}

        {isLoading && <LoadingState message="Loading notification health…" />}

        {error && !isLoading && (
          <ErrorState
            title="Could not load notification health"
            error={error}
            onRetry={() => refetch()}
          />
        )}

        {data && !isLoading && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Failure notifications"
                value={data.notifications.notificationCount}
                icon={<Bell className="h-5 w-5" />}
                description="Rows in window"
              />
              <StatCard
                title="Fatal"
                value={data.notifications.fatalCount}
                icon={<AlertTriangle className="h-5 w-5" />}
                description="fatal === true"
              />
              <StatCard
                title="Non-fatal"
                value={data.notifications.nonFatalCount}
                icon={<Activity className="h-5 w-5" />}
                description="fatal !== true"
              />
              <StatCard
                title="Weighted fixture error rate"
                value={formatRate(data.rates.weightedFixtureErrorRate)}
                icon={<TrendingUp className="h-5 w-5" />}
                description="Σ failed / Σ total fixtures"
              />
            </div>

            <ChartCard
              title="Notifications over time"
              description="Daily buckets (UTC); notification count and summed fixtures failed"
              icon={TrendingUp}
              chartConfig={NOTIFICATION_HEALTH_CHART_CONFIG}
              chartClassName="h-[280px]"
              emptyStateMessage={
                timelineData.length === 0
                  ? "No timeline data for this window"
                  : undefined
              }
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
          </>
        )}
      </div>
    </SectionContainer>
    </div>
  );
}
