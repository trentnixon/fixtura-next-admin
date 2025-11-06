"use client";
import BarChartComponent from "@/components/modules/charts/BarChartComponent";
import { ChartConfig } from "@/components/ui/chart";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { useSchedulerRollup } from "@/hooks/scheduler/useSchedulerRollup";

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
    <ElementContainer
      title="Renders by Day"
      subtitle="Distribution of renders across days of the week"
    >
      <BarChartComponent
        data={chartData}
        xAxisKey="month"
        barKey="renders"
        barColor="var(--color-renders)"
        config={chartConfig}
        height={200}
        width="100%"
      />
    </ElementContainer>
  );
}
