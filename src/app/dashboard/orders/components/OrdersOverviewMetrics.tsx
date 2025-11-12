"use client";

import {
  ShoppingBag,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Activity,
} from "lucide-react";

import { OrderOverviewStats } from "@/types/orderOverview";
import MetricGrid from "@/components/ui-library/metrics/MetricGrid";
import StatCard from "@/components/ui-library/metrics/StatCard";
import {
  formatCurrency,
  formatNumber,
  formatRelativeTime,
} from "@/utils/chart-formatters";
interface OrdersOverviewMetricsProps {
  stats: OrderOverviewStats;
  currency?: string | null;
}

const DEFAULT_CURRENCY = "AUD";

export function OrdersOverviewMetrics({
  stats,
  currency,
}: OrdersOverviewMetricsProps) {
  const currencyCode = currency ?? DEFAULT_CURRENCY;

  const centsToUnits = (value: number) => value / 100;

  const paid = stats.paidVsUnpaid.paid;
  const unpaid = stats.paidVsUnpaid.unpaid;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Orders summary</h3>
        <p className="text-sm text-muted-foreground">
          Updated {formatRelativeTime(stats.lastUpdated, "recently")}
        </p>
      </div>

      <MetricGrid columns={3}>
        <StatCard
          title="Total orders"
          value={formatNumber(stats.totalOrders)}
          icon={<ShoppingBag className="h-5 w-5" />}
          description="All orders in selected range"
          variant="primary"
        />
        <StatCard
          title="Active orders"
          value={formatNumber(stats.activeOrders)}
          icon={<Activity className="h-5 w-5" />}
          description={`${formatNumber(stats.pausedOrders)} paused`}
          variant="secondary"
        />
        <StatCard
          title="Pending payment"
          value={formatNumber(stats.pendingPayment)}
          icon={<AlertTriangle className="h-5 w-5" />}
          description={`${formatNumber(stats.cancelledOrders)} cancelled`}
          variant="accent"
        />
        <StatCard
          title="Total revenue"
          value={formatCurrency(centsToUnits(stats.totalRevenue), currencyCode)}
          icon={<DollarSign className="h-5 w-5" />}
          description={`Avg order ${formatCurrency(
            centsToUnits(stats.averageOrderValue),
            currencyCode
          )}`}
          variant="light"
        />
        <StatCard
          title="Paid orders"
          value={`${formatNumber(paid.count)} orders`}
          icon={<CheckCircle2 className="h-5 w-5" />}
          description={`Collected ${formatCurrency(
            centsToUnits(paid.total),
            currencyCode
          )}`}
          variant="light"
        />
        <StatCard
          title="Unpaid orders"
          value={`${formatNumber(unpaid.count)} orders`}
          icon={<AlertTriangle className="h-5 w-5" />}
          description={`Outstanding ${formatCurrency(
            centsToUnits(unpaid.total),
            currencyCode
          )}`}
          variant="light"
        />
      </MetricGrid>
    </div>
  );
}
