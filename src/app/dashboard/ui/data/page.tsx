"use client";

import SectionWrapper from "@/components/scaffolding/containers/SectionWrapper";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import DataDisplayShowcase from "../foundation/_components/DataDisplayShowcase";

/**
 * Data Display Category Page
 *
 * Tables, Lists, Cards, Charts, Timelines components
 */
export default function DataPage() {
  return (
    <>
      <CreatePageTitle
        title="Data Display"
        byLine="Tables, Lists, Cards, Charts, Timelines"
        byLineBottom="Components for displaying data and information"
      />

      <SectionWrapper spacing="lg" title="Data Display Components">
        <DataDisplayShowcase />
      </SectionWrapper>
    </>
  );
}
