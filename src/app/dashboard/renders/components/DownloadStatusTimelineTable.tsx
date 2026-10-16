"use client";

import Link from "next/link";
import { Fragment, useMemo } from "react";
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
  classifyDownloadFromEntity,
  formatDownloadUpdatedAgo,
  groupDownloadsBySydneyDate,
  resolveTimelineAccountLabel,
  resolveTimelineAssetCategory,
} from "@/lib/downloads/downloadStatusTimeline";
import type { Download } from "@/types/download";
import { DownloadAttentionBadge } from "./DownloadAttentionBadge";

const COLUMN_COUNT = 5;

function DownloadStatusTimelineRow({
  download,
  nowMs,
}: {
  download: Download;
  nowMs: number;
}) {
  const bucket = classifyDownloadFromEntity(download);
  const account = resolveTimelineAccountLabel(download);
  const category = resolveTimelineAssetCategory(download);
  const name = download.attributes.Name?.trim() || "—";
  const ago = formatDownloadUpdatedAgo(download.attributes.updatedAt, nowMs);

  return (
    <TableRow>
      <TableCell className="align-top whitespace-nowrap">
        {ago ? (
          <span className="text-sm font-semibold tabular-nums leading-tight text-brandPrimary-900">
            {ago}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell className="align-top">
        <DownloadAttentionBadge bucket={bucket} labelMode="status" />
      </TableCell>
      <TableCell className="align-top">
        <div className="text-sm font-medium">{name}</div>
        {category ? (
          <div className="text-xs text-muted-foreground">{category}</div>
        ) : null}
      </TableCell>
      <TableCell className="align-top">
        <span className="text-sm">{account.label}</span>
        {account.sport ? (
          <p className="mt-0.5 text-xs text-muted-foreground">{account.sport}</p>
        ) : null}
      </TableCell>
      <TableCell className="align-top text-right">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/downloads/${download.id}`}>Download</Link>
        </Button>
      </TableCell>
    </TableRow>
  );
}

export function DownloadStatusTimelineTable({
  rows,
  nowMs = Date.now(),
}: {
  rows: Download[];
  nowMs?: number;
}) {
  const dateGroups = useMemo(() => groupDownloadsBySydneyDate(rows), [rows]);

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-slate-50 hover:bg-slate-50">
          <TableHead>Days ago</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Download</TableHead>
          <TableHead>Client</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dateGroups.map((group) => (
          <Fragment key={group.dateKey}>
            <TableRow className="bg-slate-100/80 hover:bg-slate-100/80">
              <TableCell colSpan={COLUMN_COUNT} className="py-2.5">
                <span className="text-sm font-semibold text-slate-800">
                  {group.dateLabel}
                </span>
              </TableCell>
            </TableRow>
            {group.rows.map((download) => (
              <DownloadStatusTimelineRow
                key={download.id}
                download={download}
                nowMs={nowMs}
              />
            ))}
          </Fragment>
        ))}
      </TableBody>
    </Table>
  );
}
