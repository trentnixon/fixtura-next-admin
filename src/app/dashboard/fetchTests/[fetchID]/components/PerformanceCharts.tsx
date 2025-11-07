"use client";

import ChartCard from "@/components/modules/charts/ChartCard";
import MetricGrid from "@/components/ui-library/metrics/MetricGrid";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ByIDResponse } from "@/types/fetch-test";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";
import {
  MemoryStick,
  Activity,
  Server,
  Settings,
  Box,
  Code,
  Monitor,
  MousePointerClick,
} from "lucide-react";
import type { ChartConfig } from "@/components/ui/chart";
import { formatMemory, formatDuration } from "@/utils/chart-formatters";

interface PerformanceChartsProps {
  data: ByIDResponse;
}

export function PerformanceCharts({ data }: PerformanceChartsProps) {
  // Memory usage chart data
  const memoryData = data.performanceMetrics.systemMetrics.memorySnapshots.map(
    (snapshot, index) => ({
      index: index + 1,
      heapUsed: Number((snapshot.heapUsed / 1024 / 1024).toFixed(2)),
      heapTotal: Number((snapshot.heapTotal / 1024 / 1024).toFixed(2)),
      rss: Number((snapshot.rss / 1024 / 1024).toFixed(2)),
    })
  );

  // Per-game metrics data
  const gameMetricsData = data.performanceMetrics.perGameMetrics.map(
    (metric) => ({
      gameId: metric.gameId.substring(0, 8) + "...",
      executionTime: Number((metric.executionTime / 1000).toFixed(2)),
      memoryRSS: Number((metric.memoryUsage.rss * 1024).toFixed(2)),
      memoryHeap: metric.memoryUsage.heapUsed,
    })
  );

  const memoryConfig = {
    heapUsed: {
      label: "Heap Used",
      color: "hsl(var(--chart-1))",
    },
    heapTotal: {
      label: "Heap Total",
      color: "hsl(var(--chart-2))",
    },
    rss: {
      label: "RSS",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  const gameMetricsConfig = {
    executionTime: {
      label: "Execution Time",
      color: "hsl(var(--chart-4))",
    },
  } satisfies ChartConfig;

  return (
    <MetricGrid columns={2} gap="lg">
      {/* Memory Usage Over Time */}
      <ChartCard
        title="Memory Usage Over Time"
        description="System memory metrics during test execution"
        icon={MemoryStick}
        chartConfig={memoryConfig}
        chartClassName="h-[200px]"
      >
        <LineChart data={memoryData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="index"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => `Snapshot ${value}`}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatMemory(value, "mb")}
          />
          <ChartTooltip
            content={<ChartTooltipContent />}
            formatter={(value: number, name: string) => [
              formatMemory(value, "mb"),
              name === "heapUsed"
                ? "Heap Used"
                : name === "heapTotal"
                ? "Heap Total"
                : "RSS",
            ]}
          />
          <Line
            type="monotone"
            dataKey="heapUsed"
            stroke="var(--color-heapUsed)"
            strokeWidth={2}
            dot={{ fill: "var(--color-heapUsed)", strokeWidth: 2, r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="heapTotal"
            stroke="var(--color-heapTotal)"
            strokeWidth={2}
            dot={{ fill: "var(--color-heapTotal)", strokeWidth: 2, r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="rss"
            stroke="var(--color-rss)"
            strokeWidth={2}
            dot={{ fill: "var(--color-rss)", strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ChartCard>

      {/* Per-Game Performance */}
      <ChartCard
        title="Per-Game Performance"
        description="Execution time per game"
        icon={Activity}
        chartConfig={gameMetricsConfig}
        chartClassName="h-[200px]"
      >
        <BarChart data={gameMetricsData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="gameId"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => formatDuration(value, "seconds")}
          />
          <ChartTooltip
            content={<ChartTooltipContent />}
            formatter={(value: number) => [
              formatDuration(value, "seconds"),
              "Execution Time",
            ]}
          />
          <Bar
            dataKey="executionTime"
            fill="var(--color-executionTime)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartCard>

      {/* System Information */}
      <Card className="shadow-none bg-slate-50 border rounded-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-lg font-semibold">
              System Information
            </CardTitle>
          </div>
          <CardDescription>System environment details</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="space-y-4">
            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <dt className="font-semibold text-sm w-32 flex-shrink-0 flex items-center gap-2">
                <Code className="h-4 w-4 text-muted-foreground" />
                Node Version:
              </dt>
              <dd className="flex-1 flex items-center gap-2">
                <span className="text-sm text-muted-foreground font-mono">
                  {data.systemInfo.nodeVersion}
                </span>
              </dd>
            </div>
            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <dt className="font-semibold text-sm w-32 flex-shrink-0 flex items-center gap-2">
                <Monitor className="h-4 w-4 text-muted-foreground" />
                Platform:
              </dt>
              <dd className="flex-1 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {data.systemInfo.platform}
                </span>
              </dd>
            </div>
            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <dt className="font-semibold text-sm w-32 flex-shrink-0 flex items-center gap-2">
                <Server className="h-4 w-4 text-muted-foreground" />
                Architecture:
              </dt>
              <dd className="flex-1 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {data.systemInfo.architecture}
                </span>
              </dd>
            </div>
            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <dt className="font-semibold text-sm w-32 flex-shrink-0 flex items-center gap-2">
                <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                Puppeteer Version:
              </dt>
              <dd className="flex-1 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {data.systemInfo.puppeteerVersion}
                </span>
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Test Configuration */}
      <Card className="shadow-none bg-slate-50 border rounded-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-lg font-semibold">
              Test Configuration
            </CardTitle>
          </div>
          <CardDescription>Test run configuration details</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="space-y-4">
            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <dt className="font-semibold text-sm w-32 flex-shrink-0 flex items-center gap-2">
                <Box className="h-4 w-4 text-muted-foreground" />
                Test Type:
              </dt>
              <dd className="flex-1 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {data.testConfiguration.testType}
                </span>
              </dd>
            </div>
            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <dt className="font-semibold text-sm w-32 flex-shrink-0 flex items-center gap-2">
                <Code className="h-4 w-4 text-muted-foreground" />
                Test Version:
              </dt>
              <dd className="flex-1 flex items-center gap-2">
                <span className="text-sm text-muted-foreground font-mono">
                  {data.testConfiguration.testVersion}
                </span>
              </dd>
            </div>
            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <dt className="font-semibold text-sm w-32 flex-shrink-0 flex items-center gap-2">
                <Box className="h-4 w-4 text-muted-foreground" />
                Fixtures Count:
              </dt>
              <dd className="flex-1 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {data.testConfiguration.fixturesCount}
                </span>
              </dd>
            </div>
            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <dt className="font-semibold text-sm w-32 flex-shrink-0 flex items-center gap-2">
                <Code className="h-4 w-4 text-muted-foreground" />
                XPath Version:
              </dt>
              <dd className="flex-1 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {data.testConfiguration.xpathVersion}
                </span>
              </dd>
            </div>
            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <dt className="font-semibold text-sm w-32 flex-shrink-0 flex items-center gap-2">
                <Monitor className="h-4 w-4 text-muted-foreground" />
                Headless Mode:
              </dt>
              <dd className="flex-1 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {data.testConfiguration.browserConfig.headless ? "Yes" : "No"}
                </span>
              </dd>
            </div>
            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <dt className="font-semibold text-sm w-32 flex-shrink-0 flex items-center gap-2">
                <Monitor className="h-4 w-4 text-muted-foreground" />
                Viewport:
              </dt>
              <dd className="flex-1 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {data.testConfiguration.browserConfig.viewport.width}x
                  {data.testConfiguration.browserConfig.viewport.height}
                </span>
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </MetricGrid>
  );
}
