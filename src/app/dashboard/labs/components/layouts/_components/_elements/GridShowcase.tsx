"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { SubsectionTitle } from "@/components/type/titles";
import ComponentRef from "./ComponentRef";
import { LAYOUT_TOKENS } from "./layoutTokens";

/**
 * Grid layout showcase — responsive and nested grid patterns
 */
export default function GridShowcase() {
  return (
    <SectionContainer
      title="Grid"
      description="Responsive CSS Grid layouts with Tailwind utilities"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Responsive Grid</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              1 · 2 · 3 columns
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="p-4 bg-slate-100 border rounded-md text-center"
              >
                Grid Item {item}
              </div>
            ))}
          </div>
          <ComponentRef token={LAYOUT_TOKENS.grid.responsive} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Auto-fit Grid</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              minmax(200px, 1fr)
            </span>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="p-4 bg-slate-100 border rounded-md text-center"
              >
                Auto-fit Item {item}
              </div>
            ))}
          </div>
          <ComponentRef token={LAYOUT_TOKENS.grid.autoFit} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Nested Grid</SubsectionTitle>
            <span className="text-xs text-muted-foreground">grid within grid</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-100 border rounded-md">
              Parent Grid Item 1
            </div>
            <div className="p-4 bg-slate-100 border rounded-md">
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="p-2 bg-white border rounded text-xs">
                  Nested 1
                </div>
                <div className="p-2 bg-white border rounded text-xs">
                  Nested 2
                </div>
              </div>
            </div>
          </div>
          <ComponentRef token={LAYOUT_TOKENS.grid.nested} />
        </div>
      </div>
    </SectionContainer>
  );
}
