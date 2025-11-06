"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import ErrorState from "@/components/ui-library/states/ErrorState";
import CodeExample from "./CodeExample";

/**
 * Error States Showcase
 *
 * Displays error state component examples
 */
export default function ErrorStatesShowcase() {
  return (
    <SectionContainer
      title="Error States"
      description="Display errors with optional retry functionality"
    >
      <div className="space-y-6">
        <ElementContainer title="Default Error">
          <div className="border rounded-md p-4 bg-slate-50 min-h-[200px] flex items-center">
            <ErrorState
              error="Failed to load data"
              onRetry={() => alert("Retry clicked")}
            />
          </div>
          <div className="mt-6">
            <CodeExample
              code={`import ErrorState from "@/components/ui-library/states/ErrorState";

<ErrorState
  error="Failed to load data"
  onRetry={() => refetch()}
/>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Card Error">
          <div className="border rounded-md p-4 bg-slate-50">
            <ErrorState
              variant="card"
              title="Error Loading Data"
              description="Unable to fetch account information. Please check your connection and try again."
              onRetry={() => alert("Retry clicked")}
            />
          </div>
          <div className="mt-6">
            <CodeExample
              code={`<ErrorState
  variant="card"
  title="Error Loading Data"
  description="Unable to fetch account information"
  onRetry={() => refetch()}
/>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Minimal Error">
          <div className="border rounded-md p-4 bg-slate-50">
            <ErrorState variant="minimal" error="Something went wrong" />
          </div>
          <div className="mt-6">
            <CodeExample
              code={`<ErrorState
  variant="minimal"
  error="Something went wrong"
/>`}
            />
          </div>
        </ElementContainer>

        <ElementContainer title="Error with Error Object">
          <div className="border rounded-md p-4 bg-slate-50 min-h-[200px] flex items-center">
            <ErrorState
              error={new Error("Network request failed")}
              onRetry={() => alert("Retry clicked")}
            />
          </div>
          <div className="mt-6">
            <CodeExample
              code={`<ErrorState
  error={error} // Error object from try/catch
  onRetry={() => refetch()}
/>`}
            />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}

