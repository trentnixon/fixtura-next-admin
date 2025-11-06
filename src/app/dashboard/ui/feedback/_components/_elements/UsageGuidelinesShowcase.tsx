"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import Code from "@/components/ui-library/foundation/Code";

/**
 * Usage Guidelines Showcase
 *
 * Displays best practices for using feedback components
 */
export default function UsageGuidelinesShowcase() {
  return (
    <SectionContainer
      title="Usage Guidelines"
      description="Best practices for using feedback components"
    >
      <div className="space-y-4 text-sm text-muted-foreground">
        <div>
          <h4 className="font-semibold text-foreground mb-2">Loading States</h4>
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
              Use <Code>variant=&quot;default&quot;</Code> for full-page errors
            </li>
            <li>
              Use <Code>variant=&quot;card&quot;</Code> for section-level errors
            </li>
            <li>
              Use <Code>variant=&quot;minimal&quot;</Code> for inline error
              messages
            </li>
            <li>Always provide a retry option when the error is recoverable</li>
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
              Use <Code>variant=&quot;card&quot;</Code> for section-level empty
              states
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

        <div>
          <h4 className="font-semibold text-foreground mb-2">
            Toast Notifications
          </h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              Use <Code>toast.success()</Code> for successful operations
            </li>
            <li>
              Use <Code>toast.error()</Code> for error messages
            </li>
            <li>
              Use <Code>toast.info()</Code> for informational messages
            </li>
            <li>
              Use <Code>toast.warning()</Code> for warnings
            </li>
            <li>
              Use <Code>toast.promise()</Code> for async operations with loading
              states
            </li>
            <li>Always provide descriptive messages</li>
            <li>Add descriptions for context when helpful</li>
            <li>Use action buttons for important toasts</li>
            <li>Set custom duration for time-sensitive messages</li>
          </ul>
        </div>
      </div>
    </SectionContainer>
  );
}
