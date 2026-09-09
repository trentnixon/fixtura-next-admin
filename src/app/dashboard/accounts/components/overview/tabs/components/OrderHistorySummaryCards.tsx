"use client";

import { AccountAnalytics } from "@/types/analytics";
import {
  ActivityCard,
  CompactKpiCard,
  ComparisonCard,
  OperationalStatusCard,
} from "@/components/ui-library/cards";
import { Clock3, Percent, Receipt, Wallet } from "lucide-react";
import { formatDate } from "@/lib/utils";

type OrderHistorySummaryCardsProps = {
  analytics: AccountAnalytics;
};

export default function OrderHistorySummaryCards({
  analytics,
}: OrderHistorySummaryCardsProps) {
  const { orders, averageOrderValue, totalOrders } = analytics.orderHistory;
  const paymentStatus = analytics.paymentStatus;
  const safeOrders = Array.isArray(orders) ? orders : [];

  const totalDisplayed =
    safeOrders.reduce((sum, order) => sum + (order.amount || 0), 0) / 100;

  const formattedAvgOrderValue = `$${(
    (averageOrderValue || 0) / 100
  ).toLocaleString("en-AU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const formattedTotalDisplayed = `$${totalDisplayed.toLocaleString("en-AU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  const successRate = paymentStatus?.successRate?.toFixed(1) ?? "0";
  const successfulPayments = paymentStatus?.successfulPayments ?? 0;
  const failedPayments = paymentStatus?.failedPayments ?? 0;
  const hasFailures = failedPayments > 0;

  const recentOrderItems = [...safeOrders]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)
    .map((order) => ({
      icon: Receipt,
      label: `${order.subscriptionTier} · $${(order.amount / 100).toLocaleString(
        "en-AU",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      )}`,
      meta: formatDate(order.date),
      tone:
        order.amount > 0
          ? "bg-emerald-50 text-emerald-700"
          : "bg-slate-50 text-slate-600",
    }));

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <CompactKpiCard
        value={formattedAvgOrderValue}
        label="Avg order value"
        icon={<Wallet className="h-4 w-4" />}
        iconClassName="bg-indigo-50 text-indigo-700"
        progressClassName="bg-indigo-500"
        progressPercent={
          totalDisplayed > 0
            ? Math.min(
                100,
                Math.round(((averageOrderValue || 0) / 100 / totalDisplayed) * 100),
              )
            : undefined
        }
      />

      <OperationalStatusCard
        title="Total displayed"
        description={`${safeOrders.length} order${safeOrders.length === 1 ? "" : "s"} in current view`}
        icon={<Receipt className="h-4 w-4" />}
        footerLabel="Amount"
        footerValue={formattedTotalDisplayed}
        status={totalDisplayed > 0 ? "healthy" : "neutral"}
      />

      <ComparisonCard
        title="Payment completion"
        description={`${successRate}% success rate`}
        icon={<Percent className="h-4 w-4" />}
        rows={[
          {
            label: "Successful",
            value: String(successfulPayments),
            tone: "text-emerald-700",
          },
          {
            label: "Failed",
            value: String(failedPayments),
            tone: hasFailures ? "text-red-700" : "text-slate-600",
          },
        ]}
      />

      <ActivityCard
        title="Recent orders"
        items={
          recentOrderItems.length > 0
            ? recentOrderItems
            : [
                {
                  icon: Clock3,
                  label: "No orders yet",
                  meta: `${totalOrders || 0} total on account`,
                  tone: "bg-slate-50 text-slate-600",
                },
              ]
        }
      />
    </div>
  );
}
