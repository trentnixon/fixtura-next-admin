"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";

/**
 * Usage Guidelines Showcase
 *
 * Displays usage guidelines for utility components
 */
export default function UsageGuidelinesShowcase() {
  return (
    <SectionContainer
      title="Usage Guidelines"
      description="Best practices for using utility components"
    >
      <div className="space-y-4 text-sm text-muted-foreground">
        <div>
          <h4 className="font-semibold text-foreground mb-2">
            Copy to Clipboard
          </h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Always provide visual feedback when copying succeeds</li>
            <li>Use clear icons (Copy/Check) to indicate state</li>
            <li>Reset feedback state after 2-3 seconds</li>
            <li>
              Consider accessibility - announce copy success to screen readers
            </li>
            <li>For sensitive data, consider masking before display</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-2">
            Time Formatting
          </h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              Use relative time for recent events (e.g., &quot;2 hours
              ago&quot;)
            </li>
            <li>Switch to absolute dates for older content</li>
            <li>Consider user&apos;s locale and timezone</li>
            <li>Update relative time dynamically for real-time interfaces</li>
            <li>Use consistent date formats across the application</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-2">
            Currency Formatting
          </h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Use Intl.NumberFormat for proper locale support</li>
            <li>Display currency symbol according to user&apos;s locale</li>
            <li>Handle currency conversion if needed</li>
            <li>Consider rounding for large amounts</li>
            <li>Always display currency code for clarity</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-2">
            Number Formatting
          </h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Use compact notation for large numbers (1.2M, 3.5K)</li>
            <li>Format percentages with appropriate decimal places</li>
            <li>Use binary units (1024) for file sizes</li>
            <li>Consider locale-specific number formatting</li>
            <li>Maintain consistency across similar number types</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-2">
            Search Components
          </h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Provide clear search input with icon</li>
            <li>Show clear button when search has value</li>
            <li>Debounce search input for performance</li>
            <li>Display search results dropdown or inline</li>
            <li>Handle empty states gracefully</li>
            <li>
              Support keyboard navigation (Enter to search, Escape to clear)
            </li>
          </ul>
        </div>
      </div>
    </SectionContainer>
  );
}
