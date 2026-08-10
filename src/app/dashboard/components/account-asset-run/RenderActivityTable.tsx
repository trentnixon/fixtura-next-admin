"use client";

import Link from "next/link";
import { EyeIcon, ListChecksIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatHealthTimestamp } from "@/lib/account-health/formatHealthTimestamp";
import { formatDurationMs } from "@/lib/account-health/globalRunAnalytics";
import { getAccountAssetRunDetailHref } from "@/lib/account-asset-run/accountRoutes";
import {
  getAccountOverviewHref,
  normalizeAccountOrgType,
} from "@/lib/account-asset-run/renderActivityParams";
import {
  assetRunStatusBadgeClass,
  assetRunStatusLabel,
  isAssetRunActive,
} from "@/lib/account-asset-run/displayRules";
import { parseRunKeyStartedAt } from "@/lib/account-asset-run/globalRunAnalytics";
import { useLiveRunClock } from "@/hooks/account-asset-run/useLiveRunClock";
import type { AccountAssetRunRenderActivityRow } from "@/types/accountAssetRun";

function accountDisplayName(row: AccountAssetRunRenderActivityRow): string {
  const name = row.account.name?.trim();
  if (name) return name;
  return `Account ${row.account.id}`;
}

function resolveActivityDurationMs(
  row: AccountAssetRunRenderActivityRow,
  nowMs: number,
): number | null {
  if (row.run.durationMs != null) return row.run.durationMs;

  const startIso =
    row.run.startedAt ?? parseRunKeyStartedAt(row.run.runKey) ?? null;
  if (!startIso) return null;

  const start = Date.parse(startIso);
  if (!Number.isFinite(start)) return null;

  if (isAssetRunActive(row.run.status)) {
    return nowMs - start;
  }

  const endIso = row.run.finishedAt ?? row.run.completedAt ?? row.run.failedAt;
  if (!endIso) return null;

  const end = Date.parse(endIso);
  if (!Number.isFinite(end) || end < start) return null;

  return end - start;
}

function renderCountsTooltip(
  row: AccountAssetRunRenderActivityRow,
): string | null {
  const counts = row.render?.counts;
  if (!counts) return null;

  return [
    `Downloads: ${counts.downloads}`,
    `AI articles: ${counts.aiArticles}`,
    `Game results: ${counts.gameResults}`,
    `Upcoming games: ${counts.upcomingGames}`,
    `Grades: ${counts.grades}`,
  ].join("\n");
}

interface RenderActivityTableProps {
  rows: AccountAssetRunRenderActivityRow[];
  showAccountColumn?: boolean;
}

export function RenderActivityTable({
  rows,
  showAccountColumn = true,
}: RenderActivityTableProps) {
  const hasActive = rows.some((row) => isAssetRunActive(row.run.status));
  const nowMs = useLiveRunClock(hasActive);

  const colSpan = 6 + (showAccountColumn ? 1 : 0);

  return (
    <TooltipProvider>
      <ScrollArea className="min-w-full">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-slate-50">
            <TableRow>
              {showAccountColumn && <TableHead>Org</TableHead>}
              <TableHead>Started</TableHead>
              <TableHead>Finished</TableHead>
              <TableHead>Time taken</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Render items</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={colSpan} className="text-muted-foreground">
                  No render activity in this window.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => {
                const accountType = normalizeAccountOrgType(row.account.type);
                const accountHref = getAccountOverviewHref(
                  row.account.id,
                  accountType,
                );
                const durationMs = resolveActivityDurationMs(row, nowMs);
                const durationLabel =
                  durationMs != null
                    ? `${formatDurationMs(durationMs)}${
                        isAssetRunActive(row.run.status) ? " (running)" : ""
                      }`
                    : "—";
                const countsTip = renderCountsTooltip(row);
                const totalItems = row.render?.counts.totalItems;

                return (
                  <TableRow key={row.run.id} className="hover:bg-muted/30">
                    {showAccountColumn && (
                      <TableCell>
                        {accountHref ? (
                          <Link
                            href={accountHref}
                            className="font-medium text-slate-950 hover:text-primary"
                          >
                            {accountDisplayName(row)}
                          </Link>
                        ) : (
                          <span className="font-medium">
                            {accountDisplayName(row)}
                          </span>
                        )}
                        {row.account.sport && (
                          <div className="text-xs text-muted-foreground">
                            {row.account.sport}
                          </div>
                        )}
                      </TableCell>
                    )}
                    <TableCell className="whitespace-nowrap text-sm">
                      {formatHealthTimestamp(row.run.startedAt)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
                      {formatHealthTimestamp(row.run.finishedAt)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm tabular-nums">
                      {durationLabel}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`rounded-full capitalize ${assetRunStatusBadgeClass(row.run.status)}`}
                        title={assetRunStatusLabel(row.run.status)}
                      >
                        {row.run.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-sm tabular-nums">
                      {totalItems != null ? (
                        countsTip ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-help underline decoration-dotted underline-offset-2">
                                {totalItems}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent className="whitespace-pre-line">
                              {countsTip}
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          totalItems
                        )
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1.5">
                        {row.render ? (
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-slate-200 bg-slate-50 text-slate-700 shadow-none hover:bg-slate-100 hover:text-slate-900"
                            title={`Open render #${row.render.id}`}
                            asChild
                          >
                            <Link href={`/dashboard/renders/${row.render.id}`}>
                              <EyeIcon className="h-4 w-4" />
                            </Link>
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="border-slate-200 bg-slate-50 text-slate-400 shadow-none"
                            title="Render pending"
                            disabled
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-brandSecondary-200 bg-brandSecondary-50 text-brandSecondary-800 shadow-none hover:bg-brandSecondary-100 hover:text-brandSecondary-900"
                          title={`Open run #${row.run.id}`}
                          asChild
                        >
                          <Link
                            href={getAccountAssetRunDetailHref(
                              row.run.id,
                              row.account.id,
                              accountType,
                            )}
                          >
                            <ListChecksIcon className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </TooltipProvider>
  );
}
