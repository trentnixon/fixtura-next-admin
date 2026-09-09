import { AccountAnalytics } from "@/types/analytics";

export type FinancialOverviewMetrics = {
  totalSeasonRevenue: string;
  seasonPassValue: string;
  renewalStatus: string;
  lastSeasonPassDate: string;
  paidOrderCount: number;
  isRenewalActive: boolean;
};

export function getFinancialOverviewMetrics(
  analytics: AccountAnalytics,
): FinancialOverviewMetrics {
  const paymentStatus = analytics.paymentStatus;
  const orderHistory = analytics.orderHistory;

  const paidOrders =
    orderHistory?.orders?.filter(
      (order) =>
        order.amount > 0 &&
        !order.subscriptionTier?.toLowerCase().includes("trial"),
    ) ?? [];

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

  const paidOrderCount = orderHistory?.paidOrders ?? 0;

  const totalSeasonRevenue = `$${(
    (orderHistory?.totalSpent ?? 0) / 100
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

  const isRenewalActive = analytics.currentSubscription?.isActive ?? false;

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

  return {
    totalSeasonRevenue,
    seasonPassValue: formattedSeasonPassValue,
    renewalStatus: isRenewalActive ? "Active" : "Inactive",
    lastSeasonPassDate,
    paidOrderCount,
    isRenewalActive,
  };
}
