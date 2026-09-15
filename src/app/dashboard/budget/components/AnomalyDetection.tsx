"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ScanSearch,
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
  formatPercentage,
} from "@/utils/chart-formatters";
import {
  detectAnomalies,
  detectAnomaliesByThreshold,
} from "./_utils/calculateAnomalies";
import { calculateMean } from "./_utils/calculateAnomalies";
import { formatPeriodDate } from "./_utils/budgetChartHelpers";
import { getPeriodDetailUrl } from "./_utils/navigation";
import type { TrendGranularity } from "./PeriodControls";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";

export type AnomalyDetectionMethod = "zscore" | "threshold";

export interface AnomalyDetectionProps {
  granularity: TrendGranularity;
  startDate: string;
  endDate: string;
  method?: AnomalyDetectionMethod;
  showHeader?: boolean;
}

export default function AnomalyDetection({
  granularity,
  startDate,
  endDate,
  method = "zscore",
  showHeader = true,
}: AnomalyDetectionProps) {
  const router = useRouter();

  const { data, isLoading, isError, error } = useGlobalCostTrends({
    granularity,
    startDate,
    endDate,
  });

  const chartConfig = {
    cost: {
      label: "Cost",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const meanCost = useMemo(() => {
    if (!data?.dataPoints?.length) return 0;
    return calculateMean(data.dataPoints.map((dp) => dp.totalCost ?? 0));
  }, [data]);

  const anomalies = useMemo(() => {
    if (!data?.dataPoints || data.dataPoints.length < 3) return [];

    const dataPoints = data.dataPoints.map((dp) => ({
      period: dp.period,
      cost: dp.totalCost ?? 0,
    }));

    if (method === "zscore") {
      return detectAnomalies(dataPoints, 2);
    }
    return detectAnomaliesByThreshold(dataPoints, 50);
  }, [data, method]);

  const chartData = useMemo(() => {
    if (!data?.dataPoints) return [];
    return data.dataPoints.map((point, index) => {
      const anomaly = anomalies.find((a) => a.index === index);
      return {
        period: point.period,
        periodLabel: formatPeriodDate(point.period),
        cost: point.totalCost ?? 0,
        lambda: point.totalLambdaCost ?? 0,
        ai: point.totalAiCost ?? 0,
        renders: point.totalRenders ?? 0,
        isAnomaly: !!anomaly,
        anomalyType: anomaly?.type,
        zScore: anomaly?.zScore,
      };
    });
  }, [data, anomalies]);

  const spikeCount = anomalies.filter((a) => a.type === "spike").length;
  const dropCount = anomalies.filter((a) => a.type === "drop").length;

  const summaryStats: ChartSummaryStat[] = useMemo(
    () => [
      {
        icon: ScanSearch,
        label: "Flagged",
        value: formatNumber(anomalies.length),
      },
      {
        icon: TrendingUp,
        label: "Spikes",
        value: formatNumber(spikeCount),
      },
      {
        icon: TrendingDown,
        label: "Drops",
        value: formatNumber(dropCount),
      },
      {
        icon: AlertTriangle,
        label: "Series mean",
        value: formatCurrency(meanCost),
      },
    ],
    [anomalies.length, spikeCount, dropCount, meanCost],
  );

  if (isLoading) {
    return (
      <LoadingState variant="minimal" message="Loading anomaly detection…" />
    );
  }
  if (isError && error) {
    return (
      <ErrorState
        variant="minimal"
        title="Unable to load anomaly detection"
        error={error as Error}
      />
    );
  }

  const methodLabel =
    method === "zscore" ? "Z-score (2σ)" : "±50% vs mean";

  return (
    <div className="space-y-6">
      {showHeader ? (
        <div>
          <h3 className="text-lg font-semibold">Anomaly detection</h3>
          <p className="text-sm text-muted-foreground">
            {methodLabel} on {granularity} total cost
          </p>
        </div>
      ) : null}

      <ChartCard
        title="Cost with flags"
        description={`${methodLabel} · ${startDate} → ${endDate}`}
        icon={ScanSearch}
        chartConfig={chartConfig}
        summaryStats={summaryStats}
        summaryStatsLayout="inline"
        chartClassName="h-[320px]"
        emptyStateMessage={
          chartData.length < 3
            ? "Need at least 3 buckets for detection"
            : "No anomalies in this window"
        }
      >
        {chartData.length >= 3 ? (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="periodLabel"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
              angle={-35}
              textAnchor="end"
              height={70}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <ChartTooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload[0]) return null;
                const row = payload[0].payload as (typeof chartData)[0];
                return (
                  <div className="space-y-1">
                    <ChartTooltipContent
                      active={active}
                      payload={payload}
                      label={row.periodLabel}
                      formatter={(value) => [
                        formatCurrency(value as number),
                        "Total",
                      ]}
                    />
                    <p className="px-2 text-xs text-muted-foreground">
                      λ {formatCurrency(row.lambda)} · AI{" "}
                      {formatCurrency(row.ai)} · {formatNumber(row.renders)}{" "}
                      renders
                    </p>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="cost"
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
                        ? "hsl(var(--destructive))"
                        : "hsl(var(--chart-2))"
                      : "hsl(var(--chart-1))"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        ) : null}
      </ChartCard>

      {anomalies.length > 0 && data ? (
        <div className="rounded-md border border-slate-200 bg-white p-4">
          <h4 className="mb-3 text-sm font-medium text-slate-900">
            Flagged buckets
          </h4>
          <ul className="max-h-72 space-y-2 overflow-y-auto">
            {anomalies
              .slice()
              .sort((a, b) => Math.abs(b.zScore) - Math.abs(a.zScore))
              .map((anomaly) => {
                const dataPoint = data.dataPoints[anomaly.index];
                const pctVsMean =
                  meanCost > 0
                    ? ((anomaly.value - meanCost) / meanCost) * 100
                    : 0;
                return (
                  <li
                    key={`${anomaly.index}-${dataPoint.period}`}
                    className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-100 p-3 transition-colors hover:bg-slate-50"
                    onClick={() =>
                      router.push(
                        getPeriodDetailUrl(dataPoint.period, granularity),
                      )
                    }
                  >
                    <div className="flex items-center gap-3">
                      {anomaly.type === "spike" ? (
                        <AlertTriangle
                          className="h-5 w-5 text-red-600"
                          aria-hidden
                        />
                      ) : (
                        <TrendingDown
                          className="h-5 w-5 text-emerald-600"
                          aria-hidden
                        />
                      )}
                      <div>
                        <div className="font-medium">
                          {formatPeriodDate(dataPoint.period)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {anomaly.type === "spike" ? "Spike" : "Drop"} ·{" "}
                          {method === "zscore"
                            ? `z ${anomaly.zScore.toFixed(2)}`
                            : `${formatPercentage(Math.abs(pctVsMean))} vs mean`}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold tabular-nums">
                        {formatCurrency(anomaly.value)}
                      </div>
                      <Badge
                        variant={
                          anomaly.type === "spike" ? "destructive" : "secondary"
                        }
                        className="mt-1 text-xs"
                      >
                        {formatCurrency(meanCost)} mean
                      </Badge>
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
