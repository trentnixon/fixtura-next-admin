"use client";

import { useState, useMemo } from "react";
import { useRenderRollupsByScheduler } from "@/hooks/rollups/useRenderRollupsByScheduler";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { formatCurrency, formatNumber } from "./_utils/formatCurrency";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function EfficiencyMetrics() {
  const [schedulerId, setSchedulerId] = useState<string>("");
  const [submittedSchedulerId, setSubmittedSchedulerId] = useState<
    number | null
  >(null);

  const { data, isLoading, isError, error } = useRenderRollupsByScheduler(
    submittedSchedulerId,
    {
      limit: 100,
      offset: 0,
      sortBy: "completedAt",
      sortOrder: "desc",
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = parseInt(schedulerId, 10);
    if (!isNaN(id) && id > 0) {
      setSubmittedSchedulerId(id);
    }
  };

  // Transform data for scatter plot: Duration (seconds) vs Cost
  const scatterData = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((render) => ({
      duration: (render.processingDuration / 1000).toFixed(1), // Convert to seconds
      cost: render.totalCost,
      renderId: render.renderId,
      assets: render.totalDigitalAssets,
      avgCostPerAsset: render.averageCostPerAsset,
    }));
  }, [data]);

  // Calculate efficiency metrics
  const efficiencyMetrics = useMemo(() => {
    if (!data?.data || data.data.length === 0) return null;

    const renders = data.data;
    const totalDuration = renders.reduce(
      (sum, r) => sum + r.processingDuration,
      0
    );
    const totalCost = renders.reduce((sum, r) => sum + r.totalCost, 0);
    const totalAssets = renders.reduce(
      (sum, r) => sum + r.totalDigitalAssets,
      0
    );

    const avgDuration = totalDuration / renders.length / 1000; // seconds
    const avgCost = totalCost / renders.length;
    const avgCostPerSecond = totalCost / (totalDuration / 1000);
    const avgCostPerAsset = totalAssets > 0 ? totalCost / totalAssets : 0;

    // Find most and least efficient renders
    const efficiencyScores = renders.map((r) => ({
      renderId: r.renderId,
      score: r.totalDigitalAssets > 0
        ? r.totalCost / (r.totalDigitalAssets * (r.processingDuration / 1000))
        : Infinity,
      cost: r.totalCost,
      assets: r.totalDigitalAssets,
      duration: r.processingDuration / 1000,
    }));

    const sorted = efficiencyScores
      .filter((e) => e.score !== Infinity)
      .sort((a, b) => a.score - b.score);

    return {
      avgDuration,
      avgCost,
      avgCostPerSecond,
      avgCostPerAsset,
      mostEfficient: sorted[0],
      leastEfficient: sorted[sorted.length - 1],
      totalRenders: renders.length,
    };
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Efficiency Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <Label htmlFor="schedulerIdEfficiency">Scheduler ID</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="schedulerIdEfficiency"
                type="number"
                placeholder="Enter scheduler ID"
                value={schedulerId}
                onChange={(e) => setSchedulerId(e.target.value)}
                min="1"
              />
              <Button type="submit">Load</Button>
            </div>
          </div>
        </form>

        {submittedSchedulerId && (
          <div>
            {isLoading && (
              <LoadingState message="Loading efficiency metrics..." />
            )}
            {isError && (
              <ErrorState
                variant="card"
                title="Unable to load efficiency metrics"
                error={error as Error}
              />
            )}
            {data && data.data.length > 0 && efficiencyMetrics && (
              <div className="space-y-6">
                {/* Summary Metrics */}
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Avg Duration
                    </div>
                    <div className="text-lg font-semibold">
                      {efficiencyMetrics.avgDuration.toFixed(1)}s
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Avg Cost
                    </div>
                    <div className="text-lg font-semibold">
                      {formatCurrency(efficiencyMetrics.avgCost)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Cost/Second
                    </div>
                    <div className="text-lg font-semibold">
                      {formatCurrency(efficiencyMetrics.avgCostPerSecond)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Cost/Asset
                    </div>
                    <div className="text-lg font-semibold">
                      {formatCurrency(efficiencyMetrics.avgCostPerAsset)}
                    </div>
                  </div>
                </div>

                {/* Scatter Plot: Duration vs Cost */}
                {scatterData.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-3">
                      Processing Duration vs Cost
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <ScatterChart>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          type="number"
                          dataKey="duration"
                          name="Duration"
                          unit="s"
                          label={{
                            value: "Processing Duration (seconds)",
                            position: "insideBottom",
                            offset: -5,
                          }}
                        />
                        <YAxis
                          type="number"
                          dataKey="cost"
                          name="Cost"
                          label={{
                            value: "Total Cost ($)",
                            angle: -90,
                            position: "insideLeft",
                          }}
                        />
                        <Tooltip
                          cursor={{ strokeDasharray: "3 3" }}
                          formatter={(value: number, name: string) => {
                            if (name === "cost") return formatCurrency(value);
                            if (name === "duration") return `${value}s`;
                            return value;
                          }}
                          content={({ active, payload }) => {
                            if (active && payload && payload[0]) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-background border rounded-lg p-3 shadow-lg">
                                  <p className="font-medium">
                                    Render #{data.renderId}
                                  </p>
                                  <p className="text-sm">
                                    Duration: {data.duration}s
                                  </p>
                                  <p className="text-sm">
                                    Cost: {formatCurrency(data.cost)}
                                  </p>
                                  <p className="text-sm">
                                    Assets: {formatNumber(data.assets)}
                                  </p>
                                  <p className="text-sm">
                                    Cost/Asset:{" "}
                                    {formatCurrency(data.avgCostPerAsset)}
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Scatter
                          data={scatterData}
                          fill="#3b82f6"
                          shape="circle"
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Efficiency Rankings */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  {efficiencyMetrics.mostEfficient && (
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">
                        Most Efficient Render
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">
                          Render #{efficiencyMetrics.mostEfficient.renderId}
                        </span>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatCurrency(
                            efficiencyMetrics.mostEfficient.cost
                          )}{" "}
                          for {formatNumber(efficiencyMetrics.mostEfficient.assets)}{" "}
                          assets in {efficiencyMetrics.mostEfficient.duration.toFixed(1)}s
                        </div>
                      </div>
                    </div>
                  )}
                  {efficiencyMetrics.leastEfficient && (
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">
                        Least Efficient Render
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">
                          Render #{efficiencyMetrics.leastEfficient.renderId}
                        </span>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatCurrency(
                            efficiencyMetrics.leastEfficient.cost
                          )}{" "}
                          for {formatNumber(efficiencyMetrics.leastEfficient.assets)}{" "}
                          assets in {efficiencyMetrics.leastEfficient.duration.toFixed(1)}s
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            {data && data.data.length === 0 && (
              <div className="text-sm text-muted-foreground text-center py-8">
                No renders found for this scheduler
              </div>
            )}
          </div>
        )}

        {!submittedSchedulerId && (
          <div className="text-sm text-muted-foreground text-center py-8">
            Enter a scheduler ID to view efficiency metrics
          </div>
        )}
      </CardContent>
    </Card>
  );
}

