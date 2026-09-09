"use client";

import Link from "next/link";
import { EyeIcon } from "lucide-react";
import { useRenderRollupsByScheduler } from "@/hooks/rollups/useRenderRollupsByScheduler";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { EmptyState } from "@/components/ui-library";
import { Button } from "@/components/ui/button";
import {
  LiveSnapshotMetricStrip,
  type LiveSnapshotMetricItem,
} from "@/app/dashboard/components/live-snapshot/LiveSnapshotMetricStrip";
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
import {
  Bot,
  CircleDollarSign,
  Cpu,
  Film,
} from "lucide-react";

interface SchedulerCostTableProps {
  schedulerId: number;
}

const METRIC_ICON_CLASS = "bg-slate-100 text-slate-600";

function SchedulerCostSectionHeader() {
  return (
    <div className="space-y-1">
      <h2 className="text-base font-semibold text-slate-900">
        Scheduler cost analysis
      </h2>
      <p className="text-sm text-muted-foreground">
        Cost breakdown for all renders in this scheduler
      </p>
    </div>
  );
}

export default function SchedulerCostTable({
  schedulerId,
}: SchedulerCostTableProps) {
  const { data, isLoading, isError, error } = useRenderRollupsByScheduler(
    schedulerId,
    {
      limit: 10000,
      offset: 0,
      sortBy: "completedAt",
      sortOrder: "desc",
    },
  );

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
        },
      )
    : null;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <LiveSnapshotMetricStrip
          columns={4}
          items={[
            { id: "1", label: "Total Renders", value: "", meta: "", icon: Film, isLoading: true },
            { id: "2", label: "Total Cost", value: "", meta: "", icon: CircleDollarSign, isLoading: true },
            { id: "3", label: "Lambda Cost", value: "", meta: "", icon: Cpu, isLoading: true },
            { id: "4", label: "AI Cost", value: "", meta: "", icon: Bot, isLoading: true },
          ]}
        />
        <div className="space-y-3">
          <SchedulerCostSectionHeader />
          <LoadingState message="Loading scheduler renders…" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-3">
        <SchedulerCostSectionHeader />
        <ErrorState
          variant="card"
          title="Unable to load scheduler renders"
          error={error as Error}
        />
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="space-y-3">
        <SchedulerCostSectionHeader />
        <EmptyState
          title="No renders found"
          description="This scheduler has no render cost records yet."
          variant="minimal"
        />
      </div>
    );
  }

  const summaryMetrics: LiveSnapshotMetricItem[] = totals
    ? [
        {
          id: "renders",
          label: "Total Renders",
          value: formatNumber(totals.totalRenders),
          meta: "In this scheduler",
          icon: Film,
          iconClassName: METRIC_ICON_CLASS,
        },
        {
          id: "total",
          label: "Total Cost",
          value: formatCurrency(totals.totalCost),
          meta: "Combined render spend",
          icon: CircleDollarSign,
          iconClassName: METRIC_ICON_CLASS,
        },
        {
          id: "lambda",
          label: "Lambda Cost",
          value: formatCurrency(totals.totalLambdaCost),
          meta: "Compute charges",
          icon: Cpu,
          iconClassName: METRIC_ICON_CLASS,
        },
        {
          id: "ai",
          label: "AI Cost",
          value: formatCurrency(totals.totalAiCost),
          meta: "Model usage charges",
          icon: Bot,
          iconClassName: METRIC_ICON_CLASS,
        },
      ]
    : [];

  return (
    <div className="space-y-4">
      {summaryMetrics.length > 0 && (
        <LiveSnapshotMetricStrip items={summaryMetrics} columns={4} />
      )}

      <div className="space-y-3">
        <SchedulerCostSectionHeader />

        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Render</TableHead>
              <TableHead>Completed</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Lambda</TableHead>
              <TableHead className="text-right">AI</TableHead>
              <TableHead className="text-right">Assets</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.data.map((render) => (
              <TableRow key={render.id}>
                <TableCell>
                  <div className="min-w-0">
                    <div className="font-medium text-slate-950">
                      {render.renderName || `Render ${render.renderId}`}
                    </div>
                    {render.renderName && (
                      <div className="font-mono text-xs text-muted-foreground">
                        #{render.renderId}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(render.completedAt).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums">
                  {formatCurrency(render.totalCost)}
                </TableCell>
                <TableCell className="text-right text-sm tabular-nums text-muted-foreground">
                  {formatCurrency(render.totalLambdaCost)}
                </TableCell>
                <TableCell className="text-right text-sm tabular-nums text-muted-foreground">
                  {formatCurrency(render.totalAiCost)}
                </TableCell>
                <TableCell className="text-right text-sm tabular-nums text-muted-foreground">
                  {formatNumber(render.totalDigitalAssets)}
                </TableCell>
                <TableCell className="text-right">
                  {render.renderId ? (
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-slate-200 bg-slate-50 text-slate-700 shadow-none hover:bg-slate-100 hover:text-slate-900"
                      asChild
                    >
                      <Link href={getRenderDetailUrl(render.renderId)}>
                        <EyeIcon className="h-4 w-4" />
                      </Link>
                    </Button>
                  ) : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {data.meta && (
          <p className="text-center text-xs text-muted-foreground">
            Showing {data.data.length} of {data.meta.total} renders
            {data.meta.hasMore ? " (more available)" : ""}
          </p>
        )}
      </div>
    </div>
  );
}
