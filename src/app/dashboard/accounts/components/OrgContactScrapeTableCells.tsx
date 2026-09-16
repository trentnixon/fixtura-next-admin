"use client";

import { TableCell } from "@/components/ui/table";
import type { OrgContactPerson } from "@/types/orgContactListing";
import {
  formatOrgContactScrapeDate,
  summarizeOrgContacts,
} from "@/lib/utils/orgContactListingDisplay";

type OrgContactScrapeTableCellsProps = {
  contacts: OrgContactPerson[];
  lastOrgContactScrapeAt: string | null;
};

export function OrgContactScrapeTableCells({
  contacts,
  lastOrgContactScrapeAt,
}: OrgContactScrapeTableCellsProps) {
  const { summary, detail } = summarizeOrgContacts(contacts);

  return (
    <>
      <TableCell className="hidden max-w-[180px] xl:table-cell">
        {summary === "—" ? (
          <span className="text-sm text-muted-foreground">{summary}</span>
        ) : (
          <span
            className="block truncate text-sm text-slate-900"
            title={detail}
          >
            {summary}
          </span>
        )}
      </TableCell>
      <TableCell
        className="hidden whitespace-nowrap text-sm text-muted-foreground xl:table-cell"
        title={lastOrgContactScrapeAt ?? undefined}
      >
        {formatOrgContactScrapeDate(lastOrgContactScrapeAt)}
      </TableCell>
    </>
  );
}
