import type { GanttFeature } from "@/components/ui/shadcn-io/gantt";
import { ClubInsight } from "@/types/clubInsights";

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

export function hasValidClubTimeline(club: ClubInsight): boolean {
  const range = club.competitionDateRange;
  return Boolean(range?.earliestStartDate && range.latestEndDate);
}

export function getClubRawWeight(club: ClubInsight): number {
  return club.competitionCount + club.teamCount;
}

export function computeSportWeightThresholds(
  clubs: ClubInsight[],
): SportWeightThresholds {
  const weightsBySport: Record<string, number[]> = {};

  clubs.forEach((club) => {
    if (!hasValidClubTimeline(club)) return;
    const sport = club.sport || "Unspecified";
    const weight = getClubRawWeight(club);
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

export function isClubStartingSoon(
  club: ClubInsight,
  withinDays = TIMELINE_STARTING_SOON_DAYS,
): boolean {
  if (!hasValidClubTimeline(club)) return false;
  const start = startOfDay(
    new Date(club.competitionDateRange!.earliestStartDate!),
  );
  const end = startOfDay(new Date(club.competitionDateRange!.latestEndDate!));
  const today = startOfDay(new Date());
  const horizon = addDays(today, withinDays);

  return start >= today && start <= horizon && end >= today;
}

export function isClubHighValue(
  club: ClubInsight,
  thresholds: SportWeightThresholds,
): boolean {
  if (!hasValidClubTimeline(club)) return false;
  const sport = club.sport || "Unspecified";
  const rawWeight = getClubRawWeight(club);
  const sportThreshold = thresholds[sport] || { p75: 0, p50: 0, p25: 0 };
  return rawWeight >= sportThreshold.p75 && sportThreshold.p75 > 0;
}

export function isClubInActiveSeason(club: ClubInsight): boolean {
  if (!hasValidClubTimeline(club)) return false;
  const end = startOfDay(new Date(club.competitionDateRange!.latestEndDate!));
  return end >= startOfDay(new Date());
}

export function matchesCampaignPreset(
  club: ClubInsight,
  preset: TimelineCampaignPreset,
  thresholds: SportWeightThresholds,
): boolean {
  if (!hasValidClubTimeline(club)) return false;

  if (!isClubInActiveSeason(club)) {
    return false;
  }

  switch (preset) {
    case "all":
      return true;
    case "starting-soon":
      return isClubStartingSoon(club);
    case "high-value":
      return isClubHighValue(club, thresholds);
    case "marketing":
      return isClubStartingSoon(club) || isClubHighValue(club, thresholds);
    default:
      return true;
  }
}

export function filterClubsForTimelineView(
  clubs: ClubInsight[],
  options: {
    preset: TimelineCampaignPreset;
    hideFinished: boolean;
    searchQuery: string;
    thresholds: SportWeightThresholds;
  },
): ClubInsight[] {
  const query = options.searchQuery.trim().toLowerCase();

  return clubs.filter((club) => {
    if (!hasValidClubTimeline(club)) return false;

    const dateRange = club.competitionDateRange!;
    const endDate = new Date(dateRange.latestEndDate!);

    if (options.hideFinished) {
      const cutoffDate = new Date();
      cutoffDate.setMonth(cutoffDate.getMonth() + 1);
      if (endDate < cutoffDate) return false;
    }

    if (!matchesCampaignPreset(club, options.preset, options.thresholds)) {
      return false;
    }

    if (query) {
      const matchesSearch =
        club.name.toLowerCase().includes(query) ||
        club.sport?.toLowerCase().includes(query) ||
        club.id.toString().includes(query) ||
        club.associationNames.some((name) =>
          name.toLowerCase().includes(query),
        );
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

export function clubToGanttFeature(
  club: ClubInsight,
  thresholds: SportWeightThresholds,
): GanttFeature {
  const dateRange = club.competitionDateRange!;
  const start = new Date(dateRange.earliestStartDate!);
  const end = new Date(dateRange.latestEndDate!);
  const sport = club.sport || "Unspecified";
  const rawWeight = getClubRawWeight(club);
  const normalizedWeight = normalizeWeightForGantt(rawWeight, sport, thresholds);
  const durationDays = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );

  return {
    id: `club-${club.id}`,
    name: club.name,
    startAt: start,
    endAt: end,
    group: sport,
    weight: normalizedWeight,
    originalWeight: rawWeight,
    clubId: club.id,
    sport: club.sport,
    competitionCount: dateRange.totalCompetitions,
    validDateCount: dateRange.competitionsWithValidDates,
    durationDays,
    teamCount: club.teamCount,
    associationCount: club.associationCount,
    associationNames: club.associationNames,
    hasAccount: club.hasAccount,
  } as GanttFeature;
}

export function computeTimelineDiscoveryStats(
  clubs: ClubInsight[],
  thresholds: SportWeightThresholds,
) {
  const withValid = clubs.filter(hasValidClubTimeline);
  const startingSoon = withValid.filter((c) => isClubStartingSoon(c));
  const highValue = withValid.filter((c) => isClubHighValue(c, thresholds));
  const marketingIds = new Set<number>();
  withValid.forEach((c) => {
    if (
      isClubInActiveSeason(c) &&
      (isClubStartingSoon(c) || isClubHighValue(c, thresholds))
    ) {
      marketingIds.add(c.id);
    }
  });

  return {
    total: clubs.length,
    withValidDates: withValid.length,
    withoutDates: clubs.length - withValid.length,
    startingSoon: startingSoon.length,
    highValue: highValue.length,
    marketingPicks: marketingIds.size,
  };
}

export function getClubsMissingDates(clubs: ClubInsight[]): ClubInsight[] {
  return clubs.filter((c) => !hasValidClubTimeline(c));
}

export function downloadTimelineCampaignCsv(features: GanttFeature[]) {
  const header =
    "Club Name,Club ID,Sport,Season Start,Season End,Competitions,Teams,Associations,Has Account,Priority Score,Priority Band,Admin URL";

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
    const adminUrl = `${window.location.origin}/dashboard/club/${feature.clubId}`;
    const sport = (feature.sport as string | undefined) ?? "";
    const start = feature.startAt.toISOString().slice(0, 10);
    const end = feature.endAt?.toISOString().slice(0, 10) ?? "";

    return [
      `"${String(feature.name).replace(/"/g, '""')}"`,
      feature.clubId,
      `"${sport.replace(/"/g, '""')}"`,
      start,
      end,
      feature.competitionCount ?? "",
      feature.teamCount ?? "",
      feature.associationCount ?? "",
      feature.hasAccount ? "Yes" : "No",
      feature.originalWeight ?? "",
      band,
      adminUrl,
    ].join(",");
  });

  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `club-timeline-campaign-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}
