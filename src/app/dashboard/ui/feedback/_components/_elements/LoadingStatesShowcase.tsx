"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import LoadingState from "@/components/ui-library/states/LoadingState";
import { Skeleton } from "@/components/ui/skeleton";
import CodeExample from "./CodeExample";

/**
 * Loading States Showcase
 *
 * Displays loading state component examples
 */
export default function LoadingStatesShowcase() {
  return (
    <SectionContainer
      title="Loading States"
      description="Provide feedback during async operations and data loading"
    >
      <div className="space-y-6">
        <ElementContainer title="Default Loading">
          <div className="border rounded-md p-4 bg-slate-50 min-h-[120px] flex items-center">
            <LoadingState message="Loading accounts..." />
          </div>
          <div className="mt-6">
            <CodeExample
              code={`import LoadingState from "@/components/ui-library/states/LoadingState";

<LoadingState message="Loading accounts..." />`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Minimal Loading">
          <div className="border rounded-md p-4 bg-slate-50 min-h-[60px] flex items-center">
            <LoadingState variant="minimal" />
          </div>
          <div className="mt-6">
            <CodeExample code={`<LoadingState variant="minimal" />`} />
          </div>
        </ElementContainer>

        <ElementContainer title="Skeleton Loading">
          <div className="border rounded-md p-4 bg-slate-50">
            <LoadingState variant="skeleton">
              <Skeleton className="h-20 w-full mb-2" />
              <Skeleton className="h-20 w-full mb-2" />
              <Skeleton className="h-20 w-full" />
            </LoadingState>
          </div>
          <div className="mt-6">
            <CodeExample
              code={`import LoadingState from "@/components/ui-library/states/LoadingState";
import { Skeleton } from "@/components/ui/skeleton";

<LoadingState variant="skeleton">
  <Skeleton className="h-20 w-full mb-2" />
  <Skeleton className="h-20 w-full mb-2" />
  <Skeleton className="h-20 w-full" />
</LoadingState>`}
            />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}

