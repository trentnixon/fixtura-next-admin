"use client";

import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import UtilitiesShowcase from "./_components/UtilitiesShowcase";

/**
 * Utilities Category Page
 *
 * Copy, Time Formatting, Currency, Search components
 */
export default function UtilitiesPage() {
  return (
    <>
      <CreatePageTitle
        title="Utilities"
        byLine="Copy, Time Formatting, Currency, Search"
        byLineBottom="Utility and helper components"
      />

      <PageContainer padding="xs" spacing="lg">
        <UtilitiesShowcase />
      </PageContainer>
    </>
  );
}
