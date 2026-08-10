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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import type { ChartConfig } from "@/components/ui/chart";
import type { RunsByDayRow } from "@/lib/account-health/globalRunAnalytics";
import { BarChart3 } from "lucide-react";

interface DataRefreshOutcomesByDayChartProps {
  data: RunsByDayRow[];
}

const chartConfig = {
  finalized: {
    label: "Finalized",
    color: "hsl(142, 76%, 36%)",
  },
  failed: {
    label: "Failed",
    color: "hsl(0, 84%, 60%)",
  },
  empty: {
    label: "Empty season",
    color: "hsl(199, 89%, 48%)",
  },
  active: {
    label: "Active",
    color: "hsl(221, 83%, 53%)",
  },
} satisfies ChartConfig;

export default function DataRefreshOutcomesByDayChart({
  data,
}: DataRefreshOutcomesByDayChartProps) {
  if (data.length < 1) {
    return null;
  }

  const chartData = data.map((row) => ({
    date: row.date.slice(5),
    finalized: row.finalized,
    failed: row.failed,
    empty: row.empty,
    active: row.active,
  }));

  return (
    <Card className="shadow-none border rounded-md bg-slate-50/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-slate-600" />
          Outcomes by day
        </CardTitle>
        <CardDescription className="text-xs">
          From the latest refresh runs in this window (not full history)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} width={28} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="finalized" stackId="a" fill="var(--color-finalized)" />
            <Bar dataKey="failed" stackId="a" fill="var(--color-failed)" />
            <Bar dataKey="empty" stackId="a" fill="var(--color-empty)" />
            <Bar dataKey="active" stackId="a" fill="var(--color-active)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
