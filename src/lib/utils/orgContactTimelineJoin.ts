import type { ClubInsight } from "@/types/clubInsights";
import type { AssociationDetail } from "@/types/associationInsights";
import {
  computeSportWeightThresholds as computeClubSportThresholds,
  getClubRawWeight,
  matchesCampaignPreset as matchesClubCampaignPreset,
  normalizeWeightForGantt as normalizeClubWeightForGantt,
  type SportWeightThresholds,
} from "@/app/dashboard/club/components/clubTimelineUtils";
import {
  computeSportWeightThresholds as computeAssociationSportThresholds,
  getAssociationRawWeight,
  matchesCampaignPreset as matchesAssociationCampaignPreset,
  normalizeWeightForGantt as normalizeAssociationWeightForGantt,
} from "@/app/dashboard/association/components/associationTimelineUtils";
import type { OrgContactTimelineFilter } from "@/lib/constants/timelineCampaignPresets";

export type TimelinePriorityBand = "High" | "Med-High" | "Medium" | "Low" | "—";

export function priorityBandFromNormalizedWeight(
  weight: number,
): TimelinePriorityBand {
  if (weight >= 75) return "High";
  if (weight >= 50) return "Med-High";
  if (weight >= 25) return "Medium";
  if (weight > 0) return "Low";
  return "—";
}

export function buildClubTimelineIndex(clubs: ClubInsight[]) {
  return {
    byId: new Map(clubs.map((club) => [club.id, club])),
    thresholds: computeClubSportThresholds(clubs),
  };
}

export function buildAssociationTimelineIndex(
  associations: AssociationDetail[],
) {
  return {
    byId: new Map(associations.map((a) => [a.id, a])),
    thresholds: computeAssociationSportThresholds(associations),
  };
}

export function clubContactMatchesTimelineFilter(
  orgId: number,
  filter: OrgContactTimelineFilter,
  index: {
    byId: Map<number, ClubInsight>;
    thresholds: SportWeightThresholds;
  },
): boolean {
  if (filter === "none") return true;
  const club = index.byId.get(orgId);
  if (!club) return false;
  return matchesClubCampaignPreset(club, filter, index.thresholds);
}

export function associationContactMatchesTimelineFilter(
  orgId: number,
  filter: OrgContactTimelineFilter,
  index: {
    byId: Map<number, AssociationDetail>;
    thresholds: SportWeightThresholds;
  },
): boolean {
  if (filter === "none") return true;
  const association = index.byId.get(orgId);
  if (!association) return false;
  return matchesAssociationCampaignPreset(
    association,
    filter,
    index.thresholds,
  );
}

export function getClubTimelineDisplay(
  club: ClubInsight | undefined,
  thresholds: SportWeightThresholds,
) {
  if (!club?.competitionDateRange?.earliestStartDate) {
    return {
      seasonStart: "—",
      sizeMetric: "—",
      sizeLabel: "Teams",
      priorityBand: "—" as TimelinePriorityBand,
    };
  }
  const sport = club.sport || "Unspecified";
  const weight = normalizeClubWeightForGantt(
    getClubRawWeight(club),
    sport,
    thresholds,
  );
  return {
    seasonStart: club.competitionDateRange.earliestStartDate.slice(0, 10),
    sizeMetric: String(club.teamCount),
    sizeLabel: "Teams",
    priorityBand: priorityBandFromNormalizedWeight(weight),
  };
}

export function getAssociationTimelineDisplay(
  association: AssociationDetail | undefined,
  thresholds: SportWeightThresholds,
) {
  if (!association?.competitionDateRange?.earliestStartDate) {
    return {
      seasonStart: "—",
      sizeMetric: "—",
      sizeLabel: "Grades",
      priorityBand: "—" as TimelinePriorityBand,
    };
  }
  const sport = association.sport || "Unspecified";
  const weight = normalizeAssociationWeightForGantt(
    getAssociationRawWeight(association),
    sport,
    thresholds,
  );
  return {
    seasonStart: association.competitionDateRange.earliestStartDate.slice(0, 10),
    sizeMetric: String(association.gradeCount),
    sizeLabel: "Grades",
    priorityBand: priorityBandFromNormalizedWeight(weight),
  };
}
