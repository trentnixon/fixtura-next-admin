"use client";

import BasicTablesShowcase from "./_elements/BasicTablesShowcase";
import PaginatedTableShowcase from "./_elements/PaginatedTableShowcase";
import AdvancedTableShowcase from "./_elements/AdvancedTableShowcase";
import UsageGuidelinesShowcase from "./_elements/UsageGuidelinesShowcase";

/**
 * Tables showcase — basic, paginated, and advanced table patterns
 */
export default function TablesShowcase() {
  return (
    <>
      <BasicTablesShowcase />
      <PaginatedTableShowcase />
      <AdvancedTableShowcase />
      <UsageGuidelinesShowcase />
    </>
  );
}
