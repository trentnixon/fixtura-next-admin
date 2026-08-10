"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { SubsectionTitle } from "@/components/type/titles";
import { FileText } from "lucide-react";
import ComponentRef from "./ComponentRef";
import { MEDIA_TOKENS } from "./mediaTokens";

/**
 * Markdown showcase — placeholder for upcoming markdown components
 */
export default function MarkdownShowcase() {
  return (
    <SectionContainer
      title="Markdown"
      description="Markdown renderer and editor components"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Coming Soon</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              renderer · editor · preview
            </span>
          </div>
          <EmptyState
            title="Markdown Components"
            description="Markdown renderer and markdown editor components will be available here."
            icon={<FileText className="h-12 w-12 text-muted-foreground" />}
            variant="card"
          />
          <ComponentRef token={MEDIA_TOKENS.markdown.comingSoon} />
        </div>
      </div>
    </SectionContainer>
  );
}
