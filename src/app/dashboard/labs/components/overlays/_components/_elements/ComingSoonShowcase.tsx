"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";

/**
 * Coming Soon Showcase
 *
 * Displays upcoming overlay components
 */
export default function ComingSoonShowcase() {
  return (
    <SectionContainer
      title="Coming Soon"
      description="Additional overlay components"
    >
      <div className="space-y-4 text-sm text-muted-foreground">
        <div>
          <h4 className="font-semibold text-foreground mb-2">
            Popover Component
          </h4>
          <p>
            Popover component for floating content (similar to tooltip but
            clickable)
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-2">Context Menu</h4>
          <p>Right-click context menu component for contextual actions</p>
        </div>
      </div>
    </SectionContainer>
  );
}
