"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import { DashboardLinkButton } from "@/app/dashboard/components/live-snapshot/DashboardLinkButton";
import { Button } from "@/components/ui/button";
import { siteNavigationCtaAltClass } from "@/lib/actions/siteNavigationButtonStyles";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FetchOrderOverviewParams } from "@/types/orderOverview";
import { useAdminOrderOverview } from "@/hooks/orders/useAdminOrderOverview";
import { OrdersOverviewDashboard } from "./components/OrdersOverviewDashboard";
import OrdersWorkspaceHeader from "./components/OrdersWorkspaceHeader";
import { findCurrencyFromOrders } from "./utils/orderHelpers";

const INITIAL_FILTERS: FetchOrderOverviewParams = {};

export default function Orders() {
  const [filters, setFilters] =
    useState<FetchOrderOverviewParams>(INITIAL_FILTERS);
  const [ordersTab, setOrdersTab] = useState("snapshot");

  const { data, isLoading, isFetching } = useAdminOrderOverview(filters);

  const currency = useMemo(() => {
    if (!data) return null;
    return findCurrencyFromOrders(data.orders);
  }, [data]);

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  return (
    <>
      <CreatePageTitle
        title="Orders"
        byLine="Billing activity and order operations"
        byLineBottom="Filter by date or checkout status in the workspace"
      >
        <DashboardLinkButton
          href="/dashboard/orders/invoices"
          trailingIcon="arrow"
        >
          Invoice queue
        </DashboardLinkButton>
        <Button
          asChild
          size="sm"
          variant="primary"
          className={cn(siteNavigationCtaAltClass, "h-9")}
        >
          <Link href="/dashboard/orders/create">
            <Plus className="mr-2 h-4 w-4" aria-hidden />
            Create order
          </Link>
        </Button>
      </CreatePageTitle>

      <PageContainer padding="xs" spacing="md">
        <div className="space-y-6">
          <OrdersWorkspaceHeader
            filters={filters}
            onChangeFilters={setFilters}
            onResetFilters={handleResetFilters}
            stats={data?.stats}
            currency={currency}
            isLoading={isLoading || (isFetching && !data)}
          />

          <OrdersOverviewDashboard
            filters={filters}
            ordersTab={ordersTab}
            onOrdersTabChange={setOrdersTab}
          />
        </div>
      </PageContainer>
    </>
  );
}
