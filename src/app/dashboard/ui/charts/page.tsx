"use client";

import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import ChartsShowcase from "./_components/ChartsShowcase";
import PageContainer from "@/components/scaffolding/containers/PageContainer";

/**
 * Charts Category Page
 *
 * Chart components, containers, and layouts
 */
export default function ChartsPage() {
  return (
    <>
      <CreatePageTitle
        title="Charts & Data Visualization"
        byLine="Chart containers, layouts, and visualization components"
        byLineBottom="Chart components for displaying data"
      />

      <PageContainer padding="xs" spacing="lg">
        <ChartsShowcase />
      </PageContainer>
    </>
  );
}
