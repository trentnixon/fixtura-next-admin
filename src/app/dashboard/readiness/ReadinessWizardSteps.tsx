"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type ReadinessWizardStep = {
  label: string;
  summary: string | null;
  icon: LucideIcon;
};

function statusLabel(index: number, current: number, summary: string | null) {
  if (index === current) return "Current";
  if (index < current) return summary ?? "Complete";
  if (index === current + 1) return "Next";
  return "Later";
}

export function ReadinessWizardSteps({
  steps,
  current,
  onStep,
}: {
  steps: ReadinessWizardStep[];
  current: number;
  onStep: (index: number) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isCurrent = index === current;
        const isDone = index < current;
        return (
          <button
            key={step.label}
            type="button"
            disabled={index > current}
            onClick={() => {
              if (index < current) onStep(index);
            }}
            className={cn(
              "flex items-center gap-3 rounded-md border px-3 py-2 text-left disabled:cursor-default disabled:opacity-70",
              isCurrent
                ? "border-brandPrimary-300 bg-brandPrimary-50 text-brandPrimary-800"
                : "border-slate-200 text-slate-700",
              isDone && "hover:border-brandPrimary-200",
            )}
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-semibold shadow-sm">
              {index + 1}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-sm font-semibold">
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{step.label}</span>
              </div>
              <div className="truncate text-xs opacity-75">
                {statusLabel(index, current, step.summary)}
              </div>
            </div>
            {index < steps.length - 1 ? (
              <ChevronRight className="hidden h-4 w-4 shrink-0 text-slate-400 md:block" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
