"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Clapperboard,
  DollarSign,
  LineChart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ChartCard, {
  ChartSummaryStat,
} from "@/components/modules/charts/ChartCard";
import {
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { useGlobalCostTrends } from "@/hooks/rollups/useGlobalCostTrends";
import {
  formatCurrency,
  formatNumber,
} from "@/utils/chart-formatters";
import { detectAnomalies } from "./_utils/calculateAnomalies";
import { formatPeriodDate } from "./_utils/budgetChartHelpers";
import { getPeriodDetailUrl } from "./_utils/navigation";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";

export default function PeriodTrendsChart({
  granularity = "daily",
  startDate,
  endDate,
}: {
  granularity?: "daily" | "weekly" | "monthly";
  startDate: string;
  endDate: string;
}) {
  const router = useRouter();
  const { data, isLoading, isError, error } = useGlobalCostTrends({
    granularity,
    startDate,
    endDate,
  });

  const summary = useMemo(() => data?.summary, [data]);

  const chartConfig = {
    cost: {
      label: "Cost",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const chartData = useMemo(() => {
    if (!data?.dataPoints) return [];

    const dataPoints = data.dataPoints.map((point) => ({
      cost: point.totalCost ?? 0,
    }));

    const anomalies = detectAnomalies(dataPoints, 2);
    const anomalyIndices = new Set(anomalies.map((a) => a.index));

    return data.dataPoints.map((point, index) => {
      const anomaly = anomalies.find((a) => a.index === index);
      return {
        period: point.period,
        periodLabel: formatPeriodDate(point.period),
        cost: point.totalCost ?? 0,
        lambda: point.totalLambdaCost ?? 0,
        ai: point.totalAiCost ?? 0,
        renders: point.totalRenders ?? 0,
        isAnomaly: anomalyIndices.has(index),
        anomalyType: anomaly?.type,
        zScore: anomaly?.zScore,
      };
    });
  }, [data]);

  const totalRenders = useMemo(
    () => chartData.reduce((sum, d) => sum + d.renders, 0),
    [chartData],
  );

  const anomalyCount = chartData.filter((d) => d.isAnomaly).length;

  const summaryStats: ChartSummaryStat[] = useMemo(() => {
    if (!summary) return [];
    const TrendIcon =
      summary.trend === "up"
        ? TrendingUp
        : summary.trend === "down"
          ? TrendingDown
          : LineChart;

    const stats: ChartSummaryStat[] = [
      {
        icon: DollarSign,
        label: "Total",
        value: formatCurrency(summary.totalCost ?? 0),
      },
      {
        icon: TrendIcon,
        label: "Avg / bucket",
        value: formatCurrency(summary.averageCost ?? 0),
      },
      {
        icon: DollarSign,
        label: "Peak",
        value: formatCurrency(summary.peakCost ?? 0),
      },
      {
        icon: Clapperboard,
        label: "Renders",
        value: formatNumber(totalRenders),
      },
    ];

    if (summary.peakPeriod) {
      stats.push({
        icon: LineChart,
        label: "Peak on",
        value: formatPeriodDate(summary.peakPeriod),
      });
    }

    if (anomalyCount > 0) {
      stats.push({
        icon: AlertTriangle,
        label: "Anomalies",
        value: formatNumber(anomalyCount),
      });
    }

    return stats;
  }, [summary, totalRenders, anomalyCount]);

  if (isLoading) {
    return <LoadingState variant="minimal" message="Loading cost trends…" />;
  }
  if (isError) {
    return (
      <ErrorState
        variant="minimal"
        title="Unable to load trends"
        error={error as Error}
      />
    );
  }
  if (!data) return null;

  return (
    <ChartCard
      title="Total cost over time"
      description={`${granularity} · ${data.period.start} → ${data.period.end}`}
      icon={LineChart}
      chartConfig={chartConfig}
      summaryStats={summaryStats}
      summaryStatsLayout="inline"
      chartClassName="h-[300px]"
    >
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="periodLabel"
          angle={-45}
          textAnchor="end"
          height={80}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => formatCurrency(value)}
        />
        <ChartTooltip
          content={({ active, payload, label }) => {
            if (!active || !payload || !payload[0]) return null;
            const row = payload[0].payload as {
              cost: number;
              lambda: number;
              ai: number;
              renders: number;
              period: string;
              isAnomaly?: boolean;
              anomalyType?: "spike" | "drop";
              zScore?: number;
            };

            const tooltipLabel = row.isAnomaly
              ? `${label || row.period} · ${row.anomalyType === "spike" ? "Spike" : "Drop"} (z ${row.zScore?.toFixed(2)})`
              : label || row.period;

            return (
              <div className="relative space-y-1">
                <ChartTooltipContent
                  active={active}
                  payload={[
                    {
                      name: "cost",
                      value: row.cost,
                      payload: row,
                      color: "var(--color-cost)",
                    },
                  ]}
                  label={tooltipLabel}
                  formatter={(value) => [
                    formatCurrency(value as number),
                    "Total",
                  ]}
                />
                <div className="rounded-md border bg-background px-2 py-1 text-xs text-muted-foreground">
                  Lambda {formatCurrency(row.lambda)} · AI{" "}
                  {formatCurrency(row.ai)} ·{" "}
                  {formatNumber(row.renders)} renders
                </div>
                {row.isAnomaly ? (
                  <Badge
                    variant={
                      row.anomalyType === "spike" ? "destructive" : "secondary"
                    }
                    className="text-xs"
                  >
                    {row.anomalyType === "spike" ? "Spike" : "Drop"}
                  </Badge>
                ) : null}
              </div>
            );
          }}
        />
        <Bar
          dataKey="cost"
          fill="var(--color-cost)"
          radius={[4, 4, 0, 0]}
          onClick={(bar: { period: string }) => {
            if (bar?.period) {
              router.push(getPeriodDetailUrl(bar.period, granularity));
            }
          }}
          style={{ cursor: "pointer" }}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={
                entry.isAnomaly
                  ? entry.anomalyType === "spike"
                    ? "#ef4444"
                    : "#10b981"
                  : "var(--color-cost)"
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ChartCard>
  );
}
