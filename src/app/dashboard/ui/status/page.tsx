"use client";

import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import StatusShowcase from "./_components/StatusShowcase";

/**
 * Status Category Page
 *
 * Badges, Indicators, Avatars, Tags components
 */
export default function StatusPage() {
  return (
    <>
      <CreatePageTitle
        title="Status & Indicators"
        byLine="Badges, Indicators, Avatars, Tags"
        byLineBottom="Status display and indicator components"
      />

      <PageContainer padding="xs" spacing="lg">
        <StatusShowcase />
      </PageContainer>
    </>
  );
}
