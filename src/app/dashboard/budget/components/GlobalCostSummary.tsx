"use client";

import { useMemo } from "react";
import { useGlobalCostSummary } from "@/hooks/rollups/useGlobalCostSummary";
import { useGlobalCostTrends } from "@/hooks/rollups/useGlobalCostTrends";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { detectAnomalies } from "./_utils/calculateAnomalies";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/utils/chart-formatters";

export default function GlobalCostSummaryCard({
  period = "current-month" as
    | "current-month"
    | "last-month"
    | "current-year"
    | "all-time",
}) {
  const { data, isLoading, isError, error } = useGlobalCostSummary(period);

  // Fetch trend data for anomaly detection (last 30 days for current month)
  const { data: trendData } = useGlobalCostTrends({
    granularity: "daily",
    startDate: useMemo(() => {
      const end = new Date();
      const start = new Date(end);
      start.setDate(end.getDate() - 29);
      return start.toISOString().slice(0, 10);
    }, []),
    endDate: useMemo(() => new Date().toISOString().slice(0, 10), []),
  });

  // Detect anomalies in recent trends
  const recentAnomalies = useMemo(() => {
    if (!trendData?.dataPoints || trendData.dataPoints.length < 3) return [];
    const dataPoints = trendData.dataPoints.map((point) => ({
      cost: point.totalCost ?? 0,
    }));
    return detectAnomalies(dataPoints, 2);
  }, [trendData]);

  const spikeCount = recentAnomalies.filter((a) => a.type === "spike").length;
  const hasAnomalies = recentAnomalies.length > 0;

  if (isLoading)
    return <LoadingState message="Loading global cost summary..." />;
  if (isError)
    return (
      <ErrorState
        variant="card"
        title="Unable to load global summary"
        error={error as Error}
      />
    );
  if (!data) return null;

  const summaryData = [
    {
      label: "Total Cost",
      value: data.totalCost,
      isCurrency: true,
    },
    {
      label: "Lambda Cost",
      value: data.totalLambdaCost,
      isCurrency: true,
    },
    {
      label: "AI Cost",
      value: data.totalAiCost,
      isCurrency: true,
    },
    {
      label: "Renders",
      value: data.totalRenders ?? 0,
      isCurrency: false,
    },
    {
      label: "Accounts",
      value: data.totalAccounts ?? 0,
      isCurrency: false,
    },
    {
      label: "Schedulers",
      value: data.totalSchedulers ?? 0,
      isCurrency: false,
    },
  ];

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-between">
        {hasAnomalies && (
          <Badge
            variant={spikeCount > 0 ? "destructive" : "default"}
            className="flex items-center gap-1"
          >
            <AlertTriangle className="h-3 w-3" />
            {recentAnomalies.length} Anomal
            {recentAnomalies.length === 1 ? "y" : "ies"}
            {spikeCount > 0 &&
              ` (${spikeCount} spike${spikeCount === 1 ? "" : "s"})`}
          </Badge>
        )}
      </div>
      <div className="w-full">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Metric</TableHead>
              <TableHead className="text-right">Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {summaryData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.label}</TableCell>
                <TableCell className="text-right font-semibold">
                  {item.isCurrency
                    ? item.value != null
                      ? formatCurrency(item.value)
                      : "-"
                    : item.value.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
