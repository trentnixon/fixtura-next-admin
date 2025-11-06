"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { Image as ImageIcon } from "lucide-react";
import CodeExample from "./CodeExample";

/**
 * Images Showcase
 *
 * Displays Image component examples
 */
export default function ImagesShowcase() {
  return (
    <SectionContainer
      title="Images"
      description="Image components with loading states and galleries"
    >
      <div className="space-y-6">
        <ElementContainer title="Coming Soon">
          <EmptyState
            title="Image Components"
            description="Image gallery, responsive images, and image loading components will be available here."
            icon={<ImageIcon className="h-12 w-12 text-muted-foreground" />}
            variant="card"
          />
          <div className="mt-6">
            <CodeExample
              code={`// Image components coming soon
// Planned features:
// - Responsive image component
// - Image gallery
// - Image loading states
// - Image lazy loading`}
            />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}
