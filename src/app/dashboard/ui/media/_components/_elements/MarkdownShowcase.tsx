"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { FileText } from "lucide-react";
import CodeExample from "./CodeExample";

/**
 * Markdown Showcase
 *
 * Displays Markdown component examples
 */
export default function MarkdownShowcase() {
  return (
    <SectionContainer
      title="Markdown"
      description="Markdown renderer and editor components"
    >
      <div className="space-y-6">
        <ElementContainer title="Coming Soon">
          <EmptyState
            title="Markdown Components"
            description="Markdown renderer and markdown editor components will be available here."
            icon={<FileText className="h-12 w-12 text-muted-foreground" />}
            variant="card"
          />
          <div className="mt-6">
            <CodeExample
              code={`// Markdown components coming soon
// Planned features:
// - MarkdownRenderer component
// - MarkdownEditor component
// - Markdown preview
// - Markdown formatting toolbar`}
            />
          </div>
        </ElementContainer>
      </div>
    </SectionContainer>
  );
}
