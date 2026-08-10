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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";
import type { AssetRunRunsByDayRow } from "@/lib/account-asset-run/globalRunAnalytics";
import { BarChart3 } from "lucide-react";

interface AssetRunOutcomesByDayChartProps {
  data: AssetRunRunsByDayRow[];
}

const chartConfig = {
  completed: {
    label: "Completed",
    color: "hsl(142, 76%, 36%)",
  },
  failed: {
    label: "Failed",
    color: "hsl(0, 84%, 60%)",
  },
  active: {
    label: "Active",
    color: "hsl(221, 83%, 53%)",
  },
} satisfies ChartConfig;

export function AssetRunOutcomesByDayChart({
  data,
}: AssetRunOutcomesByDayChartProps) {
  if (data.length < 1) return null;

  const chartData = data.map((row) => ({
    date: row.date.slice(5),
    completed: row.completed,
    failed: row.failed,
    active: row.active,
  }));

  return (
    <Card className="rounded-md border bg-slate-50/50 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <BarChart3 className="h-4 w-4 text-slate-600" />
          Asset runs by day
        </CardTitle>
        <CardDescription className="text-xs">
          Outcomes in the current window (not full history)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={28} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="completed"
              stackId="a"
              fill="var(--color-completed)"
            />
            <Bar dataKey="failed" stackId="a" fill="var(--color-failed)" />
            <Bar dataKey="active" stackId="a" fill="var(--color-active)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
