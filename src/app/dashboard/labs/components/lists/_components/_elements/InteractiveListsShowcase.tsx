"use client";

import { useState } from "react";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { CheckCircle2, Circle, ChevronRight } from "lucide-react";
import { SubsectionTitle } from "@/components/type/titles";
import ComponentRef from "./ComponentRef";
import { LIST_TOKENS } from "./listTokens";
import {
  defaultCheckedTaskIds,
  defaultExpandedFeatureIds,
  sampleFeatures,
  sampleTasks,
} from "./listSampleData";

/**
 * Interactive list showcase — checklist and expandable patterns
 */
export default function InteractiveListsShowcase() {
  const [checkedItems, setCheckedItems] = useState<string[]>(defaultCheckedTaskIds);
  const [expandedItems, setExpandedItems] = useState<string[]>(defaultExpandedFeatureIds);

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <SectionContainer
      title="Interactive Lists"
      description="Checklists and expandable sections with client state"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Checklist</SubsectionTitle>
            <span className="text-xs text-muted-foreground">toggle · strikethrough</span>
          </div>
          <ul className="space-y-2">
            {sampleTasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => toggleCheck(task.id)}
              >
                {checkedItems.includes(task.id) ? (
                  <CheckCircle2 className="h-5 w-5 text-brandPrimary-600 flex-shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
                <span
                  className={`flex-1 text-sm ${
                    checkedItems.includes(task.id)
                      ? "text-muted-foreground line-through"
                      : ""
                  }`}
                >
                  {task.label}
                </span>
              </li>
            ))}
          </ul>
          <ComponentRef token={LIST_TOKENS.checklist} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Expandable</SubsectionTitle>
            <span className="text-xs text-muted-foreground">accordion · nested ul</span>
          </div>
          <ul className="space-y-2">
            {sampleFeatures.map((feature) => (
              <li
                key={feature.id}
                className="border border-slate-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleExpand(feature.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="text-left">
                    <div className="font-medium text-sm">{feature.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {feature.description}
                    </div>
                  </div>
                  <ChevronRight
                    className={`h-4 w-4 text-muted-foreground transition-transform ${
                      expandedItems.includes(feature.id) ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {expandedItems.includes(feature.id) ? (
                  <div className="px-4 pb-4 border-t border-slate-200">
                    <ul className="mt-3 space-y-2">
                      {feature.items.map((item) => (
                        <li
                          key={item}
                          className="text-sm text-muted-foreground flex items-center gap-2"
                        >
                          <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
          <ComponentRef token={LIST_TOKENS.expandable} />
        </div>
      </div>
    </SectionContainer>
  );
}
