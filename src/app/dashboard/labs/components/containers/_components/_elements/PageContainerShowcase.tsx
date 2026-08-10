"use client";

import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { SubsectionTitle } from "@/components/type/titles";
import ComponentRef from "./ComponentRef";
import { CONTAINER_TOKENS } from "./containerTokens";

/**
 * PageContainer showcase — top-level page wrapper examples
 */
export default function PageContainerShowcase() {
  return (
    <SectionContainer
      title="PageContainer"
      description="Top-level wrapper for page content — padding and vertical spacing only"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Default</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              padding lg · spacing lg
            </span>
          </div>
          <PageContainer
            padding="lg"
            spacing="lg"
            className="border border-dashed border-slate-300 rounded-md"
          >
            <div className="p-4 bg-slate-50 rounded-md">
              PageContainer provides padding and spacing without borders or
              backgrounds
            </div>
            <div className="p-4 bg-slate-50 rounded-md">
              Children are automatically spaced
            </div>
          </PageContainer>
          <ComponentRef token={CONTAINER_TOKENS.page.default} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Compact</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              padding xs · spacing md
            </span>
          </div>
          <PageContainer
            padding="xs"
            spacing="md"
            className="border border-dashed border-slate-300 rounded-md"
          >
            <div className="p-4 bg-slate-50 rounded-md">Tighter page padding</div>
            <div className="p-4 bg-slate-50 rounded-md">Reduced vertical gap</div>
          </PageContainer>
          <ComponentRef token={CONTAINER_TOKENS.page.compact} />
        </div>
      </div>
    </SectionContainer>
  );
}
