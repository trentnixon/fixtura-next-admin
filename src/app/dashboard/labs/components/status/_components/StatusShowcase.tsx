"use client";

import StatusBadgesShowcase from "./_elements/StatusBadgesShowcase";
import BaseBadgeShowcase from "./_elements/BaseBadgeShowcase";
import AvatarsShowcase from "./_elements/AvatarsShowcase";
import StatusIndicatorsShowcase from "./_elements/StatusIndicatorsShowcase";
import UsageGuidelinesShowcase from "./_elements/UsageGuidelinesShowcase";

/**
 * Status showcase — badges, indicators, and avatars
 */
export default function StatusShowcase() {
  return (
    <>
      <StatusBadgesShowcase />
      <BaseBadgeShowcase />
      <AvatarsShowcase />
      <StatusIndicatorsShowcase />
      <UsageGuidelinesShowcase />
    </>
  );
}
