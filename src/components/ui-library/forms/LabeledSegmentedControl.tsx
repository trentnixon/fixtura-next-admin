"use client";

import { useId } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  segmentedControlLabelClass,
  segmentedControlLabelInverseClass,
  segmentedControlRowClass,
  segmentedControlShellClass,
  segmentedControlShellInverseClass,
  segmentedControlTriggerClass,
  type SegmentedControlVariant,
} from "@/lib/forms/segmentedControlStyles";
import { cn } from "@/lib/utils";

export type SegmentedControlOption = {
  value: string;
  label: string;
};

export interface LabeledSegmentedControlProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: SegmentedControlOption[];
  variant?: SegmentedControlVariant;
  className?: string;
  shellClassName?: string;
  ariaLabel?: string;
}

const shellClassByVariant = {
  default: segmentedControlShellClass,
  inverse: segmentedControlShellInverseClass,
} as const;

const labelClassByVariant = {
  default: segmentedControlLabelClass,
  inverse: segmentedControlLabelInverseClass,
} as const;

/**
 * Inline labeled segmented control for constrained single-choice filters
 * (period, range, preset) — `form.segmented-control.default` /
 * `form.segmented-control.inverse`.
 */
export function LabeledSegmentedControl({
  label,
  value,
  onValueChange,
  options,
  variant = "default",
  className,
  shellClassName,
  ariaLabel,
}: LabeledSegmentedControlProps) {
  const labelId = useId();
  const isInverse = variant === "inverse";

  return (
    <div className={cn(segmentedControlRowClass, className)}>
      <span id={labelId} className={labelClassByVariant[variant]}>
        {label}
      </span>
      <Tabs value={value} onValueChange={onValueChange}>
        <TabsList
          variant={isInverse ? "sectionInverse" : undefined}
          className={cn(shellClassByVariant[variant], shellClassName)}
          aria-labelledby={labelId}
          aria-label={ariaLabel}
        >
          {options.map((option) => (
            <TabsTrigger
              key={option.value}
              value={option.value}
              variant={isInverse ? "sectionInverse" : "section"}
              className={segmentedControlTriggerClass}
            >
              {option.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}

export type { SegmentedControlVariant };
