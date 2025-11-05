"use client";

import PageContainer from "@/components/scaffolding/containers/PageContainer";
import TabsShowcase from "./_elements/TabsShowcase";
import PaginationShowcase from "./_elements/PaginationShowcase";
import UsageGuidelinesShowcase from "./_elements/UsageGuidelinesShowcase";

/**
 * Navigation Showcase Component
 *
 * Displays all navigation components with examples
 */
export default function NavigationShowcase() {
  return (
    <PageContainer padding="none" spacing="lg">
      <TabsShowcase />
      <PaginationShowcase />
      <UsageGuidelinesShowcase />
    </PageContainer>
  );
}
