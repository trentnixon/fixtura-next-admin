"use client";

import { OverviewRecordPanel } from "@/app/dashboard/components/live-snapshot/OverviewRecordPanel";
import type {
  FetchOrderOverviewParams,
  OrderOverviewStats,
} from "@/types/orderOverview";
import { describeOrderFilters } from "../utils/ordersOverviewHelpers";
import { OrdersOverviewMetrics } from "./OrdersOverviewMetrics";
import { OrdersOverviewPaymentChannelChart } from "./OrdersOverviewPaymentChannelChart";
import { OrdersOverviewStatusChart } from "./OrdersOverviewStatusChart";

interface OrdersSnapshotTabProps {
  filters: FetchOrderOverviewParams;
  stats: OrderOverviewStats;
  currency?: string | null;
}

export function OrdersSnapshotTab({
  filters,
  stats,
  currency,
}: OrdersSnapshotTabProps) {
  return (
    <div className="space-y-6">
      <p className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-muted-foreground">
        Snapshot reflects workspace filters:{" "}
        <span className="font-medium text-slate-900">
          {describeOrderFilters(filters)}
        </span>
        . Table filters on the Orders tab are local to that list.
      </p>

      <OverviewRecordPanel
        title="Operational KPIs"
        description="Volume, revenue, and payment health for the filtered cohort."
      >
        <OrdersOverviewMetrics stats={stats} currency={currency} embedded />
      </OverviewRecordPanel>

      <OverviewRecordPanel
        title="Composition"
        description="How orders break down by payment channel and checkout status."
      >
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <OrdersOverviewPaymentChannelChart stats={stats} />
          <OrdersOverviewStatusChart stats={stats} />
        </div>
      </OverviewRecordPanel>
    </div>
  );
}
