"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  CircleDollarSign,
  Clock,
  Cpu,
  Database,
  FileStack,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";
import {
  CompactKpiCard,
  ComparisonCard,
} from "@/components/ui-library/cards";
import {
  OverviewDataWorkspace,
  type WorkspaceMetricTile,
} from "@/app/dashboard/components/live-snapshot/OverviewDataWorkspace";
import { DashboardLinkButton } from "@/app/dashboard/components/live-snapshot/DashboardLinkButton";
import {
  sectionTabListInverseClass,
  sectionTabTriggerInverseClass,
} from "@/lib/actions/siteNavigationButtonStyles";
import { useRenderRollup } from "@/hooks/rollups/useRenderRollup";
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber } from "./_utils/formatCurrency";

interface RenderCostBreakdownProps {
  renderId: number;
}

function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase());
}

function recordToRows(
  record: Record<string, unknown> | undefined,
  formatter: (value: unknown) => string = (value) => String(value),
) {
  if (!record) return [];

  return Object.entries(record).map(([key, value]) => ({
    label: formatLabel(key),
    value: formatter(value),
  }));
}

export default function RenderCostBreakdown({
  renderId,
}: RenderCostBreakdownProps) {
  const { data, isLoading, isError, error, refetch } =
    useRenderRollup(renderId);

  const headlineMetrics = useMemo((): WorkspaceMetricTile[] => {
    return [
      {
        id: "total-cost",
        label: "Total cost",
        value: data ? formatCurrency(data.totalCost) : "—",
        meta: "All-in render cost",
        isLoading,
      },
      {
        id: "lambda-cost",
        label: "Lambda cost",
        value: data ? formatCurrency(data.totalLambdaCost) : "—",
        meta: "Compute and processing",
        isLoading,
      },
      {
        id: "ai-cost",
        label: "AI cost",
        value: data ? formatCurrency(data.totalAiCost) : "—",
        meta: "Model and token usage",
        isLoading,
      },
      {
        id: "duration",
        label: "Processing duration",
        value: data
          ? `${(data.processingDuration / 1000).toFixed(1)}s`
          : "—",
        meta: data
          ? `Completed ${new Date(data.completedAt).toLocaleString()}`
          : "End-to-end runtime",
        isLoading,
      },
    ];
  }, [data, isLoading]);

  if (isLoading) {
    return (
      <LoadingState variant="default" message="Loading render cost data…" />
    );
  }

  if (isError) {
    return (
      <ErrorState
        variant="default"
        title="Unable to load render cost"
        error={error instanceof Error ? error : new Error(String(error))}
        onRetry={() => refetch()}
      />
    );
  }

  if (!data) {
    return (
      <EmptyState
        variant="card"
        title="No cost data"
        description="Rollup cost data is not available for this render yet."
      />
    );
  }

  const assetBreakdownRows = recordToRows(
    data.costBreakdown?.assetBreakdown as Record<string, unknown> | undefined,
    (value) => formatCurrency(Number(value)),
  );

  const modelBreakdownRows = recordToRows(data.modelBreakdown, (value) =>
    typeof value === "number" ? formatNumber(value) : String(value),
  );

  const performanceRows = recordToRows(data.performanceMetrics, (value) =>
    typeof value === "number"
      ? formatNumber(value)
      : typeof value === "string"
        ? value
        : JSON.stringify(value),
  );

  return (
    <div className="space-y-6">
      <OverviewDataWorkspace
        title="Render cost"
        description={
          data.renderName
            ? `${data.renderName} · rollup cost summary`
            : "Rollup cost summary for this render"
        }
        icon={CircleDollarSign}
        badge={
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" aria-hidden />
            {data.renderPeriod || "Completed run"}
          </Badge>
        }
        metrics={headlineMetrics}
        columns={4}
        footer={
          <>
            <span className="inline-flex flex-wrap items-center gap-x-3 text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Cpu className="h-3.5 w-3.5" aria-hidden />
                Lambda spend
              </span>
              <span className="inline-flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                AI spend
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" aria-hidden />
                Runtime
              </span>
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {data.schedulerId ? (
                <DashboardLinkButton
                  href={`/dashboard/schedulers/${data.schedulerId}`}
                  trailingIcon="arrow"
                >
                  Scheduler #{data.schedulerId}
                </DashboardLinkButton>
              ) : null}
              {data.accountId ? (
                <DashboardLinkButton
                  href={`/dashboard/budget/account/${data.accountId}`}
                  intent="highlight"
                  trailingIcon="external"
                >
                  Account budget
                </DashboardLinkButton>
              ) : null}
            </div>
          </>
        }
      />

      <Tabs defaultValue="summary" className="w-full">
        <TabsList
          variant="sectionInverse"
          className={cn(sectionTabListInverseClass, "mb-4")}
        >
          <TabsTrigger
            value="summary"
            variant="sectionInverse"
            className={sectionTabTriggerInverseClass}
          >
            Summary
          </TabsTrigger>
          <TabsTrigger
            value="assets"
            variant="sectionInverse"
            className={sectionTabTriggerInverseClass}
          >
            Assets
          </TabsTrigger>
          <TabsTrigger
            value="metadata"
            variant="sectionInverse"
            className={sectionTabTriggerInverseClass}
          >
            Metadata
          </TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="mt-0 space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ComparisonCard
              title="Cost split"
              description="Lambda vs AI contribution to total spend"
              icon={<CircleDollarSign className="h-4 w-4" />}
              rows={[
                {
                  label: "Total cost",
                  value: formatCurrency(data.totalCost),
                },
                {
                  label: "Lambda",
                  value: formatCurrency(data.totalLambdaCost),
                  tone: "text-blue-700",
                },
                {
                  label: "AI",
                  value: formatCurrency(data.totalAiCost),
                  tone: "text-violet-700",
                },
                {
                  label: "Avg cost per asset",
                  value: formatCurrency(data.averageCostPerAsset),
                },
              ]}
            />

            <ComparisonCard
              title="Run timing"
              description="Processing window for this render"
              icon={<Clock className="h-4 w-4" />}
              rows={[
                {
                  label: "Started",
                  value: new Date(data.renderStartedAt).toLocaleString(),
                },
                {
                  label: "Completed",
                  value: new Date(data.completedAt).toLocaleString(),
                },
                {
                  label: "Duration",
                  value: `${(data.processingDuration / 1000).toFixed(1)}s`,
                },
                {
                  label: "Period",
                  value: data.renderPeriod,
                },
              ]}
            />
          </div>

          {performanceRows.length > 0 ? (
            <ComparisonCard
              title="Performance metrics"
              description="Additional rollup performance signals"
              icon={<Cpu className="h-4 w-4" />}
              rows={performanceRows}
            />
          ) : null}
        </TabsContent>

        <TabsContent value="assets" className="mt-0 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <CompactKpiCard
              label="Total downloads"
              value={formatNumber(data.totalDownloads)}
              icon={<FileStack className="h-4 w-4" />}
              iconClassName="bg-blue-50 text-blue-700"
              progressClassName="bg-blue-500"
            />
            <CompactKpiCard
              label="AI articles"
              value={formatNumber(data.totalAiArticles)}
              icon={<Sparkles className="h-4 w-4" />}
              iconClassName="bg-violet-50 text-violet-700"
              progressClassName="bg-violet-500"
            />
            <CompactKpiCard
              label="Digital assets"
              value={formatNumber(data.totalDigitalAssets)}
              icon={<Database className="h-4 w-4" />}
              iconClassName="bg-emerald-50 text-emerald-700"
              progressClassName="bg-emerald-500"
            />
            <CompactKpiCard
              label="Avg cost per asset"
              value={formatCurrency(data.averageCostPerAsset)}
              icon={<CircleDollarSign className="h-4 w-4" />}
              iconClassName="bg-amber-50 text-amber-700"
              progressClassName="bg-amber-500"
            />
          </div>

          {assetBreakdownRows.length > 0 ? (
            <ComparisonCard
              title="Asset cost breakdown"
              description="Cost allocation by asset category"
              icon={<FileStack className="h-4 w-4" />}
              rows={assetBreakdownRows}
            />
          ) : (
            <EmptyState
              variant="minimal"
              title="No asset breakdown"
              description="Asset-level cost allocation is not available for this render."
            />
          )}
        </TabsContent>

        <TabsContent value="metadata" className="mt-0 space-y-4">
          <ComparisonCard
            title="Render linkage"
            description="Account and scheduler references from rollup metadata"
            icon={<Database className="h-4 w-4" />}
            rows={[
              {
                label: "Render ID",
                value: String(data.renderId),
              },
              {
                label: "Account ID",
                value: data.accountId?.toString() ?? "—",
              },
              {
                label: "Account type",
                value: data.accountType ?? "—",
              },
              {
                label: "Scheduler ID",
                value: data.schedulerId?.toString() ?? "—",
              },
              {
                label: "Total tokens",
                value: formatNumber(data.totalTokens),
              },
            ]}
          />

          {modelBreakdownRows.length > 0 ? (
            <ComparisonCard
              title="Model usage"
              description="Token or usage counts by model"
              icon={<Sparkles className="h-4 w-4" />}
              rows={modelBreakdownRows}
            />
          ) : (
            <EmptyState
              variant="minimal"
              title="No model breakdown"
              description="Model usage detail is not available for this render."
            />
          )}

          {(data.accountId || data.schedulerId) && (
            <div className="flex flex-wrap gap-2 text-sm">
              {data.schedulerId ? (
                <Link
                  href={`/dashboard/schedulers/${data.schedulerId}`}
                  className="font-medium text-slate-700 hover:underline"
                >
                  Open scheduler #{data.schedulerId}
                </Link>
              ) : null}
              {data.accountId ? (
                <Link
                  href={`/dashboard/budget/account/${data.accountId}`}
                  className="font-medium text-slate-700 hover:underline"
                >
                  Open account budget
                </Link>
              ) : null}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
