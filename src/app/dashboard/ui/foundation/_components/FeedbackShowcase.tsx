"use client";

import { useState } from "react";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { SubsectionTitle } from "@/components/type/titles";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import Code from "@/components/ui-library/foundation/Code";
import { Copy, Check, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Code Example Component
 */
function CodeExample({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <Code variant="block" className="text-xs">
        {code}
      </Code>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="absolute top-2 right-2 h-7 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? (
          <>
            <Check className="h-3 w-3 mr-1" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-3 w-3 mr-1" />
            Copy
          </>
        )}
      </Button>
    </div>
  );
}

/**
 * Feedback Showcase Component
 *
 * Displays all feedback and state components with examples
 */
export default function FeedbackShowcase() {
  return (
    <>
      {/* Loading States */}
      <SectionContainer
        title="Loading States"
        description="Provide feedback during async operations and data loading"
      >
        <div className="space-y-8">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>Default Loading</SubsectionTitle>
              </div>
              <div className="border rounded-md p-4 bg-slate-50 min-h-[120px] flex items-center">
                <LoadingState message="Loading accounts..." />
              </div>
              <CodeExample
                code={`import LoadingState from "@/components/ui-library/states/LoadingState";

<LoadingState message="Loading accounts..." />`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>Minimal Loading</SubsectionTitle>
              </div>
              <div className="border rounded-md p-4 bg-slate-50 min-h-[60px] flex items-center">
                <LoadingState variant="minimal" />
              </div>
              <CodeExample code={`<LoadingState variant="minimal" />`} />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>Skeleton Loading</SubsectionTitle>
              </div>
              <div className="border rounded-md p-4 bg-slate-50">
                <LoadingState variant="skeleton">
                  <Skeleton className="h-20 w-full mb-2" />
                  <Skeleton className="h-20 w-full mb-2" />
                  <Skeleton className="h-20 w-full" />
                </LoadingState>
              </div>
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
          </div>
        </div>
      </SectionContainer>

      {/* Error States */}
      <SectionContainer
        title="Error States"
        description="Display errors with optional retry functionality"
      >
        <div className="space-y-8">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>Default Error</SubsectionTitle>
              </div>
              <div className="border rounded-md p-4 bg-slate-50 min-h-[200px] flex items-center">
                <ErrorState
                  error="Failed to load data"
                  onRetry={() => alert("Retry clicked")}
                />
              </div>
              <CodeExample
                code={`import ErrorState from "@/components/ui-library/states/ErrorState";

<ErrorState
  error="Failed to load data"
  onRetry={() => refetch()}
/>`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>Card Error</SubsectionTitle>
              </div>
              <div className="border rounded-md p-4 bg-slate-50">
                <ErrorState
                  variant="card"
                  title="Error Loading Data"
                  description="Unable to fetch account information. Please check your connection and try again."
                  onRetry={() => alert("Retry clicked")}
                />
              </div>
              <CodeExample
                code={`<ErrorState
  variant="card"
  title="Error Loading Data"
  description="Unable to fetch account information"
  onRetry={() => refetch()}
/>`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>Minimal Error</SubsectionTitle>
              </div>
              <div className="border rounded-md p-4 bg-slate-50">
                <ErrorState variant="minimal" error="Something went wrong" />
              </div>
              <CodeExample
                code={`<ErrorState
  variant="minimal"
  error="Something went wrong"
/>`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>Error with Error Object</SubsectionTitle>
              </div>
              <div className="border rounded-md p-4 bg-slate-50 min-h-[200px] flex items-center">
                <ErrorState
                  error={new Error("Network request failed")}
                  onRetry={() => alert("Retry clicked")}
                />
              </div>
              <CodeExample
                code={`<ErrorState
  error={error} // Error object from try/catch
  onRetry={() => refetch()}
/>`}
              />
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* Empty States */}
      <SectionContainer
        title="Empty States"
        description="Show when no data is available with optional actions"
      >
        <div className="space-y-8">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>Default Empty State</SubsectionTitle>
              </div>
              <div className="border rounded-md p-4 bg-slate-50 min-h-[250px] flex items-center">
                <EmptyState
                  title="No accounts found"
                  description="Start by creating your first account to get started"
                  actionLabel="Create Account"
                  onAction={() => alert("Create clicked")}
                />
              </div>
              <CodeExample
                code={`import EmptyState from "@/components/ui-library/states/EmptyState";

<EmptyState
  title="No accounts found"
  description="Start by creating your first account"
  actionLabel="Create Account"
  onAction={handleCreate}
/>`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>Card Empty State</SubsectionTitle>
              </div>
              <div className="border rounded-md p-4 bg-slate-50">
                <EmptyState
                  variant="card"
                  title="No collections yet"
                  description="Collections will appear here once created"
                  actionLabel="Create Collection"
                  onAction={() => alert("Create clicked")}
                />
              </div>
              <CodeExample
                code={`<EmptyState
  variant="card"
  title="No collections yet"
  description="Collections will appear here once created"
  actionLabel="Create Collection"
  onAction={handleCreate}
/>`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>Minimal Empty State</SubsectionTitle>
              </div>
              <div className="border rounded-md p-4 bg-slate-50">
                <EmptyState variant="minimal" description="No data available" />
              </div>
              <CodeExample
                code={`<EmptyState
  variant="minimal"
  description="No data available"
/>`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>Custom Icon Empty State</SubsectionTitle>
              </div>
              <div className="border rounded-md p-4 bg-slate-50 min-h-[250px] flex items-center">
                <EmptyState
                  title="No search results"
                  description="Try adjusting your search criteria"
                  icon={<Inbox className="h-12 w-12 text-muted-foreground" />}
                  actionLabel="Clear Filters"
                  onAction={() => alert("Clear clicked")}
                />
              </div>
              <CodeExample
                code={`import { Inbox } from "lucide-react";

<EmptyState
  title="No search results"
  description="Try adjusting your search criteria"
  icon={<Inbox className="h-12 w-12 text-muted-foreground" />}
  actionLabel="Clear Filters"
  onAction={handleClearFilters}
/>`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <SubsectionTitle>Custom Action Empty State</SubsectionTitle>
              </div>
              <div className="border rounded-md p-4 bg-slate-50 min-h-[250px] flex items-center">
                <EmptyState
                  title="No notifications"
                  description="You're all caught up!"
                  action={
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Settings
                      </Button>
                      <Button size="sm">Learn More</Button>
                    </div>
                  }
                />
              </div>
              <CodeExample
                code={`<EmptyState
  title="No notifications"
  description="You're all caught up!"
  action={
    <div className="flex gap-2">
      <Button variant="outline">Settings</Button>
      <Button>Learn More</Button>
    </div>
  }
/>`}
              />
            </div>
          </div>
        </div>
      </SectionContainer>

      {/* Usage Guidelines */}
      <SectionContainer
        title="Usage Guidelines"
        description="Best practices for using feedback components"
      >
        <div className="space-y-4 text-sm text-muted-foreground">
          <div>
            <h4 className="font-semibold text-foreground mb-2">
              Loading States
            </h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                Use <Code>variant=&quot;default&quot;</Code> for full-page or
                section loading
              </li>
              <li>
                Use <Code>variant=&quot;minimal&quot;</Code> for inline loading
                indicators
              </li>
              <li>
                Use <Code>variant=&quot;skeleton&quot;</Code> for content
                placeholders
              </li>
              <li>Always provide a descriptive message when possible</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-2">Error States</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                Use <Code>variant=&quot;default&quot;</Code> for full-page
                errors
              </li>
              <li>
                Use <Code>variant=&quot;card&quot;</Code> for section-level
                errors
              </li>
              <li>
                Use <Code>variant=&quot;minimal&quot;</Code> for inline error
                messages
              </li>
              <li>
                Always provide a retry option when the error is recoverable
              </li>
              <li>
                Use descriptive error messages that help users understand the
                issue
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-2">Empty States</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                Use <Code>variant=&quot;default&quot;</Code> for full-page empty
                states
              </li>
              <li>
                Use <Code>variant=&quot;card&quot;</Code> for section-level
                empty states
              </li>
              <li>
                Use <Code>variant=&quot;minimal&quot;</Code> for compact empty
                states
              </li>
              <li>Always provide a clear call-to-action when applicable</li>
              <li>
                Use custom icons to match the context (search, filters, etc.)
              </li>
            </ul>
          </div>
        </div>
      </SectionContainer>
    </>
  );
}
