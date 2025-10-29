"use client";

import { useTrialAnalytics } from "@/hooks/analytics/useTrialAnalytics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * TrialConversionWidget Component
 *
 * Displays trial conversion funnels showing progress through different stages.
 */
export function TrialConversionWidget() {
  const { data, isLoading, error } = useTrialAnalytics();

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
          <CardTitle>Error Loading Trial Analytics</CardTitle>
          <CardDescription>{error.message}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  const analytics = data;
  const funnel = analytics.trialToPaidConversionFunnels;
  const conversionRate =
    analytics.conversionRatesByAccountType?.overallConversionRate || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Total Trials</CardTitle>
          <CardDescription>Started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{funnel?.totalTrials || 0}</div>
          <p className="text-xs text-muted-foreground">
            {analytics.trialStartEndPatterns?.activeTrials || 0} active
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Converted Trials
          </CardTitle>
          <CardDescription>Trials to paid</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {funnel?.convertedTrials || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            {conversionRate.toFixed(1)}% conversion
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">
            Average Duration
          </CardTitle>
          <CardDescription>Trial period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {analytics.trialDurationAnalysis?.averageDuration || 0} days
          </div>
          <p className="text-xs text-muted-foreground">
            {analytics.trialDurationAnalysis?.optimalDuration || 0} optimal
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle>Conversion Funnel</CardTitle>
          <CardDescription>Trial progression through stages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {funnel?.funnelStages?.map((stage) => (
              <div key={stage.stage} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{stage.stage}</span>
                  <span className="text-muted-foreground">
                    {stage.count} ({stage.percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all"
                    style={{ width: `${stage.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
