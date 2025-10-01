"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ByIDResponse } from "@/types/fetch-test";
import { SectionTitle } from "@/components/type/titles";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";

interface PerformanceChartsProps {
  data: ByIDResponse;
}

export function PerformanceCharts({ data }: PerformanceChartsProps) {
  // Memory usage chart data
  const memoryData = data.performanceMetrics.systemMetrics.memorySnapshots.map(
    (snapshot, index) => ({
      index: index + 1,
      heapUsed: (snapshot.heapUsed / 1024 / 1024).toFixed(2),
      heapTotal: (snapshot.heapTotal / 1024 / 1024).toFixed(2),
      rss: (snapshot.rss / 1024 / 1024).toFixed(2),
    })
  );

  // Per-game metrics data
  const gameMetricsData = data.performanceMetrics.perGameMetrics.map(
    (metric) => ({
      gameId: metric.gameId.substring(0, 8) + "...",
      executionTime: (metric.executionTime / 1000).toFixed(2),
      memoryRSS: (metric.memoryUsage.rss * 1024).toFixed(2),
      memoryHeap: metric.memoryUsage.heapUsed.toFixed(2),
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
  };

  const gameMetricsConfig = {
    executionTime: {
      label: "Execution Time (s)",
      color: "hsl(var(--chart-4))",
    },
    memoryRSS: {
      label: "Memory RSS (MB)",
      color: "hsl(var(--chart-5))",
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Memory Usage Over Time */}
      <Card className="bg-slate-50 border-b-4 border-b-blue-500">
        <CardHeader className="p-4">
          <CardTitle className="flex items-center justify-between w-full">
            <SectionTitle>Memory Usage Over Time</SectionTitle>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ChartContainer
            config={memoryConfig}
            className="w-full"
            style={{ height: "200px" }}
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
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number, name: string) => [
                  `${value} MB`,
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
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Per-Game Performance */}
      <Card className="bg-slate-50 border-b-4 border-b-green-500">
        <CardHeader className="p-4">
          <CardTitle className="flex items-center justify-between w-full">
            <SectionTitle>Per-Game Performance</SectionTitle>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ChartContainer
            config={gameMetricsConfig}
            className="w-full"
            style={{ height: "200px" }}
          >
            <BarChart data={gameMetricsData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="gameId"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value: number, name: string) => [
                  `${value}${name === "executionTime" ? "s" : " MB"}`,
                  name === "executionTime" ? "Execution Time" : "Memory RSS",
                ]}
              />
              <Bar
                dataKey="executionTime"
                fill="var(--color-executionTime)"
                radius={4}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card className="bg-slate-50 border-b-4 border-b-purple-500">
        <CardHeader className="p-4">
          <CardTitle className="flex items-center justify-between w-full">
            <SectionTitle>System Information</SectionTitle>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-white rounded">
              <span className="text-sm font-medium">Node Version</span>
              <span className="text-sm text-muted-foreground font-mono">
                {data.systemInfo.nodeVersion}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded">
              <span className="text-sm font-medium">Platform</span>
              <span className="text-sm text-muted-foreground">
                {data.systemInfo.platform}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded">
              <span className="text-sm font-medium">Architecture</span>
              <span className="text-sm text-muted-foreground">
                {data.systemInfo.architecture}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded">
              <span className="text-sm font-medium">Puppeteer Version</span>
              <span className="text-sm text-muted-foreground">
                {data.systemInfo.puppeteerVersion}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Configuration */}
      <Card className="bg-slate-50 border-b-4 border-b-orange-500">
        <CardHeader className="p-4">
          <CardTitle className="flex items-center justify-between w-full">
            <SectionTitle>Test Configuration</SectionTitle>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-white rounded">
              <span className="text-sm font-medium">Test Type</span>
              <span className="text-sm text-muted-foreground">
                {data.testConfiguration.testType}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded">
              <span className="text-sm font-medium">Test Version</span>
              <span className="text-sm text-muted-foreground font-mono">
                {data.testConfiguration.testVersion}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded">
              <span className="text-sm font-medium">Fixtures Count</span>
              <span className="text-sm text-muted-foreground">
                {data.testConfiguration.fixturesCount}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded">
              <span className="text-sm font-medium">XPath Version</span>
              <span className="text-sm text-muted-foreground">
                {data.testConfiguration.xpathVersion}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded">
              <span className="text-sm font-medium">Headless Mode</span>
              <span className="text-sm text-muted-foreground">
                {data.testConfiguration.browserConfig.headless ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded">
              <span className="text-sm font-medium">Viewport</span>
              <span className="text-sm text-muted-foreground">
                {data.testConfiguration.browserConfig.viewport.width}x
                {data.testConfiguration.browserConfig.viewport.height}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
