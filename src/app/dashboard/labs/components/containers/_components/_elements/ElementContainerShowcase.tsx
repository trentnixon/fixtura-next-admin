"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { SubsectionTitle } from "@/components/type/titles";
import ComponentRef from "./ComponentRef";
import { CONTAINER_TOKENS } from "./containerTokens";

/**
 * ElementContainer showcase — individual element wrappers within a section
 */
export default function ElementContainerShowcase() {
  return (
    <SectionContainer
      title="ElementContainer"
      description="Wrap individual examples or components inside a SectionContainer"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Light · Border</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              variant light · border
            </span>
          </div>
          <ElementContainer
            title="With Border"
            subtitle="Border and padding options"
            border
            padding="md"
            variant="light"
          >
            <p className="text-sm text-muted-foreground">
              ElementContainer with border and light variant
            </p>
          </ElementContainer>
          <ComponentRef token={CONTAINER_TOKENS.element.lightBorder} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Dark · Border</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              variant dark · border
            </span>
          </div>
          <ElementContainer
            title="Dark Variant"
            subtitle="Dark background variant"
            border
            padding="md"
            variant="dark"
          >
            <p className="text-sm text-muted-foreground">
              ElementContainer with dark variant
            </p>
          </ElementContainer>
          <ComponentRef token={CONTAINER_TOKENS.element.darkBorder} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Light · No Border</SubsectionTitle>
            <span className="text-xs text-muted-foreground">padding only</span>
          </div>
          <ElementContainer
            title="No Border"
            subtitle="Padding only, no border"
            padding="md"
            variant="light"
          >
            <p className="text-sm text-muted-foreground">
              ElementContainer without border
            </p>
          </ElementContainer>
          <ComponentRef token={CONTAINER_TOKENS.element.lightNoBorder} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Light · Large Padding</SubsectionTitle>
            <span className="text-xs text-muted-foreground">padding lg</span>
          </div>
          <ElementContainer
            title="Different Padding"
            subtitle="Large padding example"
            border
            padding="lg"
            variant="light"
          >
            <p className="text-sm text-muted-foreground">
              ElementContainer with large padding
            </p>
          </ElementContainer>
          <ComponentRef token={CONTAINER_TOKENS.element.lightPaddingLg} />
        </div>
      </div>
    </SectionContainer>
  );
}
