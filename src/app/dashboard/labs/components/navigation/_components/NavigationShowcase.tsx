"use client";

import NavigationPatternsShowcase from "./_elements/NavigationPatternsShowcase";
import TabsShowcase from "./_elements/TabsShowcase";
import PaginationShowcase from "./_elements/PaginationShowcase";
import UsageGuidelinesShowcase from "./_elements/UsageGuidelinesShowcase";

/**
 * Navigation showcase - breadcrumbs, tabbers, side nav, tabs, and pagination patterns
 */
export default function NavigationShowcase() {
  return (
    <>
      <NavigationPatternsShowcase />
      <TabsShowcase />
      <PaginationShowcase />
      <UsageGuidelinesShowcase />
    </>
  );
}
