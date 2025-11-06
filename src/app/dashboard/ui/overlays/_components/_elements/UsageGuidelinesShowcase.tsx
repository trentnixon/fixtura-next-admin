"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";

/**
 * Usage Guidelines Showcase
 *
 * Displays usage guidelines for overlay components
 */
export default function UsageGuidelinesShowcase() {
  return (
    <SectionContainer
      title="Usage Guidelines"
      description="Best practices for using overlay components"
    >
      <div className="space-y-4 text-sm text-muted-foreground">
        <div>
          <h4 className="font-semibold text-foreground mb-2">Dialogs</h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Use for critical actions that require user confirmation</li>
            <li>Keep dialog content concise and focused</li>
            <li>Always provide cancel/close option</li>
            <li>Use for forms that need user attention</li>
            <li>
              Consider accessibility (focus management, keyboard navigation)
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-2">Sheets</h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Use for secondary content or actions</li>
            <li>Right side is default for most use cases</li>
            <li>Left side for navigation or filters</li>
            <li>Top/Bottom for mobile-friendly overlays</li>
            <li>Great for forms, filters, and detail views</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-2">Tooltips</h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Use for helpful contextual information</li>
            <li>Keep tooltip text short and concise</li>
            <li>Position tooltips to avoid screen edges</li>
            <li>Dont hide critical information in tooltips</li>
            <li>
              Consider mobile users (tooltips may not work on touch devices)
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-2">Dropdown Menus</h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Use for contextual actions and options</li>
            <li>Group related items with separators</li>
            <li>Use icons for visual clarity</li>
            <li>Submenus for nested options</li>
            <li>Checkboxes for multi-select options</li>
            <li>Radio items for single-select options</li>
          </ul>
        </div>
      </div>
    </SectionContainer>
  );
}
