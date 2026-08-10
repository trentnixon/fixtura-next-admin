"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Button } from "@/components/ui/button";
import { SubsectionTitle } from "@/components/type/titles";
import { Loader2, CheckCircle } from "lucide-react";
import ComponentRef from "./ComponentRef";
import { ACTION_TOKENS } from "./actionTokens";

/**
 * Button states showcase — disabled, loading, and success patterns
 */
export default function ButtonStatesShowcase() {
  return (
    <SectionContainer
      title="Button States"
      description="Different button states (disabled, loading, etc.)"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Disabled</SubsectionTitle>
            <span className="text-xs text-muted-foreground">disabled prop</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" disabled>
              Disabled Primary
            </Button>
            <Button variant="secondary" disabled>
              Disabled Secondary
            </Button>
            <Button variant="accent" disabled>
              Disabled Accent
            </Button>
          </div>
          <ComponentRef token={ACTION_TOKENS.button.disabled} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Loading</SubsectionTitle>
            <span className="text-xs text-muted-foreground">Loader2 · animate-spin</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" disabled>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </Button>
            <Button variant="secondary" disabled>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing
            </Button>
            <Button variant="accent" size="icon" disabled>
              <Loader2 className="h-4 w-4 animate-spin" />
            </Button>
          </div>
          <ComponentRef token={ACTION_TOKENS.button.loading} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Success</SubsectionTitle>
            <span className="text-xs text-muted-foreground">brandSuccess override</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="primary"
              className="bg-brandSuccess-600 hover:bg-brandSuccess-700 border-brandSuccess-600"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Success
            </Button>
            <Button
              variant="secondary"
              className="border-brandSuccess-600 text-brandSuccess-600 hover:bg-brandSuccess-50"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Saved
            </Button>
          </div>
          <ComponentRef token={ACTION_TOKENS.button.success} />
        </div>
      </div>
    </SectionContainer>
  );
}
