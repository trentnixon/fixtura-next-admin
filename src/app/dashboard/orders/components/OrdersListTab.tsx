"use client";

import { DashboardLinkButton } from "@/app/dashboard/components/live-snapshot/DashboardLinkButton";
import { OverviewRecordPanel } from "@/app/dashboard/components/live-snapshot/OverviewRecordPanel";
import type { OrderOverviewRow } from "@/types/orderOverview";
import { formatNumber } from "@/utils/chart-formatters";
import { OrdersOverviewTable } from "./OrdersOverviewTable";

interface OrdersListTabProps {
  orders: OrderOverviewRow[];
  currency?: string | null;
}

export function OrdersListTab({ orders, currency }: OrdersListTabProps) {
  return (
    <OverviewRecordPanel
      title="Order registry"
      description={`${formatNumber(orders.length)} orders from the current workspace filters.`}
      action={
        <DashboardLinkButton href="/dashboard/orders/create" trailingIcon="arrow">
          Create order
        </DashboardLinkButton>
      }
    >
      <OrdersOverviewTable orders={orders} currency={currency} embedded />
    </OverviewRecordPanel>
  );
}
