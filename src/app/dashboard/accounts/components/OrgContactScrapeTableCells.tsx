"use client";

import { TableCell } from "@/components/ui/table";
import {
  formatOrgContactScrapeDate,
} from "@/lib/utils/orgContactListingDisplay";

type OrgContactScrapeTableCellsProps = {
  lastOrgContactScrapeAt: string | null;
};

export function OrgContactScrapeTableCells({
  lastOrgContactScrapeAt,
}: OrgContactScrapeTableCellsProps) {
  return (
    <TableCell
      className="hidden whitespace-nowrap text-sm text-muted-foreground xl:table-cell"
      title={lastOrgContactScrapeAt ?? undefined}
    >
      {formatOrgContactScrapeDate(lastOrgContactScrapeAt)}
    </TableCell>
  );
}
