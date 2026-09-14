import type { GanttFeature } from "@/components/ui/shadcn-io/gantt";
import { AssociationDetail } from "@/types/associationInsights";

export type TimelineCampaignPreset =
  | "all"
  | "starting-soon"
  | "high-value"
  | "marketing";

export const TIMELINE_STARTING_SOON_DAYS = 60;

export type SportWeightThresholds = Record<
  string,
  { p75: number; p50: number; p25: number }
>;

export function hasValidAssociationTimeline(
  association: AssociationDetail,
): boolean {
  const range = association.competitionDateRange;
  return Boolean(range?.earliestStartDate && range.latestEndDate);
}

export function getAssociationRawWeight(association: AssociationDetail): number {
  return association.competitionCount + association.gradeCount;
}

export function computeSportWeightThresholds(
  associations: AssociationDetail[],
): SportWeightThresholds {
  const weightsBySport: Record<string, number[]> = {};

  associations.forEach((association) => {
    if (!hasValidAssociationTimeline(association)) return;
    const sport = association.sport || "Unspecified";
    const weight = getAssociationRawWeight(association);
    if (!weightsBySport[sport]) weightsBySport[sport] = [];
    weightsBySport[sport].push(weight);
  });

  const thresholds: SportWeightThresholds = {};

  Object.keys(weightsBySport).forEach((sport) => {
    const weights = weightsBySport[sport].sort((a, b) => a - b);
    const len = weights.length;

    if (len === 0) {
      thresholds[sport] = { p75: 0, p50: 0, p25: 0 };
      return;
    }

    const getPercentile = (p: number) => {
      const index = Math.floor(len * p);
      return weights[Math.min(index, len - 1)];
    };

    thresholds[sport] = {
      p75: getPercentile(0.75),
      p50: getPercentile(0.5),
      p25: getPercentile(0.25),
    };
  });

  return thresholds;
}

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function isAssociationStartingSoon(
  association: AssociationDetail,
  withinDays = TIMELINE_STARTING_SOON_DAYS,
): boolean {
  if (!hasValidAssociationTimeline(association)) return false;
  const start = startOfDay(
    new Date(association.competitionDateRange!.earliestStartDate!),
  );
  const end = startOfDay(
    new Date(association.competitionDateRange!.latestEndDate!),
  );
  const today = startOfDay(new Date());
  const horizon = addDays(today, withinDays);

  return start >= today && start <= horizon && end >= today;
}

export function isAssociationHighValue(
  association: AssociationDetail,
  thresholds: SportWeightThresholds,
): boolean {
  if (!hasValidAssociationTimeline(association)) return false;
  const sport = association.sport || "Unspecified";
  const rawWeight = getAssociationRawWeight(association);
  const sportThreshold = thresholds[sport] || { p75: 0, p50: 0, p25: 0 };
  return rawWeight >= sportThreshold.p75 && sportThreshold.p75 > 0;
}

export function isAssociationInActiveSeason(association: AssociationDetail): boolean {
  if (!hasValidAssociationTimeline(association)) return false;
  const end = startOfDay(
    new Date(association.competitionDateRange!.latestEndDate!),
  );
  return end >= startOfDay(new Date());
}

export function matchesCampaignPreset(
  association: AssociationDetail,
  preset: TimelineCampaignPreset,
  thresholds: SportWeightThresholds,
): boolean {
  if (!hasValidAssociationTimeline(association)) return false;

  if (!isAssociationInActiveSeason(association)) {
    return false;
  }

  switch (preset) {
    case "all":
      return true;
    case "starting-soon":
      return isAssociationStartingSoon(association);
    case "high-value":
      return isAssociationHighValue(association, thresholds);
    case "marketing":
      return (
        isAssociationStartingSoon(association) ||
        isAssociationHighValue(association, thresholds)
      );
    default:
      return true;
  }
}

export function filterAssociationsForTimelineView(
  associations: AssociationDetail[],
  options: {
    preset: TimelineCampaignPreset;
    hideFinished: boolean;
    searchQuery: string;
    thresholds: SportWeightThresholds;
  },
): AssociationDetail[] {
  const query = options.searchQuery.trim().toLowerCase();

  return associations.filter((association) => {
    if (!hasValidAssociationTimeline(association)) return false;

    const dateRange = association.competitionDateRange!;
    const endDate = new Date(dateRange.latestEndDate!);

    if (options.hideFinished) {
      const cutoffDate = new Date();
      cutoffDate.setMonth(cutoffDate.getMonth() + 1);
      if (endDate < cutoffDate) return false;
    }

    if (
      !matchesCampaignPreset(association, options.preset, options.thresholds)
    ) {
      return false;
    }

    if (query) {
      const matchesSearch =
        association.name.toLowerCase().includes(query) ||
        association.sport?.toLowerCase().includes(query) ||
        association.id.toString().includes(query);
      if (!matchesSearch) return false;
    }

    return true;
  });
}

