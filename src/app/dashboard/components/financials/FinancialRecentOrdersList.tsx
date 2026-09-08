"use client";

import Link from "next/link";
import { CreditCard, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/ui-library/states/EmptyState";
import type { OrderOverviewRow } from "@/types/orderOverview";
import {
  formatCurrency,
  formatRelativeTime,
} from "@/utils/chart-formatters";
import {
  getPaymentChannelBadgeClassName,
  getStatusBadgeClassName,
  formatStatusBadgeVariant,
} from "@/app/dashboard/orders/utils/badgeHelpers";
import { toTitleCase } from "@/app/dashboard/orders/utils/textHelpers";
import { cn } from "@/lib/utils";

interface FinancialRecentOrdersListProps {
  orders: OrderOverviewRow[];
  currency?: string | null;
  limit?: number;
}

const DEFAULT_CURRENCY = "AUD";

export function FinancialRecentOrdersList({
  orders,
  currency,
  limit = 5,
}: FinancialRecentOrdersListProps) {
  const currencyCode = currency ?? DEFAULT_CURRENCY;

  const recent = [...orders]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, limit);

  if (recent.length === 0) {
    return (
      <EmptyState
        variant="minimal"
        title="No orders in range"
        description="Orders will appear here for the selected period."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-slate-200">
      {recent.map((order) => {
        const accountName = order.account.name?.trim() || "Unknown account";
        const amount = formatCurrency(order.totals.amount / 100, currencyCode);
        const channel = order.paymentChannel;

        return (
          <div
            key={order.id}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-slate-200 px-3 py-2.5 text-sm last:border-b-0"
          >
            <div className="rounded-md bg-slate-50 p-1.5 text-slate-600">
              {order.paymentChannel === "stripe" ? (
                <CreditCard className="h-3.5 w-3.5" />
              ) : (
                <ShoppingBag className="h-3.5 w-3.5" />
              )}
            </div>

            <div className="min-w-0">
              <Link
                href={`/dashboard/orders/${order.id}`}
                className="truncate font-medium text-slate-800 hover:text-primary hover:underline"
              >
                {order.name?.trim() || `Order #${order.id}`}
              </Link>
              <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                <span className="truncate">{accountName}</span>
                <span className="text-muted-foreground/60">·</span>
                <span>{amount}</span>
                <span className="text-muted-foreground/60">·</span>
                <span>{formatRelativeTime(order.updatedAt, "recently")}</span>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-1">
              <Badge
                variant={formatStatusBadgeVariant(order.status)}
                className={getStatusBadgeClassName(order.status)}
              >
                {toTitleCase(order.status.replace(/_/g, " "))}
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px]",
                  getPaymentChannelBadgeClassName(channel)
                )}
              >
                {toTitleCase(channel ?? "not set")}
              </Badge>
            </div>
          </div>
        );
      })}
    </div>
  );
}
