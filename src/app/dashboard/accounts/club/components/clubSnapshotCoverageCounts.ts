import { computeTimelineDiscoveryStats } from "@/app/dashboard/club/components/clubTimelineUtils";
import { buildClubTimelineIndex } from "@/lib/utils/orgContactTimelineJoin";
import { countOrgContactInsights } from "@/lib/utils/orgContactListingFilters";
import type { AccountLookupItem } from "@/types/adminAccountLookup";
import type { ClubInsight } from "@/types/clubInsights";
import type { OrgContactListingRow } from "@/types/orgContactListing";

export type ClubDirectoryCoverageCounts = {
  exportReady: number;
  neverScraped: number;
  staleScrape: number;
  noAccount: number;
  startingSoon: number | null;
  marketingPicks: number | null;
};

export function linkedClubIds(accounts: AccountLookupItem[]): Set<number> {
  return new Set(
    accounts.flatMap((account) => account.clubs.map((club) => club.id)),
  );
}

export function countClubDirectoryCoverage(input: {
  contacts: OrgContactListingRow[];
  unsubscribedEmails: string[];
  linkedClubIds: Set<number>;
  clubs: ClubInsight[] | null;
}): ClubDirectoryCoverageCounts {
  const insightCounts = countOrgContactInsights(
    input.contacts,
    input.unsubscribedEmails,
    input.linkedClubIds,
  );

  const timeline =
    input.clubs === null
      ? null
      : computeTimelineDiscoveryStats(
          input.clubs,
          buildClubTimelineIndex(input.clubs).thresholds,
        );

  return {
    exportReady: insightCounts.exportReady,
    neverScraped: insightCounts.neverScraped,
    staleScrape: insightCounts.staleScrape,
    noAccount: insightCounts.noAccount,
    startingSoon: timeline?.startingSoon ?? null,
    marketingPicks: timeline?.marketingPicks ?? null,
  };
}
