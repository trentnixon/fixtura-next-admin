"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { Video } from "lucide-react";
import CodeExample from "./CodeExample";

/**
 * Videos Showcase
 *
 * Displays Video component examples
 */
export default function VideosShowcase() {
  return (
    <SectionContainer
      title="Videos"
      description="Video player components and video display"
    >
      <div className="space-y-6">
        <ElementContainer title="Coming Soon">
          <EmptyState
            title="Video Components"
            description="Video player, video thumbnail, and video controls components will be available here."
            icon={<Video className="h-12 w-12 text-muted-foreground" />}
            variant="card"
          />
          <div className="mt-6">
            <CodeExample
              code={`// Video components coming soon
// Planned features:
// - VideoPlayer component
// - VideoThumbnail component
// - VideoControls component
// - Video gallery`}
            />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}
