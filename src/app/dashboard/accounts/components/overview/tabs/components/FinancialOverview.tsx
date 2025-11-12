"use client";

import { AccountAnalytics } from "@/types/analytics";
import StatCard from "@/components/ui-library/metrics/StatCard";
import { LoadingState } from "@/components/ui-library";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionTitle } from "@/components/type/titles";
import { TrendingUp, DollarSign, Calendar, CreditCard } from "lucide-react";

/**
 * FinancialOverview Component
 *
 * Displays key financial metrics for cricket club/association accounts including
 * season revenue, annual season pass value, and payment history.
 *
 * @param analytics - Account analytics data
 */
export default function FinancialOverview({
  analytics,
}: {
  analytics?: AccountAnalytics;
}) {
  if (!analytics) {
    return (
      <LoadingState variant="skeleton" message="Loading financial overview...">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border rounded-lg p-6">
              <Skeleton className="h-4 w-32 mb-4" />
              <Skeleton className="h-10 w-40" />
            </div>
          ))}
        </div>
      </LoadingState>
    );
  }

  const paymentStatus = analytics?.paymentStatus;
  const orderHistory = analytics?.orderHistory;

  // Calculate the most recent paid order amount for Season Pass Value
  // Filter out free trials and $0 orders
  const paidOrders =
    orderHistory?.orders?.filter(
      (order) =>
        order.amount > 0 &&
        !order.subscriptionTier?.toLowerCase().includes("trial")
    ) || [];

  // Get the most recent paid order amount, or use average if no recent order
  const mostRecentPaidOrder =
    paidOrders.length > 0
      ? paidOrders.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0]
      : null;

  const seasonPassValue =
    mostRecentPaidOrder?.amount ||
    (orderHistory?.paidOrders > 0
      ? orderHistory.totalSpent / orderHistory.paidOrders
      : 0);

  return (
    <div className="space-y-6">
      <SectionTitle className="flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-blue-500" />
        Financial Overview
      </SectionTitle>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Season Revenue */}
        <StatCard
          title="Total Season Revenue"
          value={`$${((orderHistory?.totalSpent || 0) / 100).toLocaleString(
            "en-AU",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}`}
          icon={<DollarSign className="h-5 w-5" />}
          description={`${orderHistory?.paidOrders || 0} season pass${
            (orderHistory?.paidOrders || 0) !== 1 ? "es" : ""
          } purchased`}
          variant="primary"
        />

        {/* Annual Season Pass Value */}
        <StatCard
          title="Season Pass Value"
          value={`$${(seasonPassValue / 100).toLocaleString("en-AU", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          icon={<TrendingUp className="h-5 w-5" />}
          description="Annual billing cycle"
          variant="secondary"
        />

        {/* Renewal Status */}
        <StatCard
          title="Renewal Status"
          value={
            analytics?.currentSubscription?.isActive ? "Active" : "Inactive"
          }
          icon={<Calendar className="h-5 w-5" />}
          description={`${orderHistory?.paidOrders || 0} season${
            (orderHistory?.paidOrders || 0) !== 1 ? "s" : ""
          } subscribed`}
          variant="accent"
        />

        {/* Last Season Pass Purchase */}
        <StatCard
          title="Last Season Pass"
          value={
            mostRecentPaidOrder?.date
              ? new Date(mostRecentPaidOrder.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "2-digit",
                })
              : paymentStatus?.lastPaymentDate
              ? new Date(paymentStatus.lastPaymentDate).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    year: "2-digit",
                  }
                )
              : "Never"
          }
          icon={<CreditCard className="h-5 w-5" />}
          description={`${orderHistory?.paidOrders || 0} season${
            (orderHistory?.paidOrders || 0) !== 1 ? "s" : ""
          } total`}
          variant="light"
        />
      </div>
    </div>
  );
}
