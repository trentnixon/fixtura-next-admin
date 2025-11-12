"use client";

import { useState } from "react";

import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
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
        byLine="Financial orders and billing activity"
        byLineBottom="Track order performance, payments, and revenue trends"
      />
      <PageContainer padding="md" spacing="lg">
        <div className="flex justify-end">
          <div className="w-full max-w-xl">
            <OrdersOverviewFilters
              value={filters}
              onChange={setFilters}
              onReset={handleResetFilters}
            />
          </div>
        </div>
        <SectionContainer
          title="Admin orders overview"
          description="Filter by date or status to monitor order activity, payment states, and revenue."
        >
          <OrdersOverviewDashboard filters={filters} />
        </SectionContainer>
      </PageContainer>
    </>
  );
}
