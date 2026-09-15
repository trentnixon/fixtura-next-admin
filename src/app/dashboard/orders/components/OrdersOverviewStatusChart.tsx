"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import { ListChecks } from "lucide-react";

import ChartCard from "@/components/modules/charts/ChartCard";
import {
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { OrderOverviewStats } from "@/types/orderOverview";
import { formatNumber, formatPercentage } from "@/utils/chart-formatters";
import { getPrimaryShadesColorArray } from "@/utils/chart-colors";
import { toTitleCase } from "../utils/textHelpers";

const COLORS = getPrimaryShadesColorArray();

interface OrdersOverviewStatusChartProps {
  stats: OrderOverviewStats;
  limit?: number;
}

export function OrdersOverviewStatusChart({
  stats,
  limit = 8,
}: OrdersOverviewStatusChartProps) {
  const chartData = useMemo(() => {
    return Object.entries(stats.byStatus ?? {})
      .map(([key, value]) => ({
        name: toTitleCase(key.replace(/_/g, " ")),
        value,
      }))
      .filter((row) => row.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, limit);
  }, [stats.byStatus, limit]);

  const total = chartData.reduce((sum, row) => sum + row.value, 0);

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    chartData.forEach((row, index) => {
      config[row.name] = {
        label: row.name,
        color: COLORS[index % COLORS.length],
      };
    });
    return config;
  }, [chartData]);

  if (chartData.length === 0 || total === 0) {
    return null;
  }

  const top = chartData[0];

  return (
    <ChartCard
      title="Checkout status mix"
      description="Orders in range by checkout status"
      icon={ListChecks}
      chartConfig={chartConfig}
      summaryStatsLayout="inline"
      summaryStats={[
        {
          icon: ListChecks,
          label: "Statuses",
          value: formatNumber(chartData.length),
        },
        {
          icon: ListChecks,
          label: "Top status",
          value: top?.name ?? "—",
        },
        {
          icon: ListChecks,
          label: "Top share",
          value: top ? formatPercentage((top.value / total) * 100) : "—",
        },
      ]}
      chartClassName="h-[260px]"
    >
      <BarChart data={chartData} layout="vertical" margin={{ left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tickLine={false} axisLine={false} allowDecimals={false} />
        <YAxis
          type="category"
          dataKey="name"
          width={100}
          tick={{ fontSize: 11 }}
          tickLine={false}
          axisLine={false}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => [formatNumber(value as number), "Orders"]}
            />
          }
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ChartCard>
  );
}
