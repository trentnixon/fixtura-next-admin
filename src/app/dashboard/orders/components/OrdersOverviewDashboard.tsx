"use client";

import { useMemo } from "react";
import { BarChart3, Gauge, Table2 } from "lucide-react";

import { FetchOrderOverviewParams } from "@/types/orderOverview";
import { useAdminOrderOverview } from "@/hooks/orders/useAdminOrderOverview";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrdersOverviewMetrics } from "./OrdersOverviewMetrics";
import { OrdersOverviewTimeline } from "./OrdersOverviewTimeline";
import { OrdersOverviewTable } from "./OrdersOverviewTable";
import { OrdersOverviewPaymentChannelChart } from "./OrdersOverviewPaymentChannelChart";
import { findCurrencyFromOrders } from "../utils/orderHelpers";

interface OrdersOverviewDashboardProps {
  filters: FetchOrderOverviewParams;
}

const ordersOverviewTabs = [
  {
    value: "snapshot",
    label: "Snapshot",
    icon: Gauge,
  },
  {
    value: "orders",
    label: "Orders",
    icon: Table2,
  },
  {
    value: "analytics",
    label: "Analytics",
    icon: BarChart3,
  },
];

export function OrdersOverviewDashboard({
  filters,
}: OrdersOverviewDashboardProps) {
  const { data, error, isLoading, isFetching, refetch } =
    useAdminOrderOverview(filters);

  const currency = useMemo(() => {
    if (!data) return null;
    return findCurrencyFromOrders(data.orders);
  }, [data]);

  if (isLoading) {
    return (
      <LoadingState variant="skeleton">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-[360px] w-full" />
        <Skeleton className="h-[480px] w-full" />
      </LoadingState>
    );
  }

  if (error) {
    return (
      <ErrorState
        variant="card"
        title="Unable to load order overview"
        error={error}
        onRetry={() => refetch()}
      />
    );
  }

  if (!data) {
    return (
      <EmptyState
        variant="card"
        title="No order data available"
        description="We couldn't find any orders for the selected filters. Try adjusting the date range or status."
      />
    );
  }

  return (
    <div className="space-y-4">
      {isFetching && (
        <LoadingState variant="minimal" message="Refreshing orders..." />
      )}
      <Tabs defaultValue="snapshot" className="w-full min-w-0 max-w-full">
        <TabsList className="h-auto w-full flex-wrap justify-start rounded-md bg-slate-100 p-1 lg:w-auto">
          {ordersOverviewTabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="min-h-10 gap-2"
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="snapshot" className="mt-6 space-y-6">
          <OrdersOverviewMetrics stats={data.stats} currency={currency} />
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <OrdersOverviewTable orders={data.orders} currency={currency} />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <OrdersOverviewTimeline
                timeline={data.timeline}
                currency={currency}
              />
            </div>
            <OrdersOverviewPaymentChannelChart stats={data.stats} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
