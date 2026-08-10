"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { SubsectionTitle } from "@/components/type/titles";
import Text from "@/components/ui-library/foundation/Text";
import ComponentRef from "./ComponentRef";
import { TYPE_TOKENS } from "./typeTokens";

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
      <div className="space-y-8">
        <div>
          <SubsectionTitle>Text Variants</SubsectionTitle>
          <div className="mt-4 space-y-6">
            <div>
              <Text variant="lead" weight="semibold">
                Lead Text - Large and prominent
              </Text>
              <ComponentRef token={TYPE_TOKENS.text.lead} />
            </div>
            <div>
              <Text variant="body">Body Text - Standard body text</Text>
              <ComponentRef token={TYPE_TOKENS.text.body} />
            </div>
            <div>
              <Text variant="small">Small Text - Secondary information</Text>
              <ComponentRef token={TYPE_TOKENS.text.small} />
            </div>
            <div>
              <Text variant="tiny">Tiny Text - Fine print or captions</Text>
              <ComponentRef token={TYPE_TOKENS.text.tiny} />
            </div>
            <div>
              <Text variant="muted">Muted Text - Subtle helper text</Text>
              <ComponentRef token={TYPE_TOKENS.text.muted} />
            </div>
          </div>
        </div>

        <div>
          <SubsectionTitle>Text Weights</SubsectionTitle>
          <div className="mt-4 space-y-6">
            <div>
              <Text weight="normal">Normal weight text</Text>
              <ComponentRef token={TYPE_TOKENS.text.bodyNormal} />
            </div>
            <div>
              <Text weight="medium">Medium weight text</Text>
              <ComponentRef token={TYPE_TOKENS.text.bodyMedium} />
            </div>
            <div>
              <Text weight="semibold">Semibold weight text</Text>
              <ComponentRef token={TYPE_TOKENS.text.bodySemibold} />
            </div>
            <div>
              <Text weight="bold">Bold weight text</Text>
              <ComponentRef token={TYPE_TOKENS.text.bodyBold} />
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}
