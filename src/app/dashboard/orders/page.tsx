"use client";

import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";

export default function Orders() {
  return (
    <>
      <CreatePageTitle
        title="Orders"
        byLine="Financial orders and billing activity"
        byLineBottom="Orders workspace under construction"
      />
      <PageContainer padding="md" spacing="lg">
        <SectionContainer
          title="Coming Soon"
          description="The orders dashboard will land here."
        >
          <p className="text-sm text-muted-foreground">
            We’re preparing tooling to review, search, and reconcile Fixtura
            orders. This placeholder will be replaced with the full experience
            shortly.
          </p>
        </SectionContainer>
      </PageContainer>
    </>
  );
}

