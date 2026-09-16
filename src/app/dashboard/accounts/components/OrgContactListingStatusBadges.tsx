"use client";

import { Badge } from "@/components/ui/badge";
import type { OrgContactListingRow } from "@/types/orgContactListing";
import {
  getScrapeFreshness,
  isExportReadyOrgContact,
} from "@/lib/utils/orgContactListingFilters";
import { isEmailUnsubscribed } from "@/lib/utils/unsubscribedEmails";

type OrgContactListingStatusBadgesProps = {
  row: OrgContactListingRow;
  accountId: number | undefined;
  isActiveSubscription: boolean;
  unsubscribedEmails: string[];
};

export function OrgContactListingStatusBadges({
  row,
  accountId,
  isActiveSubscription,
  unsubscribedEmails,
}: OrgContactListingStatusBadgesProps) {
  const badges: { key: string; label: string; className: string }[] = [];

  if (accountId == null) {
    badges.push({
      key: "no-account",
      label: "No account",
      className: "border-slate-300 bg-slate-50 text-slate-700",
    });
  } else if (isActiveSubscription) {
    badges.push({
      key: "active",
      label: "Active",
      className: "border-emerald-300 bg-emerald-50 text-emerald-900",
    });
  } else {
    badges.push({
      key: "inactive",
      label: "Inactive",
      className: "border-amber-300 bg-amber-50 text-amber-900",
    });
  }

  const scrapeFreshness = getScrapeFreshness(row.lastOrgContactScrapeAt);
  if (scrapeFreshness === "never") {
    badges.push({
      key: "never-scraped",
      label: "Never scraped",
      className: "border-orange-300 bg-orange-50 text-orange-900",
    });
  } else if (scrapeFreshness === "stale") {
    badges.push({
      key: "stale",
      label: "Stale scrape",
      className: "border-orange-300 bg-orange-50 text-orange-900",
    });
  }

  if (isEmailUnsubscribed(row.email, unsubscribedEmails)) {
    badges.push({
      key: "unsub",
      label: "Unsubscribed",
      className: "border-red-300 bg-red-50 text-red-900",
    });
  }

  if (isExportReadyOrgContact(row, unsubscribedEmails)) {
    badges.push({
      key: "export",
      label: "Export ready",
      className: "border-sky-300 bg-sky-50 text-sky-900",
    });
  }

  return (
    <div className="mt-1.5 flex flex-wrap gap-1">
      {badges.map((badge) => (
        <Badge
          key={badge.key}
          variant="outline"
          className={`text-[10px] font-medium ${badge.className}`}
        >
          {badge.label}
        </Badge>
      ))}
    </div>
  );
}
