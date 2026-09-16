import { describe, expect, it } from "vitest";
import {
  formatOrgContactScrapeDate,
  formatOrgContactsForCsv,
  orgContactSearchTokens,
  summarizeOrgContacts,
} from "./orgContactListingDisplay";

describe("formatOrgContactScrapeDate", () => {
  it("returns em dash when missing or invalid", () => {
    expect(formatOrgContactScrapeDate(null)).toBe("—");
    expect(formatOrgContactScrapeDate("not-a-date")).toBe("—");
  });

  it("formats valid ISO timestamps", () => {
    expect(formatOrgContactScrapeDate("2026-03-15T04:30:00.000Z")).toMatch(
      /15 Mar 2026/,
    );
  });
});

describe("summarizeOrgContacts", () => {
  it("handles empty lists", () => {
    expect(summarizeOrgContacts([])).toEqual({
      summary: "—",
      detail: "No scraped contacts",
    });
  });

  it("summarizes a single person", () => {
    expect(
      summarizeOrgContacts([
        { name: "Alex", role: "Secretary", email: "alex@example.com" },
      ]),
    ).toEqual({
      summary: "Alex (Secretary)",
      detail: "Alex (Secretary)",
    });
  });

  it("summarizes multiple people", () => {
    const result = summarizeOrgContacts([
      { name: "Alex", role: "Secretary" },
      { email: "treasurer@example.com" },
    ]);
    expect(result.summary).toBe("Alex (Secretary) +1 more");
    expect(result.detail).toContain("treasurer@example.com");
  });
});

describe("formatOrgContactsForCsv", () => {
  it("joins contacts with semicolons", () => {
    expect(
      formatOrgContactsForCsv([
        { name: "Alex", role: "Secretary" },
        { email: "b@example.com" },
      ]),
    ).toBe("Alex (Secretary); b@example.com");
  });
});

describe("orgContactSearchTokens", () => {
  it("collects lowercase tokens from scraped contacts", () => {
    expect(
      orgContactSearchTokens({
        contacts: [{ name: "Alex", email: "Alex@Example.com" }],
      }),
    ).toEqual(["alex", "alex@example.com"]);
  });
});
