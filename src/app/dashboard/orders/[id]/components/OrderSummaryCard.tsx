"use client";

import { useMemo } from "react";
import { OrderDetail } from "@/types/orderDetail";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/chart-formatters";
import {
  formatStatusBadgeVariant,
  getStatusBadgeClassName,
  getCheckoutBadgeClassName,
  getActiveBadgeClassName,
} from "../components/utils/badgeHelpers";
import { formatMoney } from "../../utils/currencyHelpers";
import { calculateDaysBetween } from "../../utils/dateHelpers";
import { toTitleCase } from "../../utils/textHelpers";
import { PieChart, Pie, Cell } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

interface OrderSummaryCardProps {
  order: OrderDetail;
}

export default function OrderSummaryCard({ order }: OrderSummaryCardProps) {
  // Calculate progress data for the chart
  const progressData = useMemo(() => {
    const startDate = order.schedule.startOrderAt;
    const endDate = order.schedule.endOrderAt;
    const totalDays = calculateDaysBetween(startDate, endDate);

    if (totalDays === null || totalDays === 0) {
      return null;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (
      !start ||
      !end ||
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime())
    ) {
      return null;
    }

    // Calculate days used (from start to today, but not before start or after end)
    let daysUsed = 0;
    if (today >= start) {
      if (today >= end) {
        // Order has ended - all days used
        daysUsed = totalDays;
      } else {
        // Order is in progress - calculate days from start to today
        const millisPerDay = 1000 * 60 * 60 * 24;
        daysUsed = Math.round(
          (today.getTime() - start.getTime()) / millisPerDay
        );
        daysUsed = Math.max(0, Math.min(daysUsed, totalDays));
      }
    } else {
      // Order hasn't started yet
      daysUsed = 0;
    }

    // Calculate days remaining
    const daysRemaining = Math.max(0, totalDays - daysUsed);

    // Only show chart if we have valid data
    if (daysUsed === 0 && daysRemaining === 0) {
      return null;
    }

    return [
      {
        name: "Days Used",
        value: daysUsed,
        color: "hsl(var(--chart-1))",
      },
      {
        name: "Days Remaining",
        value: daysRemaining,
        color: "hsl(var(--chart-2))",
      },
    ];
  }, [order.schedule.startOrderAt, order.schedule.endOrderAt]);

  const chartConfig: ChartConfig = useMemo(
    () => ({
      "Days Used": {
        label: "Days Used",
        color: "hsl(var(--chart-1))",
      },
      "Days Remaining": {
        label: "Days Remaining",
        color: "hsl(var(--chart-2))",
      },
    }),
    []
  );

  // Determine if order is paid
  const isPaid =
    order.payment.orderPaid || order.payment.status?.toLowerCase() === "paid";

  // Set background and text colors based on payment status
  const paidStyles = {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    textPrimary: "text-emerald-900",
    textSecondary: "text-emerald-800",
    borderDivider: "border-emerald-200/50",
  };

  const unpaidStyles = {
    bg: "bg-amber-50",
    border: "border-amber-200",
    textPrimary: "text-amber-900",
    textSecondary: "text-amber-800",
    borderDivider: "border-amber-200/50",
  };

  const styles = isPaid ? paidStyles : unpaidStyles;

  return (
    <Card className="lg:col-span-2 overflow-hidden">
      {/* Hero Header Section */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-slate-900 mb-2 truncate">
              {order.name ?? `Order #${order.id}`}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <span className="font-medium">ID: {order.id}</span>
              {order.currency && (
                <>
                  <span className="text-slate-400">·</span>
                  <span className="uppercase font-medium">
                    {order.currency.toLowerCase()}
                  </span>
                </>
              )}
            </div>
          </div>
          {/* Status Badges - Prominent Display */}
          <div className="flex flex-wrap gap-2 justify-end">
            <Badge
              variant={formatStatusBadgeVariant(order.payment.status ?? "")}
              className={getStatusBadgeClassName(order.payment.status ?? "")}
            >
              Payment Status:{" "}
              {order.payment.status
                ? toTitleCase(order.payment.status)
                : "Unknown"}
            </Badge>
            {order.status.checkoutStatus && (
              <Badge
                variant="outline"
                className={getCheckoutBadgeClassName(
                  order.status.checkoutStatus
                )}
              >
                Checkout Status: {toTitleCase(order.status.checkoutStatus)}
              </Badge>
            )}
            <Badge
              variant={order.status.isActive ? "primary" : "outline"}
              className={getActiveBadgeClassName(order.status.isActive)}
            >
              Order Status: {order.status.isActive ? "Active" : "Inactive"}
            </Badge>
            {order.status.isPaused && (
              <Badge variant="secondary" className="rounded-full">
                Order Status: Paused
              </Badge>
            )}
            {order.status.hasExpired && (
              <Badge variant="destructive" className="rounded-full">
                Order Status: Expired
              </Badge>
            )}
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Financial & Subscription */}
          <div className="lg:col-span-2 space-y-6">
            {/* Financial Highlight Box */}
            <div
              className={`${styles.bg} border ${styles.border} rounded-lg p-5`}
            >
              <div className="flex items-baseline justify-between gap-4">
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${styles.textPrimary} mb-1`}
                  >
                    Total Amount
                  </p>
                  <p className={`text-3xl font-bold ${styles.textPrimary}`}>
                    {order.totals.formatted ??
                      formatMoney(order.totals.amount, order.currency)}
                  </p>
                  {/* Payment Status and Channel */}
                  <div
                    className={`mt-4 space-y-2 pt-4 border-t ${styles.borderDivider}`}
                  >
                    <div>
                      <p
                        className={`text-xs font-medium ${styles.textSecondary} mb-0.5`}
                      >
                        Payment status
                      </p>
                      <p
                        className={`text-sm font-semibold ${styles.textPrimary}`}
                      >
                        {order.payment.status ?? "—"}
                      </p>
                    </div>
                    <div>
                      <p
                        className={`text-xs font-medium ${styles.textSecondary} mb-0.5`}
                      >
                        Payment channel
                      </p>
                      <p
                        className={`text-sm font-semibold ${styles.textPrimary}`}
                      >
                        {order.payment.channel
                          ? order.payment.channel.charAt(0).toUpperCase() +
                            order.payment.channel.slice(1)
                          : "—"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-700 mb-1">
                    Subscription
                  </p>
                  <p className="text-lg font-semibold text-slate-900">
                    {order.subscriptionTier.name ?? "—"}
                  </p>
                  <div className="text-xs text-slate-600 mt-1 space-y-0.5">
                    <p>
                      {order.schedule.startOrderAt
                        ? formatDate(order.schedule.startOrderAt)
                        : "—"}
                    </p>
                    <p>
                      {order.schedule.endOrderAt
                        ? formatDate(order.schedule.endOrderAt)
                        : "—"}
                    </p>
                    {(() => {
                      const days = calculateDaysBetween(
                        order.schedule.startOrderAt,
                        order.schedule.endOrderAt
                      );
                      return days !== null ? (
                        <p className="font-medium text-slate-700 mt-1">
                          {days} {days === 1 ? "day" : "days"}
                        </p>
                      ) : null;
                    })()}
                  </div>
                </div>
              </div>
            </div>

            {/* Account Section - Card Style */}
            <div className="border border-slate-200 rounded-lg p-5 bg-white">
              <div className="mb-4">
                <h3 className="text-base font-semibold text-slate-900 mb-1">
                  Account
                </h3>
                <p className="text-xs text-slate-500">
                  Account hierarchy associated with this order
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Account Name
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {order.account.name ?? "—"}
                  </p>
                  {order.account.accountType && (
                    <p className="text-xs text-slate-600">
                      {order.account.accountType}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Sport
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {order.account.sport ?? "—"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Contact
                  </p>
                  <p className="text-sm font-semibold text-slate-900 break-all">
                    {order.account.contact.email ?? "—"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Clubs
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {order.account.clubs.length > 0
                      ? order.account.clubs
                          .map((club) => club.name ?? "—")
                          .join(", ")
                      : "—"}
                  </p>
                </div>
              </div>
              {order.account.associations.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                    Associations
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {order.account.associations.map((assoc, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {assoc.name ?? "—"}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Metadata */}
          <div className="space-y-6">
            {/* Timestamps Card */}
            <div className="border border-slate-200 rounded-lg p-5 bg-slate-50/50">
              <h4 className="text-sm font-semibold text-slate-900 mb-4">
                Timeline
              </h4>
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Created
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {formatDate(order.timestamps.createdAt)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Updated
                  </p>
                  <p className="text-sm font-semibold text-slate-900">
                    {formatDate(order.timestamps.updatedAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Chart */}
            {progressData && (
              <div className="border border-slate-200 rounded-lg p-5 bg-white">
                <h4 className="text-sm font-semibold text-slate-900 mb-4">
                  Season Pass Progress
                </h4>
                <ChartContainer
                  config={chartConfig}
                  className="h-[200px] w-full"
                >
                  <PieChart>
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0];
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="grid gap-2">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-sm font-medium">
                                    {data.name}
                                  </span>
                                  <span className="text-sm font-bold">
                                    {data.value}{" "}
                                    {data.value === 1 ? "day" : "days"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Pie
                      data={progressData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {progressData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartLegend
                      content={<ChartLegendContent />}
                      className="-bottom-2"
                    />
                  </PieChart>
                </ChartContainer>
                <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Used</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {progressData[0].value}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Remaining</p>
                    <p className="text-lg font-semibold text-slate-900">
                      {progressData[1].value}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
