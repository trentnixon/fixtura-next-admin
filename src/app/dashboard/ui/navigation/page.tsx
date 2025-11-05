"use client";

import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import NavigationShowcase from "./_components/NavigationShowcase";
import PageContainer from "@/components/scaffolding/containers/PageContainer";

/**
 * Navigation Category Page
 *
 * Breadcrumbs, Tabs, Sidebar, Pagination components
 */
export default function NavigationPage() {
  return (
    <>
      <CreatePageTitle
        title="Navigation"
        byLine="Breadcrumbs, Tabs, Sidebar, Pagination"
        byLineBottom="Navigation and routing components"
      />

      <PageContainer padding="xs" spacing="lg">
        <NavigationShowcase />
      </PageContainer>
    </>
  );
}
