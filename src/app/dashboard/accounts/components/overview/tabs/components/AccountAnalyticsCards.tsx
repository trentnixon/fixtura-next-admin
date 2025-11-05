"use client";

import { useAccountAnalytics } from "@/hooks/analytics/useAccountAnalytics";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import FinancialOverview from "./FinancialOverview";
import SubscriptionStatusCard from "./SubscriptionStatusCard";
import OrderHistoryTable from "./OrderHistoryTable";
import TrialPerformancePanel from "./TrialPerformancePanel";
import TrialHistory from "./TrialHistory";

/**
 * AccountAnalyticsCards Component
 *
 * Displays comprehensive account-specific analytics including order history,
 * subscription timeline, trial usage, payment status, renewal patterns, and account health scoring.
 *
 * @param accountId - The account ID to fetch analytics for
 */
export default function AccountAnalyticsCards({
  accountId,
}: {
  accountId: number;
}) {
  const {
    data: analyticsData,
    isLoading: isAnalyticsLoading,
    error: analyticsError,
  } = useAccountAnalytics(accountId.toString());

  if (isAnalyticsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (analyticsError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error Loading Analytics</CardTitle>
          <CardDescription>{analyticsError.message}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!analyticsData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Account Analytics
          </CardTitle>
          <CardDescription>No analytics data available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">
            Unable to load analytics for this account. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Check if we have any real data
  const hasRealData = analyticsData?.orderHistory?.totalOrders > 0;

  return (
    <div className="space-y-6">
      {/* Financial Overview Section */}
      {hasRealData ? (
        <FinancialOverview analytics={analyticsData} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Account Analytics
            </CardTitle>
            <CardDescription>
              No account analytics data available yet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground py-4">
              This account has no orders or subscriptions yet. Check back once
              the account has activity.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Subscription Status Section */}
      <SubscriptionStatusCard analytics={analyticsData} />

      {/* Order History */}
      <OrderHistoryTable analytics={analyticsData} />

      {/* Trial Performance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trial Performance Panel */}
        <TrialPerformancePanel analytics={analyticsData} />

        {/* Trial History */}
        <TrialHistory analytics={analyticsData} />
      </div>
    </div>
  );
}
