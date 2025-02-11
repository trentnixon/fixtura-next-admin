// schedulerBarChartByDays.tsx
"use client";
import { SectionTitle } from "@/components/type/titles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { useSchedulerRollup } from "@/hooks/scheduler/useSchedulerRollup";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

export default function SchedulerBarChartByDays() {
  const { data } = useSchedulerRollup();
  const chartConfig = {
    renders: {
      label: "renders",
      color: "#2563eb",
    },
  } satisfies ChartConfig;
  const chartData = [
    {
      month: "Monday",
      renders: data?.DaysOfTheWeekGroupedByCount["Monday"] || 0,
    },
    {
      month: "Tuesday",
      renders: data?.DaysOfTheWeekGroupedByCount["Tuesday"] || 0,
    },
    {
      month: "Wednesday",
      renders: data?.DaysOfTheWeekGroupedByCount["Wednesday"] || 0,
    },
    {
      month: "Thursday",
      renders: data?.DaysOfTheWeekGroupedByCount["Thursday"] || 0,
    },
    {
      month: "Friday",
      renders: data?.DaysOfTheWeekGroupedByCount["Friday"] || 0,
    },
    {
      month: "Saturday",
      renders: data?.DaysOfTheWeekGroupedByCount["Saturday"] || 0,
    },
    {
      month: "Sunday",
      renders: data?.DaysOfTheWeekGroupedByCount["Sunday"] || 0,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Card className="w-full shadow-none bg-slate-50 border-b-4 border-b-slate-500 rounded-md">
        <CardTitle className="flex items-center justify-between w-full p-2">
          <SectionTitle>Renders by Day</SectionTitle>
        </CardTitle>
        <CardContent className="p-2">
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={value => value.slice(0, 3)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="renders" fill="var(--color-renders)" radius={4} />
            </BarChart>
          </ChartContainer>
          {/* Conditionally render the action component if provided */}
        </CardContent>
        <CardHeader className="p-2"></CardHeader>
      </Card>
    </div>
  );
}
