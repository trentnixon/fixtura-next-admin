"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import LoadingState from "@/components/ui-library/states/LoadingState";
import { Skeleton } from "@/components/ui/skeleton";
import { SubsectionTitle } from "@/components/type/titles";
import ComponentRef from "./ComponentRef";
import { FEEDBACK_TOKENS } from "./feedbackTokens";

/**
 * Loading state showcase — default, minimal, and skeleton variants
 */
export default function LoadingStatesShowcase() {
  return (
    <SectionContainer
      title="Loading States"
      description="Provide feedback during async operations and data loading"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Default</SubsectionTitle>
            <span className="text-xs text-muted-foreground">with message</span>
          </div>
          <div className="border rounded-md p-4 bg-slate-50 min-h-[120px] flex items-center">
            <LoadingState message="Loading accounts..." />
          </div>
          <ComponentRef token={FEEDBACK_TOKENS.loading.default} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Minimal</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              variant minimal
            </span>
          </div>
          <div className="border rounded-md p-4 bg-slate-50 min-h-[60px] flex items-center">
            <LoadingState variant="minimal" />
          </div>
          <ComponentRef token={FEEDBACK_TOKENS.loading.minimal} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Skeleton</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              variant skeleton
            </span>
          </div>
          <div className="border rounded-md p-4 bg-slate-50">
            <LoadingState variant="skeleton">
              <Skeleton className="h-20 w-full mb-2" />
              <Skeleton className="h-20 w-full mb-2" />
              <Skeleton className="h-20 w-full" />
            </LoadingState>
          </div>
          <ComponentRef token={FEEDBACK_TOKENS.loading.skeleton} />
        </div>
      </div>
    </SectionContainer>
  );
}
