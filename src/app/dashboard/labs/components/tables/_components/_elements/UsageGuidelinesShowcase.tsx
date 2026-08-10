"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";

/**
 * Usage guidelines for table components
 */
export default function UsageGuidelinesShowcase() {
  return (
    <SectionContainer
      title="Usage Guidelines"
      description="Best practices for using table components"
    >
      <div className="space-y-4 text-sm text-muted-foreground">
        <div>
          <h4 className="font-semibold text-foreground mb-2">Tables</h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Use for structured, tabular data</li>
            <li>Always include TableHeader for accessibility</li>
            <li>Use TableFooter for totals and summaries</li>
            <li>Use TableCaption for table descriptions</li>
            <li>Consider pagination for large datasets</li>
            <li>Provide search and filtering for complex data</li>
          </ul>
        </div>
      </div>
    </SectionContainer>
  );
}
