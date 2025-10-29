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

/**
 * CohortRetentionWidget Component
 *
 * Displays cohort retention analysis showing customer acquisition and retention patterns by cohort.
 */
export function CohortRetentionWidget() {
  const { data, isLoading, error } = useCohortAnalysis();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Cohort Analysis</CardTitle>
          <CardDescription>{error.message}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  const analytics = data;
  const acquisition = analytics?.acquisitionCohorts;
  const retention = analytics?.retentionAnalysis?.overallRetentionMetrics;
  const lifecycle = analytics?.lifecycleStages?.stageMetrics;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Total Cohorts</CardTitle>
          <CardDescription>Acquisition groups</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {acquisition?.totalCohorts || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            {acquisition?.totalAccounts || 0} accounts
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
          <CardDescription>Average across cohorts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(retention?.averageRetentionRate || 0).toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">
            {retention?.totalAccounts || 0} tracked
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
          <CardDescription>Currently active</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {lifecycle.active?.count || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            {(lifecycle.active?.percentage || 0).toFixed(1)}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Churned Accounts
          </CardTitle>
          <CardDescription>Lost customers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {lifecycle.churned?.count || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            {(lifecycle.churned?.percentage || 0).toFixed(1)}%
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-4">
        <CardHeader>
          <CardTitle>Cohort Revenue</CardTitle>
          <CardDescription>Revenue by acquisition cohort</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            $
            {(
              (analytics?.cohortRevenuePatterns?.totalRevenue || 0) / 100
            ).toLocaleString()}
          </div>
          <p className="text-sm text-muted-foreground">
            Average: $
            {(
              (analytics?.cohortRevenuePatterns?.averageRevenuePerCohort || 0) /
              100
            ).toLocaleString()}{" "}
            per cohort
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
