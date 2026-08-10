"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { SubsectionTitle } from "@/components/type/titles";
import { Video } from "lucide-react";
import ComponentRef from "./ComponentRef";
import { MEDIA_TOKENS } from "./mediaTokens";

/**
 * Videos showcase — placeholder for upcoming video components
 */
export default function VideosShowcase() {
  return (
    <SectionContainer
      title="Videos"
      description="Video player components and video display"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Coming Soon</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              player · thumbnail · controls
            </span>
          </div>
          <EmptyState
            title="Video Components"
            description="Video player, video thumbnail, and video controls components will be available here."
            icon={<Video className="h-12 w-12 text-muted-foreground" />}
            variant="card"
          />
          <ComponentRef token={MEDIA_TOKENS.video.comingSoon} />
        </div>
      </div>
    </SectionContainer>
  );
}
