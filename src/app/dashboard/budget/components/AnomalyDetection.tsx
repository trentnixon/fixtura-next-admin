"use client";

import { useMemo, useState } from "react";
import { useGlobalCostTrends } from "@/hooks/rollups/useGlobalCostTrends";
import ChartCard, {
  ChartSummaryStat,
} from "@/components/modules/charts/ChartCard";
import {
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { formatCurrency } from "@/utils/chart-formatters";
import {
  detectAnomalies,
  detectAnomaliesByThreshold,
} from "./_utils/calculateAnomalies";
import { TrendGranularity } from "./PeriodControls";
import { AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";

type DetectionMethod = "zscore" | "threshold";

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

export default function AnomalyDetection() {
  const [granularity, setGranularity] = useState<TrendGranularity>("daily");
  const [method, setMethod] = useState<DetectionMethod>("zscore");

  // Calculate date range based on granularity
  const { startDate, endDate } = useMemo(() => {
    const end = new Date();
    const start = new Date(end);
    if (granularity === "daily") {
      start.setDate(end.getDate() - 29); // Last 30 days
    } else if (granularity === "weekly") {
      start.setDate(end.getDate() - 7 * 12); // Last 12 weeks
    } else {
      start.setMonth(end.getMonth() - 11); // Last 12 months
    }
    const toYmd = (d: Date) => d.toISOString().slice(0, 10);
    return { startDate: toYmd(start), endDate: toYmd(end) };
  }, [granularity]);

  const { data, isLoading, isError, error } = useGlobalCostTrends({
    granularity,
    startDate,
    endDate,
  });

  // Chart configuration
  const chartConfig = {
    cost: {
      label: "Cost",
      color: "hsl(var(--chart-1))",
    },
    spike: {
      label: "Spike",
      color: "hsl(var(--destructive))",
    },
    drop: {
      label: "Drop",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  // Detect anomalies
  const anomalies = useMemo(() => {
    if (!data?.dataPoints || data.dataPoints.length < 3) return [];

    const dataPoints = data.dataPoints.map((dp) => ({
      period: dp.period,
      cost: dp.totalCost ?? 0,
    }));

    if (method === "zscore") {
      return detectAnomalies(dataPoints, 2);
    } else {
      return detectAnomaliesByThreshold(dataPoints, 50);
    }
  }, [data, method]);

  // Prepare chart data with anomaly flags
  const chartData = useMemo(() => {
    if (!data?.dataPoints) return [];
    return data.dataPoints.map((point, index) => {
      const anomaly = anomalies.find((a) => a.index === index);
      return {
        period: point.period,
        periodLabel: formatPeriodDate(point.period),
        cost: point.totalCost ?? 0,
        isAnomaly: !!anomaly,
        anomalyType: anomaly?.type,
        zScore: anomaly?.zScore,
      };
    });
  }, [data, anomalies]);

  const spikeCount = anomalies.filter((a) => a.type === "spike").length;
  const dropCount = anomalies.filter((a) => a.type === "drop").length;

  // Summary stats for ChartCard
  const summaryStats: ChartSummaryStat[] = useMemo(() => {
    return [
      {
        icon: AlertTriangle,
        label: "Total Anomalies",
        value: anomalies.length.toString(),
      },
      {
        icon: TrendingUp,
        label: "Cost Spikes",
        value: spikeCount.toString(),
        variant: "destructive",
      },
      {
        icon: TrendingDown,
        label: "Cost Drops",
        value: dropCount.toString(),
        variant: "success",
      },
    ];
  }, [anomalies.length, spikeCount, dropCount]);

  if (isLoading) return <LoadingState message="Loading anomaly detection..." />;
  if (isError && error)
    return (
      <ErrorState
        variant="card"
        title="Unable to load anomaly detection"
        error={error as Error}
      />
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Anomaly Detection</h3>
          <p className="text-sm text-muted-foreground">
            Cost anomaly detection using{" "}
            {method === "zscore" ? "Z-Score" : "Threshold"} method (
            {granularity})
          </p>
        </div>
        <div className="flex gap-2">
          <Select
            value={granularity}
            onValueChange={(v) => setGranularity(v as TrendGranularity)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={method}
            onValueChange={(v) => setMethod(v as DetectionMethod)}
          >
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="zscore">Z-Score</SelectItem>
              <SelectItem value="threshold">Threshold</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <ChartCard
        title=""
        description=""
        chartConfig={chartConfig}
        summaryStats={summaryStats}
        chartClassName="h-[350px]"
        emptyStateMessage={
          chartData.length === 0
            ? "Insufficient data for anomaly detection (need at least 3 data points)"
            : "No anomalies detected in this period"
        }
      >
        {chartData.length > 0 ? (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="periodLabel"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <ChartTooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload[0]) return null;
                const data = payload[0].payload as {
                  periodLabel: string;
                  cost: number;
                  isAnomaly: boolean;
                  anomalyType?: "spike" | "drop";
                  zScore?: number;
                };
                return (
                  <div className="relative">
                    <ChartTooltipContent
                      active={active}
                      payload={payload}
                      label={data.periodLabel}
                      formatter={(value) => [
                        formatCurrency(value as number),
                        "Cost",
                      ]}
                    />
                    {data.isAnomaly && (
                      <div className="absolute -bottom-8 left-0 right-0 flex justify-center">
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
            <Bar dataKey="cost" radius={[4, 4, 0, 0]}>
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

      {/* Anomaly Details */}
      {anomalies.length > 0 && data && (
        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-sm font-medium mb-3">Detected Anomalies</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {anomalies
              .sort((a, b) => Math.abs(b.zScore) - Math.abs(a.zScore))
              .map((anomaly, idx) => {
                const dataPoint = data.dataPoints[anomaly.index];
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {anomaly.type === "spike" ? (
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-green-600" />
                      )}
                      <div>
                        <div className="font-medium">
                          {formatPeriodDate(dataPoint.period)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {anomaly.type === "spike"
                            ? "Unusual cost spike"
                            : "Unusual cost drop"}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {formatCurrency(anomaly.value)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Z-Score: {anomaly.zScore.toFixed(2)}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
