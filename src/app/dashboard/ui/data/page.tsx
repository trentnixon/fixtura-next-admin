"use client";

import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import DataDisplayShowcase from "./_components/DataDisplayShowcase";

/**
 * Data Display Category Page
 *
 * Cards, Stat Cards, Metric Grid components
 */
export default function DataPage() {
  return (
    <>
      <CreatePageTitle
        title="Cards"
        byLine="Stat Cards, Metric Grids, Base Cards"
        byLineBottom="Card components for displaying data and metrics"
      />

      <PageContainer padding="xs" spacing="lg">
        <DataDisplayShowcase />
      </PageContainer>
    </>
  );
}
