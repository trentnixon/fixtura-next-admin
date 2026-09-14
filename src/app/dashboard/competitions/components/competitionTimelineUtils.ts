import type { GanttFeature } from "@/components/ui/shadcn-io/gantt";
import { CompetitionAdminStatsAvailableCompetition } from "@/types/competitionAdminStats";

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

export function getCompetitionEndDate(
  competition: CompetitionAdminStatsAvailableCompetition,
): Date | null {
  if (!competition.startDate) return null;
  const start = new Date(competition.startDate);
  if (Number.isNaN(start.getTime())) return null;
  const duration = Number(competition.durationDays) || 1;
  const end = new Date(start);
  end.setDate(end.getDate() + duration);
  return end;
}

export function hasValidCompetitionTimeline(
  competition: CompetitionAdminStatsAvailableCompetition,
): boolean {
  if (!competition.startDate) return false;
  const start = new Date(competition.startDate);
  const end = getCompetitionEndDate(competition);
  return !Number.isNaN(start.getTime()) && end !== null && !Number.isNaN(end.getTime());
}

export function getCompetitionRawWeight(
  competition: CompetitionAdminStatsAvailableCompetition,
): number {
  return competition.gradeCount;
}

export function computeSportWeightThresholds(
  competitions: CompetitionAdminStatsAvailableCompetition[],
): SportWeightThresholds {
  const weightsBySport: Record<string, number[]> = {};

  competitions.forEach((competition) => {
    if (!hasValidCompetitionTimeline(competition)) return;
    const sport = competition.sport || "Unspecified";
    const weight = getCompetitionRawWeight(competition);
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

export function isCompetitionStartingSoon(
  competition: CompetitionAdminStatsAvailableCompetition,
  withinDays = TIMELINE_STARTING_SOON_DAYS,
): boolean {
  if (!hasValidCompetitionTimeline(competition)) return false;
  const start = startOfDay(new Date(competition.startDate!));
  const end = startOfDay(getCompetitionEndDate(competition)!);
  const today = startOfDay(new Date());
  const horizon = addDays(today, withinDays);

  return start >= today && start <= horizon && end >= today;
}

export function isCompetitionHighValue(
  competition: CompetitionAdminStatsAvailableCompetition,
  thresholds: SportWeightThresholds,
): boolean {
  if (!hasValidCompetitionTimeline(competition)) return false;
  const sport = competition.sport || "Unspecified";
  const rawWeight = getCompetitionRawWeight(competition);
  const sportThreshold = thresholds[sport] || { p75: 0, p50: 0, p25: 0 };
  return rawWeight >= sportThreshold.p75 && sportThreshold.p75 > 0;
}

export function isCompetitionInActiveSeason(
  competition: CompetitionAdminStatsAvailableCompetition,
): boolean {
  if (!hasValidCompetitionTimeline(competition)) return false;
  const end = startOfDay(getCompetitionEndDate(competition)!);
  return end >= startOfDay(new Date());
}

export function matchesCampaignPreset(
  competition: CompetitionAdminStatsAvailableCompetition,
  preset: TimelineCampaignPreset,
  thresholds: SportWeightThresholds,
): boolean {
  if (!hasValidCompetitionTimeline(competition)) return false;

  if (!isCompetitionInActiveSeason(competition)) {
    return false;
  }

  switch (preset) {
    case "all":
      return true;
    case "starting-soon":
      return isCompetitionStartingSoon(competition);
    case "high-value":
      return isCompetitionHighValue(competition, thresholds);
    case "marketing":
      return (
        isCompetitionStartingSoon(competition) ||
        isCompetitionHighValue(competition, thresholds)
      );
    default:
      return true;
  }
}

export function filterCompetitionsForTimelineView(
  competitions: CompetitionAdminStatsAvailableCompetition[],
  options: {
    preset: TimelineCampaignPreset;
    hideFinished: boolean;
    searchQuery: string;
    thresholds: SportWeightThresholds;
  },
): CompetitionAdminStatsAvailableCompetition[] {
  const query = options.searchQuery.trim().toLowerCase();

  return competitions.filter((competition) => {
    if (!hasValidCompetitionTimeline(competition)) return false;

    const endDate = getCompetitionEndDate(competition)!;

    if (options.hideFinished) {
      const cutoffDate = new Date();
      cutoffDate.setMonth(cutoffDate.getMonth() + 1);
      if (endDate < cutoffDate) return false;
    }

    if (
      !matchesCampaignPreset(competition, options.preset, options.thresholds)
    ) {
      return false;
    }

    if (query) {
      const matchesSearch =
        competition.name.toLowerCase().includes(query) ||
        (competition.associationName?.toLowerCase().includes(query) ?? false) ||
        (competition.sport?.toLowerCase().includes(query) ?? false) ||
        (competition.season?.toLowerCase().includes(query) ?? false) ||
        competition.id.toString().includes(query);
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

export function competitionToGanttFeature(
  competition: CompetitionAdminStatsAvailableCompetition,
  thresholds: SportWeightThresholds,
): GanttFeature {
  const start = new Date(competition.startDate!);
  const end = getCompetitionEndDate(competition)!;
  const sport = competition.sport || "Unspecified";
  const rawWeight = getCompetitionRawWeight(competition);
  const normalizedWeight = normalizeWeightForGantt(
    rawWeight,
    sport,
    thresholds,
  );

  return {
    id: `competition-${competition.id}`,
    name: competition.name,
    startAt: start,
    endAt: end,
    group: competition.associationName ?? sport,
    sport: competition.sport ?? undefined,
    weight: normalizedWeight,
    originalWeight: rawWeight,
    competitionId: competition.id,
    season: competition.season ?? undefined,
    gradeCount: competition.gradeCount,
    sizeCategory: competition.sizeCategory,
    cmsWeight: competition.weight,
  } as GanttFeature;
}

export function computeTimelineDiscoveryStats(
  competitions: CompetitionAdminStatsAvailableCompetition[],
  thresholds: SportWeightThresholds,
) {
  const withValid = competitions.filter(hasValidCompetitionTimeline);
  const startingSoon = withValid.filter((c) => isCompetitionStartingSoon(c));
  const highValue = withValid.filter((c) =>
    isCompetitionHighValue(c, thresholds),
  );
  const marketingIds = new Set<number>();
  withValid.forEach((c) => {
    if (
      isCompetitionInActiveSeason(c) &&
      (isCompetitionStartingSoon(c) || isCompetitionHighValue(c, thresholds))
    ) {
      marketingIds.add(c.id);
    }
  });

  return {
    total: competitions.length,
    withValidDates: withValid.length,
    withoutDates: competitions.length - withValid.length,
    startingSoon: startingSoon.length,
    highValue: highValue.length,
    marketingPicks: marketingIds.size,
  };
}

export function getCompetitionsMissingDates(
  competitions: CompetitionAdminStatsAvailableCompetition[],
): CompetitionAdminStatsAvailableCompetition[] {
  return competitions.filter((c) => !hasValidCompetitionTimeline(c));
}

export function downloadTimelineCampaignCsv(features: GanttFeature[]) {
  const header =
    "Competition Name,Competition ID,Association,Sport,Season,Start,End,Grades,Size Band,CMS Weight %,Priority Band,Admin URL";

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
    const adminUrl = `${window.location.origin}/dashboard/competitions/${feature.competitionId}`;
    const sport = (feature.sport as string | undefined) ?? "";
    const association = (feature.group as string | undefined) ?? "";
    const season = (feature.season as string | undefined) ?? "";
    const start = feature.startAt.toISOString().slice(0, 10);
    const end = feature.endAt?.toISOString().slice(0, 10) ?? "";
    const sizeCategory = (feature.sizeCategory as string | undefined) ?? "";
    const cmsWeight = feature.cmsWeight ?? "";

    return [
      `"${String(feature.name).replace(/"/g, '""')}"`,
      feature.competitionId,
      `"${association.replace(/"/g, '""')}"`,
      `"${sport.replace(/"/g, '""')}"`,
      `"${season.replace(/"/g, '""')}"`,
      start,
      end,
      feature.gradeCount ?? "",
      sizeCategory,
      cmsWeight,
      band,
      adminUrl,
    ].join(",");
  });

  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `competition-timeline-campaign-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}
