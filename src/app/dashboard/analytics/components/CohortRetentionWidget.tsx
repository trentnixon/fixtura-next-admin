"use client";

import { useCohortAnalysis } from "@/hooks/analytics/useCohortAnalysis";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { formatCurrency, formatPercentage } from "@/utils/chart-formatters";
import ChartCard from "@/components/modules/charts/ChartCard";
import { CheckCircle, DollarSign, Shield, Users, X } from "lucide-react";
import type { ChartConfig } from "@/components/ui/chart";

function MetricStrip({
  items,
}: {
  items: { label: string; value: string | number; meta: string }[];
}) {
  return (
    <div className="grid overflow-hidden rounded-md border bg-white sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="border-b px-4 py-3 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0"
        >
          <div className="text-xs font-medium uppercase tracking-normal text-muted-foreground">
            {item.label}
          </div>
          <div className="mt-1 text-xl font-semibold text-slate-900">
            {item.value}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">{item.meta}</div>
        </div>
      ))}
    </div>
  );
}

function DetailRow({
  label,
  value,
  meta,
}: {
  label: string;
  value: string | number;
  meta?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b py-2 last:border-b-0">
      <div>
        <div className="text-sm font-medium text-slate-900">{label}</div>
        {meta && <div className="text-xs text-muted-foreground">{meta}</div>}
      </div>
      <div className="text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}

/**
 * CohortRetentionWidget Component
 *
 * Displays cohort retention, lifecycle, and revenue metrics.
 */
export function CohortRetentionWidget() {
  const { data, isLoading, error, refetch } = useCohortAnalysis();

  if (isLoading) {
    return (
      <LoadingState variant="skeleton">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </LoadingState>
    );
  }

  if (error) {
    return (
      <ErrorState
        variant="card"
        title="Error Loading Cohort Analysis"
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  if (!data) {
    return (
      <EmptyState
        variant="card"
        title="No Cohort Data"
        description="Cohort retention data will appear here once available"
        icon={<Users className="h-12 w-12 text-muted-foreground" />}
      />
    );
  }

  const analytics = data;
  const acquisition = analytics.acquisitionCohorts;
  const retention = analytics.retentionAnalysis.overallRetentionMetrics;
  const lifecycle = analytics.lifecycleStages.stageMetrics;
  const active = lifecycle.active;
  const churned = lifecycle.churned;
  const chartConfig = {
    cohorts: { label: "Cohorts", color: "hsl(var(--chart-1))" },
  } satisfies ChartConfig;

  return (
    <div className="space-y-6">
      <MetricStrip
        items={[
          {
            label: "Cohorts",
            value: acquisition.totalCohorts || 0,
            meta: `${acquisition.totalAccounts || 0} accounts`,
          },
          {
            label: "Retention",
            value: formatPercentage(retention.averageRetentionRate || 0),
            meta: `${retention.totalAccounts || 0} accounts tracked`,
          },
          {
            label: "Active Accounts",
            value: active?.count || 0,
            meta: formatPercentage(active?.percentage || 0),
          },
          {
            label: "Churned Accounts",
            value: churned?.count || 0,
            meta: formatPercentage(churned?.percentage || 0),
          },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard
          title="Cohort Revenue"
          description="Revenue by acquisition cohort."
          icon={DollarSign}
          chartConfig={chartConfig}
          summaryStats={[
            {
              icon: DollarSign,
              label: "Total Revenue",
              value: formatCurrency(
                (analytics.cohortRevenuePatterns.totalRevenue || 0) / 100,
              ),
            },
            {
              icon: Users,
              label: "Avg/Cohort",
              value: formatCurrency(
                (analytics.cohortRevenuePatterns.averageRevenuePerCohort || 0) /
                  100,
              ),
            },
          ]}
          chartClassName="h-auto"
        >
          <div>
            <DetailRow
              label="Monthly Cohorts"
              value={Object.keys(acquisition.monthlyCohorts || {}).length}
            />
            <DetailRow
              label="Quarterly Cohorts"
              value={Object.keys(acquisition.quarterlyCohorts || {}).length}
            />
          </div>
        </ChartCard>

        <ChartCard
          title="Lifecycle"
          description="Current cohort stage mix."
          icon={CheckCircle}
          chartConfig={chartConfig}
          chartClassName="h-auto"
        >
          <div>
            <DetailRow
              label="Active"
              value={active?.count || 0}
              meta={formatPercentage(active?.percentage || 0)}
            />
            <DetailRow
              label="Churned"
              value={churned?.count || 0}
              meta={formatPercentage(churned?.percentage || 0)}
            />
            <DetailRow
              label="Total Accounts"
              value={analytics.lifecycleStages.totalAccounts || 0}
            />
          </div>
        </ChartCard>

        <ChartCard
          title="Retention Health"
          description="Overall retention and churn."
          icon={Shield}
          chartConfig={chartConfig}
          summaryStats={[
            {
              icon: Shield,
              label: "Retention",
              value: formatPercentage(retention.averageRetentionRate || 0),
            },
            {
              icon: X,
              label: "Churned",
              value:
                analytics.churnAnalysis.overallChurnMetrics.totalChurned || 0,
            },
          ]}
          chartClassName="h-auto"
        >
          <div>
            <DetailRow
              label="Average Churn"
              value={formatPercentage(
                analytics.churnAnalysis.overallChurnMetrics.averageChurnRate ||
                  0,
              )}
            />
            <DetailRow
              label="Performance Conversion"
              value={formatPercentage(
                analytics.cohortPerformanceMetrics.overallPerformance
                  .averageConversionRate || 0,
              )}
            />
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
