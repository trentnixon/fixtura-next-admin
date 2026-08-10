"use client";

import { AccountAnalytics } from "@/types/analytics";
import { LoadingState } from "@/components/ui-library";
import { Skeleton } from "@/components/ui/skeleton";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

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
        <div className="grid overflow-hidden rounded-md border border-slate-200 bg-white sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="border-b border-r border-slate-200 px-4 py-3 last:border-r-0 sm:[&:nth-child(2n)]:border-r-0 lg:border-b-0 lg:[&:nth-child(2n)]:border-r lg:last:border-r-0"
            >
              <Skeleton className="mb-3 h-3 w-28" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="mt-2 h-3 w-36" />
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
        !order.subscriptionTier?.toLowerCase().includes("trial"),
    ) || [];

  // Get the most recent paid order amount, or use average if no recent order
  const mostRecentPaidOrder =
    paidOrders.length > 0
      ? paidOrders.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        )[0]
      : null;

  const seasonPassValue =
    mostRecentPaidOrder?.amount ||
    (orderHistory?.paidOrders > 0
      ? orderHistory.totalSpent / orderHistory.paidOrders
      : 0);
  const paidOrderCount = orderHistory?.paidOrders || 0;
  const totalSeasonRevenue = `$${(
    (orderHistory?.totalSpent || 0) / 100
  ).toLocaleString("en-AU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
  const formattedSeasonPassValue = `$${(seasonPassValue / 100).toLocaleString(
    "en-AU",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  )}`;
  const renewalStatus = analytics?.currentSubscription?.isActive
    ? "Active"
    : "Inactive";
  const lastSeasonPassDate = mostRecentPaidOrder?.date
    ? new Date(mostRecentPaidOrder.date).toLocaleDateString("en-AU", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : paymentStatus?.lastPaymentDate
      ? new Date(paymentStatus.lastPaymentDate).toLocaleDateString("en-AU", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Never";

  return (
    <SectionContainer
      title="Financial Overview"
      description="Season pass revenue and subscription timing"
      variant="compact"
      icon={<TrendingUp className="h-4 w-4 text-slate-500" />}
      contentClassName="p-0"
    >
      <div className="grid overflow-hidden rounded-md border border-slate-200 bg-white sm:grid-cols-2 lg:grid-cols-4">
        <FinancialMetric
          label="Total Season Revenue"
          value={totalSeasonRevenue}
          helper={`${paidOrderCount} season pass${
            paidOrderCount !== 1 ? "es" : ""
          } purchased`}
        />
        <FinancialMetric
          label="Season Pass Value"
          value={formattedSeasonPassValue}
          helper="Annual billing cycle"
        />
        <FinancialMetric
          label="Renewal Status"
          value={renewalStatus}
          helper={`${paidOrderCount} season${
            paidOrderCount !== 1 ? "s" : ""
          } subscribed`}
          status={analytics?.currentSubscription?.isActive ? "active" : "muted"}
        />
        <FinancialMetric
          label="Last Season Pass"
          value={lastSeasonPassDate}
          helper={`${paidOrderCount} season${
            paidOrderCount !== 1 ? "s" : ""
          } total`}
        />
      </div>
    </SectionContainer>
  );
}

function FinancialMetric({
  label,
  value,
  helper,
  status,
}: {
  label: string;
  value: string;
  helper: string;
  status?: "active" | "muted";
}) {
  return (
    <div className="border-b border-r border-slate-200 px-4 py-3 last:border-r-0 sm:[&:nth-child(2n)]:border-r-0 lg:border-b-0 lg:[&:nth-child(2n)]:border-r lg:last:border-r-0">
      <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
      <div className="mt-1 flex min-h-6 items-center gap-2">
        {status ? (
          <Badge
            variant="outline"
            className={cn(
              "rounded-full text-xs",
              status === "active" &&
                "border-emerald-200 bg-emerald-50 text-emerald-700",
              status === "muted" &&
                "border-slate-200 bg-slate-50 text-slate-600",
            )}
          >
            {value}
          </Badge>
        ) : (
          <p className="truncate text-lg font-semibold leading-none text-slate-900">
            {value}
          </p>
        )}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{helper}</p>
    </div>
  );
}
