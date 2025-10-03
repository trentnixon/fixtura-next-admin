"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TestCharts } from "@/types/fetch-account-scrape-test";
import { SectionTitle } from "@/components/type/titles";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  LineChart,
  Line,
} from "recharts";

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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Daily Runs Chart */}
      <Card className="bg-slate-50 border-b-4 border-b-blue-500">
        <CardHeader className="p-4">
          <CardTitle className="flex items-center justify-between w-full">
            <SectionTitle>Daily Test Runs</SectionTitle>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ChartContainer
            config={dailyRunsConfig}
            className="w-full"
            style={{ height: "200px" }}
          >
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
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Success Rate Over Time */}
      <Card className="bg-slate-50 border-b-4 border-b-green-500">
        <CardHeader className="p-4">
          <CardTitle className="flex items-center justify-between w-full">
            <SectionTitle>Success Rate Over Time</SectionTitle>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ChartContainer
            config={successRateConfig}
            className="w-full"
            style={{ height: "200px" }}
          >
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
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Duration Trends */}
      <Card className="bg-slate-50 border-b-4 border-b-orange-500">
        <CardHeader className="p-4">
          <CardTitle className="flex items-center justify-between w-full">
            <SectionTitle>Duration Trends</SectionTitle>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ChartContainer
            config={durationConfig}
            className="w-full"
            style={{ height: "200px" }}
          >
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
                formatter={(value: number) => [
                  formatDuration(value),
                  "Duration",
                ]}
              />
              <Line
                type="monotone"
                dataKey="duration"
                stroke="var(--color-duration)"
                strokeWidth={2}
                dot={{ fill: "var(--color-duration)", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Scraper Type Distribution */}
      <Card className="bg-slate-50 border-b-4 border-b-purple-500">
        <CardHeader className="p-4">
          <CardTitle className="flex items-center justify-between w-full">
            <SectionTitle>Scraper Type Distribution</SectionTitle>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-2">
            {cleanScraperDistribution.map((scraper, index) => (
              <div
                key={`${scraper.id} index ${index}`}
                className="flex items-center justify-between p-2 bg-white rounded"
              >
                <span className="text-sm font-medium">
                  {scraper.scraperType}
                </span>
                <span className="text-sm text-muted-foreground">
                  {scraper.count} tests ({scraper.successRate.toFixed(1)}%
                  success)
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Environment Distribution */}
      <Card className="bg-slate-50 border-b-4 border-b-cyan-500">
        <CardHeader className="p-4">
          <CardTitle className="flex items-center justify-between w-full">
            <SectionTitle>Environment Distribution</SectionTitle>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-2">
            {cleanEnvironmentDistribution.map((env, index) => (
              <div
                key={env.id + ` index ${index}`}
                className="flex items-center justify-between p-2 bg-white rounded"
              >
                <span className="text-sm font-medium">{env.environment}</span>
                <span className="text-sm text-muted-foreground">
                  {env.count} tests
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Initiator Breakdown */}
      <Card className="bg-slate-50 border-b-4 border-b-pink-500">
        <CardHeader className="p-4">
          <CardTitle className="flex items-center justify-between w-full">
            <SectionTitle>Initiator Breakdown</SectionTitle>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-2">
            {cleanInitiatorBreakdown.map((initiator, index) => (
              <div
                key={initiator.id + ` index ${index}`}
                className="flex items-center justify-between p-2 bg-white rounded"
              >
                <span className="text-sm font-medium">
                  {initiator.initiator}
                </span>
                <span className="text-sm text-muted-foreground">
                  {initiator.count} tests ({initiator.successRate.toFixed(1)}%
                  success)
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
