"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Button } from "@/components/ui/button";
import { SubsectionTitle } from "@/components/type/titles";
import ComponentRef from "./ComponentRef";
import { ACTION_TOKENS } from "./actionTokens";

/**
 * Button variants showcase — brand colors and use-case examples
 */
export default function ButtonVariantsShowcase() {
  return (
    <SectionContainer
      title="Button Variants"
      description="Different button styles for various use cases"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Brand Colors</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              primary · secondary · accent
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="accent">Accent</Button>
          </div>
          <ComponentRef token={ACTION_TOKENS.button.brand} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>All Variants</SubsectionTitle>
            <span className="text-xs text-muted-foreground">complete variant set</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="accent">Accent</Button>
          </div>
          <ComponentRef token={ACTION_TOKENS.button.all} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Use Cases</SubsectionTitle>
            <span className="text-xs text-muted-foreground">CTA · supporting · highlight</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary">Primary Action</Button>
            <Button variant="secondary">Secondary Action</Button>
            <Button variant="accent">Highlight Action</Button>
          </div>
          <ComponentRef token={ACTION_TOKENS.button.useCases} />
        </div>
      </div>
    </SectionContainer>
  );
}
