"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Button } from "@/components/ui/button";
import { SubsectionTitle } from "@/components/type/titles";
import { Plus } from "lucide-react";
import ComponentRef from "./ComponentRef";
import { ACTION_TOKENS } from "./actionTokens";

/**
 * Button sizes showcase — all sizes and per-variant size grids
 */
export default function ButtonSizesShowcase() {
  return (
    <SectionContainer
      title="Button Sizes"
      description="Different button sizes for various contexts"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>All Sizes</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              sm · default · lg · icon
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="primary" size="sm">
              Small
            </Button>
            <Button variant="primary" size="default">
              Default
            </Button>
            <Button variant="primary" size="lg">
              Large
            </Button>
            <Button variant="primary" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <ComponentRef token={ACTION_TOKENS.button.sizes} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>By Variant</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              primary · secondary · accent × sizes
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="primary" size="sm">
                Small Primary
              </Button>
              <Button variant="primary" size="default">
                Default Primary
              </Button>
              <Button variant="primary" size="lg">
                Large Primary
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="secondary" size="sm">
                Small Secondary
              </Button>
              <Button variant="secondary" size="default">
                Default Secondary
              </Button>
              <Button variant="secondary" size="lg">
                Large Secondary
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="accent" size="sm">
                Small Accent
              </Button>
              <Button variant="accent" size="default">
                Default Accent
              </Button>
              <Button variant="accent" size="lg">
                Large Accent
              </Button>
            </div>
          </div>
          <ComponentRef token={ACTION_TOKENS.button.sizesByVariant} />
        </div>
      </div>
    </SectionContainer>
  );
}
