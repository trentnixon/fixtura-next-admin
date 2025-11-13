"use client";

import { useMemo } from "react";

import { FetchOrderOverviewParams } from "@/types/orderOverview";
import { useAdminOrderOverview } from "@/hooks/orders/useAdminOrderOverview";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { OrdersOverviewMetrics } from "./OrdersOverviewMetrics";
import { OrdersOverviewTimeline } from "./OrdersOverviewTimeline";
import { OrdersOverviewTable } from "./OrdersOverviewTable";
import { OrdersOverviewPaymentChannelChart } from "./OrdersOverviewPaymentChannelChart";
import { findCurrencyFromOrders } from "../utils/orderHelpers";

interface OrdersOverviewDashboardProps {
  filters: FetchOrderOverviewParams;
}

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
    <div className="space-y-6">
      {isFetching && (
        <LoadingState variant="minimal" message="Refreshing orders..." />
      )}
      <OrdersOverviewTable orders={data.orders} currency={currency} />
      <OrdersOverviewMetrics stats={data.stats} currency={currency} />
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <OrdersOverviewTimeline
            timeline={data.timeline}
            currency={currency}
          />
        </div>
        <OrdersOverviewPaymentChannelChart stats={data.stats} />
      </div>
    </div>
  );
}
