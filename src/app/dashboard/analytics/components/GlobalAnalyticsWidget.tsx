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
import {
  formatCurrency,
  formatPercent,
  calculateActivityRate,
  calculateRevenuePerAccount,
  getLatestEntry,
  getHighestDistribution,
  getTrendColor,
  getTrendIcon,
} from "@/lib/utils/analytics";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

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
  const { data, isLoading, error } = useGlobalAnalytics();

  if (isLoading) {
    return (
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
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Analytics</CardTitle>
          <CardDescription>{error.message}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!data) {
    return null;
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
  const latestQuarterlyRevenue = getLatestEntry(
    analytics.revenueTrends?.quarterlyRevenue || {}
  );
  const mostPopularTier = getHighestDistribution(
    analytics.subscriptionTierDistribution?.distribution || {}
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
      color: "hsl(142, 76%, 36%)",
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Content Section - 3 columns */}
      <div className="lg:col-span-3 space-y-6">
        {/* Top: Key Metrics (4 cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="shadow-none bg-slate-50 border-b-4 border-b-slate-500 rounded-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Total Accounts
              </CardTitle>
              <CardDescription>Active & Inactive</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {analytics.totalAccounts || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {analytics.activeAccounts || 0} active
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatPercent(activityRate)} activity rate
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-none bg-slate-50 border-b-4 border-b-slate-500 rounded-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <CardDescription>All time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {formatCurrency(analytics.revenueTrends?.totalRevenue || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Avg:{" "}
                {formatCurrency(
                  analytics.revenueTrends?.averageMonthlyRevenue || 0
                )}
                /mo
              </p>
              <p
                className={`text-xs mt-1 ${getTrendColor(
                  analytics.revenueTrends?.trend || "stable"
                )}`}
              >
                <span className="mr-1">
                  {getTrendIcon(analytics.revenueTrends?.trend || "stable")}
                </span>
                {analytics.revenueTrends?.growthRate
                  ? `${analytics.revenueTrends.growthRate}%`
                  : "No trend"}
                {analytics.revenueTrends?.trend
                  ? ` (${analytics.revenueTrends.trend})`
                  : ""}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-none bg-slate-50 border-b-4 border-b-slate-500 rounded-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Conversion Rate
              </CardTitle>
              <CardDescription>Trial to paid</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {formatPercent(
                  analytics.trialConversionRates?.conversionRate || 0
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {analytics.trialConversionRates?.convertedTrials || 0} converted
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {analytics.trialConversionRates?.totalTrials || 0} total trials
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-none bg-slate-50 border-b-4 border-b-slate-500 rounded-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Retention Rate
              </CardTitle>
              <CardDescription>Active accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">
                {formatPercent(analytics.churnRates?.retentionRate || 0)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {analytics.churnRates?.totalChurned || 0} churned
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatPercent(analytics.churnRates?.churnRate || 0)} churn rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Middle: Revenue Trends (full width) */}
        <Card className="shadow-none bg-slate-50 border-b-4 border-b-slate-500 rounded-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Revenue Trends
            </CardTitle>
            <CardDescription>
              {latestMonthlyRevenue && (
                <>
                  Latest Month: {formatCurrency(latestMonthlyRevenue[1])} (
                  {latestMonthlyRevenue[0]})
                </>
              )}
              {latestQuarterlyRevenue && (
                <>
                  {" "}
                  | Latest Quarter: {formatCurrency(
                    latestQuarterlyRevenue[1]
                  )}{" "}
                  ({latestQuarterlyRevenue[0]})
                </>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Monthly Revenue Chart */}
              <div>
                <h4 className="text-sm font-medium mb-3">Monthly Revenue</h4>
                <ChartContainer config={chartConfig} className="h-[250px]">
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
                      tickFormatter={(value) => `$${value}`}
                      fontSize={12}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      formatter={(value) => formatCurrency(Number(value) * 100)}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(142, 76%, 36%)"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ChartContainer>
              </div>

              {/* Quarterly Revenue */}
              <div>
                <h4 className="text-sm font-medium mb-3">Quarterly Revenue</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {Object.entries(
                    analytics.revenueTrends?.quarterlyRevenue || {}
                  )
                    .reverse()
                    .slice(0, 8)
                    .map(([quarter, revenue]) => (
                      <div
                        key={quarter}
                        className="flex justify-between items-center p-2 bg-muted rounded"
                      >
                        <span className="text-sm">{quarter}</span>
                        <span className="text-sm font-medium">
                          {formatCurrency(revenue)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bottom: Distribution Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Subscription Distribution */}
          <Card className="shadow-none bg-slate-50 border-b-4 border-b-slate-500 rounded-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Subscription Distribution
              </CardTitle>
              <CardDescription>
                Total:{" "}
                {analytics.subscriptionTierDistribution?.totalSubscriptions ||
                  0}{" "}
                subscriptions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {Object.entries(
                  analytics.subscriptionTierDistribution?.distribution || {}
                ).map(([tier, percentage]) => (
                  <div key={tier}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">{tier}</span>
                      <span className="text-sm font-medium">
                        {formatPercent(percentage)}
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                ))}
              </div>
              {mostPopularTier && (
                <div className="text-xs text-muted-foreground pt-2 border-t">
                  Most popular: {mostPopularTier[0]} (
                  {formatPercent(mostPopularTier[1])})
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Types */}
          <Card className="shadow-none bg-slate-50 border-b-4 border-b-slate-500 rounded-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Account Types
              </CardTitle>
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
                            {count} ({formatPercent(percentage)})
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

      {/* Sidebar Section - 1 column */}
      <div className="lg:col-span-1 space-y-6">
        {/* Customer Value */}
        <div className="shadow-none bg-slate-50 border-b-4 border-b-slate-500 rounded-md p-4">
          <h3 className="text-sm font-medium mb-2">Customer Value</h3>
          <p className="text-xs text-muted-foreground mb-3">Lifetime value</p>
          <ul className="space-y-2">
            <li className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Avg CLV</span>
              <span className="text-sm font-semibold">
                {formatCurrency(analytics.averageCustomerLifetimeValue || 0)}
              </span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Median CLV</span>
              <span className="text-sm font-semibold">
                {formatCurrency(analytics.medianCustomerLifetimeValue || 0)}
              </span>
            </li>
            <li className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                Per Active Account
              </span>
              <span className="text-sm font-semibold">
                {formatCurrency(revenuePerAccount)}
              </span>
            </li>
          </ul>
        </div>

        {/* Sports Distribution */}
        <div className="shadow-none bg-slate-50 border-b-4 border-b-slate-500 rounded-md p-4">
          <h3 className="text-sm font-medium mb-2">Sports Distribution</h3>
          <p className="text-xs text-muted-foreground mb-3">Cricket-focused</p>
          <ul className="space-y-3">
            {Object.entries(analytics.sportsDistribution || {}).map(
              ([sport, percentage]) => (
                <li key={sport}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">{sport}</span>
                    <span className="text-sm font-medium">
                      {formatPercent(percentage)}
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </li>
              )
            )}
          </ul>
        </div>

        {/* Churn by Type */}
        <div className="shadow-none bg-slate-50 border-b-4 border-b-slate-500 rounded-md p-4">
          <h3 className="text-sm font-medium mb-2">Churn by Type</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Account type breakdown
          </p>
          <ul className="space-y-2">
            {Object.entries(analytics.churnRates?.churnByAccountType || {}).map(
              ([type, churn]) => (
                <li key={type} className="flex justify-between items-center">
                  <span className="text-sm">{type}</span>
                  <span className="text-sm font-medium">
                    {formatPercent(churn)}
                  </span>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
