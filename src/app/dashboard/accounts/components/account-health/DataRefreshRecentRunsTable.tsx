"use client";

import Link from "next/link";
import { useAccountHealthAccountStatus } from "@/hooks/account-health/useAccountHealthAccountStatus";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
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
    <SectionContainer
      title="Recent refresh runs"
      description="Newest runs for this account — open a run for full step detail"
      variant="compact"
    >
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Run</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Started</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Finalized</TableHead>
              <TableHead>Note</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentRuns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground">
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
                    <TableCell className="font-mono text-sm">
                      <Link href={href} className="text-primary underline">
                        {r.id}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={healthRunStatusBadgeClass(r.status)}
                      >
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
                      {formatHealthTimestamp(r.startedAt)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm tabular-nums">
                      {formatDurationMs(runDurationMs(rowMeta))}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
                      {formatHealthTimestamp(r.finalizedAt)}
                    </TableCell>
                    <TableCell className="max-w-xs text-sm">
                      {emp.isEmptyResult
                        ? `${EMPTY_RUN_RESULT_LABEL}${emp.reasonDisplay ? ` — ${emp.reasonDisplay}` : ""}`
                        : "—"}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </SectionContainer>
  );
}
