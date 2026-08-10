"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import Code from "@/components/ui-library/foundation/Code";
import { TYPE_TOKENS } from "./typeTokens";

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
              Use <Code>{TYPE_TOKENS.title.page}</Code> for the main page
              heading (one per page)
            </li>
            <li>
              Use <Code>{TYPE_TOKENS.title.subtitle}</Code> for secondary
              page-level headings
            </li>
            <li>
              Use <Code>{TYPE_TOKENS.title.section}</Code> for major sections
              within a page
            </li>
            <li>
              Use <Code>{TYPE_TOKENS.title.subsection}</Code> for nested
              sections
            </li>
            <li>
              Use <Code>{TYPE_TOKENS.title.label}</Code> for form labels and
              small headings
            </li>
            <li>
              Use <Code>{TYPE_TOKENS.title.byline}</Code> for metadata,
              captions, or helper text
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-2">HTML Semantics</h4>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>
              <Code>{TYPE_TOKENS.title.page}</Code> renders as{" "}
              <Code>&lt;h1&gt;</Code>
            </li>
            <li>
              <Code>{TYPE_TOKENS.title.subtitle}</Code> renders as{" "}
              <Code>&lt;h2&gt;</Code>
            </li>
            <li>
              <Code>{TYPE_TOKENS.title.section}</Code> renders as{" "}
              <Code>&lt;h3&gt;</Code>
            </li>
            <li>
              <Code>{TYPE_TOKENS.title.subsection}</Code> renders as{" "}
              <Code>&lt;h4&gt;</Code>
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
