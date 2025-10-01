"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TestReport } from "@/types/fetch-test";
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

interface FetchTestsChartsProps {
  charts: TestReport["charts"];
}

export function FetchTestsCharts({ charts }: FetchTestsChartsProps) {
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

  const durationConfig = {
    duration: {
      label: "Duration (ms)",
      color: "hsl(var(--chart-4))",
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
            <BarChart data={charts.dailyRuns}>
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
              <Bar dataKey="runs" fill="var(--color-runs)" radius={4} />
              <Bar dataKey="passed" fill="var(--color-passed)" radius={4} />
              <Bar dataKey="failed" fill="var(--color-failed)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Duration Trends Chart */}
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
            <LineChart data={charts.durationTrends}>
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

      {/* Environment Distribution */}
      <Card className="bg-slate-50 border-b-4 border-b-purple-500">
        <CardHeader className="p-4">
          <CardTitle className="flex items-center justify-between w-full">
            <SectionTitle>Environment Distribution</SectionTitle>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-2">
            {charts.environmentDistribution.map((env, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-white rounded"
              >
                <span className="text-sm font-medium">
                  Environment {index + 1}
                </span>
                <span className="text-sm text-muted-foreground">
                  {env.count} tests
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Initiator Breakdown */}
      <Card className="bg-slate-50 border-b-4 border-b-green-500">
        <CardHeader className="p-4">
          <CardTitle className="flex items-center justify-between w-full">
            <SectionTitle>Initiator Breakdown</SectionTitle>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-2">
            {charts.initiatorBreakdown.map((initiator, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-white rounded"
              >
                <span className="text-sm font-medium">
                  Initiator {index + 1}
                </span>
                <span className="text-sm text-muted-foreground">
                  {initiator.count} tests
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
