"use client";

import { useSubscriptionTrends } from "@/hooks/analytics/useSubscriptionTrends";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { formatPercentage } from "@/utils/chart-formatters";
import ChartCard from "@/components/modules/charts/ChartCard";
import { CheckCircle, TrendingDown, TrendingUp } from "lucide-react";
import type { ChartConfig } from "@/components/ui/chart";

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
 * SubscriptionTrendsWidget Component
 *
 * Displays subscription lifecycle stages and renewal vs churn patterns.
 */
export function SubscriptionTrendsWidget() {
  const { data, isLoading, error, refetch } = useSubscriptionTrends();

  if (isLoading) {
    return (
      <LoadingState variant="skeleton">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
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
        title="Error Loading Subscription Trends"
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  if (!data) {
    return (
      <EmptyState
        variant="card"
        title="No Subscription Data"
        description="Subscription trends data will appear here once available"
        icon={<TrendingUp className="h-12 w-12 text-muted-foreground" />}
      />
    );
  }

  const analytics = data;
  const lifecycle = analytics.subscriptionLifecycleStages;
  const renewalChurn = analytics.renewalChurnPatterns;
  const monthlyTrends = analytics.monthlySubscriptionTrends;
  const tierMigration = analytics.tierMigrationPatterns;

  const chartConfig = {
    subscriptions: {
      label: "Subscriptions",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <ChartCard
        title="Lifecycle"
        description="Current subscription stages."
        icon={CheckCircle}
        chartConfig={chartConfig}
        chartClassName="h-auto"
      >
        <div>
          <DetailRow
            label="Active"
            value={lifecycle?.active || 0}
            meta={`${renewalChurn?.totalSubscriptions || 0} total subscriptions`}
          />
          <DetailRow
            label="New"
            value={lifecycle?.new || 0}
            meta="This period"
          />
          <DetailRow label="Renewing" value={lifecycle?.renewing || 0} />
          <DetailRow label="Dormant" value={lifecycle?.dormant || 0} />
        </div>
      </ChartCard>

      <ChartCard
        title="Renewal and Churn"
        description="Renewed and churned subscriptions."
        icon={TrendingDown}
        chartConfig={chartConfig}
        summaryStats={[
          {
            icon: TrendingUp,
            label: "Renewal Rate",
            value: formatPercentage(renewalChurn?.renewalRate || 0),
          },
          {
            icon: TrendingDown,
            label: "Churn Rate",
            value: formatPercentage(renewalChurn?.churnRate || 0),
          },
        ]}
        chartClassName="h-auto"
      >
        <div>
          <DetailRow
            label="Renewed"
            value={renewalChurn?.renewedSubscriptions || 0}
          />
          <DetailRow
            label="Churned"
            value={renewalChurn?.churnedSubscriptions || 0}
          />
          <DetailRow
            label="Average Renewal Interval"
            value={`${renewalChurn?.averageRenewalInterval || 0} days`}
          />
        </div>
      </ChartCard>

      <ChartCard
        title="Growth"
        description="Monthly subscription trend."
        icon={TrendingUp}
        chartConfig={chartConfig}
        summaryStats={[
          {
            icon: TrendingUp,
            label: "Growth Rate",
            value: formatPercentage(monthlyTrends?.growthRate || 0),
          },
        ]}
        chartClassName="h-auto"
      >
        <div>
          <DetailRow
            label="Trend"
            value={monthlyTrends?.trend || "N/A"}
            meta="Current direction"
          />
          <DetailRow
            label="Upgrades"
            value={tierMigration?.upgrades || 0}
          />
          <DetailRow
            label="Downgrades"
            value={tierMigration?.downgrades || 0}
          />
        </div>
      </ChartCard>
    </div>
  );
}
