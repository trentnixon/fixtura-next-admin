"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { SubsectionTitle } from "@/components/type/titles";
import ComponentRef from "./ComponentRef";
import { LAYOUT_TOKENS } from "./layoutTokens";

/**
 * Flex layout showcase — row, column, and alignment patterns
 */
export default function FlexShowcase() {
  return (
    <SectionContainer
      title="Flex"
      description="Flexbox layouts for rows, columns, and alignment"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Row</SubsectionTitle>
            <span className="text-xs text-muted-foreground">flex-row · gap-4</span>
          </div>
          <div className="flex flex-row gap-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="p-4 bg-slate-100 border rounded-md flex-1"
              >
                Flex Item {item}
              </div>
            ))}
          </div>
          <ComponentRef token={LAYOUT_TOKENS.flex.row} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Column</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              flex-col · gap-4
            </span>
          </div>
          <div className="flex flex-col gap-4 max-w-xs">
            {[1, 2, 3].map((item) => (
              <div key={item} className="p-4 bg-slate-100 border rounded-md">
                Flex Column Item {item}
              </div>
            ))}
          </div>
          <ComponentRef token={LAYOUT_TOKENS.flex.column} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Center</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              items-center · justify-center
            </span>
          </div>
          <div className="flex items-center justify-center h-24 bg-slate-100 border rounded-md">
            Centered Content
          </div>
          <ComponentRef token={LAYOUT_TOKENS.flex.center} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Between</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              items-center · justify-between
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-100 border rounded-md">
            <span>Left Content</span>
            <span>Right Content</span>
          </div>
          <ComponentRef token={LAYOUT_TOKENS.flex.between} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Around</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              items-center · justify-around
            </span>
          </div>
          <div className="flex items-center justify-around p-4 bg-slate-100 border rounded-md">
            <span>Item 1</span>
            <span>Item 2</span>
            <span>Item 3</span>
          </div>
          <ComponentRef token={LAYOUT_TOKENS.flex.around} />
        </div>
      </div>
    </SectionContainer>
  );
}
