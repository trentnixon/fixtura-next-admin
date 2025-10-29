"use client";

import { useSubscriptionTrends } from "@/hooks/analytics/useSubscriptionTrends";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * SubscriptionTrendsWidget Component
 *
 * Displays subscription lifecycle stages and renewal vs churn patterns.
 */
export function SubscriptionTrendsWidget() {
  const { data, isLoading, error } = useSubscriptionTrends();

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
          <CardTitle>Error Loading Subscription Trends</CardTitle>
          <CardDescription>{error.message}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  const analytics = data;
  const lifecycle = analytics?.subscriptionLifecycleStages;
  const renewalChurn = analytics?.renewalChurnPatterns;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Active Subscriptions
          </CardTitle>
          <CardDescription>Currently active</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{lifecycle?.active || 0}</div>
          <p className="text-xs text-muted-foreground">
            {renewalChurn?.totalSubscriptions || 0} total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Renewal Rate</CardTitle>
          <CardDescription>Successfully renewed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(renewalChurn?.renewalRate || 0).toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">
            {renewalChurn?.renewedSubscriptions || 0} renewed
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Churn Rate</CardTitle>
          <CardDescription>Cancellations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(renewalChurn?.churnRate || 0).toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">
            {renewalChurn?.churnedSubscriptions || 0} churned
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            New Subscriptions
          </CardTitle>
          <CardDescription>Recently added</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{lifecycle?.new || 0}</div>
          <p className="text-xs text-muted-foreground">This period</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Churned</CardTitle>
          <CardDescription>Cancelled accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{lifecycle?.churned || 0}</div>
          <p className="text-xs text-muted-foreground">Total</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
          <CardDescription>Net subscription growth</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(analytics?.monthlySubscriptionTrends?.growthRate || 0).toFixed(1)}
            %
          </div>
          <p className="text-xs text-muted-foreground">
            {analytics?.monthlySubscriptionTrends?.trend || "N/A"} trend
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
