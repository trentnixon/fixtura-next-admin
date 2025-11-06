"use client";

import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import FormsShowcase from "./_components/FormsShowcase";
import PageContainer from "@/components/scaffolding/containers/PageContainer";

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

      <PageContainer padding="xs" spacing="lg">
        <FormsShowcase />
      </PageContainer>
    </>
  );
}
