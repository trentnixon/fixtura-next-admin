"use client";

import SectionWrapper from "@/components/scaffolding/containers/SectionWrapper";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import FormsShowcase from "../foundation/_components/FormsShowcase";

/**
 * Forms Category Page
 *
 * Inputs, Selects, Checkboxes, Date Pickers components
 */
export default function FormsPage() {
  return (
    <>
      <CreatePageTitle
        title="Forms & Inputs"
        byLine="Inputs, Selects, Checkboxes, Date Pickers"
        byLineBottom="Form components and input controls"
      />

      <SectionWrapper spacing="lg" title="Form Components">
        <FormsShowcase />
      </SectionWrapper>
    </>
  );
}
