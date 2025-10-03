"use client";

import { SectionTitle } from "@/components/type/titles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TestRun } from "@/types/fetch-account-scrape-test";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

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
      fill: "#10B981",
    },
    {
      id: "validation-failed",
      name: "Failed",
      value: data.validation?.failedValidations || 0,
      fill: "#EF4444",
    },
  ];

  const itemCountData = [
    {
      id: "items-scraped",
      name: "Scraped",
      value: data.dataComparison?.scrapedItemCount || 0,
      fill: "#3B82F6",
    },
    {
      id: "items-expected",
      name: "Expected",
      value: data.dataComparison?.expectedItemCount || 0,
      fill: "#8B5CF6",
    },
  ];

  const validationConfig = {
    value: {
      label: "Count",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Validation Results */}
      <Card className="bg-slate-50 border-b-4 border-b-green-500">
        <CardHeader className="p-4">
          <CardTitle className="flex items-center justify-between w-full">
            <SectionTitle>Validation Results</SectionTitle>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ChartContainer
            config={validationConfig}
            className="w-full"
            style={{ height: "200px" }}
          >
            <BarChart data={validationData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="value"
                fill="var(--color-value)"
                radius={4}
                key="validation-results"
              />
            </BarChart>
          </ChartContainer>
          <div className="mt-4 text-center">
            <div className="text-sm text-gray-600">
              Success Rate: {(data.validation?.successRate || 0).toFixed(1)}%
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Item Count Comparison */}
      <Card className="bg-slate-50 border-b-4 border-b-purple-500">
        <CardHeader className="p-4">
          <CardTitle className="flex items-center justify-between w-full">
            <SectionTitle>Item Count Comparison</SectionTitle>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ChartContainer
            config={validationConfig}
            className="w-full"
            style={{ height: "200px" }}
          >
            <BarChart data={itemCountData}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="value"
                fill="var(--color-value)"
                radius={4}
                key="item-count-comparison"
              />
            </BarChart>
          </ChartContainer>
          <div className="mt-4 text-center">
            <div className="text-sm text-gray-600">
              Match Rate:{" "}
              {data.dataComparison.expectedItemCount > 0
                ? (
                    (data.dataComparison.scrapedItemCount /
                      data.dataComparison.expectedItemCount) *
                    100
                  ).toFixed(1)
                : 0}
              %
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Configuration Summary */}
      <Card className="bg-slate-50 border-b-4 border-b-orange-500">
        <CardHeader className="p-4">
          <CardTitle className="flex items-center justify-between w-full">
            <SectionTitle>Test Configuration</SectionTitle>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-white rounded">
              <span className="text-sm font-medium">Test Entity</span>
              <span className="text-sm text-muted-foreground">
                {data.testEntity}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded">
              <span className="text-sm font-medium">Scraper Type</span>
              <span className="text-sm text-muted-foreground">
                {data.scraperType}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded">
              <span className="text-sm font-medium">Environment</span>
              <span className="text-sm text-muted-foreground">
                {data.environment}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded">
              <span className="text-sm font-medium">Initiator</span>
              <span className="text-sm text-muted-foreground">
                {data.testInitiator}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded">
              <span className="text-sm font-medium">Test Duration</span>
              <span className="text-sm text-muted-foreground">
                {(data.testDuration / 1000).toFixed(2)}s
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
