"use client";

import { useState } from "react";
import { useRenderRollup } from "@/hooks/rollups/useRenderRollup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { formatCurrency, formatNumber } from "./_utils/formatCurrency";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

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

export default function AssetTypeBreakdown() {
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

  // Transform asset breakdown data
  const assetBreakdownData = data?.costBreakdown?.assetBreakdown
    ? Object.entries(data.costBreakdown.assetBreakdown).map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
        value: value as number,
        cost: value as number,
      }))
    : [];

  // Asset type breakdown (counts)
  const assetTypeData = data?.costBreakdown?.assetTypeBreakdown
    ? Object.entries(data.costBreakdown.assetTypeBreakdown).map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
        count: typeof value === "number" ? value : 0,
      }))
    : [];

  const hasAssetData = assetBreakdownData.length > 0 || assetTypeData.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Asset Type Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <Label htmlFor="renderIdAsset">Render ID</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="renderIdAsset"
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
              <LoadingState message="Loading asset breakdown..." />
            )}
            {isError && (
              <ErrorState
                variant="card"
                title="Unable to load asset breakdown"
                error={error as Error}
              />
            )}
            {data && (
              <div className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Total Digital Assets
                    </div>
                    <div className="text-lg font-semibold">
                      {formatNumber(data.totalDigitalAssets)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Total AI Articles
                    </div>
                    <div className="text-lg font-semibold">
                      {formatNumber(data.totalAiArticles)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Avg Cost per Asset
                    </div>
                    <div className="text-lg font-semibold">
                      {formatCurrency(data.averageCostPerAsset)}
                    </div>
                  </div>
                </div>

                {hasAssetData && (
                  <>
                    {/* Asset Cost Breakdown (Pie Chart) */}
                    {assetBreakdownData.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium mb-3">
                          Cost by Asset Type
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie
                              data={assetBreakdownData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) =>
                                `${name}: ${(percent * 100).toFixed(0)}%`
                              }
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {assetBreakdownData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <Tooltip
                              formatter={(value: number) => formatCurrency(value)}
                              labelStyle={{ color: "#000" }}
                            />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    {/* Asset Type Count (Bar Chart) */}
                    {assetTypeData.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium mb-3">
                          Asset Count by Type
                        </h3>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={assetTypeData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="name"
                              angle={-45}
                              textAnchor="end"
                              height={80}
                            />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#3b82f6" radius={4} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </>
                )}

                {!hasAssetData && (
                  <div className="text-sm text-muted-foreground text-center py-8">
                    No asset breakdown data available for this render
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {!submittedRenderId && (
          <div className="text-sm text-muted-foreground text-center py-8">
            Enter a render ID to view asset type breakdown
          </div>
        )}
      </CardContent>
    </Card>
  );
}

