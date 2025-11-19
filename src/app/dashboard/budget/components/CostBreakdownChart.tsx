"use client";

import { useGlobalCostSummary } from "@/hooks/rollups/useGlobalCostSummary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { formatCurrency, formatPercentage } from "@/utils/chart-formatters";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

type SummaryPeriod =
  | "current-month"
  | "last-month"
  | "current-year"
  | "all-time";

interface CostBreakdownChartProps {
  period?: SummaryPeriod;
}

export default function CostBreakdownChart({
  period = "current-month",
}: CostBreakdownChartProps) {
  const { data, isLoading, isError, error } = useGlobalCostSummary(period);

  if (isLoading) return <LoadingState message="Loading cost breakdown..." />;
  if (isError && error)
    return (
      <ErrorState
        variant="card"
        title="Unable to load cost breakdown"
        error={error as Error}
      />
    );
  if (!data) return null;

  const lambdaCost = data.totalLambdaCost ?? 0;
  const aiCost = data.totalAiCost ?? 0;
  const total = lambdaCost + aiCost;

  const chartData = [
    {
      name: "Lambda Cost",
      value: lambdaCost,
      percentage: total > 0 ? (lambdaCost / total) * 100 : 0,
      color: "hsl(var(--chart-1))",
    },
    {
      name: "AI Cost",
      value: aiCost,
      percentage: total > 0 ? (aiCost / total) * 100 : 0,
      color: "hsl(var(--chart-2))",
    },
  ].filter((item) => item.value > 0); // Only show segments with data

  return (
    <Card className="bg-white border shadow-none">
      <CardHeader>
        <CardTitle>Cost Breakdown (Lambda vs AI)</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="space-y-4">
            <ChartContainer
              config={{
                lambda: {
                  label: "Lambda Cost",
                  color: "hsl(var(--chart-1))",
                },
                ai: {
                  label: "AI Cost",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px]"
            >
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) =>
                    `${name}: ${percentage.toFixed(1)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ChartContainer>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <div className="text-sm text-muted-foreground">Total Cost</div>
                <div className="text-lg font-semibold">
                  {formatCurrency(total)}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Lambda Cost</div>
                <div className="text-lg font-semibold">
                  {formatCurrency(lambdaCost)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {total > 0
                    ? formatPercentage((lambdaCost / total) * 100)
                    : "0%"}{" "}
                  of total
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">AI Cost</div>
                <div className="text-lg font-semibold">
                  {formatCurrency(aiCost)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {total > 0 ? formatPercentage((aiCost / total) * 100) : "0%"}{" "}
                  of total
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground text-center py-8">
            No cost data available for this period
          </div>
        )}
      </CardContent>
    </Card>
  );
}
