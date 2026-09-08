"use client";

import Link from "next/link";
import { Clapperboard, ListChecks } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { useLiveRunClock } from "@/hooks/account-asset-run/useLiveRunClock";
import { formatHealthTimestamp } from "@/lib/account-health/formatHealthTimestamp";
import { formatDurationMs } from "@/lib/account-health/globalRunAnalytics";
import { getAccountAssetRunDetailHref } from "@/lib/account-asset-run/accountRoutes";
import {
  assetRunStatusBadgeClass,
  isAssetRunActive,
} from "@/lib/account-asset-run/displayRules";
import {
  getAccountOverviewHref,
  normalizeAccountOrgType,
} from "@/lib/account-asset-run/renderActivityParams";
import { parseRunKeyStartedAt } from "@/lib/account-asset-run/globalRunAnalytics";
import type { AccountAssetRunRenderActivityRow } from "@/types/accountAssetRun";
import { cn } from "@/lib/utils";

function accountDisplayName(row: AccountAssetRunRenderActivityRow): string {
  const name = row.account.name?.trim();
  return name || `Account ${row.account.id}`;
}

function resolveDurationMs(
  row: AccountAssetRunRenderActivityRow,
  nowMs: number
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

interface RenderActivityCompactListProps {
  rows: AccountAssetRunRenderActivityRow[];
  showAccountColumn?: boolean;
  limit?: number;
}

export function RenderActivityCompactList({
  rows,
  showAccountColumn = true,
  limit = 8,
}: RenderActivityCompactListProps) {
  const hasActive = rows.some((row) => isAssetRunActive(row.run.status));
  const nowMs = useLiveRunClock(hasActive);
  const visible = rows.slice(0, limit);

  if (visible.length === 0) {
    return (
      <EmptyState
        variant="minimal"
        title="No render activity"
        description="Runs will appear here for the selected window and filters."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-slate-200">
      {visible.map((row) => {
        const accountType = normalizeAccountOrgType(row.account.type);
        const accountHref = getAccountOverviewHref(row.account.id, accountType);
        const durationMs = resolveDurationMs(row, nowMs);
        const durationLabel =
          durationMs != null
            ? `${formatDurationMs(durationMs)}${
                isAssetRunActive(row.run.status) ? " (running)" : ""
              }`
            : "—";
        const totalItems = row.render?.counts.totalItems;

        return (
          <div
            key={row.run.id}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-slate-200 px-3 py-2.5 text-sm last:border-b-0"
          >
            <div className="rounded-md bg-indigo-50 p-1.5 text-indigo-700">
              <Clapperboard className="h-3.5 w-3.5" />
            </div>

            <div className="min-w-0">
              {showAccountColumn && accountHref ? (
                <Link
                  href={accountHref}
                  className="truncate font-medium text-slate-800 hover:text-primary hover:underline"
                >
                  {accountDisplayName(row)}
                </Link>
              ) : (
                <div className="truncate font-medium text-slate-800">
                  {accountDisplayName(row)}
                </div>
              )}
              <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                <span>Run #{row.run.id}</span>
                <span className="text-muted-foreground/60">·</span>
                <span>{formatHealthTimestamp(row.run.startedAt)}</span>
                <span className="text-muted-foreground/60">·</span>
                <span>{durationLabel}</span>
                {totalItems != null ? (
                  <>
                    <span className="text-muted-foreground/60">·</span>
                    <span>{totalItems} items</span>
                  </>
                ) : null}
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <Badge
                variant="outline"
                className={cn(
                  "capitalize",
                  assetRunStatusBadgeClass(row.run.status)
                )}
              >
                {row.run.status}
              </Badge>
              <Link
                href={getAccountAssetRunDetailHref(
                  row.run.id,
                  row.account.id,
                  accountType
                )}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <ListChecks className="h-3 w-3" />
                Open run
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
