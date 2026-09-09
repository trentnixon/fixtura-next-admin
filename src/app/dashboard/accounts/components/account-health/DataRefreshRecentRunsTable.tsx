"use client";

import Link from "next/link";
import { EyeIcon } from "lucide-react";
import { useAccountHealthAccountStatus } from "@/hooks/account-health/useAccountHealthAccountStatus";
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
import { HealthTimestampStack } from "@/app/dashboard/accounts/components/account-health/HealthTimestampStack";
import {
  EMPTY_RUN_RESULT_LABEL,
  getSummaryEmptyReason,
  healthRunStatusBadgeClass,
} from "@/lib/account-health/displayRules";
import { getAccountHealthRunDetailHref } from "@/lib/account-health/accountRoutes";
import {
  formatDurationMs,
  runDurationMs,
  type RunWithTimestamps,
} from "@/lib/account-health/globalRunAnalytics";

interface DataRefreshRecentRunsTableProps {
  accountId: number;
}

export default function DataRefreshRecentRunsTable({
  accountId,
}: DataRefreshRecentRunsTableProps) {
  const { data } = useAccountHealthAccountStatus(accountId);
  const recentRuns = data?.data?.recentRuns ?? [];
  const account = data?.data?.account;

  if (!account) return null;

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <h2 className="text-base font-semibold text-slate-900">
          Recent refresh runs
        </h2>
        <p className="text-sm text-muted-foreground">
          Newest runs for this account — open a run for full step detail
        </p>
      </div>

      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead>Run</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Started</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Finalized</TableHead>
            <TableHead>Note</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentRuns.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-muted-foreground">
                No runs recorded.
              </TableCell>
            </TableRow>
          ) : (
            recentRuns.map((r) => {
              const emp = getSummaryEmptyReason(r.summary);
              const href = getAccountHealthRunDetailHref(r.id, account.id);
              const rowMeta: RunWithTimestamps = {
                id: r.id,
                status: r.status,
                startedAt: r.startedAt,
                finalizedAt: r.finalizedAt,
                failedAt: r.failedAt,
                summary: r.summary,
              };

              return (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-sm tabular-nums">
                    #{r.id}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={healthRunStatusBadgeClass(r.status)}
                    >
                      {r.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <HealthTimestampStack iso={r.startedAt} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-sm tabular-nums text-muted-foreground">
                    {formatDurationMs(runDurationMs(rowMeta))}
                  </TableCell>
                  <TableCell>
                    <HealthTimestampStack iso={r.finalizedAt} />
                  </TableCell>
                  <TableCell className="max-w-xs text-sm text-muted-foreground">
                    {emp.isEmptyResult
                      ? `${EMPTY_RUN_RESULT_LABEL}${emp.reasonDisplay ? ` — ${emp.reasonDisplay}` : ""}`
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-slate-200 bg-slate-50 text-slate-700 shadow-none hover:bg-slate-100 hover:text-slate-900"
                      asChild
                    >
                      <Link href={href}>
                        <EyeIcon className="h-4 w-4" />
                      </Link>
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
