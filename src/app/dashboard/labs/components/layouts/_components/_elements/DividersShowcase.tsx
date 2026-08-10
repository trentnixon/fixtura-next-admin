"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { SubsectionTitle } from "@/components/type/titles";
import ComponentRef from "./ComponentRef";
import { LAYOUT_TOKENS } from "./layoutTokens";

/**
 * Divider layout showcase — horizontal, labeled, and vertical dividers
 */
export default function DividersShowcase() {
  return (
    <SectionContainer
      title="Dividers"
      description="Horizontal, labeled, and vertical separator patterns"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Horizontal</SubsectionTitle>
            <span className="text-xs text-muted-foreground">hr element</span>
          </div>
          <div className="space-y-4">
            <div>Content above</div>
            <hr className="border-slate-200" />
            <div>Content below</div>
          </div>
          <ComponentRef token={LAYOUT_TOKENS.divider.horizontal} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>With Text</SubsectionTitle>
            <span className="text-xs text-muted-foreground">centered label</span>
          </div>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <ComponentRef token={LAYOUT_TOKENS.divider.withText} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Vertical</SubsectionTitle>
            <span className="text-xs text-muted-foreground">w-px divider</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1 p-4 bg-slate-100 border rounded-md">
              Left Content
            </div>
            <div className="h-12 w-px bg-slate-200" />
            <div className="flex-1 p-4 bg-slate-100 border rounded-md">
              Right Content
            </div>
          </div>
          <ComponentRef token={LAYOUT_TOKENS.divider.vertical} />
        </div>
      </div>
    </SectionContainer>
  );
}
