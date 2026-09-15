"use client";

import { useMemo, useState } from "react";
import { BarChart3, Gauge, Table2 } from "lucide-react";

import { FetchOrderOverviewParams } from "@/types/orderOverview";
import { useAdminOrderOverview } from "@/hooks/orders/useAdminOrderOverview";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  sectionTabListClass,
  sectionTabTriggerClass,
} from "@/lib/actions/siteNavigationButtonStyles";
import { findCurrencyFromOrders } from "../utils/orderHelpers";
import { OrdersSnapshotTab } from "./OrdersSnapshotTab";
import { OrdersListTab } from "./OrdersListTab";
import { OrdersAnalyticsTab } from "./OrdersAnalyticsTab";

interface OrdersOverviewDashboardProps {
  filters: FetchOrderOverviewParams;
  ordersTab?: string;
  onOrdersTabChange?: (tab: string) => void;
}

const ordersOverviewTabs = [
  { value: "snapshot", label: "Snapshot", icon: Gauge },
  { value: "orders", label: "Orders", icon: Table2 },
  { value: "analytics", label: "Analytics", icon: BarChart3 },
] as const;

export function OrdersOverviewDashboard({
  filters,
  ordersTab: controlledTab,
  onOrdersTabChange,
}: OrdersOverviewDashboardProps) {
  const [internalTab, setInternalTab] = useState("snapshot");
  const ordersTab = controlledTab ?? internalTab;
  const setOrdersTab = onOrdersTabChange ?? setInternalTab;

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
      {isFetching ? (
        <LoadingState variant="minimal" message="Refreshing orders…" />
      ) : null}

      <Tabs
        value={ordersTab}
        onValueChange={setOrdersTab}
        className="w-full min-w-0 max-w-full"
      >
        <div className="pb-8">
          <TabsList variant="primary" className={sectionTabListClass}>
            {ordersOverviewTabs.map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                variant="section"
                className={sectionTabTriggerClass}
              >
                <Icon className="h-4 w-4 shrink-0 text-current" aria-hidden />
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="snapshot" className="mt-0">
          <OrdersSnapshotTab
            filters={filters}
            stats={data.stats}
            currency={currency}
          />
        </TabsContent>

        <TabsContent value="orders" className="mt-0">
          <OrdersListTab orders={data.orders} currency={currency} />
        </TabsContent>

        <TabsContent value="analytics" className="mt-0">
          <OrdersAnalyticsTab
            timeline={data.timeline}
            stats={data.stats}
            currency={currency}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
