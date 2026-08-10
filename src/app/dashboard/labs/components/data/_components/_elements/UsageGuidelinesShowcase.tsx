"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";

/**
 * Usage Guidelines Showcase
 *
 * Displays usage guidelines for card components
 */
export default function UsageGuidelinesShowcase() {
  return (
    <SectionContainer
      title="Usage Guidelines"
      description="Best practices for using card components"
    >
      <div className="space-y-4 text-sm text-muted-foreground">
        <div>
          <h4 className="font-semibold text-foreground mb-2">StatCard</h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Use for displaying key metrics and statistics</li>
            <li>Include trend indicators when showing time-based data</li>
            <li>Use icons to provide visual context</li>
            <li>Provide descriptions for clarity</li>
            <li>
              Choose appropriate variant (primary, secondary, accent, light,
              dark)
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-2">MetricGrid</h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Use for grouping related metric cards</li>
            <li>
              Responsive: automatically adjusts columns based on screen size
            </li>
            <li>
              Choose appropriate gap size (sm, md, lg) based on content density
            </li>
            <li>Limit to 4 columns maximum for readability</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-2">Cards</h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Use for grouping related content</li>
            <li>CardHeader for titles and descriptions</li>
            <li>CardContent for main content</li>
            <li>CardFooter for actions and additional info</li>
            <li>Can be made interactive with hover effects</li>
          </ul>
        </div>
      </div>
    </SectionContainer>
  );
}
