"use client";

import Link from "next/link";
import { HealthTimestampStack } from "@/app/dashboard/accounts/components/account-health/HealthTimestampStack";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  extractErrorHandlerTypes,
  resolveDownloadPrimaryErrorMessage,
  resolveFleetQueueRowAttention,
} from "@/lib/downloads/downloadAttention";
import type { DownloadQualityQueueRow } from "@/types/downloadQualityControl";
import { DownloadAttentionBadge } from "./DownloadAttentionBadge";
import {
  getAccountOverviewHref,
  normalizeAccountOrgType,
} from "@/lib/account-asset-run/renderActivityParams";

function DownloadQualityQueueTableRow({ row }: { row: DownloadQualityQueueRow }) {
  const bucket = resolveFleetQueueRowAttention(row);
  const errorTypes = extractErrorHandlerTypes(row.errorHandler);
  const primaryError = resolveDownloadPrimaryErrorMessage(
    row.userErrorMessage,
    row.errorHandler,
  );
  const accountType = normalizeAccountOrgType(row.account?.type);
  const accountHref =
    row.account?.id != null
      ? getAccountOverviewHref(row.account.id, accountType)
      : null;
  const clientLabel =
    [row.account?.firstName, row.account?.lastName]
      .filter(Boolean)
      .join(" ")
      .trim() || (row.account?.id ? `Account ${row.account.id}` : "—");

  return (
    <TableRow>
      <TableCell className="align-top">
        {accountHref ? (
          <Link
            href={accountHref}
            className="text-sm font-medium hover:text-primary"
          >
            {clientLabel}
          </Link>
        ) : (
          <span className="text-sm">{clientLabel}</span>
        )}
        {row.account?.sport ? (
          <p className="mt-0.5 text-xs text-muted-foreground">{row.account.sport}</p>
        ) : null}
      </TableCell>
      <TableCell className="align-top whitespace-nowrap">
        <HealthTimestampStack iso={row.updatedAt} />
      </TableCell>
      <TableCell className="align-top">
        <div className="text-sm font-medium">{row.name ?? "—"}</div>
        <div className="text-xs text-muted-foreground">
          #{row.downloadId}
          {row.assetCategoryIdentifier
            ? ` · ${row.assetCategoryIdentifier}`
            : ""}
        </div>
      </TableCell>
      <TableCell className="align-top max-w-xs">
        <DownloadAttentionBadge bucket={bucket} />
        {primaryError ? (
          <p className="mt-2 text-xs text-red-900 whitespace-pre-wrap line-clamp-3">
            {primaryError}
          </p>
        ) : null}
        {errorTypes.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {errorTypes.map((type) => (
              <Badge key={type} variant="outline" className="text-xs">
                {type}
              </Badge>
            ))}
          </div>
        )}
      </TableCell>
      <TableCell className="align-top text-right">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/downloads/${row.downloadId}`}>Detail</Link>
        </Button>
      </TableCell>
    </TableRow>
  );
}

export function DownloadQualityQueueTable({
  rows,
}: {
  rows: DownloadQualityQueueRow[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-slate-50 hover:bg-slate-50">
          <TableHead>Client</TableHead>
          <TableHead>
            <span className="block">Time</span>
            <span className="block text-xs font-normal text-muted-foreground">
              Date
            </span>
          </TableHead>
          <TableHead>Output</TableHead>
          <TableHead>Attention</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <DownloadQualityQueueTableRow key={row.downloadId} row={row} />
        ))}
      </TableBody>
    </Table>
  );
}
