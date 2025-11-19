"use client";

import { useState, useMemo } from "react";
import { useRenderRollupsByScheduler } from "@/hooks/rollups/useRenderRollupsByScheduler";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { formatCurrency } from "./_utils/formatCurrency";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function FileSizeDurationAnalysis() {
  const [schedulerId, setSchedulerId] = useState<string>("");
  const [submittedSchedulerId, setSubmittedSchedulerId] = useState<
    number | null
  >(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = parseInt(schedulerId, 10);
    if (!isNaN(id) && id > 0) {
      setSubmittedSchedulerId(id);
    }
  };

  const { data, isLoading, isError, error } = useRenderRollupsByScheduler(
    submittedSchedulerId,
    {
      limit: 100,
      offset: 0,
      sortBy: "completedAt",
      sortOrder: "desc",
    }
  );

  // Transform data: Use asset count as proxy for file size, duration vs cost
  const scatterData = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((render) => ({
      assets: render.totalDigitalAssets ?? 0,
      duration: (render.processingDuration / 1000).toFixed(1), // Convert to seconds
      cost: render.totalCost ?? 0,
      renderId: render.renderId,
      efficiency: render.totalDigitalAssets
        ? render.totalCost / render.totalDigitalAssets
        : 0,
    }));
  }, [data]);

  // Calculate efficiency metrics
  const efficiencyMetrics = useMemo(() => {
    if (!data?.data || data.data.length === 0) return null;

    const renders = data.data;
    const avgDuration =
      renders.reduce((sum, r) => sum + r.processingDuration, 0) /
      renders.length /
      1000; // Convert to seconds
    const avgCost = renders.reduce((sum, r) => sum + r.totalCost, 0) / renders.length;
    const avgAssets =
      renders.reduce((sum, r) => sum + (r.totalDigitalAssets ?? 0), 0) /
      renders.length;

    return {
      avgDuration: avgDuration.toFixed(1),
      avgCost,
      avgAssets: avgAssets.toFixed(1),
      costPerSecond: avgDuration > 0 ? avgCost / avgDuration : 0,
    };
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>File Size & Duration Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <Label htmlFor="schedulerIdFileSize">Scheduler ID</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="schedulerIdFileSize"
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
          <>
            {isLoading && (
              <LoadingState message="Loading file size analysis..." />
            )}
            {isError && (
              <ErrorState
                variant="card"
                title="Unable to load file size analysis"
                error={error as Error}
              />
            )}
            {scatterData.length > 0 && (
              <div className="space-y-6">
                {/* Efficiency Metrics */}
                {efficiencyMetrics && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Stat
                      label="Avg Duration (sec)"
                      value={efficiencyMetrics.avgDuration}
                    />
                    <Stat
                      label="Avg Cost"
                      value={formatCurrency(efficiencyMetrics.avgCost)}
                    />
                    <Stat
                      label="Avg Assets"
                      value={efficiencyMetrics.avgAssets}
                    />
                    <Stat
                      label="Cost/Second"
                      value={formatCurrency(efficiencyMetrics.costPerSecond)}
                    />
                  </div>
                )}

                {/* Scatter Plot: Assets (proxy for file size) vs Cost */}
                <div>
                  <h3 className="text-sm font-medium mb-3">
                    Asset Count vs Cost (Processing Efficiency)
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart data={scatterData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        type="number"
                        dataKey="assets"
                        name="Assets"
                        label={{ value: "Number of Assets", position: "insideBottom", offset: -5 }}
                      />
                      <YAxis
                        type="number"
                        dataKey="cost"
                        name="Cost"
                        label={{ value: "Cost ($)", angle: -90, position: "insideLeft" }}
                      />
                      <Tooltip
                        cursor={{ strokeDasharray: "3 3" }}
                        formatter={(value: number, name: string, props: { payload: { assets: number; duration: string; renderId: number } }) => {
                          if (name === "cost") {
                            return [
                              <div key="tooltip">
                                <div>Cost: {formatCurrency(value)}</div>
                                <div className="text-xs">
                                  Assets: {props.payload.assets}
                                </div>
                                <div className="text-xs">
                                  Duration: {props.payload.duration}s
                                </div>
                                <div className="text-xs">
                                  Render: {props.payload.renderId}
                                </div>
                              </div>,
                              "Cost",
                            ];
                          }
                          return [value, name];
                        }}
                      />
                      <Scatter name="Renders" dataKey="cost" fill="#3b82f6">
                        {scatterData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              entry.efficiency < 1
                                ? "#10b981"
                                : entry.efficiency < 5
                                ? "#3b82f6"
                                : "#ef4444"
                            }
                          />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                  <div className="text-xs text-muted-foreground mt-2">
                    Green: High efficiency (&lt;$1/asset) • Blue: Medium
                    ($1-5/asset) • Red: Low efficiency (&gt;$5/asset)
                  </div>
                </div>

                {/* Duration vs Cost */}
                <div>
                  <h3 className="text-sm font-medium mb-3">
                    Processing Duration vs Cost
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart data={scatterData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        type="number"
                        dataKey="duration"
                        name="Duration"
                        label={{ value: "Duration (seconds)", position: "insideBottom", offset: -5 }}
                      />
                      <YAxis
                        type="number"
                        dataKey="cost"
                        name="Cost"
                        label={{ value: "Cost ($)", angle: -90, position: "insideLeft" }}
                      />
                      <Tooltip
                        cursor={{ strokeDasharray: "3 3" }}
                        formatter={(value: number, name: string, props: { payload: { assets: number; duration: string; renderId: number } }) => {
                          if (name === "cost") {
                            return [
                              <div key="tooltip">
                                <div>Cost: {formatCurrency(value)}</div>
                                <div className="text-xs">
                                  Duration: {props.payload.duration}s
                                </div>
                                <div className="text-xs">
                                  Assets: {props.payload.assets}
                                </div>
                                <div className="text-xs">
                                  Render: {props.payload.renderId}
                                </div>
                              </div>,
                              "Cost",
                            ];
                          }
                          return [value, name];
                        }}
                      />
                      <Scatter name="Renders" dataKey="cost" fill="#3b82f6" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </>
        )}

        {!submittedSchedulerId && (
          <div className="text-sm text-muted-foreground text-center py-8">
            Enter a scheduler ID to view file size and duration analysis
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-lg font-semibold">{value}</span>
    </div>
  );
}

