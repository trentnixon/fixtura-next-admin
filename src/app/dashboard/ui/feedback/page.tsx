"use client";

import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import FeedbackShowcase from "./_components/FeedbackShowcase";
import PageContainer from "@/components/scaffolding/containers/PageContainer";

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

      <PageContainer padding="xs" spacing="lg">
        <FeedbackShowcase />
      </PageContainer>
    </>
  );
}
