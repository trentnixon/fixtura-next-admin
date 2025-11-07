"use client";

import { useSubscriptionTrends } from "@/hooks/analytics/useSubscriptionTrends";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { formatPercentage } from "@/utils/chart-formatters";
import StatCard from "@/components/ui-library/metrics/StatCard";
import {
  TrendingUp,
  CheckCircle,
  TrendingDown,
  Plus,
  X,
  ArrowUpRight,
} from "lucide-react";

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
  const lifecycle = analytics?.subscriptionLifecycleStages;
  const renewalChurn = analytics?.renewalChurnPatterns;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard
        title="Active Subscriptions"
        value={lifecycle?.active || 0}
        icon={<CheckCircle className="h-5 w-5" />}
        description={`${renewalChurn?.totalSubscriptions || 0} total`}
        variant="primary"
      />

      <StatCard
        title="Renewal Rate"
        value={formatPercentage(renewalChurn?.renewalRate || 0)}
        icon={<TrendingUp className="h-5 w-5" />}
        description={`${renewalChurn?.renewedSubscriptions || 0} renewed`}
        trend={renewalChurn?.renewalRate}
        variant="accent"
      />

      <StatCard
        title="Churn Rate"
        value={formatPercentage(renewalChurn?.churnRate || 0)}
        icon={<TrendingDown className="h-5 w-5" />}
        description={`${renewalChurn?.churnedSubscriptions || 0} churned`}
        trend={renewalChurn?.churnRate ? -renewalChurn.churnRate : undefined}
        variant="secondary"
      />

      <StatCard
        title="New Subscriptions"
        value={lifecycle?.new || 0}
        icon={<Plus className="h-5 w-5" />}
        description="This period"
        variant="primary"
      />

      <StatCard
        title="Churned"
        value={lifecycle?.churned || 0}
        icon={<X className="h-5 w-5" />}
        description="Total"
        variant="secondary"
      />

      <StatCard
        title="Growth Rate"
        value={formatPercentage(
          analytics?.monthlySubscriptionTrends?.growthRate || 0
        )}
        icon={<ArrowUpRight className="h-5 w-5" />}
        description={`${
          analytics?.monthlySubscriptionTrends?.trend || "N/A"
        } trend`}
        trend={analytics?.monthlySubscriptionTrends?.growthRate}
        variant="accent"
      />
    </div>
  );
}
