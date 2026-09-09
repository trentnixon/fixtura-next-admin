"use client";

import { useState } from "react";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { LabeledSegmentedControl } from "@/components/ui-library/forms/LabeledSegmentedControl";
import { SubsectionTitle } from "@/components/type/titles";
import ComponentRef from "./ComponentRef";
import { FORM_TOKENS } from "./formTokens";

const PERIOD_OPTIONS = [
  { value: "1", label: "1 month" },
  { value: "3", label: "3 months" },
  { value: "6", label: "6 months" },
];

/**
 * Segmented control showcase — default labeled option picker for filters and presets
 */
export default function SegmentedControlShowcase() {
  const [period, setPeriod] = useState("3");
  const [periodInverse, setPeriodInverse] = useState("3");

  return (
    <SectionContainer
      title="Segmented Control"
      description="Inline labeled option picker for period, range, and preset filters"
    >
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Default</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              white shell · active: sidebar bg + white text
            </span>
          </div>
          <LabeledSegmentedControl
            label="Period"
            value={period}
            onValueChange={setPeriod}
            options={PERIOD_OPTIONS}
          />
          <ComponentRef token={FORM_TOKENS.segmentedControl.default} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <SubsectionTitle>Inverse</SubsectionTitle>
            <span className="text-xs text-muted-foreground">
              sidebar shell · active: white pill + sidebar text
            </span>
          </div>
          <LabeledSegmentedControl
            label="Period"
            variant="inverse"
            value={periodInverse}
            onValueChange={setPeriodInverse}
            options={PERIOD_OPTIONS}
          />
          <ComponentRef token={FORM_TOKENS.segmentedControl.inverse} />
        </div>
      </div>
    </SectionContainer>
  );
}
