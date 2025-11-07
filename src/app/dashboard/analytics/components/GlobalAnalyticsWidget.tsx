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
  getLatestEntry,
} from "@/lib/utils/analytics";
import ChartCard, {
  ChartSummaryStat,
} from "@/components/modules/charts/ChartCard";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import StatCard from "@/components/ui-library/metrics/StatCard";
import {
  Users,
  DollarSign,
  TrendingUp,
  Shield,
  BarChart3,
  Calendar,
} from "lucide-react";
import type { ChartConfig } from "@/components/ui/chart";

/**
 * GlobalAnalyticsWidget Component
 *
 * Displays comprehensive system-wide metrics with in-depth analysis including:
 * - Account overview (total, active, inactive, types)
 * - Subscription analysis (tiers, distribution, values)
 * - Trial conversion metrics
 * - Revenue trends (monthly, quarterly, growth)
 * - Churn and retention analysis
 * - Customer lifetime value
 * - Sports distribution (cricket-focused)
 */
export function GlobalAnalyticsWidget() {
  const { data, isLoading, error, refetch } = useGlobalAnalytics();

  if (isLoading) {
    return (
      <LoadingState variant="skeleton">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

  // Calculate derived metrics
  const activityRate = calculateActivityRate(
    analytics.activeAccounts || 0,
    analytics.totalAccounts || 0
  );
  const revenuePerAccount = calculateRevenuePerAccount(
    analytics.revenueTrends?.totalRevenue || 0,
    analytics.activeAccounts || 0
  );
  const latestMonthlyRevenue = getLatestEntry(
    analytics.revenueTrends?.monthlyRevenue || {}
  );
  // Transform monthly revenue data for chart
  const chartData = Object.entries(
    analytics.revenueTrends?.monthlyRevenue || {}
  )
    .map(([month, revenue]) => ({
      month,
      revenue: revenue / 100, // Convert cents to dollars
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
        (analytics.revenueTrends?.averageMonthlyRevenue || 0) / 100
      ),
    },
    {
      icon: Calendar,
      label: "Latest Month",
      value: latestMonthlyRevenue
        ? formatCurrency(latestMonthlyRevenue[1] / 100)
        : "N/A",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Content Section - 3 columns */}
      <div className="lg:col-span-3 space-y-6">
        {/* Top: Key Metrics (4 cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard
            title="Total Accounts"
            value={analytics.totalAccounts || 0}
            icon={<Users className="h-5 w-5" />}
            description={`${
              analytics.activeAccounts || 0
            } active • ${formatPercentage(activityRate)} activity rate`}
            variant="primary"
          />

          <StatCard
            title="Total Revenue"
            value={formatCurrency(
              (analytics.revenueTrends?.totalRevenue || 0) / 100
            )}
            icon={<DollarSign className="h-5 w-5" />}
            description={`Avg: ${formatCurrency(
              (analytics.revenueTrends?.averageMonthlyRevenue || 0) / 100
            )}/mo`}
            trend={analytics.revenueTrends?.growthRate}
            variant="accent"
          />

          <StatCard
            title="Conversion Rate"
            value={formatPercentage(
              analytics.trialConversionRates?.conversionRate || 0
            )}
            icon={<TrendingUp className="h-5 w-5" />}
            description={`${
              analytics.trialConversionRates?.convertedTrials || 0
            } converted • ${
              analytics.trialConversionRates?.totalTrials || 0
            } total trials`}
            variant="secondary"
          />

          <StatCard
            title="Retention Rate"
            value={formatPercentage(analytics.churnRates?.retentionRate || 0)}
            icon={<Shield className="h-5 w-5" />}
            description={`${
              analytics.churnRates?.totalChurned || 0
            } churned • ${formatPercentage(
              analytics.churnRates?.churnRate || 0
            )} churn rate`}
            variant="primary"
          />
        </div>

        {/* Middle: Revenue Trends (full width) */}
        <ChartCard
          title="Revenue Trends"
          description="Monthly and quarterly revenue over time"
          icon={TrendingUp}
          chartConfig={chartConfig}
          summaryStats={revenueSummaryStats}
          variant="elevated"
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
      </div>

      {/* Sidebar Section - 1 column */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        {/* Customer Value */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Customer Value
            </CardTitle>
            <CardDescription>Lifetime value metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Avg CLV</span>
              <span className="text-sm font-semibold">
                {formatCurrency(
                  (analytics.averageCustomerLifetimeValue || 0) / 100
                )}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Median CLV</span>
              <span className="text-sm font-semibold">
                {formatCurrency(
                  (analytics.medianCustomerLifetimeValue || 0) / 100
                )}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-sm text-muted-foreground">
                Per Active Account
              </span>
              <span className="text-sm font-semibold">
                {formatCurrency(revenuePerAccount / 100)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Sports Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Sports Distribution
            </CardTitle>
            <CardDescription>Cricket-focused breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(analytics.sportsDistribution || {}).map(
              ([sport, percentage]) => (
                <div key={sport} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{sport}</span>
                    <span className="text-sm font-medium">
                      {formatPercentage(percentage)}
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              )
            )}
          </CardContent>
        </Card>
        {/* Account Types */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Account Types</CardTitle>
            <CardDescription>Distribution by type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {Object.entries(analytics.accountTypesDistribution || {}).map(
                ([type, count]) => {
                  const percentage = analytics.totalAccounts
                    ? (count / analytics.totalAccounts) * 100
                    : 0;
                  return (
                    <div key={type}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">{type}</span>
                        <span className="text-sm font-medium">
                          {count} ({formatPercentage(percentage)})
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                }
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
