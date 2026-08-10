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
import { formatHealthTimestamp } from "@/lib/account-health/formatHealthTimestamp";
import { formatDurationMs } from "@/lib/account-health/globalRunAnalytics";
import {
  assetRunListDurationMs,
  resolveAssetRunStartedAt,
} from "@/lib/account-asset-run/globalRunAnalytics";
import {
  assetRunStatusBadgeClass,
  assetRunStatusLabel,
  isAssetRunActive,
} from "@/lib/account-asset-run/displayRules";
import { getAccountAssetRunDetailHref } from "@/lib/account-asset-run/accountRoutes";
import type { AccountAssetRunListRow } from "@/types/accountAssetRun";
import { useLiveRunClock } from "@/hooks/account-asset-run/useLiveRunClock";

function rowMode(summary: Record<string, unknown> | null): string {
  if (!summary?.mode || typeof summary.mode !== "string") return "—";
  return summary.mode;
}

interface GlobalAccountAssetRunTableProps {
  rows: AccountAssetRunListRow[];
  /** Show started + duration columns (renders ops view) */
  showDuration?: boolean;
}

export function GlobalAccountAssetRunTable({
  rows,
  showDuration = false,
}: GlobalAccountAssetRunTableProps) {
  const hasActive = rows.some((r) => isAssetRunActive(r.status));
  const nowMs = useLiveRunClock(showDuration && hasActive);

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Run</TableHead>
            <TableHead>Account</TableHead>
            <TableHead>Scheduler</TableHead>
            <TableHead>Render</TableHead>
            <TableHead>Status</TableHead>
            {showDuration && <TableHead>Duration</TableHead>}
            <TableHead>Mode</TableHead>
            <TableHead>Scheduled</TableHead>
            {showDuration && <TableHead>Started</TableHead>}
            <TableHead>Completed</TableHead>
            <TableHead>Failed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={showDuration ? 11 : 9}
                className="text-muted-foreground"
              >
                No recent asset runs.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((run) => {
              const durationMs = showDuration
                ? assetRunListDurationMs(run, { nowMs })
                : null;
              const durationLabel =
                durationMs != null
                  ? `${formatDurationMs(durationMs)}${
                      isAssetRunActive(run.status) ? " (running)" : ""
                    }`
                  : "—";
              const startedAt = resolveAssetRunStartedAt(run);

              return (
                <TableRow key={run.id}>
                  <TableCell className="font-mono text-sm">
                    <Link
                      href={getAccountAssetRunDetailHref(run.id, run.accountId)}
                      className="text-primary underline underline-offset-2 hover:no-underline"
                    >
                      {run.id}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="font-mono text-sm">{run.accountId}</div>
                    {run.accountName?.trim() && (
                      <div className="text-xs text-muted-foreground">
                        {run.accountName.trim()}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {run.schedulerId}
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
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`capitalize ${assetRunStatusBadgeClass(run.status)}`}
                      title={assetRunStatusLabel(run.status)}
                    >
                      {run.status}
                    </Badge>
                  </TableCell>
                  {showDuration && (
                    <TableCell className="whitespace-nowrap text-sm tabular-nums">
                      {durationLabel}
                    </TableCell>
                  )}
                  <TableCell className="text-sm capitalize">
                    {rowMode(run.summary)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm">
                    {run.scheduledDate ?? "—"}
                  </TableCell>
                  {showDuration && (
                    <TableCell className="whitespace-nowrap text-sm">
                      {formatHealthTimestamp(startedAt)}
                    </TableCell>
                  )}
                  <TableCell className="whitespace-nowrap text-sm">
                    {formatHealthTimestamp(run.completedAt)}
                  </TableCell>
                  <TableCell className="max-w-[180px] text-sm">
                    <div>{formatHealthTimestamp(run.failedAt)}</div>
                    {run.failureReason && (
                      <div className="mt-1 line-clamp-2 text-xs text-red-800">
                        {run.failureReason}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
