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

export default function AverageCostBenchmarks() {
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

  // Calculate benchmarks
  const benchmarks = useMemo(() => {
    if (!data?.data || data.data.length === 0) return null;

    const renders = data.data;
    const totalAssets = renders.reduce(
      (sum, r) => sum + (r.totalDigitalAssets ?? 0),
      0
    );
    const totalCost = renders.reduce((sum, r) => sum + (r.totalCost ?? 0), 0);
    const totalTokens = renders.reduce(
      (sum, r) => sum + (r.totalTokens ?? 0),
      0
    );

    return {
      avgCostPerAsset:
        totalAssets > 0 ? totalCost / totalAssets : 0,
      avgTokensPerAsset:
        totalAssets > 0 ? totalTokens / totalAssets : 0,
      avgCostPerRender:
        renders.length > 0 ? totalCost / renders.length : 0,
      avgTokensPerRender:
        renders.length > 0 ? totalTokens / renders.length : 0,
      totalRenders: renders.length,
      totalAssets,
    };
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Average Cost Benchmarks</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <Label htmlFor="schedulerIdBenchmarks">Scheduler ID</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="schedulerIdBenchmarks"
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
              <LoadingState message="Loading benchmarks..." />
            )}
            {isError && (
              <ErrorState
                variant="card"
                title="Unable to load benchmarks"
                error={error as Error}
              />
            )}
            {benchmarks && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Stat
                  label="Avg Cost per Asset"
                  value={formatCurrency(benchmarks.avgCostPerAsset)}
                />
                <Stat
                  label="Avg Tokens per Asset"
                  value={formatNumber(benchmarks.avgTokensPerAsset)}
                />
                <Stat
                  label="Avg Cost per Render"
                  value={formatCurrency(benchmarks.avgCostPerRender)}
                />
                <Stat
                  label="Avg Tokens per Render"
                  value={formatNumber(benchmarks.avgTokensPerRender)}
                />
                <Stat
                  label="Total Renders"
                  value={formatNumber(benchmarks.totalRenders)}
                />
                <Stat
                  label="Total Assets"
                  value={formatNumber(benchmarks.totalAssets)}
                />
              </div>
            )}
          </>
        )}

        {!submittedSchedulerId && (
          <div className="text-sm text-muted-foreground text-center py-8">
            Enter a scheduler ID to view cost benchmarks
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

