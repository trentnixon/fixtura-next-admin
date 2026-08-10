"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";

/**
 * Usage guidelines for list components
 */
export default function UsageGuidelinesShowcase() {
  return (
    <SectionContainer
      title="Usage Guidelines"
      description="Best practices for using list components"
    >
      <div className="space-y-4 text-sm text-muted-foreground">
        <div>
          <h4 className="font-semibold text-foreground mb-2">List Patterns</h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Use basic lists for simple, non-interactive content</li>
            <li>Add icons and avatars for visual context and recognition</li>
            <li>Use checklists for task management and completion tracking</li>
            <li>Timeline lists work well for activity feeds and history</li>
            <li>Action lists provide quick access to common operations</li>
            <li>Expandable lists help organize hierarchical information</li>
            <li>Notification lists should clearly indicate read/unread states</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-2">Accessibility</h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Use semantic HTML (ul, ol, li, dl, dt, dd)</li>
            <li>Add keyboard navigation for interactive lists</li>
            <li>Include ARIA labels for screen readers</li>
            <li>Ensure sufficient color contrast for text and icons</li>
            <li>Provide focus indicators for clickable items</li>
          </ul>
        </div>
      </div>
    </SectionContainer>
  );
}
