"use client";

import {
  ShoppingBag,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Activity,
  PauseCircle,
  type LucideIcon,
} from "lucide-react";

import { OrderOverviewStats } from "@/types/orderOverview";
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

  const metrics: Array<{
    label: string;
    value: string;
    detail: string;
    icon: LucideIcon;
  }> = [
    {
      label: "Total orders",
      value: formatNumber(stats.totalOrders),
      detail: "Selected range",
      icon: ShoppingBag,
    },
    {
      label: "Active orders",
      value: formatNumber(stats.activeOrders),
      detail: `${formatNumber(stats.pausedOrders)} paused`,
      icon: Activity,
    },
    {
      label: "Pending payment",
      value: formatNumber(stats.pendingPayment),
      detail: `${formatNumber(stats.cancelledOrders)} cancelled`,
      icon: AlertTriangle,
    },
    {
      label: "Total revenue",
      value: formatCurrency(centsToUnits(stats.totalRevenue), currencyCode),
      detail: `Avg ${formatCurrency(
        centsToUnits(stats.averageOrderValue),
        currencyCode,
      )}`,
      icon: DollarSign,
    },
    {
      label: "Paid orders",
      value: formatNumber(paid.count),
      detail: formatCurrency(centsToUnits(paid.total), currencyCode),
      icon: CheckCircle2,
    },
    {
      label: "Unpaid orders",
      value: formatNumber(unpaid.count),
      detail: formatCurrency(centsToUnits(unpaid.total), currencyCode),
      icon: PauseCircle,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Orders snapshot
          </h3>
          <p className="text-sm text-muted-foreground">
            Compact summary for the selected filters.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          Updated {formatRelativeTime(stats.lastUpdated, "recently")}
        </p>
      </div>

      <div className="grid overflow-hidden rounded-md border bg-white sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;

          return (
            <div
              key={metric.label}
              className="flex items-center justify-between gap-4 border-b border-slate-100 p-4 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0 lg:border-r lg:[&:nth-child(3n)]:border-r-0 lg:[&:nth-last-child(-n+3)]:border-b-0"
            >
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {metric.label}
                </p>
                <p className="mt-1 truncate text-xl font-semibold text-slate-900">
                  {metric.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {metric.detail}
                </p>
              </div>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-600">
                <Icon className="h-4 w-4" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
