// TODO: Add a page that shows all the renders for an account
"use client";
import BarChartComponent from "@/components/modules/charts/BarChartComponent";
import { ChartConfig } from "@/components/ui/chart";
import { useAccountSummaryQuery } from "@/hooks/accounts/useAccountSummaryQuery";

export default function TestCharts() {
  const { data: accountSummary } = useAccountSummaryQuery();
  const chartConfig = {
    renders: {
      label: "name",
      color: "#2563eb",
    },
  } satisfies ChartConfig;
  const BarCharts = accountSummary?.data?.BarChartData;

  return (
    <section className="flex flex-col gap-8 my-8">
      <div className="grid grid-cols-3 gap-8">
        <BarChartComponent
          title="Account Types"
          data={BarCharts?.accountTypesBarChart ?? []}
          xAxisKey="name"
          barKey="value"
          barColor="var(--color-renders)"
          config={chartConfig}
          height={200}
          width="100%"
        />

        <BarChartComponent
          title="Sports Count"
          data={BarCharts?.sportsCountBarChart ?? []}
          xAxisKey="name"
          barKey="value"
          barColor="var(--color-renders)"
          config={chartConfig}
          height={200}
          width="100%"
        />
        <BarChartComponent
          title="Engagement Metrics"
          data={BarCharts?.engagementMetricsBarChart ?? []}
          xAxisKey="metric"
          barKey="count"
          barColor="var(--color-renders)"
          config={chartConfig}
          height={200}
          width="100%"
        />
      </div>
    </section>
  );
}
