"use client";

import {
  Area,
  ComposedChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { CalendarClock, TrendingUp, Wallet } from "lucide-react";

import { OrderOverviewTimeline } from "@/types/orderOverview";
import ChartCard, {
  ChartSummaryStat,
} from "@/components/modules/charts/ChartCard";
import {
  ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  formatCurrency,
  formatDateShort,
  formatNumber,
} from "@/utils/chart-formatters";
import { formatMonthKeyLabel } from "@/app/dashboard/components/financials/financialDateRanges";
import {
  aggregateTimelineByMonth,
  mergeDailyTimeline,
} from "@/app/dashboard/components/financials/financialTimeline";

interface OrdersOverviewTimelineProps {
  timeline: OrderOverviewTimeline;
  currency?: string | null;
  /** When set, bucket daily API points into these calendar months (zero-filled). */
  monthKeys?: string[];
}

const DEFAULT_CURRENCY = "AUD";

const chartConfig: ChartConfig = {
  ordersCreated: {
    label: "Orders created",
    color: "hsl(var(--chart-1))",
  },
  ordersPaid: {
    label: "Orders paid",
    color: "hsl(var(--chart-2))",
  },
  ordersEnded: {
    label: "Orders ended",
    color: "hsl(var(--chart-3))",
  },
  revenueCollected: {
    label: "Revenue collected",
    color: "hsl(var(--chart-4))",
  },
};

export function OrdersOverviewTimeline({
  timeline,
  currency,
  monthKeys,
}: OrdersOverviewTimelineProps) {
  const currencyCode = currency ?? DEFAULT_CURRENCY;
  const centsToUnits = (value: number) => value / 100;
  const isMonthly = monthKeys != null && monthKeys.length > 0;

  const data = isMonthly
    ? aggregateTimelineByMonth(timeline, monthKeys)
    : mergeDailyTimeline(timeline);

  const formatAxisLabel = (value: string) =>
    isMonthly ? formatMonthKeyLabel(value) : formatDateShort(value);

  const summaryStats: ChartSummaryStat[] = [
    {
      icon: CalendarClock,
      label: "Range",
      value:
        timeline.range.start && timeline.range.end
          ? `${formatDateShort(timeline.range.start)} - ${formatDateShort(
              timeline.range.end,
            )}`
          : "Dynamic",
    },
    {
      icon: TrendingUp,
      label: "Orders paid",
      value: formatNumber(timeline.totals.ordersPaid),
    },
    {
      icon: Wallet,
      label: "Revenue",
      value: formatCurrency(
        centsToUnits(timeline.totals.revenueCollected),
        currencyCode,
      ),
    },
  ];

  return (
    <ChartCard
      title="Orders timeline"
      description={
        isMonthly
          ? "Monthly creation, payment, and revenue trends"
          : "Creation, payment, and revenue trends"
      }
      chartConfig={chartConfig}
      summaryStats={summaryStats}
      variant="elevated"
    >
      <ComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={formatAxisLabel}
          tickLine={false}
          axisLine={false}
          angle={isMonthly ? 0 : -45}
          textAnchor={isMonthly ? "middle" : "end"}
          height={isMonthly ? 40 : 80}
          fontSize={12}
        />
        <YAxis
          yAxisId="left"
          tickLine={false}
          axisLine={false}
          fontSize={12}
          allowDecimals={false}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          tickLine={false}
          axisLine={false}
          fontSize={12}
          tickFormatter={(value) =>
            formatCurrency(value, currencyCode, { maximumFractionDigits: 0 })
          }
        />
        <ChartTooltip
          content={<ChartTooltipContent />}
          formatter={(value: number, name) => {
            if (name === "revenueCollected") {
              return [
                formatCurrency(value, currencyCode),
                chartConfig.revenueCollected.label,
              ];
            }

            const label =
              chartConfig[name as keyof typeof chartConfig]?.label ?? name;
            return [formatNumber(value), label];
          }}
          labelFormatter={(label) => formatAxisLabel(String(label))}
        />
        <Legend />
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="ordersCreated"
          stroke="var(--color-ordersCreated)"
          fill="var(--color-ordersCreated)"
          fillOpacity={0.24}
          name="Orders created"
        />
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="ordersPaid"
          stroke="var(--color-ordersPaid)"
          fill="var(--color-ordersPaid)"
          fillOpacity={0.24}
          name="Orders paid"
        />
        <Area
          yAxisId="left"
          type="monotone"
          dataKey="ordersEnded"
          stroke="var(--color-ordersEnded)"
          fill="var(--color-ordersEnded)"
          fillOpacity={0.2}
          name="Orders ended"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="revenueCollected"
          stroke="var(--color-revenueCollected)"
          strokeWidth={2.5}
          dot={false}
          name="Revenue collected"
        />
      </ComposedChart>
    </ChartCard>
  );
}
