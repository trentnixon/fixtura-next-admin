"use client";

import { useTrialAnalytics } from "@/hooks/analytics/useTrialAnalytics";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { formatPercentage } from "@/utils/chart-formatters";
import StatCard from "@/components/ui-library/metrics/StatCard";
import ChartCard from "@/components/modules/charts/ChartCard";
import { Users, TrendingUp, Clock, BarChart3, Target } from "lucide-react";
import type { ChartConfig } from "@/components/ui/chart";

/**
 * TrialConversionWidget Component
 *
 * Displays trial conversion funnels showing progress through different stages.
 */
export function TrialConversionWidget() {
  const { data, isLoading, error, refetch } = useTrialAnalytics();

  if (isLoading) {
    return (
      <LoadingState variant="skeleton">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
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
        title="Error Loading Trial Analytics"
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  if (!data) {
    return (
      <EmptyState
        variant="card"
        title="No Trial Data"
        description="Trial analytics data will appear here once available"
        icon={<BarChart3 className="h-12 w-12 text-muted-foreground" />}
      />
    );
  }

  const analytics = data;
  const funnel = analytics.trialToPaidConversionFunnels;
  const conversionRate =
    analytics.conversionRatesByAccountType?.overallConversionRate || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard
        title="Total Trials"
        value={funnel?.totalTrials || 0}
        icon={<Users className="h-5 w-5" />}
        description={`${
          analytics.trialStartEndPatterns?.activeTrials || 0
        } active`}
        variant="primary"
      />

      <StatCard
        title="Converted Trials"
        value={funnel?.convertedTrials || 0}
        icon={<TrendingUp className="h-5 w-5" />}
        description={`${formatPercentage(conversionRate)} conversion`}
        variant="accent"
      />

      <StatCard
        title="Average Duration"
        value={`${analytics.trialDurationAnalysis?.averageDuration || 0} days`}
        icon={<Clock className="h-5 w-5" />}
        description={`${
          analytics.trialDurationAnalysis?.optimalDuration || 0
        } optimal`}
        variant="secondary"
      />

      <ChartCard
        title="Conversion Funnel"
        description="Trial progression through stages"
        icon={Target}
        chartConfig={
          {
            stage: { label: "Stage", color: "hsl(var(--chart-1))" },
          } satisfies ChartConfig
        }
        summaryStats={[
          {
            icon: Users,
            label: "Total Trials",
            value: funnel?.totalTrials || 0,
          },
          {
            icon: TrendingUp,
            label: "Converted",
            value: funnel?.convertedTrials || 0,
          },
          {
            icon: Clock,
            label: "Conversion Rate",
            value: formatPercentage(conversionRate),
          },
        ]}
        variant="elevated"
        chartClassName="h-auto"
      >
        <div className="space-y-2 pt-4">
          {funnel?.funnelStages?.map((stage) => (
            <div key={stage.stage} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{stage.stage}</span>
                <span className="text-muted-foreground">
                  {stage.count} ({formatPercentage(stage.percentage, 1)})
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
      </ChartCard>
    </div>
  );
}
