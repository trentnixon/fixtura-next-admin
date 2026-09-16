import { differenceInDays, isValid, parseISO } from "date-fns";
import type { OrgContactListingRow } from "@/types/orgContactListing";
import { isEmailUnsubscribed } from "@/lib/utils/unsubscribedEmails";

/** Matches CMS org-contact scrape stale window (see handoff). */
export const ORG_CONTACT_STALE_DAYS = 30;

export type OrgContactQualityFilter =
  | "all"
  | "export_ready"
  | "never_scraped"
  | "stale_scrape"
  | "has_scraped"
  | "no_account"
  | "unsubscribed";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidContactEmail(email: string | null | undefined): boolean {
  if (!email?.trim()) return false;
  return EMAIL_REGEX.test(email.trim());
}

export function hasScrapedContacts(
  row: Pick<OrgContactListingRow, "contacts">,
): boolean {
  return (row.contacts?.filter(Boolean).length ?? 0) > 0;
}

export type ScrapeFreshness = "never" | "fresh" | "stale";

export function getScrapeFreshness(
  lastOrgContactScrapeAt: string | null | undefined,
  now: Date = new Date(),
): ScrapeFreshness {
  if (!lastOrgContactScrapeAt) return "never";
  const parsed = parseISO(lastOrgContactScrapeAt);
  if (!isValid(parsed)) return "never";
  const ageDays = differenceInDays(now, parsed);
  if (ageDays > ORG_CONTACT_STALE_DAYS) return "stale";
  return "fresh";
}

export function isExportReadyOrgContact(
  row: Pick<OrgContactListingRow, "email">,
  unsubscribedEmails: string[],
): boolean {
  return (
    isValidContactEmail(row.email) &&
    !isEmailUnsubscribed(row.email, unsubscribedEmails)
  );
}

export function matchesOrgContactQualityFilter(
  row: OrgContactListingRow,
  qualityFilter: OrgContactQualityFilter,
  options: {
    unsubscribedEmails: string[];
    hasLinkedAccount: boolean;
  },
): boolean {
  if (qualityFilter === "all") return true;

  switch (qualityFilter) {
    case "export_ready":
      return isExportReadyOrgContact(row, options.unsubscribedEmails);
    case "never_scraped":
      return getScrapeFreshness(row.lastOrgContactScrapeAt) === "never";
    case "stale_scrape":
      return getScrapeFreshness(row.lastOrgContactScrapeAt) === "stale";
    case "has_scraped":
      return hasScrapedContacts(row);
    case "no_account":
      return !options.hasLinkedAccount;
    case "unsubscribed":
      return isEmailUnsubscribed(row.email, options.unsubscribedEmails);
    default:
      return true;
  }
}

export type OrgContactInsightCounts = {
  exportReady: number;
  neverScraped: number;
  staleScrape: number;
  withScrapedPeople: number;
  noAccount: number;
};

export function countOrgContactInsights(
  rows: OrgContactListingRow[],
  unsubscribedEmails: string[],
  linkedAccountIds: Set<number>,
): OrgContactInsightCounts {
  let exportReady = 0;
  let neverScraped = 0;
  let staleScrape = 0;
  let withScrapedPeople = 0;
  let noAccount = 0;

  for (const row of rows) {
    if (isExportReadyOrgContact(row, unsubscribedEmails)) exportReady += 1;
    const freshness = getScrapeFreshness(row.lastOrgContactScrapeAt);
    if (freshness === "never") neverScraped += 1;
    if (freshness === "stale") staleScrape += 1;
    if (hasScrapedContacts(row)) withScrapedPeople += 1;
    if (!linkedAccountIds.has(row.id)) noAccount += 1;
  }

  return {
    exportReady,
    neverScraped,
    staleScrape,
    withScrapedPeople,
    noAccount,
  };
}
