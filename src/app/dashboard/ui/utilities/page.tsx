"use client";

import SectionWrapper from "@/components/scaffolding/containers/SectionWrapper";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { Clock } from "lucide-react";

/**
 * Utilities Category Page
 *
 * Copy, Time Formatting, Currency, Search components
 */
export default function UtilitiesPage() {
  return (
    <>
      <CreatePageTitle
        title="Utilities"
        byLine="Copy, Time Formatting, Currency, Search"
        byLineBottom="Utility and helper components"
      />

      <SectionWrapper spacing="lg" title="Coming Soon">
        <SectionContainer
          title="Utility Components"
          description="Copy to clipboard, time formatting, currency, number formatting, and search components"
        >
          <EmptyState
            title="Utility Components"
            description="Utility components are being built. Check back soon!"
            icon={<Clock className="h-12 w-12 text-muted-foreground" />}
            variant="card"
          />
        </SectionContainer>
      </SectionWrapper>
    </>
  );
}

