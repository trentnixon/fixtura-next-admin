"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { SubsectionTitle } from "@/components/type/titles";
import Text from "@/components/ui-library/foundation/Text";

/**
 * Text Components Showcase
 *
 * Displays examples of Text component variants and weights
 */
export default function TextComponentsShowcase() {
  return (
    <SectionContainer
      title="Text Components"
      description="Flexible text components with size and weight variants"
    >
      <div className="space-y-6">
        <div>
          <SubsectionTitle>Text Variants</SubsectionTitle>
          <div className="space-y-2 mt-4">
            <Text variant="lead" weight="semibold">
              Lead Text - Large and prominent
            </Text>
            <Text variant="body">Body Text - Standard body text</Text>
            <Text variant="small">Small Text - Secondary information</Text>
            <Text variant="tiny">Tiny Text - Fine print or captions</Text>
            <Text variant="muted">Muted Text - Subtle helper text</Text>
          </div>
        </div>

        <div>
          <SubsectionTitle>Text Weights</SubsectionTitle>
          <div className="space-y-2 mt-4">
            <Text weight="normal">Normal weight text</Text>
            <Text weight="medium">Medium weight text</Text>
            <Text weight="semibold">Semibold weight text</Text>
            <Text weight="bold">Bold weight text</Text>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
