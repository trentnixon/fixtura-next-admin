"use client";

import SectionWrapper from "@/components/scaffolding/containers/SectionWrapper";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import FeedbackShowcase from "../foundation/_components/FeedbackShowcase";

/**
 * Feedback Category Page
 *
 * Loading, Error, Empty, Alerts, Toasts components
 */
export default function FeedbackPage() {
  return (
    <>
      <CreatePageTitle
        title="Feedback & States"
        byLine="Loading, Error, Empty, Alerts, Toasts"
        byLineBottom="User feedback and state management components"
      />

      <SectionWrapper spacing="lg" title="Feedback Components">
        <FeedbackShowcase />
      </SectionWrapper>
    </>
  );
}

