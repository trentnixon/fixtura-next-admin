"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDurationMs } from "@/lib/account-health/globalRunAnalytics";
import {
  assetRunListDurationMs,
  resolveAssetRunStartedAt,
} from "@/lib/account-asset-run/globalRunAnalytics";
import {
  assetRunStatusBadgeClass,
  assetRunStatusLabel,
} from "@/lib/account-asset-run/displayRules";
import { getAccountAssetRunDetailHref } from "@/lib/account-asset-run/accountRoutes";
import { formatHealthTimestamp } from "@/lib/account-health/formatHealthTimestamp";
import type { AccountAssetRunListRow } from "@/types/accountAssetRun";
import { useLiveRunClock } from "@/hooks/account-asset-run/useLiveRunClock";

interface AssetRunActiveProcessingTableProps {
  rows: AccountAssetRunListRow[];
}

export function AssetRunActiveProcessingTable({
  rows,
}: AssetRunActiveProcessingTableProps) {
  const hasActive = rows.length > 0;
  const nowMs = useLiveRunClock(hasActive);

  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No asset runs in flight right now.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Run</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Current phase</TableHead>
            <TableHead>Started</TableHead>
            <TableHead>Elapsed</TableHead>
            <TableHead>Render</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((run) => {
            const startedAt = resolveAssetRunStartedAt(run);
            const elapsedMs = assetRunListDurationMs(run, { nowMs });
            const elapsedLabel =
              elapsedMs != null
                ? `${formatDurationMs(elapsedMs)} (running)`
                : "—";

            return (
              <TableRow key={run.id}>
                <TableCell className="font-mono text-sm">
                  <Link
                    href={getAccountAssetRunDetailHref(run.id, run.accountId)}
                    className="text-primary underline underline-offset-2 hover:no-underline"
                  >
                    #{run.id}
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium">
                    {run.accountName?.trim() || `Account ${run.accountId}`}
                  </div>
                  {run.accountType && (
                    <div className="text-xs capitalize text-muted-foreground">
                      {run.accountType}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`capitalize ${assetRunStatusBadgeClass(run.status)}`}
                  >
                    {assetRunStatusLabel(run.status)}
                  </Badge>
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm">
                  {formatHealthTimestamp(startedAt)}
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm font-medium tabular-nums">
                  {elapsedLabel}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {run.renderId != null && Number.isFinite(run.renderId) ? (
                    <Link
                      href={`/dashboard/renders/${run.renderId}`}
                      className="text-primary underline underline-offset-2 hover:no-underline"
                    >
                      {run.renderId}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground">Pending</span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
