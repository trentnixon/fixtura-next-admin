"use client";

import PageTitlesShowcase from "./_elements/PageTitlesShowcase";
import SecondaryHeadingsShowcase from "./_elements/SecondaryHeadingsShowcase";
import SectionHeadingsShowcase from "./_elements/SectionHeadingsShowcase";
import SubsectionHeadingsShowcase from "./_elements/SubsectionHeadingsShowcase";
import SupportingTextShowcase from "./_elements/SupportingTextShowcase";
import HierarchyExampleShowcase from "./_elements/HierarchyExampleShowcase";
import CustomizationExamplesShowcase from "./_elements/CustomizationExamplesShowcase";
import UsageGuidelinesShowcase from "./_elements/UsageGuidelinesShowcase";

/**
 * Title Showcase Component
 *
 * Displays all title and heading components with examples
 */
export default function TitlesShowcase() {
  return (
    <>
      <PageTitlesShowcase />
      <SecondaryHeadingsShowcase />
      <SectionHeadingsShowcase />
      <SubsectionHeadingsShowcase />
      <SupportingTextShowcase />
      <HierarchyExampleShowcase />
      <CustomizationExamplesShowcase />
      <UsageGuidelinesShowcase />
    </>
  );
}
