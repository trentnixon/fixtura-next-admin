"use client";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { SubsectionTitle } from "@/components/type/titles";
import ComponentRef from "./ComponentRef";
import { LIST_TOKENS } from "./listTokens";
import { sampleProjects } from "./listSampleData";

/**
 * Basic list showcase — unordered, ordered, and byline patterns
 */
export default function BasicListsShowcase() {
  return (
    <SectionContainer
      title="Basic Lists"
      description="Simple unordered, ordered, and byline list patterns"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Unordered & Ordered</SubsectionTitle>
            <span className="text-xs text-muted-foreground">ul · ol</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-semibold mb-2">Unordered List</h4>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>First item</li>
                <li>Second item</li>
                <li>Third item</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-2">Ordered List</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>First step</li>
                <li>Second step</li>
                <li>Third step</li>
              </ol>
            </div>
          </div>
          <ComponentRef token={LIST_TOKENS.basic} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Main Item & Byline</SubsectionTitle>
            <span className="text-xs text-muted-foreground">title + supporting text</span>
          </div>
          <ul className="space-y-3">
            {sampleProjects.map((project) => (
              <li key={project.title} className="flex flex-col gap-1">
                <span className="font-medium text-sm">{project.title}</span>
                <span className="text-xs text-muted-foreground">{project.byline}</span>
              </li>
            ))}
          </ul>
          <ComponentRef token={LIST_TOKENS.byline} />
        </div>
      </div>
    </SectionContainer>
  );
}
