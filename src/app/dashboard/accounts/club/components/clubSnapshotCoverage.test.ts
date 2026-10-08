import { addDays, subDays } from "date-fns";
import type { AccountLookupItem } from "@/types/adminAccountLookup";
import type { ClubInsight } from "@/types/clubInsights";
import type { OrgContactListingRow } from "@/types/orgContactListing";
import {
  countClubDirectoryCoverage,
  linkedClubIds,
} from "./clubSnapshotCoverage";

function account(
  overrides: Partial<AccountLookupItem> & Pick<AccountLookupItem, "id">,
): AccountLookupItem {
  return {
    FirstName: null,
    DeliveryAddress: null,
    Sport: "Cricket",
    isActive: true,
    isSetup: true,
    hasCompletedStartSequence: true,
    hasActiveOrder: true,
    daysLeftOnSubscription: 40,
    account_type: "Club",
    clubs: [],
    associations: [],
    logo: null,
    email: null,
    accountHealthStatus: "completed",
    accountHealthLastStartedAt: null,
    accountHealthLastCompletedAt: null,
    accountHealthFailureReason: null,
    isSchedulerRendering: false,
    renderProcessingSince: null,
    lastRenderCompletedAt: null,
    ...overrides,
  };
}

function contact(
  overrides: Partial<OrgContactListingRow> & Pick<OrgContactListingRow, "id">,
): OrgContactListingRow {
  return {
    name: "Club",
    phone: null,
    email: "ready@example.com",
    address: null,
    website: null,
    logo: null,
    contacts: [],
    lastOrgContactScrapeAt: new Date().toISOString(),
    ...overrides,
  };
}

function club(
  overrides: Partial<ClubInsight> & Pick<ClubInsight, "id">,
): ClubInsight {
  return {
    name: "Club",
    sport: "Cricket",
    logoUrl: "",
    associationNames: [],
    associationCount: 1,
    teamCount: 2,
    competitionCount: 1,
    hasAccount: true,
    competitionDateRange: null,
    ...overrides,
  };
}

describe("linkedClubIds", () => {
  it("collects club ids from every account", () => {
    const ids = linkedClubIds([
      account({
        id: 1,
        clubs: [
          { id: 10, name: "A" },
          { id: 11, name: "B" },
        ],
      }),
      account({ id: 2, clubs: [{ id: 11, name: "B" }] }),
    ]);

    expect([...ids].sort((left, right) => left - right)).toEqual([10, 11]);
  });
});

describe("countClubDirectoryCoverage", () => {
  it("counts export reach, unlinked clubs, and seasons starting soon", () => {
    const start = addDays(new Date(), 10).toISOString();
    const end = addDays(new Date(), 120).toISOString();
    const counts = countClubDirectoryCoverage({
      contacts: [
        contact({ id: 10, email: "ready@example.com" }),
        contact({ id: 11, email: null, lastOrgContactScrapeAt: null }),
        contact({
          id: 12,
          email: "stale@example.com",
          lastOrgContactScrapeAt: subDays(new Date(), 45).toISOString(),
        }),
      ],
      unsubscribedEmails: [],
      linkedClubIds: new Set([10, 11]),
      clubs: [
        club({
          id: 10,
          competitionDateRange: {
            earliestStartDate: start,
            latestEndDate: end,
            competitionsWithValidDates: 1,
            totalCompetitions: 1,
          },
        }),
      ],
    });

    expect(counts.exportReady).toBe(2);
    expect(counts.neverScraped).toBe(1);
    expect(counts.staleScrape).toBe(1);
    expect(counts.noAccount).toBe(1);
    expect(counts.startingSoon).toBe(1);
    expect(counts.marketingPicks).toBe(1);
  });
});
