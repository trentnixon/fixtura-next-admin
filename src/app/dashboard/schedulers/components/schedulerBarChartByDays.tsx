"use client";

import ChartCard, {
  ChartSummaryStat,
} from "@/components/modules/charts/ChartCard";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis } from "recharts";
import { Calendar, BarChart3 } from "lucide-react";
import { ChartConfig } from "@/components/ui/chart";
import { useSchedulerRollup } from "@/hooks/scheduler/useSchedulerRollup";
import { formatNumber } from "@/utils/chart-formatters";

export default function SchedulerBarChartByDays() {
  const { data } = useSchedulerRollup();

  const chartConfig = {
    renders: {
      label: "Renders",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const chartData = [
    {
      day: "Monday",
      renders: data?.DaysOfTheWeekGroupedByCount["Monday"] || 0,
    },
    {
      day: "Tuesday",
      renders: data?.DaysOfTheWeekGroupedByCount["Tuesday"] || 0,
    },
    {
      day: "Wednesday",
      renders: data?.DaysOfTheWeekGroupedByCount["Wednesday"] || 0,
    },
    {
      day: "Thursday",
      renders: data?.DaysOfTheWeekGroupedByCount["Thursday"] || 0,
    },
    {
      day: "Friday",
      renders: data?.DaysOfTheWeekGroupedByCount["Friday"] || 0,
    },
    {
      day: "Saturday",
      renders: data?.DaysOfTheWeekGroupedByCount["Saturday"] || 0,
    },
    {
      day: "Sunday",
      renders: data?.DaysOfTheWeekGroupedByCount["Sunday"] || 0,
    },
  ];

  // Calculate summary statistics
  const totalRenders = chartData.reduce((sum, item) => sum + item.renders, 0);
  const averageRenders = totalRenders / chartData.length;
  const maxRenders = Math.max(...chartData.map((item) => item.renders));
  const maxDay =
    chartData.find((item) => item.renders === maxRenders)?.day || "N/A";

  const summaryStats: ChartSummaryStat[] = [
    {
      icon: BarChart3,
      label: "Total Renders",
      value: formatNumber(totalRenders),
    },
    {
      icon: Calendar,
      label: "Average/Day",
      value: formatNumber(Math.round(averageRenders)),
    },
    {
      icon: BarChart3,
      label: "Max Day",
      value: maxDay,
    },
    {
      icon: Calendar,
      label: "Max Renders",
      value: formatNumber(maxRenders),
    },
  ];

  return (
    <ChartCard
      title="Renders by Day"
      description="Distribution of renders across days of the week"
      icon={Calendar}
      chartConfig={chartConfig}
      summaryStats={summaryStats}
    >
      <BarChart
        data={chartData}
        margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="day"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          fontSize={12}
          tickFormatter={(value: string) => value.slice(0, 3)}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          fontSize={12}
          tickFormatter={(value) => formatNumber(value)}
        />
        <ChartTooltip
          content={<ChartTooltipContent />}
          formatter={(value: number) => [formatNumber(value), "Renders"]}
        />
        <Bar
          dataKey="renders"
          fill="var(--color-renders)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartCard>
  );
}
