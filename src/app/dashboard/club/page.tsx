"use client";

import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";

export default function ClubData() {
  return (
    <>
      <CreatePageTitle
        title="Club Data"
        byLine="Lookup and insights for clubs"
        byLineBottom="Data integration in progress"
      />
      <PageContainer padding="md" spacing="lg">
        <SectionContainer
          title="Coming Soon"
          description="A dedicated club data exploration experience is on the way."
        >
          <p className="text-sm text-muted-foreground">
            We’re preparing the tooling to surface club-level metrics, search,
            and drilldowns. Check back shortly for updates.
          </p>
        </SectionContainer>
      </PageContainer>
    </>
  );
}
