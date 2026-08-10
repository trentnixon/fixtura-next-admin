"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";

/**
 * Usage Guidelines Showcase
 *
 * Displays best practices for using navigation components
 */
export default function UsageGuidelinesShowcase() {
  return (
    <SectionContainer
      title="Usage Guidelines"
      description="Best practices for using navigation components"
    >
      <div className="space-y-4 text-sm text-muted-foreground">
        <div>
          <h4 className="font-semibold text-foreground mb-2">Tabs</h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Use for organizing related content within a page</li>
            <li>Keep tab labels short and descriptive</li>
            <li>Limit to 5-7 tabs maximum for usability</li>
            <li>Use icons to enhance visual clarity</li>
            <li>Always provide default active tab</li>
            <li>Consider mobile experience (scrollable tabs if needed)</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-2">Pagination</h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Use for large datasets that need to be split across pages</li>
            <li>Show current page clearly</li>
            <li>Provide Previous/Next buttons</li>
            <li>Display page numbers when there are few pages</li>
            <li>Use ellipsis for many pages</li>
            <li>Show total results count when helpful</li>
            <li>Disable navigation buttons at boundaries</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-2">Accessibility</h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Use semantic HTML elements (nav, ol, etc.)</li>
            <li>Provide ARIA labels where needed</li>
            <li>Support keyboard navigation</li>
            <li>Ensure focus indicators are visible</li>
            <li>Use aria-current for active items</li>
            <li>Test with screen readers</li>
          </ul>
        </div>
      </div>
    </SectionContainer>
  );
}
