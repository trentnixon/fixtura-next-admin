"use client";

import { useMemo } from "react";
import { useGlobalCostTrends } from "@/hooks/rollups/useGlobalCostTrends";
import ChartCard, {
  ChartSummaryStat,
} from "@/components/modules/charts/ChartCard";
import {
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { TrendGranularity } from "./PeriodControls";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { formatCurrency } from "@/utils/chart-formatters";
import { detectAnomalies } from "./_utils/calculateAnomalies";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import { AlertTriangle, DollarSign, Zap, Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

interface StackedCostTrendsChartProps {
  granularity?: TrendGranularity;
  startDate: string;
  endDate: string;
}

export default function StackedCostTrendsChart({
  granularity = "daily",
  startDate,
  endDate,
}: StackedCostTrendsChartProps) {
  const { data, isLoading, isError, error } = useGlobalCostTrends({
    granularity,
    startDate,
    endDate,
  });

  // Chart configuration
  const chartConfig = {
    lambda: {
      label: "Lambda Cost",
      color: "#3b82f6",
    },
    ai: {
      label: "AI Cost",
      color: "#10b981",
    },
  } satisfies ChartConfig;

  // Transform data for stacked bar chart and detect anomalies
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
        lambda: point.totalLambdaCost ?? 0,
        ai: point.totalAiCost ?? 0,
        total: point.totalCost ?? 0,
        isAnomaly: anomalyIndices.has(index),
        anomalyType: anomaly?.type,
        zScore: anomaly?.zScore,
      };
    });
  }, [data]);

  const anomalyCount = chartData.filter((d) => d.isAnomaly).length;

  // Summary stats for ChartCard
  const summaryStats: ChartSummaryStat[] = useMemo(() => {
    if (chartData.length === 0) return [];
    const totalLambda = chartData.reduce((sum, d) => sum + d.lambda, 0);
    const totalAi = chartData.reduce((sum, d) => sum + d.ai, 0);
    const totalCost = chartData.reduce((sum, d) => sum + d.total, 0);

    return [
      {
        icon: Zap,
        label: "Total Lambda Cost",
        value: formatCurrency(totalLambda),
      },
      {
        icon: Brain,
        label: "Total AI Cost",
        value: formatCurrency(totalAi),
      },
      {
        icon: DollarSign,
        label: "Total Cost",
        value: formatCurrency(totalCost),
      },
    ];
  }, [chartData]);

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

  if (isLoading)
    return <LoadingState message="Loading cost breakdown trends..." />;
  if (isError)
    return (
      <ErrorState
        variant="card"
        title="Unable to load cost breakdown trends"
        error={error as Error}
      />
    );
  if (!data) return null;

  return (
    <ChartCard
      title="Cost Breakdown Over Time (Lambda vs AI)"
      description={
        chartData.length > 0
          ? `${data.dataPoints.length} data points from ${data.period.start} to ${data.period.end}`
          : "No cost breakdown data available"
      }
      chartConfig={chartConfig}
      summaryStats={enhancedSummaryStats}
      chartClassName="h-[350px]"
      emptyStateMessage="No cost breakdown data available"
    >
      {chartData.length > 0 ? (
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
              if (!active || !payload || payload.length === 0) return null;

              const data = payload[0].payload as {
                lambda: number;
                ai: number;
                total: number;
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
                    formatter={(value, name) => {
                      const label =
                        name === "lambda"
                          ? "Lambda Cost"
                          : name === "ai"
                          ? "AI Cost"
                          : "Total";
                      return [formatCurrency(value as number), label];
                    }}
                  />
                  {data.isAnomaly && (
                    <div className="absolute -bottom-6 left-0 right-0 flex justify-center">
                      <Badge
                        variant={
                          data.anomalyType === "spike"
                            ? "destructive"
                            : "default"
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
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="lambda"
            stackId="cost"
            fill="var(--color-lambda)"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="ai"
            stackId="cost"
            fill="var(--color-ai)"
            radius={[4, 4, 0, 0]}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.isAnomaly
                    ? entry.anomalyType === "spike"
                      ? "#ef4444"
                      : "#10b981"
                    : "var(--color-ai)"
                }
                stroke={
                  entry.isAnomaly
                    ? entry.anomalyType === "spike"
                      ? "#dc2626"
                      : "#059669"
                    : "none"
                }
                strokeWidth={entry.isAnomaly ? 2 : 0}
              />
            ))}
          </Bar>
        </BarChart>
      ) : null}
    </ChartCard>
  );
}
