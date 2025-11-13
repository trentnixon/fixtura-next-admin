"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell } from "recharts";
import { CreditCard } from "lucide-react";

import { OrderOverviewStats } from "@/types/orderOverview";
import ChartCard from "@/components/modules/charts/ChartCard";
import {
  ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { formatNumber, formatPercentage } from "@/utils/chart-formatters";

interface OrdersOverviewPaymentChannelChartProps {
  stats: OrderOverviewStats;
}

type PaymentChannelData = {
  name: string;
  value: number;
  color: string;
};

const CHART_COLORS = {
  stripe: "hsl(var(--chart-1))", // Purple-like color
  invoice: "hsl(var(--chart-2))", // Blue-like color
  notset: "hsl(var(--chart-3))", // Gray-like color
};

const DEFAULT_COLOR = "hsl(var(--chart-4))";

/**
 * Formats payment channel key to display name
 */
function formatPaymentChannelName(key: string): string {
  if (key === "notset") {
    return "Not Set";
  }
  return key.charAt(0).toUpperCase() + key.slice(1);
}

/**
 * Gets color for payment channel
 */
function getPaymentChannelColor(key: string): string {
  const normalized = key.toLowerCase();
  return CHART_COLORS[normalized as keyof typeof CHART_COLORS] || DEFAULT_COLOR;
}

export function OrdersOverviewPaymentChannelChart({
  stats,
}: OrdersOverviewPaymentChannelChartProps) {
  const chartData = useMemo<PaymentChannelData[]>(() => {
    if (!stats.byPaymentChannel || Object.keys(stats.byPaymentChannel).length === 0) {
      return [];
    }

    return Object.entries(stats.byPaymentChannel)
      .map(([key, value]) => ({
        name: formatPaymentChannelName(key),
        value,
        color: getPaymentChannelColor(key),
      }))
      .filter((item) => item.value > 0) // Only show channels with orders
      .sort((a, b) => b.value - a.value); // Sort by value descending
  }, [stats.byPaymentChannel]);

  const chartConfig = useMemo<ChartConfig>(() => {
    const config: ChartConfig = {};
    chartData.forEach((item) => {
      config[item.name] = {
        label: item.name,
        color: item.color,
      };
    });
    return config;
  }, [chartData]);

  const total = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0);
  }, [chartData]);

  // Don't render if no data
  if (chartData.length === 0 || total === 0) {
    return null;
  }

  return (
    <ChartCard
      title="Payment Channel Distribution"
      description="Breakdown of orders by payment channel"
      icon={CreditCard}
      chartConfig={chartConfig}
      chartClassName="h-[300px]"
    >
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name}: ${formatPercentage(percent * 100)}`
          }
          outerRadius={100}
          innerRadius={50}
          paddingAngle={4}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <ChartTooltip
          content={<ChartTooltipContent />}
          formatter={(value: number) => formatNumber(value)}
        />
        <ChartLegend content={<ChartLegendContent />} />
      </PieChart>
    </ChartCard>
  );
}

