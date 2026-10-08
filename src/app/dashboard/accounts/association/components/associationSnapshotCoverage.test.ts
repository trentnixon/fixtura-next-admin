import { addDays, subDays } from "date-fns";
import type { AccountLookupItem } from "@/types/adminAccountLookup";
import type { AssociationDetail } from "@/types/associationInsights";
import type { OrgContactListingRow } from "@/types/orgContactListing";
import {
  countAssociationAccountOperations,
  countAssociationAccountSummary,
  countAssociationContactCoverage,
  linkedAssociationIds,
} from "./associationSnapshotCoverage";

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
    account_type: "Association",
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
    name: "Association",
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

function association(
  overrides: Partial<AssociationDetail> & Pick<AssociationDetail, "id">,
): AssociationDetail {
  return {
    name: "Association",
    href: null,
    logoUrl: "",
    gradeCount: 2,
    clubCount: 4,
    competitionCount: 1,
    activeCompetitionCount: 1,
    competitionTeams: 8,
    competitionGrades: 2,
    averageTeamsPerCompetition: 8,
    averageGradesPerCompetition: 2,
    sport: "Cricket",
    competitionDateRange: null,
    ...overrides,
  };
}

describe("countAssociationAccountSummary", () => {
  it("counts subscription, expiry, setup, and sport mix", () => {
    const counts = countAssociationAccountSummary([
      account({
        id: 1,
        hasActiveOrder: true,
        daysLeftOnSubscription: 10,
        isSetup: true,
        Sport: "Cricket",
      }),
      account({
        id: 2,
        hasActiveOrder: false,
        daysLeftOnSubscription: null,
        isSetup: false,
        Sport: null,
      }),
    ]);

    expect(counts.total).toBe(2);
    expect(counts.active).toBe(1);
    expect(counts.inactive).toBe(1);
    expect(counts.expiring30).toBe(1);
    expect(counts.setupComplete).toBe(1);
    expect(counts.setupPending).toBe(1);
    expect(counts.setupPercentage).toBe(50);
    expect(counts.sportCount).toBe(2);
    expect(counts.sportDetail).toBe("Cricket: 1 / Unknown: 1");
  });
});

describe("countAssociationAccountOperations", () => {
  it("counts refresh, render, and start-sequence gaps", () => {
    const counts = countAssociationAccountOperations([
      account({ id: 1, accountHealthStatus: "failed" }),
      account({ id: 2, accountHealthStatus: "not_started" }),
      account({ id: 3, accountHealthStatus: "queued" }),
      account({ id: 4, accountHealthStatus: "running", isSchedulerRendering: true }),
      account({
        id: 5,
        hasCompletedStartSequence: false,
        renderProcessingSince: "2026-10-08T00:00:00.000Z",
      }),
    ]);

    expect(counts).toEqual({
      refreshFailed: 1,
      refreshNotStarted: 1,
      refreshInProgress: 2,
      renderingNow: 2,
      startSequenceOpen: 1,
      startSequenceComplete: 4,
    });
  });
});

describe("linkedAssociationIds", () => {
  it("collects association ids from every account", () => {
    const ids = linkedAssociationIds([
      account({
        id: 1,
        associations: [
          { id: 10, name: "A" },
          { id: 11, name: "B" },
        ],
      }),
      account({ id: 2, associations: [{ id: 11, name: "B" }] }),
    ]);

    expect([...ids].sort((left, right) => left - right)).toEqual([10, 11]);
  });
});

describe("countAssociationContactCoverage", () => {
  it("keeps season counts empty until insights are available", () => {
    const counts = countAssociationContactCoverage({
      contacts: [contact({ id: 10 })],
      unsubscribedEmails: [],
      linkedAssociationIds: new Set([10]),
      associations: null,
    });

    expect(counts.startingSoon).toBeNull();
    expect(counts.marketingPicks).toBeNull();
    expect(counts.exportReady).toBe(1);
  });

  it("counts export-ready, scrape freshness, unlinked orgs, and seasons starting soon", () => {
    const start = addDays(new Date(), 10).toISOString();
    const end = addDays(new Date(), 120).toISOString();
    const counts = countAssociationContactCoverage({
      contacts: [
        contact({ id: 10, email: "ready@example.com" }),
        contact({ id: 11, email: "gone@example.com" }),
        contact({ id: 12, email: null, lastOrgContactScrapeAt: null }),
        contact({
          id: 13,
          email: "stale@example.com",
          lastOrgContactScrapeAt: subDays(new Date(), 45).toISOString(),
        }),
      ],
      unsubscribedEmails: ["gone@example.com"],
      linkedAssociationIds: new Set([10, 11, 12]),
      associations: [
        association({
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
