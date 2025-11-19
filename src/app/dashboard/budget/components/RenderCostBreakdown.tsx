"use client";

import { useRenderRollup } from "@/hooks/rollups/useRenderRollup";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { formatCurrency, formatNumber } from "./_utils/formatCurrency";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";

interface RenderCostBreakdownProps {
  renderId: number;
}

export default function RenderCostBreakdown({
  renderId,
}: RenderCostBreakdownProps) {
  const { data, isLoading, isError, error } = useRenderRollup(renderId);

  return (
    <div className="space-y-4 w-full">
      {isLoading && <LoadingState message="Loading render cost data..." />}
      {isError && (
        <ErrorState
          variant="card"
          title="Unable to load render cost"
          error={error as Error}
        />
      )}
      {data && (
        <div className="">
          <Tabs defaultValue="summary" className="w-full">
            <TabsList variant="secondary">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="assets">Assets</TabsTrigger>
              <TabsTrigger value="metadata">Metadata</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4 mt-4">
              <div className="border rounded-lg overflow-hidden shadow-none w-full">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableHead className="w-[200px]">Total Cost</TableHead>
                      <TableCell className="font-semibold">
                        {formatCurrency(data.totalCost)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Lambda Cost</TableHead>
                      <TableCell className="font-semibold">
                        {formatCurrency(data.totalLambdaCost)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>AI Cost</TableHead>
                      <TableCell className="font-semibold">
                        {formatCurrency(data.totalAiCost)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableHead>Processing Duration</TableHead>
                      <TableCell className="font-semibold">
                        {(data.processingDuration / 1000).toFixed(1)}s
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="pt-2 border-t text-xs text-muted-foreground">
                Completed: {new Date(data.completedAt).toLocaleString()}
              </div>
            </TabsContent>

            <TabsContent value="assets" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <Stat
                  label="Total Downloads"
                  value={formatNumber(data.totalDownloads)}
                />
                <Stat
                  label="AI Articles"
                  value={formatNumber(data.totalAiArticles)}
                />
                <Stat
                  label="Digital Assets"
                  value={formatNumber(data.totalDigitalAssets)}
                />
                <Stat
                  label="Avg Cost per Asset"
                  value={formatCurrency(data.averageCostPerAsset)}
                />
              </div>
              <div className="pt-2 border-t">
                <div className="text-sm text-muted-foreground mb-2">
                  Asset Breakdown
                </div>
                {data.costBreakdown?.assetBreakdown && (
                  <div className="space-y-1 text-sm">
                    {Object.entries(data.costBreakdown.assetBreakdown).map(
                      ([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="capitalize">{key}</span>
                          <span className="font-medium">
                            {formatCurrency(value as number)}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="metadata" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <Stat
                  label="Total Tokens"
                  value={formatNumber(data.totalTokens)}
                />
                <Stat
                  label="Account ID"
                  value={data.accountId?.toString() ?? "-"}
                />
                <Stat
                  label="Scheduler ID"
                  value={data.schedulerId?.toString() ?? "-"}
                />
                <Stat label="Account Type" value={data.accountType ?? "-"} />
              </div>
              {data.modelBreakdown &&
                Object.keys(data.modelBreakdown).length > 0 && (
                  <div className="pt-2 border-t">
                    <div className="text-sm text-muted-foreground mb-2">
                      Model Usage
                    </div>
                    <div className="space-y-1 text-sm">
                      {Object.entries(data.modelBreakdown).map(
                        ([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="capitalize">{key}</span>
                            <span className="font-medium">
                              {typeof value === "number"
                                ? formatNumber(value)
                                : String(value)}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
            </TabsContent>
          </Tabs>
        </div>
      )}
      {!data && !isLoading && !isError && (
        <div className="text-sm text-muted-foreground text-center py-8">
          No data available for this render
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-lg font-semibold">{value}</span>
    </div>
  );
}
