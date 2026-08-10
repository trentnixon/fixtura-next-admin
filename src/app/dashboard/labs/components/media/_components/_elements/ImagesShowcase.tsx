"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { SubsectionTitle } from "@/components/type/titles";
import { Image as ImageIcon } from "lucide-react";
import ComponentRef from "./ComponentRef";
import { MEDIA_TOKENS } from "./mediaTokens";

/**
 * Images showcase — placeholder for upcoming image components
 */
export default function ImagesShowcase() {
  return (
    <SectionContainer
      title="Images"
      description="Image components with loading states and galleries"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Coming Soon</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              gallery · responsive · lazy load
            </span>
          </div>
          <EmptyState
            title="Image Components"
            description="Image gallery, responsive images, and image loading components will be available here."
            icon={<ImageIcon className="h-12 w-12 text-muted-foreground" />}
            variant="card"
          />
          <ComponentRef token={MEDIA_TOKENS.image.comingSoon} />
        </div>
      </div>
    </SectionContainer>
  );
}
