"use client";

import { useTrialAnalytics } from "@/hooks/analytics/useTrialAnalytics";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { formatPercentage } from "@/utils/chart-formatters";
import ChartCard from "@/components/modules/charts/ChartCard";
import { Users, TrendingUp, Clock, BarChart3, Target } from "lucide-react";
import type { ChartConfig } from "@/components/ui/chart";

function MetricStrip({
  items,
}: {
  items: { label: string; value: string | number; meta: string }[];
}) {
  return (
    <div className="grid overflow-hidden rounded-md border bg-white md:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="border-b px-4 py-3 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0"
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

/**
 * TrialConversionWidget Component
 *
 * Displays trial conversion funnel and compact trial performance metrics.
 */
export function TrialConversionWidget() {
  const { data, isLoading, error, refetch } = useTrialAnalytics();

  if (isLoading) {
    return (
      <LoadingState variant="skeleton">
        <div className="grid gap-4 md:grid-cols-3">
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
    <div className="space-y-6">
      <MetricStrip
        items={[
          {
            label: "Total Trials",
            value: funnel?.totalTrials || 0,
            meta: `${analytics.trialStartEndPatterns?.activeTrials || 0} active`,
          },
          {
            label: "Converted",
            value: funnel?.convertedTrials || 0,
            meta: `${formatPercentage(conversionRate)} conversion`,
          },
          {
            label: "Average Duration",
            value: `${analytics.trialDurationAnalysis?.averageDuration || 0} days`,
            meta: `${analytics.trialDurationAnalysis?.optimalDuration || 0} optimal`,
          },
        ]}
      />

      <ChartCard
        title="Conversion Funnel"
        description="Trial progression through stages."
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
        chartClassName="h-auto"
      >
        <div className="space-y-3 pt-2">
          {funnel?.funnelStages?.map((stage) => (
            <div key={stage.stage} className="space-y-1">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-medium text-slate-900">
                  {stage.stage}
                </span>
                <span className="text-xs text-muted-foreground">
                  {stage.count} ({formatPercentage(stage.percentage, 1)})
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-primary transition-all"
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
