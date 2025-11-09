"use client";

import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";

export default function AssociationData() {
  return (
    <>
      <CreatePageTitle
        title="Association Data"
        byLine="Lookup and insights for associations"
        byLineBottom="Data integration in progress"
      />
      <PageContainer padding="md" spacing="lg">
        <SectionContainer
          title="Coming Soon"
          description="We’re assembling the dedicated association data experience."
        >
          <p className="text-sm text-muted-foreground">
            This page will provide advanced association search, summaries, and
            drilldown metrics. Hang tight while we build it out.
          </p>
        </SectionContainer>
      </PageContainer>
    </>
  );
}
