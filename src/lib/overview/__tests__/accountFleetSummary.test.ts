import { describe, expect, it } from "vitest";
import type { AccountSummary } from "@/types/account";
import type { AccountLookupItem } from "@/types/adminAccountLookup";
import {
  ACCOUNT_SIGNUP_WINDOW_DAYS,
  buildAccountFleetOverview,
  buildAccountFleetSportRows,
  buildAccountSignupSummary,
  formatSignupRelativeAge,
  formatSportMixBreakdown,
  getRecentAccountSignupItems,
} from "@/lib/overview/accountFleetSummary";

function totals(
  overrides: Partial<AccountSummary["Totals"]> = {}
): AccountSummary["Totals"] {
  return {
    count: 5,
    uniqueSports: ["Cricket"],
    sportsCount: { Cricket: 5 },
    accountTypesCount: { Association: 2, Club: 3 },
    sportsPerAccountTypeCount: {
      Association: { Cricket: 2, AFL: 0, Netball: 0 },
      Club: { Cricket: 3, AFL: 0, Netball: 0 },
    },
    trialInstanceStatus: { active: 0, expired: 0 },
    activeOrderCount: 0,
    activeFreeTierCount: 0,
    inactiveFreeTierCount: 0,
    isSetupCount: { true: 0, false: 0 },
    mediaLibraryUsage: [],
    longevityAndRetention: [],
    ...overrides,
  };
}

function lookup(
  overrides: Partial<AccountLookupItem> = {}
): AccountLookupItem {
  return {
    id: 99,
    FirstName: "New Club",
    DeliveryAddress: "club@example.com",
    Sport: "Cricket",
    isActive: true,
    isSetup: false,
    hasCompletedStartSequence: false,
    hasActiveOrder: false,
    daysLeftOnSubscription: null,
    account_type: "Club",
    clubs: [],
    associations: [],
    logo: null,
    email: "club@example.com",
    ...overrides,
  };
}

describe("formatSportMixBreakdown", () => {
  it("formats cricket, afl, and netball counts", () => {
    expect(formatSportMixBreakdown({ Cricket: 2, AFL: 1, Netball: 0 })).toBe(
      "2 Cricket · 1 AFL · 0 Netball"
    );
  });
});

describe("formatSignupRelativeAge", () => {
  it("describes recent signups in plain language", () => {
    const nowMs = Date.parse("2026-09-08T12:00:00.000Z");

    expect(
      formatSignupRelativeAge("2026-09-08T10:00:00.000Z", nowMs)
    ).toBe("Signed up today");
    expect(
      formatSignupRelativeAge("2026-09-06T10:00:00.000Z", nowMs)
    ).toBe("Signed up 2 days ago");
  });
});

describe("buildAccountFleetSportRows", () => {
  it("returns cricket, afl, and netball rows", () => {
    expect(buildAccountFleetSportRows({ Cricket: 2, AFL: 0, Netball: 1 })).toEqual([
      { label: "Cricket", value: "2", valueTone: "text-emerald-700" },
      { label: "AFL", value: "0", valueTone: "text-amber-700" },
      { label: "Netball", value: "1", valueTone: "text-sky-700" },
    ]);
  });
});

describe("getRecentAccountSignupItems", () => {
  it("returns enriched signup rows sorted newest first", () => {
    const nowMs = Date.parse("2026-09-08T12:00:00.000Z");
    const items = getRecentAccountSignupItems(
      [
        {
          id: 99,
          createdAt: "2026-09-07T12:00:00.000Z",
          updatedAt: "2026-09-07T12:00:00.000Z",
          deliveryAddress: "club@example.com",
        },
      ],
      new Map([[99, lookup()]]),
      { nowMs }
    );

    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      label: "New Club",
      accountType: "Club",
      href: "/dashboard/accounts/club/99",
    });
    expect(items[0]?.meta).toContain("Club");
    expect(items[0]?.meta).toContain("Signed up yesterday");
  });
});

describe("buildAccountSignupSummary", () => {
  it("counts association and club signups separately", () => {
    const nowMs = Date.parse("2026-09-08T12:00:00.000Z");
    const summary = buildAccountSignupSummary(
      [
        {
          id: 1,
          createdAt: "2026-09-07T12:00:00.000Z",
          updatedAt: "2026-09-07T12:00:00.000Z",
          deliveryAddress: "assoc@example.com",
        },
        {
          id: 2,
          createdAt: "2026-09-06T12:00:00.000Z",
          updatedAt: "2026-09-06T12:00:00.000Z",
          deliveryAddress: "club@example.com",
        },
      ],
      new Map([
        [1, lookup({ id: 1, FirstName: "Assoc", account_type: "Association" })],
        [2, lookup({ id: 2, FirstName: "Club", account_type: "Club" })],
      ]),
      { nowMs }
    );

    expect(summary.total).toBe(2);
    expect(summary.associationCount).toBe(1);
    expect(summary.clubCount).toBe(1);
  });
});

describe("buildAccountFleetOverview", () => {
  it("returns null when summary is missing", () => {
    expect(buildAccountFleetOverview(undefined)).toBeNull();
  });

  it("builds fleet cards and a signup summary", () => {
    const model = buildAccountFleetOverview(
      totals({
        longevityAndRetention: [
          {
            id: 99,
            createdAt: "2026-09-07T12:00:00.000Z",
            updatedAt: "2026-09-07T12:00:00.000Z",
            deliveryAddress: "new@example.com",
          },
        ],
      }),
      {
        nowMs: Date.parse("2026-09-08T12:00:00.000Z"),
        lookupById: new Map([[99, lookup()]]),
      }
    );

    expect(model?.totalAccounts).toBe(5);
    expect(model?.cards).toHaveLength(2);
    expect(model?.signups.total).toBe(1);
    expect(model?.signups.clubCount).toBe(1);
    expect(model?.signups.windowDays).toBe(ACCOUNT_SIGNUP_WINDOW_DAYS);
  });
});
