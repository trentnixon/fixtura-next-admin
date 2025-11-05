"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import {
  Title,
  SectionTitle,
  SubsectionTitle,
  Label,
  ByLine,
} from "@/components/type/titles";

/**
 * Hierarchy Example Showcase
 *
 * Displays a complete example of typography hierarchy
 */
export default function HierarchyExampleShowcase() {
  return (
    <SectionContainer
      title="Typography Hierarchy Example"
      description="Example of how all title components work together in a document structure"
    >
      <div className="space-y-6 border-l-2 border-slate-200 pl-6">
        <Title>Main Page Title</Title>
        <ByLine>Page subtitle or description</ByLine>

        <div className="mt-8 space-y-6">
          <SectionTitle>Major Section</SectionTitle>
          <p className="text-sm text-muted-foreground">
            Section description text goes here. This provides context for the
            section content.
          </p>

          <div className="ml-4 space-y-4">
            <SubsectionTitle>Subsection</SubsectionTitle>
            <p className="text-sm text-muted-foreground">
              Subsection content and details.
            </p>

            <div className="ml-4 space-y-2">
              <Label>Form Field Label</Label>
              <ByLine>Helper text or metadata</ByLine>
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <SectionTitle>Another Major Section</SectionTitle>
          <p className="text-sm text-muted-foreground">
            Another section with its own content and subsections.
          </p>
        </div>
      </div>
    </SectionContainer>
  );
}
