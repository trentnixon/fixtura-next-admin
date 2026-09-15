"use client";

import { useMemo } from "react";
import { AlertTriangle, Brain, DollarSign, Layers, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { useGlobalCostTrends } from "@/hooks/rollups/useGlobalCostTrends";
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
} from "@/utils/chart-formatters";
import { detectAnomalies } from "./_utils/calculateAnomalies";
import { formatPeriodDate } from "./_utils/budgetChartHelpers";
import { TrendGranularity } from "./PeriodControls";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";

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

  const chartConfig = {
    lambda: {
      label: "Lambda",
      color: "hsl(var(--chart-1))",
    },
    ai: {
      label: "AI",
      color: "hsl(var(--chart-2))",
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
        lambda: point.totalLambdaCost ?? 0,
        ai: point.totalAiCost ?? 0,
        total: point.totalCost ?? 0,
        renders: point.totalRenders ?? 0,
        isAnomaly: anomalyIndices.has(index),
        anomalyType: anomaly?.type,
        zScore: anomaly?.zScore,
      };
    });
  }, [data]);

  const anomalyCount = chartData.filter((d) => d.isAnomaly).length;

  const summaryStats: ChartSummaryStat[] = useMemo(() => {
    if (chartData.length === 0) return [];
    const totalLambda = chartData.reduce((sum, d) => sum + d.lambda, 0);
    const totalAi = chartData.reduce((sum, d) => sum + d.ai, 0);
    const totalCost = chartData.reduce((sum, d) => sum + d.total, 0);
    const aiShare = totalCost > 0 ? (totalAi / totalCost) * 100 : 0;

    const stats: ChartSummaryStat[] = [
      {
        icon: Zap,
        label: "Lambda",
        value: formatCurrency(totalLambda),
      },
      {
        icon: Brain,
        label: "AI",
        value: formatCurrency(totalAi),
      },
      {
        icon: DollarSign,
        label: "Combined",
        value: formatCurrency(totalCost),
      },
      {
        icon: Layers,
        label: "AI share",
        value: formatPercentage(aiShare),
      },
    ];

    if (anomalyCount > 0) {
      stats.push({
        icon: AlertTriangle,
        label: "Anomalies",
        value: formatNumber(anomalyCount),
      });
    }

    return stats;
  }, [chartData, anomalyCount]);

  if (isLoading) {
    return (
      <LoadingState variant="minimal" message="Loading cost breakdown trends…" />
    );
  }
  if (isError) {
    return (
      <ErrorState
        variant="minimal"
        title="Unable to load cost breakdown trends"
        error={error as Error}
      />
    );
  }
  if (!data) return null;

  return (
    <ChartCard
      title="Lambda vs AI over time"
      description={`Stacked ${granularity} infrastructure spend`}
      icon={Layers}
      chartConfig={chartConfig}
      summaryStats={summaryStats}
      summaryStatsLayout="inline"
      chartClassName="h-[320px]"
      emptyStateMessage="No cost breakdown in this window"
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

              const row = payload[0].payload as {
                lambda: number;
                ai: number;
                total: number;
                renders: number;
                period: string;
                isAnomaly?: boolean;
                anomalyType?: "spike" | "drop";
                zScore?: number;
              };

              const tooltipLabel = row.isAnomaly
                ? `${label || row.period} · ${row.anomalyType === "spike" ? "Spike" : "Drop"}`
                : label || row.period;

              return (
                <div className="space-y-1">
                  <ChartTooltipContent
                    active={active}
                    payload={payload}
                    label={tooltipLabel}
                    formatter={(value, name) => {
                      const seriesLabel =
                        name === "lambda"
                          ? "Lambda"
                          : name === "ai"
                            ? "AI"
                            : String(name);
                      return [formatCurrency(value as number), seriesLabel];
                    }}
                  />
                  <div className="text-xs text-muted-foreground">
                    Total {formatCurrency(row.total)} ·{" "}
                    {formatNumber(row.renders)} renders
                  </div>
                  {row.isAnomaly ? (
                    <Badge
                      variant={
                        row.anomalyType === "spike" ? "destructive" : "secondary"
                      }
                      className="text-xs"
                    >
                      z {row.zScore?.toFixed(2)}
                    </Badge>
                  ) : null}
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
