import { describe, expect, it } from "vitest";
import {
  countOrgContactInsights,
  getScrapeFreshness,
  isExportReadyOrgContact,
  matchesOrgContactQualityFilter,
  ORG_CONTACT_STALE_DAYS,
} from "./orgContactListingFilters";
import type { OrgContactListingRow } from "@/types/orgContactListing";

const baseRow: OrgContactListingRow = {
  id: 1,
  name: "Test Club",
  phone: null,
  email: "valid@example.com",
  address: null,
  website: null,
  logo: null,
  contacts: [{ name: "Secretary", email: "sec@example.com" }],
  lastOrgContactScrapeAt: null,
};

describe("getScrapeFreshness", () => {
  it("uses CMS stale day threshold", () => {
    expect(ORG_CONTACT_STALE_DAYS).toBe(30);
  });

  it("classifies missing or invalid dates as never", () => {
    expect(getScrapeFreshness(null)).toBe("never");
    expect(getScrapeFreshness("bad")).toBe("never");
  });

  it("classifies recent scrapes as fresh", () => {
    const recent = new Date();
    recent.setDate(recent.getDate() - 5);
    expect(getScrapeFreshness(recent.toISOString())).toBe("fresh");
  });

  it("classifies old scrapes as stale", () => {
    const old = new Date();
    old.setDate(old.getDate() - 45);
    expect(getScrapeFreshness(old.toISOString())).toBe("stale");
  });
});

describe("isExportReadyOrgContact", () => {
  it("requires valid email and not on unsub list", () => {
    expect(
      isExportReadyOrgContact(baseRow, ["other@example.com"]),
    ).toBe(true);
    expect(
      isExportReadyOrgContact(baseRow, ["valid@example.com"]),
    ).toBe(false);
    expect(
      isExportReadyOrgContact({ email: "not-an-email" }, []),
    ).toBe(false);
  });
});

describe("matchesOrgContactQualityFilter", () => {
  it("filters export-ready rows", () => {
    expect(
      matchesOrgContactQualityFilter(baseRow, "export_ready", {
        unsubscribedEmails: [],
        hasLinkedAccount: true,
      }),
    ).toBe(true);
  });

  it("filters rows without linked accounts", () => {
    expect(
      matchesOrgContactQualityFilter(baseRow, "no_account", {
        unsubscribedEmails: [],
        hasLinkedAccount: false,
      }),
    ).toBe(true);
  });
});

describe("countOrgContactInsights", () => {
  it("aggregates insight counts", () => {
    const counts = countOrgContactInsights(
      [baseRow, { ...baseRow, id: 2, email: "bad" }],
      [],
      new Set([1]),
    );
    expect(counts.exportReady).toBe(1);
    expect(counts.neverScraped).toBe(2);
    expect(counts.withScrapedPeople).toBe(2);
    expect(counts.noAccount).toBe(1);
  });
});
