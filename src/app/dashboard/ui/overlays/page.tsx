"use client";

import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import OverlaysShowcase from "./_components/OverlaysShowcase";
import PageContainer from "@/components/scaffolding/containers/PageContainer";

/**
 * Overlays Category Page
 *
 * Dialogs, Sheets, Popovers, Tooltips components
 */
export default function OverlaysPage() {
  return (
    <>
      <CreatePageTitle
        title="Overlays & Modals"
        byLine="Dialogs, Sheets, Popovers, Tooltips"
        byLineBottom="Overlay and modal components"
      />

      <PageContainer padding="xs" spacing="lg">
        <OverlaysShowcase />
      </PageContainer>
    </>
  );
}
