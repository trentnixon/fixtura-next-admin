"use client";

import { useAccountAnalytics } from "@/hooks/analytics/useAccountAnalytics";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui-library";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
      <LoadingState variant="skeleton" message="Loading account analytics...">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </LoadingState>
    );
  }

  if (analyticsError) {
    return (
      <ErrorState
        error={analyticsError}
        title="Error Loading Analytics"
        variant="card"
      />
    );
  }

  if (!analyticsData) {
    return (
      <EmptyState
        title="Account Analytics"
        description="No analytics data available. Unable to load analytics for this account. Please try again later."
        variant="card"
      />
    );
  }

  // Check if we have any real data
  const hasRealData = analyticsData?.orderHistory?.totalOrders > 0;

  // Check if account has an active order/subscription
  // Show "Create Invoice" button only if there's no active subscription
  const hasActiveOrder = analyticsData?.currentSubscription?.isActive || false;

  return (
    <div className="space-y-6">
      {/* Create Invoice Button - Only show if account has no active order */}
      {!hasActiveOrder && (
        <div className="flex justify-end">
          <Button variant="primary" asChild>
            <Link href={`/dashboard/orders/create/${accountId}`}>
              Create Invoice
            </Link>
          </Button>
        </div>
      )}

      {/* Financial Overview Section */}
      {hasRealData ? (
        <FinancialOverview analytics={analyticsData} />
      ) : (
        <EmptyState
          title="Account Analytics"
          description="No account analytics data available yet. This account has no orders or subscriptions yet. Check back once the account has activity."
          variant="card"
        />
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
