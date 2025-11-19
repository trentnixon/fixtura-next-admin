"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useGlobalCostTrends } from "@/hooks/rollups/useGlobalCostTrends";
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
import { formatCurrency } from "@/utils/chart-formatters";

// Helper to format period dates for X-axis (e.g., "Nov 3 2025")
const formatPeriodDate = (period: string): string => {
  try {
    const date = new Date(period);
    const formatted = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    // Remove comma if present (e.g., "Nov 3, 2025" -> "Nov 3 2025")
    return formatted.replace(",", "");
  } catch {
    return period;
  }
};
import { detectAnomalies } from "./_utils/calculateAnomalies";
import { getPeriodDetailUrl } from "./_utils/navigation";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import { AlertTriangle, TrendingUp, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

  // Chart configuration
  const chartConfig = {
    cost: {
      label: "Cost",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  // Transform dataPoints for chart and detect anomalies
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
        lambda: point.totalLambdaCost,
        ai: point.totalAiCost,
        isAnomaly: anomalyIndices.has(index),
        anomalyType: anomaly?.type,
        zScore: anomaly?.zScore,
      };
    });
  }, [data]);

  const anomalyCount = chartData.filter((d) => d.isAnomaly).length;

  // Summary stats for ChartCard
  const summaryStats: ChartSummaryStat[] = useMemo(() => {
    if (!summary) return [];
    return [
      {
        icon: DollarSign,
        label: "Total Cost",
        value: formatCurrency(summary.totalCost ?? 0),
      },
      {
        icon: TrendingUp,
        label: "Average Cost",
        value: formatCurrency(summary.averageCost ?? 0),
      },
      {
        icon: DollarSign,
        label: "Peak Cost",
        value: formatCurrency(summary.peakCost ?? 0),
      },
    ];
  }, [summary]);

  // Add anomaly count to summary stats if anomalies exist
  const enhancedSummaryStats = useMemo(() => {
    if (anomalyCount > 0) {
      return [
        ...summaryStats,
        {
          icon: AlertTriangle,
          label: "Anomalies",
          value: `${anomalyCount} detected`,
        },
      ];
    }
    return summaryStats;
  }, [summaryStats, anomalyCount]);

  if (isLoading) return <LoadingState message="Loading trends..." />;
  if (isError)
    return (
      <ErrorState
        variant="card"
        title="Unable to load trends"
        error={error as Error}
      />
    );
  if (!data) return null;

  return (
    <ChartCard
      title={`Cost Trends (${granularity})`}
      description={`${data.dataPoints.length} data points from ${data.period.start} to ${data.period.end}`}
      chartConfig={chartConfig}
      summaryStats={enhancedSummaryStats}
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
            const data = payload[0].payload as {
              cost: number;
              period: string;
              isAnomaly?: boolean;
              anomalyType?: "spike" | "drop";
              zScore?: number;
            };

            const tooltipLabel = data.isAnomaly
              ? `${label || data.period} • ${
                  data.anomalyType === "spike" ? "Spike" : "Drop"
                } (Z: ${data.zScore?.toFixed(2)})`
              : label || data.period;

            return (
              <div className="relative">
                <ChartTooltipContent
                  active={active}
                  payload={payload}
                  label={tooltipLabel}
                  formatter={(value) => [
                    formatCurrency(value as number),
                    "Cost",
                  ]}
                />
                {data.isAnomaly && (
                  <div className="absolute -bottom-6 left-0 right-0 flex justify-center">
                    <Badge
                      variant={
                        data.anomalyType === "spike" ? "destructive" : "default"
                      }
                      className="text-xs"
                    >
                      {data.anomalyType === "spike" ? "Spike" : "Drop"} (Z:{" "}
                      {data.zScore?.toFixed(2)})
                    </Badge>
                  </div>
                )}
              </div>
            );
          }}
        />
        <Bar
          dataKey="cost"
          fill="var(--color-cost)"
          radius={[4, 4, 0, 0]}
          onClick={(data: { period: string }) => {
            if (data?.period) {
              router.push(getPeriodDetailUrl(data.period, granularity));
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
