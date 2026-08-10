"use client";

import { useGlobalAnalytics } from "@/hooks/analytics/useGlobalAnalytics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { formatCurrency, formatPercentage } from "@/utils/chart-formatters";
import {
  calculateActivityRate,
  calculateRevenuePerAccount,
} from "@/lib/utils/analytics";
import ChartCard, {
  ChartSummaryStat,
} from "@/components/modules/charts/ChartCard";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { Users, DollarSign, TrendingUp, Shield, BarChart3 } from "lucide-react";
import type { ChartConfig } from "@/components/ui/chart";

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

function DistributionPanel({
  title,
  description,
  entries,
  total,
}: {
  title: string;
  description: string;
  entries: [string, number][];
  total?: number;
}) {
  return (
    <Card className="rounded-md border shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-slate-900">
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {entries.length === 0 ? (
          <div className="text-sm text-muted-foreground">No data available</div>
        ) : (
          entries.map(([label, value]) => {
            const percentage = total ? (value / total) * 100 : value;

            return (
              <div key={label} className="space-y-1">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-slate-900">{label}</span>
                  <span className="text-xs text-muted-foreground">
                    {total
                      ? `${value} (${formatPercentage(percentage)})`
                      : formatPercentage(value)}
                  </span>
                </div>
                <Progress value={percentage} className="h-1.5" />
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
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
  const revenuePerAccount = calculateRevenuePerAccount(
    analytics.revenueTrends?.totalRevenue || 0,
    analytics.activeAccounts || 0,
  );

  const chartData = Object.entries(
    analytics.revenueTrends?.monthlyRevenue || {},
  )
    .map(([month, revenue]) => ({
      month,
      revenue: revenue / 100,
    }))
    .reverse()
    .slice(0, 12);

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const revenueSummaryStats: ChartSummaryStat[] = [
    {
      icon: DollarSign,
      label: "Total",
      value: formatCurrency((analytics.revenueTrends?.totalRevenue || 0) / 100),
    },
    {
      icon: TrendingUp,
      label: "Avg/Month",
      value: formatCurrency(
        (analytics.revenueTrends?.averageMonthlyRevenue || 0) / 100,
      ),
    },
    {
      icon: Shield,
      label: "Retention",
      value: formatPercentage(analytics.churnRates?.retentionRate || 0),
    },
  ];

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

      <div className="grid gap-6 lg:grid-cols-3">
        <ChartCard
          title="Revenue"
          description="Last 12 monthly revenue periods."
          icon={TrendingUp}
          chartConfig={chartConfig}
          summaryStats={revenueSummaryStats}
          cardClassName="lg:col-span-2"
          chartClassName="h-[250px]"
        >
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
            />
            <YAxis
              tickFormatter={(value) => formatCurrency(value)}
              fontSize={12}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value) => formatCurrency(Number(value))}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="var(--color-revenue)"
              strokeWidth={2}
            />
          </LineChart>
        </ChartCard>

        <Card className="rounded-md border shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-medium text-slate-900">
                Customer Value
              </CardTitle>
            </div>
            <CardDescription>Lifetime value metrics.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">Avg CLV</span>
              <span className="text-sm font-semibold">
                {formatCurrency(
                  (analytics.averageCustomerLifetimeValue || 0) / 100,
                )}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">Median CLV</span>
              <span className="text-sm font-semibold">
                {formatCurrency(
                  (analytics.medianCustomerLifetimeValue || 0) / 100,
                )}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 border-t pt-3">
              <span className="text-sm text-muted-foreground">
                Per Active Account
              </span>
              <span className="text-sm font-semibold">
                {formatCurrency(revenuePerAccount / 100)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <DistributionPanel
          title="Account Types"
          description="Distribution by account type."
          entries={Object.entries(analytics.accountTypesDistribution || {})}
          total={analytics.totalAccounts || 0}
        />
        <DistributionPanel
          title="Sports"
          description="Sport coverage across accounts."
          entries={Object.entries(analytics.sportsDistribution || {})}
        />
        <DistributionPanel
          title="Subscription Tiers"
          description="Current subscription mix."
          entries={Object.entries(
            analytics.subscriptionTierDistribution?.distribution || {},
          )}
          total={
            analytics.subscriptionTierDistribution?.totalSubscriptions || 0
          }
        />
      </div>
    </div>
  );
}
