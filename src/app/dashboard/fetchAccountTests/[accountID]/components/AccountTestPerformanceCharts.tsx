"use client";

import ChartCard, {
  ChartSummaryStat,
} from "@/components/modules/charts/ChartCard";
import MetricGrid from "@/components/ui-library/metrics/MetricGrid";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TestRun } from "@/types/fetch-account-scrape-test";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import {
  CheckCircle,
  Database,
  Settings,
  Box,
  Code,
  Server,
  User,
  Clock,
} from "lucide-react";
import type { ChartConfig } from "@/components/ui/chart";

interface AccountTestPerformanceChartsProps {
  data: TestRun;
}

export function AccountTestPerformanceCharts({
  data,
}: AccountTestPerformanceChartsProps) {
  const validationData = [
    {
      id: "validation-passed",
      name: "Passed",
      value: data.validation?.passedValidations || 0,
    },
    {
      id: "validation-failed",
      name: "Failed",
      value: data.validation?.failedValidations || 0,
    },
  ];

  const itemCountData = [
    {
      id: "items-scraped",
      name: "Scraped",
      value: data.dataComparison?.scrapedItemCount || 0,
    },
    {
      id: "items-expected",
      name: "Expected",
      value: data.dataComparison?.expectedItemCount || 0,
    },
  ];

  const validationConfig = {
    value: {
      label: "Count",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const itemCountConfig = {
    value: {
      label: "Count",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  const successRate = (data.validation?.successRate || 0).toFixed(1);
  const matchRate =
    data.dataComparison?.expectedItemCount > 0
      ? (
          (data.dataComparison.scrapedItemCount /
            data.dataComparison.expectedItemCount) *
          100
        ).toFixed(1)
      : "0.0";

  const validationSummaryStats: ChartSummaryStat[] = [
    {
      icon: CheckCircle,
      label: "Success Rate",
      value: `${successRate}%`,
    },
  ];

  const itemCountSummaryStats: ChartSummaryStat[] = [
    {
      icon: Database,
      label: "Match Rate",
      value: `${matchRate}%`,
    },
  ];

  return (
    <MetricGrid columns={2} gap="lg">
      {/* Validation Results */}
      <ChartCard
        title="Validation Results"
        description="Test validation pass/fail breakdown"
        icon={CheckCircle}
        chartConfig={validationConfig}
        summaryStats={validationSummaryStats}
        chartClassName="h-[200px]"
      >
        <BarChart data={validationData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip
            content={<ChartTooltipContent />}
            formatter={(value: number, name: string) => [
              value,
              name === "Passed" ? "Passed" : "Failed",
            ]}
          />
          <Bar
            dataKey="value"
            fill="var(--color-value)"
            radius={[4, 4, 0, 0]}
            key="validation-results"
          />
        </BarChart>
      </ChartCard>

      {/* Item Count Comparison */}
      <ChartCard
        title="Item Count Comparison"
        description="Scraped vs expected item counts"
        icon={Database}
        chartConfig={itemCountConfig}
        summaryStats={itemCountSummaryStats}
        chartClassName="h-[200px]"
      >
        <BarChart data={itemCountData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip
            content={<ChartTooltipContent />}
            formatter={(value: number, name: string) => [
              value,
              name === "Scraped" ? "Scraped" : "Expected",
            ]}
          />
          <Bar
            dataKey="value"
            fill="var(--color-value)"
            radius={[4, 4, 0, 0]}
            key="item-count-comparison"
          />
        </BarChart>
      </ChartCard>

      {/* Test Configuration Summary */}
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
                Test Entity:
              </dt>
              <dd className="flex-1 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {data.testEntity}
                </span>
              </dd>
            </div>
            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <dt className="font-semibold text-sm w-32 flex-shrink-0 flex items-center gap-2">
                <Code className="h-4 w-4 text-muted-foreground" />
                Scraper Type:
              </dt>
              <dd className="flex-1 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {data.scraperType}
                </span>
              </dd>
            </div>
            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <dt className="font-semibold text-sm w-32 flex-shrink-0 flex items-center gap-2">
                <Server className="h-4 w-4 text-muted-foreground" />
                Environment:
              </dt>
              <dd className="flex-1 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {data.environment}
                </span>
              </dd>
            </div>
            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <dt className="font-semibold text-sm w-32 flex-shrink-0 flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Initiator:
              </dt>
              <dd className="flex-1 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {data.testInitiator}
                </span>
              </dd>
            </div>
            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <dt className="font-semibold text-sm w-32 flex-shrink-0 flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Test Duration:
              </dt>
              <dd className="flex-1 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {(data.testDuration / 1000).toFixed(2)}s
                </span>
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </MetricGrid>
  );
}
