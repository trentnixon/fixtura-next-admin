"use client";

import { useCohortAnalysis } from "@/hooks/analytics/useCohortAnalysis";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { formatCurrency, formatPercentage } from "@/utils/chart-formatters";
import StatCard from "@/components/ui-library/metrics/StatCard";
import { Users, Shield, CheckCircle, X } from "lucide-react";

/**
 * CohortRetentionWidget Component
 *
 * Displays cohort retention analysis showing customer acquisition and retention patterns by cohort.
 */
export function CohortRetentionWidget() {
  const { data, isLoading, error, refetch } = useCohortAnalysis();

  if (isLoading) {
    return (
      <LoadingState variant="skeleton">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
  const acquisition = analytics?.acquisitionCohorts;
  const retention = analytics?.retentionAnalysis?.overallRetentionMetrics;
  const lifecycle = analytics?.lifecycleStages?.stageMetrics;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Cohorts"
        value={acquisition?.totalCohorts || 0}
        icon={<Users className="h-5 w-5" />}
        description={`${acquisition?.totalAccounts || 0} accounts`}
        variant="primary"
      />

      <StatCard
        title="Retention Rate"
        value={formatPercentage(retention?.averageRetentionRate || 0)}
        icon={<Shield className="h-5 w-5" />}
        description={`${retention?.totalAccounts || 0} tracked`}
        variant="accent"
      />

      <StatCard
        title="Active Accounts"
        value={lifecycle.active?.count || 0}
        icon={<CheckCircle className="h-5 w-5" />}
        description={`${formatPercentage(lifecycle.active?.percentage || 0)}`}
        variant="primary"
      />

      <StatCard
        title="Churned Accounts"
        value={lifecycle.churned?.count || 0}
        icon={<X className="h-5 w-5" />}
        description={`${formatPercentage(lifecycle.churned?.percentage || 0)}`}
        variant="secondary"
      />

      <Card className="md:col-span-4">
        <CardHeader>
          <CardTitle>Cohort Revenue</CardTitle>
          <CardDescription>Revenue by acquisition cohort</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(
              (analytics?.cohortRevenuePatterns?.totalRevenue || 0) / 100
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Average:{" "}
            {formatCurrency(
              (analytics?.cohortRevenuePatterns?.averageRevenuePerCohort || 0) /
                100
            )}{" "}
            per cohort
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
