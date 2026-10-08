import { buildAssociationTimelineIndex } from "@/lib/utils/orgContactTimelineJoin";
import { countOrgContactInsights } from "@/lib/utils/orgContactListingFilters";
import { computeTimelineDiscoveryStats } from "@/app/dashboard/association/components/associationTimelineUtils";
import type { AccountLookupItem } from "@/types/adminAccountLookup";
import type { AssociationDetail } from "@/types/associationInsights";
import type { OrgContactListingRow } from "@/types/orgContactListing";

export {
  countAccountSnapshotOperations as countAssociationAccountOperations,
  countAccountSnapshotSummary as countAssociationAccountSummary,
} from "@/app/dashboard/accounts/components/accountSnapshotCounts";
export type {
  AccountSnapshotOperationCounts as AssociationAccountOperationCounts,
  AccountSnapshotSummaryCounts as AssociationAccountSummaryCounts,
} from "@/app/dashboard/accounts/components/accountSnapshotCounts";

export type AssociationContactCoverageCounts = {
  exportReady: number;
  neverScraped: number;
  staleScrape: number;
  noAccount: number;
  startingSoon: number | null;
  marketingPicks: number | null;
};

export function linkedAssociationIds(
  accounts: AccountLookupItem[],
): Set<number> {
  return new Set(
    accounts.flatMap((account) =>
      account.associations.map((association) => association.id),
    ),
  );
}

export function countAssociationContactCoverage(input: {
  contacts: OrgContactListingRow[];
  unsubscribedEmails: string[];
  linkedAssociationIds: Set<number>;
  associations: AssociationDetail[] | null;
}): AssociationContactCoverageCounts {
  const insightCounts = countOrgContactInsights(
    input.contacts,
    input.unsubscribedEmails,
    input.linkedAssociationIds,
  );

  const timeline =
    input.associations === null
      ? null
      : computeTimelineDiscoveryStats(
          input.associations,
          buildAssociationTimelineIndex(input.associations).thresholds,
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
