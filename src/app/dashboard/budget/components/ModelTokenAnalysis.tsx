"use client";

import { useState, useMemo } from "react";
import { useRenderRollup } from "@/hooks/rollups/useRenderRollup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { formatNumber } from "./_utils/formatCurrency";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#84cc16", // lime
];

export default function ModelTokenAnalysis() {
  const [renderId, setRenderId] = useState<string>("");
  const [submittedRenderId, setSubmittedRenderId] = useState<number | null>(
    null
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = parseInt(renderId, 10);
    if (!isNaN(id) && id > 0) {
      setSubmittedRenderId(id);
    }
  };

  const { data, isLoading, isError, error } = useRenderRollup(submittedRenderId);

  // Transform model breakdown data
  const modelData = useMemo(() => {
    if (!data?.modelBreakdown) return [];
    return Object.entries(data.modelBreakdown).map(([key, value]) => {
      const numValue = typeof value === "number" ? value : 0;
      return {
        name: key
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
        value: numValue,
        tokens: numValue,
      };
    });
  }, [data]);

  const hasModelData = modelData.length > 0;
  const totalTokens = data?.totalTokens ?? 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Model & Token Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <Label htmlFor="renderIdModel">Render ID</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="renderIdModel"
                type="number"
                placeholder="Enter render ID"
                value={renderId}
                onChange={(e) => setRenderId(e.target.value)}
                min="1"
              />
              <Button type="submit">Load</Button>
            </div>
          </div>
        </form>

        {submittedRenderId && (
          <div>
            {isLoading && (
              <LoadingState message="Loading model analysis..." />
            )}
            {isError && (
              <ErrorState
                variant="card"
                title="Unable to load model analysis"
                error={error as Error}
              />
            )}
            {data && (
              <div className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Total Tokens
                    </div>
                    <div className="text-2xl font-bold">
                      {formatNumber(totalTokens)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Models Used
                    </div>
                    <div className="text-2xl font-bold">
                      {modelData.length}
                    </div>
                  </div>
                </div>

                {hasModelData && (
                  <>
                    {/* Model Usage Distribution (Pie Chart) */}
                    <div>
                      <h3 className="text-sm font-medium mb-3">
                        Token Distribution by Model
                      </h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={modelData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) =>
                              percent > 0.05
                                ? `${name}: ${(percent * 100).toFixed(0)}%`
                                : ""
                            }
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {modelData.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value: number) => formatNumber(value)}
                            labelStyle={{ color: "#000" }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Model Usage Bar Chart */}
                    <div>
                      <h3 className="text-sm font-medium mb-3">
                        Token Usage by Model
                      </h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={modelData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis
                            dataKey="name"
                            angle={-45}
                            textAnchor="end"
                            height={100}
                          />
                          <YAxis />
                          <Tooltip
                            formatter={(value: number) => formatNumber(value)}
                          />
                          <Bar dataKey="tokens" fill="#3b82f6" radius={4} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Model Details Table */}
                    <div className="pt-4 border-t">
                      <h3 className="text-sm font-medium mb-3">Model Details</h3>
                      <div className="space-y-2">
                        {modelData
                          .sort((a, b) => b.value - a.value)
                          .map((model, index) => {
                            const percentage =
                              totalTokens > 0
                                ? (model.value / totalTokens) * 100
                                : 0;
                            return (
                              <div
                                key={model.name}
                                className="flex items-center justify-between p-2 bg-muted rounded"
                              >
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-3 h-3 rounded"
                                    style={{
                                      backgroundColor:
                                        COLORS[index % COLORS.length],
                                    }}
                                  />
                                  <span className="text-sm font-medium">
                                    {model.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4">
                                  <span className="text-sm text-muted-foreground">
                                    {formatNumber(model.value)} tokens
                                  </span>
                                  <span className="text-sm font-semibold w-16 text-right">
                                    {percentage.toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </>
                )}

                {!hasModelData && (
                  <div className="text-sm text-muted-foreground text-center py-8">
                    No model breakdown data available for this render
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {!submittedRenderId && (
          <div className="text-sm text-muted-foreground text-center py-8">
            Enter a render ID to view model & token analysis
          </div>
        )}
      </CardContent>
    </Card>
  );
}

