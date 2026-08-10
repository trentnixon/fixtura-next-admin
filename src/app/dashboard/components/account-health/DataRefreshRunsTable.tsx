"use client";

import Link from "next/link";
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
  formatHealthTimestampNoYear,
} from "@/lib/account-health/formatHealthTimestamp";
import {
  EMPTY_RUN_RESULT_LABEL,
  getSummaryEmptyReason,
  healthRunStatusBadgeClass,
} from "@/lib/account-health/displayRules";
import {
  formatDurationMs,
  isStuckActiveRun,
  runDurationMs,
  type RunWithTimestamps,
} from "@/lib/account-health/globalRunAnalytics";
import {
  getAccountHealthRunDetailHref,
  getAccountPagePath,
} from "@/lib/account-health/accountRoutes";
import type { AccountHealthGlobalLatestRunRow } from "@/types/accountHealth";
import { cn } from "@/lib/utils";

interface DataRefreshRunsTableProps {
  runs: AccountHealthGlobalLatestRunRow[];
}

function toRunRow(run: AccountHealthGlobalLatestRunRow): RunWithTimestamps {
  return {
    id: run.id,
    accountId: run.accountId,
    status: run.status,
    startedAt: run.startedAt,
    finalizedAt: run.finalizedAt,
    failedAt: run.failedAt,
    failureReason: run.failureReason,
    summary: run.summary,
  };
}

export default function DataRefreshRunsTable({ runs }: DataRefreshRunsTableProps) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Account</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Started</TableHead>
            <TableHead>Finalized</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Failure</TableHead>
            <TableHead>Empty result</TableHead>
            <TableHead className="text-right" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {runs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-muted-foreground">
                No runs match this filter.
              </TableCell>
            </TableRow>
          ) : (
            runs.map((run) => {
              const accountHref = getAccountPagePath(
                run.accountId,
                run.accountType
              );
              const runHref = getAccountHealthRunDetailHref(
                run.id,
                run.accountId
              );
              const empty = getSummaryEmptyReason(run.summary);
              const rowMeta = toRunRow(run);
              const stuck = isStuckActiveRun(rowMeta);
              const failed = run.status === "failed";

              return (
                <TableRow
                  key={run.id}
                  className={cn(
                    failed && "bg-red-50/50",
                    stuck && !failed && "bg-amber-50/50"
                  )}
                >
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-auto max-w-full whitespace-normal text-left"
                      asChild
                    >
                      <Link href={accountHref}>
                        {run.accountName?.trim() ||
                          run.primaryOrgLabel?.trim() ||
                          `Account ${run.accountId}`}
                      </Link>
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={healthRunStatusBadgeClass(run.status)}
                    >
                      {run.status}
                      {stuck ? " · stuck" : ""}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize">{run.accountType}</TableCell>
                  <TableCell className="text-sm whitespace-nowrap">
                    {formatHealthTimestampNoYear(run.startedAt)}
                  </TableCell>
                  <TableCell className="text-sm whitespace-nowrap">
                    {formatHealthTimestampNoYear(run.finalizedAt)}
                  </TableCell>
                  <TableCell className="text-sm whitespace-nowrap tabular-nums font-bold">
                    {formatDurationMs(runDurationMs(rowMeta))}
                  </TableCell>
                  <TableCell className="max-w-[200px] text-sm text-red-800">
                    {run.failureReason ?? "—"}
                  </TableCell>
                  <TableCell className="max-w-[220px] text-sm">
                    {empty.isEmptyResult ? (
                      <span title={empty.reasonDisplay ?? undefined}>
                        {EMPTY_RUN_RESULT_LABEL}
                        {empty.reasonDisplay
                          ? `: ${empty.reasonDisplay}`
                          : ""}
                      </span>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="accent" size="sm" asChild>
                      <Link href={runHref}>View Run</Link>
                    </Button>
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
