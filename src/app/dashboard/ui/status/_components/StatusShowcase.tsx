"use client";

import PageContainer from "@/components/scaffolding/containers/PageContainer";
import StatusBadgesShowcase from "./_elements/StatusBadgesShowcase";
import BaseBadgeShowcase from "./_elements/BaseBadgeShowcase";
import AvatarsShowcase from "./_elements/AvatarsShowcase";
import StatusIndicatorsShowcase from "./_elements/StatusIndicatorsShowcase";
import UsageGuidelinesShowcase from "./_elements/UsageGuidelinesShowcase";

/**
 * Status Showcase Component
 *
 * Displays all status and indicator components with examples
 */
export default function StatusShowcase() {
  return (
    <PageContainer padding="none" spacing="lg">
      <StatusBadgesShowcase />
      <BaseBadgeShowcase />
      <AvatarsShowcase />
      <StatusIndicatorsShowcase />
      <UsageGuidelinesShowcase />
    </PageContainer>
  );
}
