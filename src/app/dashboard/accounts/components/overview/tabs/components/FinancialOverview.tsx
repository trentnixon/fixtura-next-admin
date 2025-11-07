"use client";

import { AccountAnalytics } from "@/types/analytics";
import StatCard from "@/components/ui-library/metrics/StatCard";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { LoadingState } from "@/components/ui-library";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionTitle, Label, H4 } from "@/components/type/titles";
import { TrendingUp, DollarSign, Calendar, CreditCard } from "lucide-react";

import { formatDate } from "@/lib/utils";

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

  const financialSummary = analytics?.financialSummary;
  const paymentStatus = analytics?.paymentStatus;

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
          value={`$${(
            (financialSummary?.totalLifetimeValue || 0) / 100
          ).toLocaleString("en-AU", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          icon={<DollarSign className="h-5 w-5" />}
          description={`${
            analytics?.orderHistory?.totalOrders || 0
          } season pass${
            analytics?.orderHistory?.totalOrders !== 1 ? "es" : ""
          } purchased`}
          variant="primary"
        />

        {/* Annual Season Pass Value */}
        <StatCard
          title="Season Pass Value"
          value={`$${(
            financialSummary?.monthlyRecurringRevenue || 0
          ).toLocaleString("en-AU", {
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
          description={`${analytics?.orderHistory?.totalOrders || 0} season${
            analytics?.orderHistory?.totalOrders !== 1 ? "s" : ""
          } subscribed`}
          variant="accent"
        />

        {/* Last Season Pass Purchase */}
        <StatCard
          title="Last Season Pass"
          value={
            paymentStatus?.lastPaymentDate
              ? formatDate(paymentStatus.lastPaymentDate)
              : "Never"
          }
          icon={<CreditCard className="h-5 w-5" />}
          description={`${analytics?.orderHistory?.totalOrders || 0} season${
            analytics?.orderHistory?.totalOrders !== 1 ? "s" : ""
          } total`}
          variant="light"
        />
      </div>

      {/* Payment Status */}
      <SectionContainer title="Payment Status" variant="compact">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="space-y-1">
            <Label className="text-xs">Success Rate</Label>
            <H4 className="text-lg font-bold m-0">
              {paymentStatus?.successRate?.toFixed(1) || 0}%
            </H4>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Total Payments</Label>
            <H4 className="text-lg font-bold m-0">
              {paymentStatus?.totalPayments || 0}
            </H4>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Successful</Label>
            <H4 className="text-lg font-bold m-0 text-success-600">
              {paymentStatus?.successfulPayments || 0}
            </H4>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Failed</Label>
            <H4 className="text-lg font-bold m-0 text-error-600">
              {paymentStatus?.failedPayments || 0}
            </H4>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Avg Payment</Label>
            <H4 className="text-lg font-bold m-0">
              $
              {(
                (paymentStatus?.averagePaymentAmount || 0) / 100
              ).toLocaleString("en-AU", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </H4>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
}
