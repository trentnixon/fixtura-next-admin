"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Button } from "@/components/ui/button";
import { SubsectionTitle } from "@/components/type/titles";
import { Plus, Download } from "lucide-react";
import ComponentRef from "./ComponentRef";
import { ACTION_TOKENS } from "./actionTokens";

/**
 * Full-width button showcase — plain and with icons
 */
export default function ButtonFullWidthShowcase() {
  return (
    <SectionContainer
      title="Full Width Buttons"
      description="Buttons that span full width of container"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Full Width</SubsectionTitle>
            <span className="text-xs text-muted-foreground">className="w-full"</span>
          </div>
          <div className="space-y-2 max-w-md">
            <Button variant="primary" className="w-full">
              Full Width Primary
            </Button>
            <Button variant="secondary" className="w-full">
              Full Width Secondary
            </Button>
            <Button variant="accent" className="w-full">
              Full Width Accent
            </Button>
          </div>
          <ComponentRef token={ACTION_TOKENS.button.fullWidth} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Full Width with Icons</SubsectionTitle>
            <span className="text-xs text-muted-foreground">w-full · icon + label</span>
          </div>
          <div className="space-y-2 max-w-md">
            <Button variant="primary" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add New Item
            </Button>
            <Button variant="secondary" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download All
            </Button>
            <Button variant="accent" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Create Account
            </Button>
          </div>
          <ComponentRef token={ACTION_TOKENS.button.fullWidthIcons} />
        </div>
      </div>
    </SectionContainer>
  );
}
