"use client";

import { useGlobalAnalytics } from "@/hooks/analytics/useGlobalAnalytics";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { formatCurrency, formatPercentage } from "@/utils/chart-formatters";
import { calculateActivityRate } from "@/lib/utils/analytics";
import { BarChart3 } from "lucide-react";
import { GlobalFleetMixSection } from "./GlobalFleetMixSection";

interface MetricStripItem {
  label: string;
  value: string | number;
  meta: string;
}

function MetricStrip({ items }: { items: MetricStripItem[] }) {
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

/**
 * GlobalAnalyticsWidget Component
 *
 * Displays compact system-wide account, revenue, trial, retention, and
 * distribution metrics for the analytics snapshot tab.
 */
export function GlobalAnalyticsWidget() {
  const { data, isLoading, error, refetch } = useGlobalAnalytics();

  if (isLoading) {
    return (
      <LoadingState variant="skeleton">
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </LoadingState>
    );
  }

  if (error) {
    return (
      <ErrorState
        variant="card"
        title="Error Loading Analytics"
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  if (!data) {
    return (
      <EmptyState
        variant="card"
        title="No Analytics Data"
        description="Analytics data will appear here once available"
        icon={<BarChart3 className="h-12 w-12 text-muted-foreground" />}
      />
    );
  }

  const analytics = data;
  const activityRate = calculateActivityRate(
    analytics.activeAccounts || 0,
    analytics.totalAccounts || 0,
  );
  return (
    <div className="space-y-6">
      <MetricStrip
        items={[
          {
            label: "Accounts",
            value: analytics.totalAccounts || 0,
            meta: `${analytics.activeAccounts || 0} active / ${formatPercentage(
              activityRate,
            )} activity`,
          },
          {
            label: "Revenue",
            value: formatCurrency(
              (analytics.revenueTrends?.totalRevenue || 0) / 100,
            ),
            meta: `${formatCurrency(
              (analytics.revenueTrends?.averageMonthlyRevenue || 0) / 100,
            )} avg monthly`,
          },
          {
            label: "Trial Conversion",
            value: formatPercentage(
              analytics.trialConversionRates?.conversionRate || 0,
            ),
            meta: `${
              analytics.trialConversionRates?.convertedTrials || 0
            } of ${analytics.trialConversionRates?.totalTrials || 0} trials`,
          },
          {
            label: "Retention",
            value: formatPercentage(analytics.churnRates?.retentionRate || 0),
            meta: `${analytics.churnRates?.totalChurned || 0} churned / ${formatPercentage(
              analytics.churnRates?.churnRate || 0,
            )} churn`,
          },
        ]}
      />

      <p className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-muted-foreground">
        Deeper revenue charts, CLV, and payment mix are on the{" "}
        <span className="font-medium text-slate-900">Revenue</span> tab above.
      </p>

      <GlobalFleetMixSection
        totalAccounts={analytics.totalAccounts || 0}
        accountTypesDistribution={analytics.accountTypesDistribution}
        sportsDistribution={analytics.sportsDistribution}
        subscriptionTierDistribution={analytics.subscriptionTierDistribution}
        dataPoints={analytics.dataPoints}
      />
    </div>
  );
}
