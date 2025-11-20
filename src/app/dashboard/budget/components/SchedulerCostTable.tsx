"use client";

import { useRouter } from "next/navigation";
import { useRenderRollupsByScheduler } from "@/hooks/rollups/useRenderRollupsByScheduler";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { formatCurrency, formatNumber } from "./_utils/formatCurrency";
import { getRenderDetailUrl } from "./_utils/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SchedulerCostTableProps {
  schedulerId: number;
}

export default function SchedulerCostTable({
  schedulerId,
}: SchedulerCostTableProps) {
  const router = useRouter();

  const { data, isLoading, isError, error } = useRenderRollupsByScheduler(
    schedulerId,
    {
      limit: 10000, // Fetch all renders (no practical limit)
      offset: 0,
      sortBy: "completedAt",
      sortOrder: "desc",
    }
  );

  // Calculate totals
  const totals = data?.data
    ? data.data.reduce(
        (acc, render) => ({
          totalCost: acc.totalCost + (render.totalCost ?? 0),
          totalRenders: acc.totalRenders + 1,
          totalLambdaCost: acc.totalLambdaCost + (render.totalLambdaCost ?? 0),
          totalAiCost: acc.totalAiCost + (render.totalAiCost ?? 0),
        }),
        {
          totalCost: 0,
          totalRenders: 0,
          totalLambdaCost: 0,
          totalAiCost: 0,
        }
      )
    : null;

  return (
    <div className="space-y-4 w-full">
      {isLoading && <LoadingState message="Loading scheduler renders..." />}
      {isError && (
        <ErrorState
          variant="card"
          title="Unable to load scheduler renders"
          error={error as Error}
        />
      )}
      {data && data.data.length > 0 && (
        <div className="space-y-4">
          {totals && (
            <div className="grid grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  Total Renders
                </div>
                <div className="text-lg font-semibold">
                  {formatNumber(totals.totalRenders)}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  Total Cost
                </div>
                <div className="text-lg font-semibold">
                  {formatCurrency(totals.totalCost)}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  Lambda Cost
                </div>
                <div className="text-lg font-semibold">
                  {formatCurrency(totals.totalLambdaCost)}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  AI Cost
                </div>
                <div className="text-lg font-semibold">
                  {formatCurrency(totals.totalAiCost)}
                </div>
              </div>
            </div>
          )}

          <div className="border rounded-lg overflow-hidden shadow-none w-full">
            <div className="max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead>Render ID</TableHead>
                    <TableHead>Render Name</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead className="text-right">Total Cost</TableHead>
                    <TableHead className="text-right">Lambda</TableHead>
                    <TableHead className="text-right">AI</TableHead>
                    <TableHead className="text-right">Assets</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.map((render) => (
                    <TableRow
                      key={render.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => {
                        if (render.renderId) {
                          router.push(getRenderDetailUrl(render.renderId));
                        }
                      }}
                    >
                      <TableCell className="font-mono text-sm">
                        {render.renderId}
                      </TableCell>
                      <TableCell>
                        {render.renderName || (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(render.completedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(render.totalCost)}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {formatCurrency(render.totalLambdaCost)}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {formatCurrency(render.totalAiCost)}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {formatNumber(render.totalDigitalAssets)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {data.meta && (
            <div className="text-xs text-muted-foreground text-center">
              Showing {data.data.length} of {data.meta.total} renders
              {data.meta.hasMore && " (more available)"}
            </div>
          )}
        </div>
      )}
      {data && data.data.length === 0 && (
        <div className="text-sm text-muted-foreground text-center py-8">
          No renders found for this scheduler
        </div>
      )}
      {!data && !isLoading && !isError && (
        <div className="text-sm text-muted-foreground text-center py-8">
          No data available for this scheduler
        </div>
      )}
    </div>
  );
}
