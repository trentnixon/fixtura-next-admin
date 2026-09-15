"use client";

import { useMemo } from "react";
import {
  AlertCircle,
  DollarSign,
  LineChart,
  Minus,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
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
import { formatCurrency } from "@/utils/chart-formatters";
import {
  forecastSMA,
  forecastLinearRegression,
  forecastHybrid,
  type ForecastResult,
} from "./_utils/forecasting";
import { formatPeriodDate } from "./_utils/budgetChartHelpers";
import type { TrendGranularity } from "./PeriodControls";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

export type ForecastMethod = "sma" | "linear" | "hybrid";

export interface CostForecastProps {
  granularity: TrendGranularity;
  startDate: string;
  endDate: string;
  method?: ForecastMethod;
  forecastPeriods?: number;
  showHeader?: boolean;
}

type ChartRow = {
  period: string;
  periodLabel: string;
  historicalCost: number | null;
  forecastCost: number | null;
  confidenceUpper: number | null;
  confidenceLower: number | null;
};

export default function CostForecast({
  granularity,
  startDate,
  endDate,
  method = "hybrid",
  forecastPeriods = 4,
  showHeader = true,
}: CostForecastProps) {
  const { data, isLoading, isError, error } = useGlobalCostTrends({
    granularity,
    startDate,
    endDate,
  });

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

  const chartDataWithLabels = useMemo((): ChartRow[] => {
    if (!forecast) return [];

    const historicalRows: ChartRow[] = forecast.historical.map((point) => ({
      period: point.period,
      periodLabel: formatPeriodDate(point.period),
      historicalCost: point.forecast,
      forecastCost: null,
      confidenceUpper: point.confidenceUpper,
      confidenceLower: point.confidenceLower,
    }));

    const lastHistorical = historicalRows[historicalRows.length - 1];
    const projectedRows: ChartRow[] = forecast.projected.map((point, index) => ({
      period: point.period,
      periodLabel: point.period.startsWith("Period")
        ? point.period
        : formatPeriodDate(point.period),
      historicalCost: index === 0 && lastHistorical ? lastHistorical.historicalCost : null,
      forecastCost: point.forecast,
      confidenceUpper: point.confidenceUpper,
      confidenceLower: point.confidenceLower,
    }));

    return [...historicalRows, ...projectedRows];
  }, [forecast]);

  const projectedTotal = useMemo(() => {
    if (!forecast) return 0;
    return forecast.projected.reduce((sum, p) => sum + p.forecast, 0);
  }, [forecast]);

  const chartConfig = {
    historical: {
      label: "Historical",
      color: "hsl(var(--chart-1))",
    },
    forecast: {
      label: "Forecast",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  const summaryStats: ChartSummaryStat[] = useMemo(() => {
    if (!forecast) return [];
    const TrendIcon =
      forecast.trend === "increasing"
        ? TrendingUp
        : forecast.trend === "decreasing"
          ? TrendingDown
          : Minus;

    return [
      {
        icon: DollarSign,
        label: "Next bucket",
        value: formatCurrency(forecast.nextPeriodEstimate),
      },
      {
        icon: AlertCircle,
        label: "95% band (±)",
        value: formatCurrency(forecast.confidenceInterval),
      },
      {
        icon: TrendIcon,
        label: "Direction",
        value:
          forecast.trend === "increasing"
            ? "Increasing"
            : forecast.trend === "decreasing"
              ? "Decreasing"
              : "Stable",
      },
      {
        icon: LineChart,
        label: `${forecastPeriods} ahead sum`,
        value: formatCurrency(projectedTotal),
      },
    ];
  }, [forecast, forecastPeriods, projectedTotal]);

  if (isLoading) {
    return <LoadingState variant="minimal" message="Loading forecast…" />;
  }
  if (isError && error) {
    return (
      <ErrorState
        variant="minimal"
        title="Unable to load forecast"
        error={error as Error}
      />
    );
  }

  const methodLabel =
    method === "sma"
      ? "Moving average"
      : method === "linear"
        ? "Linear regression"
        : "Hybrid";

  const pivotLabel =
    forecast && chartDataWithLabels.length > 0
      ? chartDataWithLabels[forecast.historical.length - 1]?.periodLabel
      : undefined;

  return (
    <div className="space-y-6">
      {showHeader ? (
        <div>
          <h3 className="text-lg font-semibold">Cost forecast</h3>
          <p className="text-sm text-muted-foreground">
            {methodLabel} · {granularity}
          </p>
        </div>
      ) : null}

      <ChartCard
        title="Historical vs projected"
        description={`${methodLabel} · history from ${startDate}`}
        icon={LineChart}
        chartConfig={chartConfig}
        summaryStats={summaryStats}
        summaryStatsLayout="inline"
        chartClassName="h-[360px]"
        emptyStateMessage="Need at least 3 buckets to forecast"
      >
        {forecast && chartDataWithLabels.length > 0 ? (
          <RechartsLineChart data={chartDataWithLabels}>
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
                if (!active || !payload?.length) return null;
                return (
                  <ChartTooltipContent
                    active={active}
                    payload={payload}
                    label={payload[0]?.payload?.periodLabel}
                    formatter={(value, name) => {
                      if (value == null) return [null, String(name)];
                      return [formatCurrency(value as number), String(name)];
                    }}
                  />
                );
              }}
            />
            <ChartLegend content={<ChartLegendContent />} />
            {pivotLabel ? (
              <ReferenceLine
                x={pivotLabel}
                stroke="hsl(var(--destructive))"
                strokeDasharray="5 5"
                label={{ value: "Now", position: "top" }}
              />
            ) : null}
            <Line
              type="monotone"
              dataKey="historicalCost"
              stroke="var(--color-historical)"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--chart-1))", r: 3 }}
              connectNulls={false}
              name="Historical"
            />
            <Line
              type="monotone"
              dataKey="forecastCost"
              stroke="var(--color-forecast)"
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={{ fill: "hsl(var(--chart-2))", r: 3 }}
              connectNulls
              name="Forecast"
            />
            <Line
              type="monotone"
              dataKey="confidenceUpper"
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="3 3"
              strokeWidth={1}
              dot={false}
              connectNulls
              name="Upper 95%"
            />
            <Line
              type="monotone"
              dataKey="confidenceLower"
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="3 3"
              strokeWidth={1}
              dot={false}
              connectNulls
              name="Lower 95%"
            />
          </RechartsLineChart>
        ) : null}
      </ChartCard>

      {forecast && forecast.projected.length > 0 ? (
        <div className="rounded-md border border-slate-200 bg-white p-4">
          <h4 className="mb-3 text-sm font-medium">Projected buckets</h4>
          <ul className="max-h-48 space-y-2 overflow-y-auto">
            {forecast.projected.map((point) => (
              <li
                key={point.period}
                className="flex items-center justify-between rounded-lg border border-slate-100 p-3"
              >
                <div>
                  <div className="font-medium">
                    {point.period.startsWith("Period")
                      ? point.period
                      : formatPeriodDate(point.period)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Point estimate {formatCurrency(point.forecast)}
                  </div>
                </div>
                <div className="text-right text-sm tabular-nums">
                  {formatCurrency(point.confidenceLower)} –{" "}
                  {formatCurrency(point.confidenceUpper)}
                  <div className="text-xs text-muted-foreground">95% band</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {forecast ? (
        <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-950">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <p>
            Forecasts follow historical spend only. Usage changes, releases, and
            seasonality can diverge from these projections — use as planning
            signal, not a budget commitment.
          </p>
        </div>
      ) : null}
    </div>
  );
}
