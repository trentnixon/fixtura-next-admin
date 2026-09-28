import type { ValidationBreakdown, ValidationStatus } from "@/types/fixtureDetail";

export const VALIDATION_BREAKDOWN_LABELS: {
  key: keyof ValidationBreakdown;
  label: string;
}[] = [
  { key: "basicInfo", label: "Basic info" },
  { key: "scheduling", label: "Scheduling" },
  { key: "matchDetails", label: "Match details" },
  { key: "content", label: "Content" },
  { key: "relations", label: "Relations" },
  { key: "results", label: "Results" },
];

export function validationProgressIndicatorClass(value: number): string {
  if (value >= 80) return "bg-emerald-500";
  if (value >= 60) return "bg-sky-500";
  if (value >= 40) return "bg-amber-500";
  if (value >= 20) return "bg-orange-500";
  return "bg-red-500";
}

export function formatValidationStatus(status: ValidationStatus): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function findWeakestBreakdown(
  breakdown: ValidationBreakdown,
): { label: string; value: number } {
  let weakest = VALIDATION_BREAKDOWN_LABELS[0];
  let min = breakdown[weakest.key];

  for (const item of VALIDATION_BREAKDOWN_LABELS) {
    const value = breakdown[item.key];
    if (value < min) {
      min = value;
      weakest = item;
    }
  }

  return { label: weakest.label, value: min };
}

/** Categories scoring below this are surfaced when CMS sends no explicit issues. */
export const VALIDATION_GAP_THRESHOLD = 80;

export const VALIDATION_CATEGORY_HINTS: Record<
  keyof ValidationBreakdown,
  string
> = {
  basicInfo: "Confirm game ID, round, fixture type, and team names in CMS.",
  scheduling: "Check display date, time, venue, and multi-day play fields.",
  matchDetails:
    "Verify toss, PlayHQ scorecard URL, and scraped innings on the Match tab.",
  content:
    "Add game context and AI prompts if this fixture feeds upcoming or result renders.",
  relations: "Ensure grade, association, clubs, and team links are populated.",
  results:
    "Use Data actions → Scrape result, then refresh to pull scores and result text.",
};

export type BreakdownGap = {
  key: keyof ValidationBreakdown;
  label: string;
  value: number;
  hint: string;
};

export function breakdownCategoriesBelow(
  breakdown: ValidationBreakdown,
  threshold = VALIDATION_GAP_THRESHOLD,
): BreakdownGap[] {
  return VALIDATION_BREAKDOWN_LABELS
    .map(({ key, label }) => ({
      key,
      label,
      value: breakdown[key],
      hint: VALIDATION_CATEGORY_HINTS[key],
    }))
    .filter((item) => item.value < threshold)
    .sort((a, b) => a.value - b.value);
}
