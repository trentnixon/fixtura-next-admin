"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Title, SectionTitle, SubsectionTitle } from "@/components/type/titles";

/**
 * Customization Examples Showcase
 *
 * Displays examples of customizing titles with className prop
 */
export default function CustomizationExamplesShowcase() {
  return (
    <SectionContainer
      title="Customization Examples"
      description="Examples of customizing titles with className prop"
    >
      <div className="space-y-6">
        <div>
          <SubsectionTitle>Color Variations</SubsectionTitle>
          <div className="space-y-3 mt-4">
            <Title className="text-primary">Colored Title</Title>
            <Title className="text-success-600">Success Title</Title>
            <Title className="text-error-600">Error Title</Title>
            <Title className="text-info-600">Info Title</Title>
          </div>
        </div>

        <div>
          <SubsectionTitle>Size Overrides</SubsectionTitle>
          <div className="space-y-3 mt-4">
            <Title className="text-4xl">Extra Large Title</Title>
            <Title className="text-2xl">Smaller Title</Title>
            <Title className="text-xl">Even Smaller Title</Title>
          </div>
        </div>

        <div>
          <SubsectionTitle>Weight Variations</SubsectionTitle>
          <div className="space-y-3 mt-4">
            <Title className="font-normal">Normal Weight Title</Title>
            <Title className="font-medium">Medium Weight Title</Title>
            <Title className="font-bold">Bold Title (default)</Title>
            <Title className="font-black">Black Weight Title</Title>
          </div>
        </div>

        <div>
          <SubsectionTitle>With Icons</SubsectionTitle>
          <div className="space-y-3 mt-4">
            <Title className="flex items-center gap-2">
              <span>📊</span>
              Dashboard Title
            </Title>
            <SectionTitle className="flex items-center gap-2">
              <span>⚙️</span>
              Settings Section
            </SectionTitle>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}