export function normalizeWeightForGantt(
  rawWeight: number,
  sport: string,
  thresholds: SportWeightThresholds,
): number {
  const sportThreshold = thresholds[sport] || { p75: 0, p50: 0, p25: 0 };

  if (rawWeight === 0) return 0;
  if (rawWeight >= sportThreshold.p75) return 80;
  if (rawWeight >= sportThreshold.p50) return 60;
  if (rawWeight >= sportThreshold.p25) return 40;
  return 20;
}

export function associationToGanttFeature(
  association: AssociationDetail,
  thresholds: SportWeightThresholds,
): GanttFeature {
  const dateRange = association.competitionDateRange!;
  const start = new Date(dateRange.earliestStartDate!);
  const end = new Date(dateRange.latestEndDate!);
  const sport = association.sport || "Unspecified";
  const rawWeight = getAssociationRawWeight(association);
  const normalizedWeight = normalizeWeightForGantt(rawWeight, sport, thresholds);
  const durationDays = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );

  return {
    id: `association-${association.id}`,
    name: association.name,
    startAt: start,
    endAt: end,
    group: sport,
    weight: normalizedWeight,
    originalWeight: rawWeight,
    associationId: association.id,
    sport: association.sport,
    competitionCount: dateRange.totalCompetitions,
    validDateCount: dateRange.competitionsWithValidDates,
    durationDays,
    gradeCount: association.gradeCount,
    clubCount: association.clubCount,
    href: association.href,
  } as GanttFeature;
}

export function computeTimelineDiscoveryStats(
  associations: AssociationDetail[],
  thresholds: SportWeightThresholds,
) {
  const withValid = associations.filter(hasValidAssociationTimeline);
  const startingSoon = withValid.filter((a) => isAssociationStartingSoon(a));
  const highValue = withValid.filter((a) =>
    isAssociationHighValue(a, thresholds),
  );
  const marketingIds = new Set<number>();
  withValid.forEach((a) => {
    if (
      isAssociationInActiveSeason(a) &&
      (isAssociationStartingSoon(a) || isAssociationHighValue(a, thresholds))
    ) {
      marketingIds.add(a.id);
    }
  });

  return {
    total: associations.length,
    withValidDates: withValid.length,
    withoutDates: associations.length - withValid.length,
    startingSoon: startingSoon.length,
    highValue: highValue.length,
    marketingPicks: marketingIds.size,
  };
}

export function getAssociationsMissingDates(
  associations: AssociationDetail[],
): AssociationDetail[] {
  return associations.filter((a) => !hasValidAssociationTimeline(a));
}

export function downloadTimelineCampaignCsv(features: GanttFeature[]) {
  const header =
    "Association Name,Association ID,Sport,Season Start,Season End,Competitions,Grades,Clubs,Priority Score,Priority Band,Admin URL,PlayHQ URL";

  const rows = features.map((feature) => {
    const weight = Number(feature.weight) || 0;
    const band =
      weight >= 75
        ? "High"
        : weight >= 50
          ? "Med-High"
          : weight >= 25
            ? "Medium"
            : "Low";
    const adminUrl = `${window.location.origin}/dashboard/association/${feature.associationId}`;
    const playHq = (feature.href as string | undefined) ?? "";
    const sport = (feature.sport as string | undefined) ?? "";
    const start = feature.startAt.toISOString().slice(0, 10);
    const end = feature.endAt?.toISOString().slice(0, 10) ?? "";

    return [
      `"${String(feature.name).replace(/"/g, '""')}"`,
      feature.associationId,
      `"${sport.replace(/"/g, '""')}"`,
      start,
      end,
      feature.competitionCount ?? "",
      feature.gradeCount ?? "",
      feature.clubCount ?? "",
      feature.originalWeight ?? "",
      band,
      adminUrl,
      playHq,
    ].join(",");
  });

  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `association-timeline-campaign-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}
