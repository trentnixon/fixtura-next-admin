"use client";

import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import TablesShowcase from "./_components/TablesShowcase";

/**
 * Tables Category Page
 *
 * Table components for displaying structured data
 */
export default function TablesPage() {
  return (
    <>
      <CreatePageTitle
        title="Tables"
        byLine="Data tables for structured information"
        byLineBottom="Components for displaying tabular data"
      />

      <PageContainer padding="xs" spacing="lg">
        <TablesShowcase />
      </PageContainer>
    </>
  );
}
