"use client";

import SectionWrapper from "@/components/scaffolding/containers/SectionWrapper";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import OverlaysShowcase from "../foundation/_components/OverlaysShowcase";

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

      <SectionWrapper spacing="lg" title="Overlay Components">
        <OverlaysShowcase />
      </SectionWrapper>
    </>
  );
}

