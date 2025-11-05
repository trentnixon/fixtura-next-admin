"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import Code from "@/components/ui-library/foundation/Code";

/**
 * Usage Guidelines Showcase
 *
 * Displays best practices for using title components
 */
export default function UsageGuidelinesShowcase() {
  return (
    <SectionContainer
      title="Usage Guidelines"
      description="Best practices for using title components"
    >
      <div className="space-y-4 text-sm text-muted-foreground">
        <div>
          <h4 className="font-semibold text-foreground mb-2">
            Semantic Hierarchy
          </h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              Use <Code>Title</Code> or <Code>PageTitle</Code> for the main page
              heading (one per page)
            </li>
            <li>
              Use <Code>Subtitle</Code> for secondary page-level headings
            </li>
            <li>
              Use <Code>SectionTitle</Code> for major sections within a page
            </li>
            <li>
              Use <Code>SubsectionTitle</Code> for nested sections
            </li>
            <li>
              Use <Code>Label</Code> for form labels and small headings
            </li>
            <li>
              Use <Code>ByLine</Code> for metadata, captions, or helper text
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-2">HTML Semantics</h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              <Code>Title</Code> renders as <Code>&lt;h1&gt;</Code>
            </li>
            <li>
              <Code>Subtitle</Code> renders as <Code>&lt;h2&gt;</Code>
            </li>
            <li>
              <Code>SectionTitle</Code> renders as <Code>&lt;h3&gt;</Code>
            </li>
            <li>
              <Code>SubsectionTitle</Code> renders as <Code>&lt;h4&gt;</Code>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-2">Customization</h4>
          <p>
            All title components accept a <Code>className</Code> prop for custom
            styling. You can override colors, sizes, weights, and add additional
            utility classes as needed.
          </p>
        </div>
      </div>
    </SectionContainer>
  );
}
