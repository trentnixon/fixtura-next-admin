"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import { Button } from "@/components/ui/button";
import { OrdersOverviewDashboard } from "./components/OrdersOverviewDashboard";
import { OrdersOverviewFilters } from "./components/OrdersOverviewFilters";
import { FetchOrderOverviewParams } from "@/types/orderOverview";

const INITIAL_FILTERS: FetchOrderOverviewParams = {};

export default function Orders() {
  const [filters, setFilters] =
    useState<FetchOrderOverviewParams>(INITIAL_FILTERS);

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  return (
    <>
      <CreatePageTitle
        title="Orders"
        byLine="Billing activity and order operations"
        byLineBottom="Filter by date or checkout status"
      />
      <PageContainer padding="xs" spacing="md">
        <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
            <div className="min-w-0 flex-1">
              <OrdersOverviewFilters
                value={filters}
                onChange={setFilters}
                onReset={handleResetFilters}
              />
            </div>
            <Button
              asChild
              size="sm"
              variant="primary"
              className="w-full sm:w-auto"
            >
              <Link href="/dashboard/orders/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Order
              </Link>
            </Button>
          </div>
        </div>

        <OrdersOverviewDashboard filters={filters} />
      </PageContainer>
    </>
  );
}
