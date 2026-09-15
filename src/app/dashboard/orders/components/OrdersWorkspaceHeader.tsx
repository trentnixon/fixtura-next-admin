"use client";

import { useMemo } from "react";
import { ShoppingBag } from "lucide-react";

import { OverviewDataWorkspace } from "@/app/dashboard/components/live-snapshot/OverviewDataWorkspace";
import type { FetchOrderOverviewParams, OrderOverviewStats } from "@/types/orderOverview";
import {
  formatCurrency,
  formatNumber,
  formatRelativeTime,
} from "@/utils/chart-formatters";
import { centsToUnits } from "../utils/currencyHelpers";
import { describeOrderFilters, paidOrderShare } from "../utils/ordersOverviewHelpers";
import { OrdersOverviewFilters } from "./OrdersOverviewFilters";

const DEFAULT_CURRENCY = "AUD";

interface OrdersWorkspaceHeaderProps {
  filters: FetchOrderOverviewParams;
  onChangeFilters: (value: FetchOrderOverviewParams) => void;
  onResetFilters: () => void;
  stats?: OrderOverviewStats | null;
  currency?: string | null;
  isLoading?: boolean;
}

export default function OrdersWorkspaceHeader({
  filters,
  onChangeFilters,
  onResetFilters,
  stats,
  currency,
  isLoading = false,
}: OrdersWorkspaceHeaderProps) {
  const currencyCode = currency ?? DEFAULT_CURRENCY;

  const metrics = useMemo(() => {
    const filterMeta = describeOrderFilters(filters);

    if (isLoading || !stats) {
      return [
        { id: "total", label: "Orders", value: "—", meta: filterMeta, isLoading: true },
        { id: "revenue", label: "Revenue", value: "—", meta: filterMeta, isLoading: true },
        { id: "pending", label: "Pending pay", value: "—", meta: filterMeta, isLoading: true },
        { id: "paid", label: "Paid share", value: "—", meta: filterMeta, isLoading: true },
      ];
    }

    const share = paidOrderShare(stats);

    return [
      {
        id: "total",
        label: "Orders",
        value: formatNumber(stats.totalOrders),
        meta: `${formatNumber(stats.activeOrders)} active`,
        isLoading: false,
      },
      {
        id: "revenue",
        label: "Revenue",
        value: formatCurrency(centsToUnits(stats.totalRevenue), currencyCode),
        meta: `Avg ${formatCurrency(centsToUnits(stats.averageOrderValue), currencyCode)}`,
        isLoading: false,
      },
      {
        id: "pending",
        label: "Pending pay",
        value: formatNumber(stats.pendingPayment),
        meta: `${formatNumber(stats.cancelledOrders)} cancelled`,
        isLoading: false,
        metaTone: stats.pendingPayment > 0 ? ("warning" as const) : ("default" as const),
      },
      {
        id: "paid",
        label: "Paid share",
        value: share != null ? `${share.toFixed(1)}%` : "—",
        meta: `${formatNumber(stats.paidVsUnpaid.paid.count)} paid orders`,
        isLoading: false,
      },
    ];
  }, [stats, currencyCode, filters, isLoading]);

  return (
    <OverviewDataWorkspace
      title="Orders workspace"
      description="Billing activity for the selected date and checkout filters."
      icon={ShoppingBag}
      metrics={metrics}
      columns={4}
      action={
        <OrdersOverviewFilters
          value={filters}
          onChange={onChangeFilters}
          onReset={onResetFilters}
        />
      }
      footer={
        <span className="text-muted-foreground">
          {stats?.lastUpdated
            ? `Updated ${formatRelativeTime(stats.lastUpdated, "recently")}`
            : "Adjust filters to refresh the overview"}
        </span>
      }
    />
  );
}
