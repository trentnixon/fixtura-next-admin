"use client";

import ChartCard from "@/components/modules/charts/ChartCard";
import MetricGrid from "@/components/ui-library/metrics/MetricGrid";
import { EmptyState } from "@/components/ui-library";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TestCharts } from "@/types/fetch-account-scrape-test";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  LineChart,
  Line,
} from "recharts";
import {
  Activity,
  TrendingUp,
  Clock,
  Database,
  Server,
  User,
} from "lucide-react";
import type { ChartConfig } from "@/components/ui/chart";

interface FetchAccountTestsChartsProps {
  charts: TestCharts;
}

export function FetchAccountTestsCharts({
  charts,
}: FetchAccountTestsChartsProps) {
  // Filter and clean chart data to prevent duplicate keys
  const cleanDailyRuns =
    charts.dailyRuns?.map((item, index) => ({
      ...item,
      id: `daily-${index}-${item.date}`,
      runs: item.runs || 0,
      passed: item.passed || 0,
      failed: item.failed || 0,
    })) || [];

  const cleanSuccessRate =
    charts.successRateOverTime?.map((item, index) => ({
      ...item,
      id: `success-${index}-${item.date}`,
      successRate: item.successRate || 0,
    })) || [];

  const cleanDurationTrends =
    charts.durationTrends?.map((item, index) => ({
      ...item,
      id: `duration-${index}-${item.timestamp}`,
      duration: item.duration || 0,
    })) || [];

  const cleanScraperDistribution =
    charts.scraperTypeDistribution?.map((item, index) => ({
      ...item,
      id: `scraper-${index}-${item.scraperType}`,
      count: item.count || 0,
    })) || [];

  const cleanEnvironmentDistribution =
    charts.environmentDistribution?.map((item, index) => ({
      ...item,
      id: `env-${index}-${item.environment}`,
      count: item.count || 0,
    })) || [];

  const cleanInitiatorBreakdown =
    charts.initiatorBreakdown?.map((item, index) => ({
      ...item,
      id: `initiator-${index}-${item.initiator}`,
      count: item.count || 0,
    })) || [];

  // Chart configurations
  const dailyRunsConfig = {
    runs: {
      label: "Runs",
      color: "hsl(var(--chart-1))",
    },
    passed: {
      label: "Passed",
      color: "hsl(var(--chart-2))",
    },
    failed: {
      label: "Failed",
      color: "hsl(var(--chart-3))",
    },
  };

  const successRateConfig = {
    successRate: {
      label: "Success Rate (%)",
      color: "hsl(var(--chart-4))",
    },
  };

  const durationConfig = {
    duration: {
      label: "Duration (ms)",
      color: "hsl(var(--chart-5))",
    },
  };

  const formatDuration = (duration: number) => {
    return `${(duration / 1000).toFixed(2)}s`;
  };

  return (
    <MetricGrid columns={2} gap="lg">
      {/* Daily Runs Chart */}
      <ChartCard
        title="Daily Test Runs"
        description="Test runs breakdown by day"
        icon={Activity}
        chartConfig={dailyRunsConfig as ChartConfig}
        chartClassName="h-[200px]"
        emptyState={
          cleanDailyRuns.length === 0 ? (
            <EmptyState title="No data available" variant="minimal" />
          ) : undefined
        }
      >
        {cleanDailyRuns.length > 0 ? (
          <BarChart data={cleanDailyRuns}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value: string) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value: number, name: string) => [
                value,
                name === "runs"
                  ? "Total Runs"
                  : name === "passed"
                  ? "Passed"
                  : "Failed",
              ]}
            />
            <Bar
              dataKey="runs"
              fill="var(--color-runs)"
              radius={4}
              key="runs"
            />
            <Bar
              dataKey="passed"
              fill="var(--color-passed)"
              radius={4}
              key="passed"
            />
            <Bar
              dataKey="failed"
              fill="var(--color-failed)"
              radius={4}
              key="failed"
            />
          </BarChart>
        ) : null}
      </ChartCard>

      {/* Success Rate Over Time */}
      <ChartCard
        title="Success Rate Over Time"
        description="Test success rate trends"
        icon={TrendingUp}
        chartConfig={successRateConfig as ChartConfig}
        chartClassName="h-[200px]"
        emptyState={
          cleanSuccessRate.length === 0 ? (
            <EmptyState title="No data available" variant="minimal" />
          ) : undefined
        }
      >
        {cleanSuccessRate.length > 0 ? (
          <LineChart data={cleanSuccessRate}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value: string) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis tickLine={false} axisLine={false} domain={[0, 100]} />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value: number) => [`${value}%`, "Success Rate"]}
            />
            <Line
              type="monotone"
              dataKey="successRate"
              stroke="var(--color-successRate)"
              strokeWidth={2}
              dot={{ fill: "var(--color-successRate)", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        ) : null}
      </ChartCard>

      {/* Duration Trends */}
      <ChartCard
        title="Duration Trends"
        description="Test execution duration over time"
        icon={Clock}
        chartConfig={durationConfig as ChartConfig}
        chartClassName="h-[200px]"
        emptyState={
          cleanDurationTrends.length === 0 ? (
            <EmptyState title="No data available" variant="minimal" />
          ) : undefined
        }
      >
        {cleanDurationTrends.length > 0 ? (
          <LineChart data={cleanDurationTrends}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="timestamp"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value: string) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value: number) => [formatDuration(value), "Duration"]}
            />
            <Line
              type="monotone"
              dataKey="duration"
              stroke="var(--color-duration)"
              strokeWidth={2}
              dot={{ fill: "var(--color-duration)", strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        ) : null}
      </ChartCard>

      {/* Scraper Type Distribution */}
      <Card className="shadow-none bg-slate-50 border rounded-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-lg font-semibold">
              Scraper Type Distribution
            </CardTitle>
          </div>
          <CardDescription>Test distribution by scraper type</CardDescription>
        </CardHeader>
        <CardContent>
          {cleanScraperDistribution.length === 0 ? (
            <EmptyState title="No data available" variant="minimal" />
          ) : (
            <ul className="space-y-2">
              {cleanScraperDistribution.map((scraper, index) => (
                <li
                  key={`${scraper.id} index ${index}`}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm font-medium">
                    {scraper.scraperType}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {scraper.count} tests ({scraper.successRate.toFixed(1)}%
                    success)
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Environment Distribution */}
      <Card className="shadow-none bg-slate-50 border rounded-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-lg font-semibold">
              Environment Distribution
            </CardTitle>
          </div>
          <CardDescription>Test distribution by environment</CardDescription>
        </CardHeader>
        <CardContent>
          {cleanEnvironmentDistribution.length === 0 ? (
            <EmptyState title="No data available" variant="minimal" />
          ) : (
            <ul className="space-y-2">
              {cleanEnvironmentDistribution.map((env, index) => (
                <li
                  key={env.id + ` index ${index}`}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm font-medium">{env.environment}</span>
                  <span className="text-sm text-muted-foreground">
                    {env.count} tests
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Initiator Breakdown */}
      <Card className="shadow-none bg-slate-50 border rounded-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-lg font-semibold">
              Initiator Breakdown
            </CardTitle>
          </div>
          <CardDescription>Test distribution by initiator</CardDescription>
        </CardHeader>
        <CardContent>
          {cleanInitiatorBreakdown.length === 0 ? (
            <EmptyState title="No data available" variant="minimal" />
          ) : (
            <ul className="space-y-2">
              {cleanInitiatorBreakdown.map((initiator, index) => (
                <li
                  key={initiator.id + ` index ${index}`}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm font-medium">
                    {initiator.initiator}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {initiator.count} tests ({initiator.successRate.toFixed(1)}%
                    success)
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </MetricGrid>
  );
}
