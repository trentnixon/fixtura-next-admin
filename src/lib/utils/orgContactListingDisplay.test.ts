import { describe, expect, it } from "vitest";
import {
  buildSendGridContactCsv,
  collectOrgContactExportRows,
  formatOrgContactScrapeDate,
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

describe("buildSendGridContactCsv", () => {
  it("puts each address on its own line with name and club", () => {
    const csv = buildSendGridContactCsv({
      contacts: collectOrgContactExportRows({
        id: 12,
        name: "Example Club",
        email: "club@example.com",
        phone: "0400000000",
        contacts: [
          {
            name: "Alex Smith",
            role: "Secretary",
            email: "alex@example.com",
            phone: "0411111111",
          },
          { name: "No inbox", role: "Coach" },
          { email: "club@example.com", name: "Inbox Owner" },
        ],
      }),
      unsubscribedEmails: ["gone@example.com"],
      organizationHeader: "club_name",
      organizationIdHeader: "club_id",
    });

    expect(csv).toBe(
      [
        "email,first_name,last_name,phone_number,club_name,club_id,role",
        "alex@example.com,Alex,Smith,0411111111,Example Club,12,Secretary",
        "club@example.com,Inbox,Owner,0400000000,Example Club,12,",
      ].join("\n"),
    );
    expect(csv.toLowerCase()).not.toMatch(/scrape/);
  });

  it("skips invalid and unsubscribed addresses", () => {
    expect(
      buildSendGridContactCsv({
        contacts: [
          { email: "not-an-email", organization: "Keep Club" },
          { email: "keep@example.com", firstName: "Keep", organization: "Keep Club", organizationId: 4 },
          { email: "drop@example.com" },
        ],
        unsubscribedEmails: ["drop@example.com"],
        organizationHeader: "club_name",
        organizationIdHeader: "club_id",
      }),
    ).toBe(
      "email,first_name,last_name,phone_number,club_name,club_id,role\nkeep@example.com,Keep,,,Keep Club,4,",
    );
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
