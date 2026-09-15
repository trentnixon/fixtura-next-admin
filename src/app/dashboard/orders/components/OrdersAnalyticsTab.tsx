"use client";

import { OverviewRecordPanel } from "@/app/dashboard/components/live-snapshot/OverviewRecordPanel";
import type {
  OrderOverviewStats,
  OrderOverviewTimeline,
} from "@/types/orderOverview";
import { formatPercentage } from "@/utils/chart-formatters";
import { timelinePaidConversion } from "../utils/ordersOverviewHelpers";
import { OrdersOverviewTimeline } from "./OrdersOverviewTimeline";
import { OrdersOverviewPaymentChannelChart } from "./OrdersOverviewPaymentChannelChart";
import { OrdersOverviewTierChart } from "./OrdersOverviewTierChart";

interface OrdersAnalyticsTabProps {
  timeline: OrderOverviewTimeline;
  stats: OrderOverviewStats;
  currency?: string | null;
}

export function OrdersAnalyticsTab({
  timeline,
  stats,
  currency,
}: OrdersAnalyticsTabProps) {
  const conversion = timelinePaidConversion(
    timeline.totals.ordersCreated,
    timeline.totals.ordersPaid,
  );

  return (
    <div className="space-y-6">
      <p className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-muted-foreground">
        Timeline uses daily buckets returned by the overview API
        {timeline.range.start && timeline.range.end
          ? ` (${timeline.range.start} → ${timeline.range.end})`
          : ""}
        .
        {conversion != null ? (
          <>
            {" "}
            Paid conversion in range:{" "}
            <span className="font-medium tabular-nums text-slate-900">
              {formatPercentage(conversion)}
            </span>{" "}
            (paid ÷ created).
          </>
        ) : null}
      </p>

      <OverviewRecordPanel
        title="Trends"
        description="Creation, payment, end events, and revenue collected over time."
      >
        <OrdersOverviewTimeline timeline={timeline} currency={currency} />
      </OverviewRecordPanel>

      <OverviewRecordPanel
        title="Segmentation"
        description="Payment channel and subscription tier distribution."
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <OrdersOverviewPaymentChannelChart stats={stats} />
          <OrdersOverviewTierChart stats={stats} />
        </div>
      </OverviewRecordPanel>
    </div>
  );
}
