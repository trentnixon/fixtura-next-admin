"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";

/**
 * Button Usage Guidelines Showcase
 *
 * Displays best practices for using buttons
 */
export default function ButtonUsageGuidelinesShowcase() {
  return (
    <SectionContainer
      title="Usage Guidelines"
      description="Best practices for using buttons"
    >
      <div className="space-y-4 text-sm text-muted-foreground">
        <div>
          <h4 className="font-semibold text-foreground mb-2">
            Button Variants
          </h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              <strong>Primary:</strong> Main brand color (slate) for primary actions and main CTAs
            </li>
            <li>
              <strong>Secondary:</strong> Secondary brand color (blue) for supporting actions
            </li>
            <li>
              <strong>Accent:</strong> Accent brand color (orange) for highlights and emphasis
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-2">Button Sizes</h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              <strong>Small:</strong> Compact spaces, dense interfaces
            </li>
            <li>
              <strong>Default:</strong> Standard use cases
            </li>
            <li>
              <strong>Large:</strong> Primary CTAs, hero sections
            </li>
            <li>
              <strong>Icon:</strong> Icon-only buttons, toolbars
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-2">Icons</h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Use icons to provide visual context</li>
            <li>Icon before text for actions (Add, Create, etc.)</li>
            <li>Icon after text for navigation (Next, Continue, etc.)</li>
            <li>Use consistent icon sizes (h-4 w-4 for default size)</li>
            <li>Always add spacing between icon and text (mr-2 or ml-2)</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-2">States</h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Use disabled state for unavailable actions</li>
            <li>Show loading state during async operations</li>
            <li>Use visual feedback for success states</li>
            <li>Always provide clear feedback for user actions</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-2">Accessibility</h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Always provide descriptive button labels</li>
            <li>Use aria-label for icon-only buttons</li>
            <li>Ensure sufficient color contrast</li>
            <li>Support keyboard navigation</li>
            <li>Provide focus indicators</li>
          </ul>
        </div>
      </div>
    </SectionContainer>
  );
}
