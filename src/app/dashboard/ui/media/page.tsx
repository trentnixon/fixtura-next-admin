"use client";

import SectionWrapper from "@/components/scaffolding/containers/SectionWrapper";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { Clock } from "lucide-react";

/**
 * Media Category Page
 *
 * Images, Videos, Code Blocks, Markdown components
 */
export default function MediaPage() {
  return (
    <>
      <CreatePageTitle
        title="Media & Content"
        byLine="Images, Videos, Code Blocks, Markdown"
        byLineBottom="Media and content display components"
      />

      <SectionWrapper spacing="lg" title="Coming Soon">
        <SectionContainer
          title="Media Components"
          description="Image galleries, video players, code blocks, and markdown renderers"
        >
          <EmptyState
            title="Media Components"
            description="Media components are being built. Check back soon!"
            icon={<Clock className="h-12 w-12 text-muted-foreground" />}
            variant="card"
          />
        </SectionContainer>
      </SectionWrapper>
    </>
  );
}

