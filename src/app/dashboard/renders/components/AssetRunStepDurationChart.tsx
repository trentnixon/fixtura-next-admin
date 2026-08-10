"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import type { ChartConfig } from "@/components/ui/chart";
import type { AssetRunStepDurationAggregate } from "@/lib/account-asset-run/globalRunAnalytics";
import { Timer } from "lucide-react";
import LoadingState from "@/components/ui-library/states/LoadingState";

interface AssetRunStepDurationChartProps {
  aggregates: AssetRunStepDurationAggregate[];
  sampleCount: number;
  isLoading: boolean;
}

const chartConfig = {
  avgMinutes: {
    label: "Avg (min)",
    color: "hsl(221, 83%, 53%)",
  },
  maxMinutes: {
    label: "Max (min)",
    color: "hsl(25, 95%, 53%)",
  },
} satisfies ChartConfig;

function toMinutes(ms: number | null): number {
  if (ms == null) return 0;
  return Math.round((ms / 60_000) * 10) / 10;
}

export function AssetRunStepDurationChart({
  aggregates,
  sampleCount,
  isLoading,
}: AssetRunStepDurationChartProps) {
  if (isLoading) {
    return (
      <LoadingState variant="minimal" message="Loading step timing sample…" />
    );
  }

  if (aggregates.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No step timing data yet — completed runs need item timestamps from CMS.
        Open a run for per-step detail.
      </p>
    );
  }

  const chartData = aggregates.map((row) => ({
    step: row.label.replace(/ scrape$/i, "").replace(/ refresh$/i, ""),
    avgMinutes: toMinutes(row.avgDurationMs),
    maxMinutes: toMinutes(row.maxDurationMs),
    avgLabel: row.avgDurationLabel,
    maxLabel: row.maxDurationLabel,
    samples: row.sampleCount,
  }));

  return (
    <Card className="rounded-md border bg-slate-50/50 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Timer className="h-4 w-4 text-slate-600" />
          Step duration — slowest runs sample
        </CardTitle>
        <CardDescription className="text-xs">
          Average and max per workflow step from the {sampleCount} slowest
          completed runs in this window. Estimates marked on run detail until CMS
          ships item timestamps.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[240px] w-full">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 4, right: 12, left: 4, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
            <XAxis type="number" tick={{ fontSize: 11 }} unit="m" />
            <YAxis
              type="category"
              dataKey="step"
              width={120}
              tick={{ fontSize: 10 }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name, item) => {
                    const payload = item.payload as (typeof chartData)[0];
                    if (name === "avgMinutes") {
                      return [`${payload.avgLabel} (${payload.samples} runs)`, "Avg"];
                    }
                    return [`${payload.maxLabel}`, "Max"];
                  }}
                />
              }
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar
              dataKey="avgMinutes"
              name="Avg (min)"
              fill="var(--color-avgMinutes)"
              radius={[0, 2, 2, 0]}
            />
            <Bar
              dataKey="maxMinutes"
              name="Max (min)"
              fill="var(--color-maxMinutes)"
              radius={[0, 2, 2, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
