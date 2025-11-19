"use client";

import { useMemo, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { formatCurrency } from "@/utils/chart-formatters";
import {
  forecastSMA,
  forecastLinearRegression,
  forecastHybrid,
  type ForecastResult,
} from "./_utils/forecasting";
import { TrendGranularity } from "./PeriodControls";
import { TrendingUp, TrendingDown, Minus, AlertCircle, DollarSign } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

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

type ForecastMethod = "sma" | "linear" | "hybrid";

export default function CostForecast() {
  const [granularity, setGranularity] = useState<TrendGranularity>("daily");
  const [method, setMethod] = useState<ForecastMethod>("hybrid");
  const [forecastPeriods, setForecastPeriods] = useState(4);

  // Calculate date range based on granularity (get more historical data for better forecasts)
  const { startDate, endDate } = useMemo(() => {
    const end = new Date();
    const start = new Date(end);
    if (granularity === "daily") {
      start.setDate(end.getDate() - 59); // Last 60 days
    } else if (granularity === "weekly") {
      start.setDate(end.getDate() - 7 * 24); // Last 24 weeks
    } else {
      start.setMonth(end.getMonth() - 23); // Last 24 months
    }
    const toYmd = (d: Date) => d.toISOString().slice(0, 10);
    return { startDate: toYmd(start), endDate: toYmd(end) };
  }, [granularity]);

  const { data, isLoading, isError, error } = useGlobalCostTrends({
    granularity,
    startDate,
    endDate,
  });

  // Generate forecast
  const forecast = useMemo<ForecastResult | null>(() => {
    if (!data?.dataPoints || data.dataPoints.length < 3) return null;

    const historicalData = data.dataPoints.map((point) => ({
      period: point.period,
      cost: point.totalCost ?? 0,
    }));

    switch (method) {
      case "sma":
        return forecastSMA(historicalData, forecastPeriods, 7);
      case "linear":
        return forecastLinearRegression(historicalData, forecastPeriods);
      case "hybrid":
      default:
        return forecastHybrid(historicalData, forecastPeriods, 7);
    }
  }, [data, method, forecastPeriods]);

  // Combine historical and projected data for chart
  const chartData = useMemo(() => {
    if (!forecast) return [];
    return [...forecast.historical, ...forecast.projected];
  }, [forecast]);

  // Chart configuration
  const chartConfig = {
    historical: {
      label: "Historical Cost",
      color: "hsl(var(--chart-1))",
    },
    forecast: {
      label: "Forecast",
      color: "hsl(var(--chart-2))",
    },
    confidenceUpper: {
      label: "Upper Bound (95%)",
      color: "hsl(var(--muted-foreground))",
    },
    confidenceLower: {
      label: "Lower Bound (95%)",
      color: "hsl(var(--muted-foreground))",
    },
  } satisfies ChartConfig;

  // Summary stats for ChartCard
  const summaryStats: ChartSummaryStat[] = useMemo(() => {
    if (!forecast) return [];
    return [
      {
        icon: DollarSign,
        label: "Next Period Estimate",
        value: formatCurrency(forecast.nextPeriodEstimate),
      },
      {
        icon: AlertCircle,
        label: "Confidence (±95%)",
        value: `±${formatCurrency(forecast.confidenceInterval)}`,
      },
      {
        icon:
          forecast.trend === "increasing"
            ? TrendingUp
            : forecast.trend === "decreasing"
            ? TrendingDown
            : Minus,
        label: "Trend",
        value:
          forecast.trend === "increasing"
            ? "Increasing"
            : forecast.trend === "decreasing"
            ? "Decreasing"
            : "Stable",
        variant:
          forecast.trend === "increasing"
            ? "destructive"
            : forecast.trend === "decreasing"
            ? "success"
            : "secondary",
      },
    ];
  }, [forecast]);

  // Prepare chart data with formatted labels
  const chartDataWithLabels = useMemo(() => {
    if (!forecast) return [];
    return chartData.map((point) => ({
      ...point,
      periodLabel: formatPeriodDate(point.period),
    }));
  }, [chartData, forecast]);

  if (isLoading)
    return <LoadingState message="Loading forecast data..." />;
  if (isError && error)
    return (
      <ErrorState
        variant="card"
        title="Unable to load forecast data"
        error={error as Error}
      />
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Cost Forecast</h3>
          <p className="text-sm text-muted-foreground">
            Historical cost trends and projected forecasts using{" "}
            {method === "sma"
              ? "Moving Average"
              : method === "linear"
              ? "Linear Regression"
              : "Hybrid"}{" "}
            method ({granularity})
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
            onValueChange={(v) => setMethod(v as ForecastMethod)}
          >
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sma">Moving Avg</SelectItem>
              <SelectItem value="linear">Linear</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={forecastPeriods.toString()}
            onValueChange={(v) => setForecastPeriods(parseInt(v, 10))}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 periods</SelectItem>
              <SelectItem value="4">4 periods</SelectItem>
              <SelectItem value="6">6 periods</SelectItem>
              <SelectItem value="8">8 periods</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <ChartCard
        title=""
        description=""
        chartConfig={chartConfig}
        summaryStats={summaryStats}
        chartClassName="h-[400px]"
        emptyStateMessage="Insufficient data for forecasting (need at least 3 data points)"
      >
        {forecast && chartDataWithLabels.length > 0 ? (
          <LineChart data={chartDataWithLabels}>
            <defs>
              <linearGradient
                id="colorConfidence"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="hsl(var(--muted-foreground))"
                  stopOpacity={0.2}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--muted-foreground))"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
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
                if (!active || !payload || !payload.length) return null;
                return (
                  <ChartTooltipContent
                    active={active}
                    payload={payload}
                    label={payload[0]?.payload?.periodLabel}
                    formatter={(value, name) => {
                      if (value == null) return [null, name];
                      return [formatCurrency(value as number), name];
                    }}
                  />
                );
              }}
            />
            <ChartLegend
              content={<ChartLegendContent />}
            />
            <ReferenceLine
              x={chartDataWithLabels[forecast.historical.length - 1]?.periodLabel}
              stroke="hsl(var(--destructive))"
              strokeDasharray="5 5"
              label={{ value: "Now", position: "top" }}
            />
            {/* Historical data - solid line */}
            <Line
              type="monotone"
              dataKey="historicalCost"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--chart-1))", r: 4 }}
              connectNulls={false}
              name="Historical Cost"
            />
            {/* Forecasted data - dashed line */}
            <Line
              type="monotone"
              dataKey="forecastCost"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              connectNulls={false}
              name="Forecast"
            />
            {/* Confidence bounds */}
            <Line
              type="monotone"
              dataKey="confidenceUpper"
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="3 3"
              strokeWidth={1}
              dot={false}
              name="Upper Bound (95%)"
            />
            <Line
              type="monotone"
              dataKey="confidenceLower"
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="3 3"
              strokeWidth={1}
              dot={false}
              name="Lower Bound (95%)"
            />
          </LineChart>
        ) : null}
      </ChartCard>

      {/* Forecast Details */}
      {forecast && forecast.projected.length > 0 && (
        <div className="rounded-lg border bg-card p-4">
          <h3 className="text-sm font-medium mb-3">Projected Periods</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {forecast.projected.map((point, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div>
                  <div className="font-medium">{formatPeriodDate(point.period)}</div>
                  <div className="text-xs text-muted-foreground">
                    Forecast: {formatCurrency(point.forecast)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">
                    {formatCurrency(point.confidenceLower)} -{" "}
                    {formatCurrency(point.confidenceUpper)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    95% confidence
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Forecast Disclaimer */}
      {forecast && (
        <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-yellow-800 dark:text-yellow-200">
            <strong>Note:</strong> Forecasts are based on historical trends
            and statistical models. Actual costs may vary significantly due to
            external factors, usage patterns, and system changes. Use forecasts
            as guidance, not guarantees.
          </div>
        </div>
      )}
    </div>
  );
}

