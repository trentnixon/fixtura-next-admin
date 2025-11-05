"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import Code from "@/components/ui-library/foundation/Code";

/**
 * Usage Guidelines Showcase
 *
 * Displays best practices for using status components
 */
export default function UsageGuidelinesShowcase() {
  return (
    <SectionContainer
      title="Usage Guidelines"
      description="Best practices for using status components"
    >
      <div className="space-y-4 text-sm text-muted-foreground">
        <div>
          <h4 className="font-semibold text-foreground mb-2">StatusBadge</h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              Use for boolean status indicators (active/inactive, on/off)
            </li>
            <li>
              Automatically colors based on status (green for true, red for
              false)
            </li>
            <li>
              Customize labels with <Code>trueLabel</Code> and{" "}
              <Code>falseLabel</Code>
            </li>
            <li>
              Override color with <Code>variant</Code> prop when needed
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-2">Base Badge</h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              Use for labels, tags, categories, or non-boolean status
            </li>
            <li>
              Brand color variants: primary, secondary, accent (fully rounded)
            </li>
            <li>
              Can be customized with className for custom colors
            </li>
            <li>Works well with icons for visual enhancement</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-2">Avatars</h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Use for user profiles and identities</li>
            <li>
              Always provide <Code>AvatarFallback</Code> for when image fails
              to load
            </li>
            <li>Use initials or icon as fallback</li>
            <li>Add status indicators with positioned spans</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-2">
            Status Indicators
          </h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Use dots for simple on/off status</li>
            <li>Use pulsing dots for active/attention states</li>
            <li>Use icons for more descriptive status</li>
            <li>
              Match colors to semantic meanings (green=success, red=error,
              yellow=warning, blue=info)
            </li>
            <li>
              Use brand colors (primary, secondary, accent) for brand-specific
              status
            </li>
          </ul>
        </div>
      </div>
    </SectionContainer>
  );
}

