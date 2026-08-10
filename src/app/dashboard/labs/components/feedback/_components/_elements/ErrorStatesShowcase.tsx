"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { SubsectionTitle } from "@/components/type/titles";
import ComponentRef from "./ComponentRef";
import { FEEDBACK_TOKENS } from "./feedbackTokens";

/**
 * Error state showcase — default, card, minimal, and error object patterns
 */
export default function ErrorStatesShowcase() {
  return (
    <SectionContainer
      title="Error States"
      description="Display errors with optional retry functionality"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Default</SubsectionTitle>
            <span className="text-xs text-muted-foreground">with retry</span>
          </div>
          <div className="border rounded-md p-4 bg-slate-50 min-h-[200px] flex items-center">
            <ErrorState
              error="Failed to load data"
              onRetry={() => alert("Retry clicked")}
            />
          </div>
          <ComponentRef token={FEEDBACK_TOKENS.error.default} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Card</SubsectionTitle>
            <span className="text-xs text-muted-foreground">variant card</span>
          </div>
          <div className="border rounded-md p-4 bg-slate-50">
            <ErrorState
              variant="card"
              title="Error Loading Data"
              description="Unable to fetch account information. Please check your connection and try again."
              onRetry={() => alert("Retry clicked")}
            />
          </div>
          <ComponentRef token={FEEDBACK_TOKENS.error.card} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Minimal</SubsectionTitle>
            <span className="text-xs text-muted-foreground">variant minimal</span>
          </div>
          <div className="border rounded-md p-4 bg-slate-50">
            <ErrorState variant="minimal" error="Something went wrong" />
          </div>
          <ComponentRef token={FEEDBACK_TOKENS.error.minimal} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>With Error Object</SubsectionTitle>
            <span className="text-xs text-muted-foreground">Error instance</span>
          </div>
          <div className="border rounded-md p-4 bg-slate-50 min-h-[200px] flex items-center">
            <ErrorState
              error={new Error("Network request failed")}
              onRetry={() => alert("Retry clicked")}
            />
          </div>
          <ComponentRef token={FEEDBACK_TOKENS.error.withObject} />
        </div>
      </div>
    </SectionContainer>
  );
}
