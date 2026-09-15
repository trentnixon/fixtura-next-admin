"use client";

import { useMemo } from "react";
import { Cell, Pie, PieChart } from "recharts";
import { Layers } from "lucide-react";

import ChartCard from "@/components/modules/charts/ChartCard";
import {
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { OrderOverviewStats } from "@/types/orderOverview";
import { formatNumber, formatPercentage } from "@/utils/chart-formatters";
import { getPrimaryShadesColorArray } from "@/utils/chart-colors";
import { toTitleCase } from "../utils/textHelpers";

const COLORS = getPrimaryShadesColorArray();

interface OrdersOverviewTierChartProps {
  stats: OrderOverviewStats;
}

export function OrdersOverviewTierChart({ stats }: OrdersOverviewTierChartProps) {
  const chartData = useMemo(() => {
    return Object.entries(stats.byTier ?? {})
      .map(([key, value], index) => ({
        name: toTitleCase(key),
        value,
        color: COLORS[index % COLORS.length],
      }))
      .filter((row) => row.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [stats.byTier]);

  const total = chartData.reduce((sum, row) => sum + row.value, 0);

  const chartConfig = useMemo(() => {
    const config: ChartConfig = {};
    chartData.forEach((row) => {
      config[row.name] = { label: row.name, color: row.color };
    });
    return config;
  }, [chartData]);

  if (chartData.length === 0 || total === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No tier breakdown for this filter set.
      </p>
    );
  }

  const leader = chartData[0];

  return (
    <ChartCard
      title="Orders by tier"
      description="Subscription tier mix in range"
      icon={Layers}
      chartConfig={chartConfig}
      summaryStatsLayout="inline"
      summaryStats={[
        {
          icon: Layers,
          label: "Tiers",
          value: formatNumber(chartData.length),
        },
        {
          icon: Layers,
          label: "Leading tier",
          value: leader.name,
        },
        {
          icon: Layers,
          label: "Share",
          value: formatPercentage((leader.value / total) * 100),
        },
      ]}
      chartClassName="h-[260px]"
    >
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={48}
          outerRadius={88}
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }) =>
            (percent ?? 0) > 0.08
              ? `${name} ${formatPercentage((percent ?? 0) * 100)}`
              : ""
          }
        >
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) => [formatNumber(value as number), "Orders"]}
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
      </PieChart>
    </ChartCard>
  );
}
