"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { getAssetRunStepIndex } from "@/lib/account-asset-run/displayRules";
import {
  buildAssetRunStepTimings,
  formatAssetRunStepDuration,
  formatAssetRunStepEnd,
  formatAssetRunStepStart,
} from "@/lib/account-asset-run/duration";
import { getAccountAssetRunScopeLabel } from "@/lib/account-asset-run/scopeLabels";
import {
  buildAssetRunDisplaySteps,
  formatGlobalV22GuardReason,
} from "@/lib/account-asset-run/globalV22Guard";
import Link from "next/link";
import {
  getAccountAssetRunDetailHref,
  type AccountAssetRunAccountOrgType,
} from "@/lib/account-asset-run/accountRoutes";
import type { GlobalV22GuardBlocked } from "@/types/accountAssetRun";
import { cn } from "@/lib/utils";
import type {
  AccountAssetRunDetail,
  AccountAssetRunItem,
} from "@/types/accountAssetRun";
import type { ResolvedAssetRunStepTiming } from "@/lib/account-asset-run/itemTiming";
import {
  assetRunItemStatusBadgeClass,
  assetRunStepIndexClass,
  assetRunTableHeaderClass,
  assetRunTableRowHoverClass,
} from "./assetRunPageStyles";

function formatResultSummary(summary: Record<string, unknown> | null): string | null {
  if (!summary || Object.keys(summary).length === 0) return null;
  try {
    return JSON.stringify(summary, null, 2);
  } catch {
    return String(summary);
  }
}

interface AccountAssetRunStepsTableProps {
  items: AccountAssetRunItem[];
  summary?: Record<string, unknown> | null;
  accountId?: number;
  accountType?: AccountAssetRunAccountOrgType | null;
  /** Full detail table vs compact panel preview */
  variant?: "full" | "compact";
  maxCompactRows?: number;
  run?: Pick<
    AccountAssetRunDetail,
    "startedAt" | "completedAt" | "failedAt" | "status"
  > | null;
  isLive?: boolean;
  nowMs?: number;
}

export function AccountAssetRunStepsTable({
  items,
  summary = null,
  accountId,
  accountType = null,
  variant = "full",
  maxCompactRows = 6,
  run = null,
  isLive = false,
  nowMs,
}: AccountAssetRunStepsTableProps) {
  const compact = variant === "compact";

  const displaySteps = useMemo(
    () => buildAssetRunDisplaySteps(items, summary),
    [items, summary]
  );

  const displayStepsForTable = compact
    ? displaySteps.slice(0, maxCompactRows)
    : displaySteps;

  const stepTimings = useMemo(() => {
    if (!run) return new Map();
    return buildAssetRunStepTimings(items, run, { isLive, nowMs });
  }, [items, run, isLive, nowMs]);

  const hasInferredTimings = useMemo(
    () => [...stepTimings.values()].some((timing) => timing.inferred),
    [stepTimings],
  );

  const table = (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className={assetRunTableHeaderClass}>
            <TableHead className="font-semibold text-brandPrimary-900">Step</TableHead>
            {!compact && (
              <TableHead className="whitespace-nowrap font-semibold text-brandPrimary-900">
                Start
              </TableHead>
            )}
            {!compact && (
              <TableHead className="whitespace-nowrap font-semibold text-brandPrimary-900">
                End
              </TableHead>
            )}
            <TableHead className="whitespace-nowrap font-semibold text-brandPrimary-900">
              Time taken
            </TableHead>
            {!compact && (
              <TableHead className="font-semibold text-brandPrimary-900">Target</TableHead>
            )}
            <TableHead className="font-semibold text-brandPrimary-900">
              Status
            </TableHead>
            {!compact && (
              <TableHead className="max-w-[200px] font-semibold text-brandPrimary-900">
                Details
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayStepsForTable.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={compact ? 3 : 7}
                className="text-muted-foreground"
              >
                {compact
                  ? "No step items yet."
                  : "No tracked items returned yet — keep this page open; the CMS may still be materializing the run envelope."}
              </TableCell>
            </TableRow>
          ) : (
            displayStepsForTable.map((step) =>
              step.kind === "item" ? (
                <AccountAssetRunStepRow
                  key={step.item.id}
                  item={step.item}
                  compact={compact}
                  timing={stepTimings.get(step.item.id)}
                />
              ) : (
                <AccountAssetRunGuardBlockedStepRow
                  key={`guard-blocked-${step.guard.blockingRunId}`}
                  guard={step.guard}
                  compact={compact}
                  accountId={accountId}
                  accountType={accountType}
                />
              )
            )
          )}
        </TableBody>
      </Table>
      {!compact && hasInferredTimings && (
        <p className="mt-2 text-xs text-muted-foreground">
          Step times marked inferred are estimated from run boundaries when the CMS
          has not returned per-step timestamps yet.
        </p>
      )}
    </div>
  );

  if (compact) {
    return table;
  }

  return (
    <SectionContainer
      title="Steps"
      description="Asset orchestration workflow sequence for this run"
      variant="compact"
    >
      {table}
    </SectionContainer>
  );
}

function AccountAssetRunStepRow({
  item,
  compact,
  timing,
}: {
  item: AccountAssetRunItem;
  compact: boolean;
  timing?: ResolvedAssetRunStepTiming;
}) {
  const [showSummary, setShowSummary] = useState(false);
  const scopeLabel = getAccountAssetRunScopeLabel(item.scope);
  const stepIndex = getAssetRunStepIndex(item.scope);
  const summaryText = formatResultSummary(item.resultSummary);

  return (
    <TableRow className={assetRunTableRowHoverClass}>
      <TableCell className="py-3 align-top">
        <div className="flex items-start gap-3">
          {stepIndex > 0 && (
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border text-sm font-semibold tabular-nums",
                assetRunStepIndexClass(item.scope, item.status),
              )}
            >
              {stepIndex}
            </div>
          )}
          <div className="min-w-0">
            <div className="text-sm font-medium text-slate-900">{scopeLabel}</div>
            {!compact && item.bullJobId && (
              <div
                className="mt-1 max-w-[280px] truncate font-mono text-[11px] text-muted-foreground"
                title={item.bullJobId}
              >
                Bull: {item.bullJobId}
              </div>
            )}
          </div>
        </div>
      </TableCell>

      {!compact && (
        <TableCell className="whitespace-nowrap py-3 align-top text-sm tabular-nums text-slate-900">
          {formatAssetRunStepStart(timing)}
          {timing?.inferred && timing.startLabel !== "—" && (
            <span className="ml-1 text-[10px] text-muted-foreground">(est.)</span>
          )}
        </TableCell>
      )}

      {!compact && (
        <TableCell className="whitespace-nowrap py-3 align-top text-sm tabular-nums text-slate-900">
          {formatAssetRunStepEnd(timing)}
          {timing?.inferred && timing.endLabel !== "—" && timing.endLabel !== "In progress" && (
            <span className="ml-1 text-[10px] text-muted-foreground">(est.)</span>
          )}
        </TableCell>
      )}

      <TableCell className="whitespace-nowrap py-3 align-top text-sm font-medium tabular-nums text-slate-900">
        {formatAssetRunStepDuration(timing)}
        {timing?.inferred && timing.durationLabel !== "—" && (
          <span className="ml-1 text-[10px] font-normal text-muted-foreground">
            (est.)
          </span>
        )}
      </TableCell>

      {!compact && (
        <TableCell className="py-3 align-top text-sm whitespace-nowrap text-slate-900">
          {item.targetType ?? "—"}
          {item.targetId != null ? ` · #${item.targetId}` : ""}
        </TableCell>
      )}

      <TableCell className="py-3 align-top">
        <div className="flex flex-col items-start gap-2">
          <Badge
            variant="outline"
            className={cn("capitalize", assetRunItemStatusBadgeClass(item.status))}
          >
            {item.status}
          </Badge>
          {item.failureReason && (
            <p className="max-w-[320px] text-xs text-brandError-800">
              {item.failureReason}
            </p>
          )}
        </div>
      </TableCell>

      {!compact && (
        <TableCell className="max-w-[320px] py-3 align-top text-sm">
          {summaryText ? (
            <div>
              <button
                type="button"
                className="text-xs text-brandSecondary-700 underline underline-offset-2 hover:text-brandSecondary-900"
                onClick={() => setShowSummary((v) => !v)}
              >
                {showSummary ? "Hide" : "Show"} result summary
              </button>
              {showSummary && (
                <pre className="mt-2 max-h-40 overflow-auto rounded border border-brandInfo-200 bg-brandInfo-50 p-2 font-mono text-[10px] text-brandPrimary-800">
                  {summaryText}
                </pre>
              )}
            </div>
          ) : (
            <span className="text-muted-foreground">—</span>
          )}
        </TableCell>
      )}
    </TableRow>
  );
}

function AccountAssetRunGuardBlockedStepRow({
  guard,
  compact,
  accountId,
  accountType,
}: {
  guard: GlobalV22GuardBlocked;
  compact: boolean;
  accountId?: number;
  accountType?: AccountAssetRunAccountOrgType | null;
}) {
  const scopeLabel = getAccountAssetRunScopeLabel("result_batch_scrape");
  const stepIndex = getAssetRunStepIndex("result_batch_scrape");
  const reasonLabel = formatGlobalV22GuardReason(guard.reason);
  const blockingHref =
    accountId != null && accountId > 0
      ? getAccountAssetRunDetailHref(
          guard.blockingRunId,
          accountId,
          accountType ?? undefined
        )
      : null;

  return (
    <TableRow className={cn(assetRunTableRowHoverClass, "bg-brandWarning-50/40")}>
      <TableCell className="py-3 align-top">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border text-sm font-semibold tabular-nums",
              "border-brandWarning-300 bg-brandWarning-100 text-brandWarning-900",
            )}
          >
            {stepIndex}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-slate-900">{scopeLabel}</div>
            {!compact && (
              <p className="mt-1 text-xs text-brandWarning-900">
                Skipped — global v2.2 guard
              </p>
            )}
          </div>
        </div>
      </TableCell>

      {!compact && (
        <TableCell className="whitespace-nowrap py-3 align-top text-sm text-muted-foreground">
          —
        </TableCell>
      )}

      {!compact && (
        <TableCell className="whitespace-nowrap py-3 align-top text-sm text-muted-foreground">
          —
        </TableCell>
      )}

      <TableCell className="whitespace-nowrap py-3 align-top text-sm text-muted-foreground">
        —
      </TableCell>

      {!compact && (
        <TableCell className="py-3 align-top text-sm text-muted-foreground">—</TableCell>
      )}

      <TableCell className="py-3 align-top">
        <Badge
          variant="outline"
          className={cn("capitalize", assetRunItemStatusBadgeClass("guard_blocked"))}
        >
          Blocked (guard)
        </Badge>
      </TableCell>

      {!compact && (
        <TableCell className="max-w-[320px] py-3 align-top text-sm">
          <p className="text-xs text-brandWarning-950">{reasonLabel}</p>
          {blockingHref ? (
            <Link
              href={blockingHref}
              className="mt-1 inline-block text-xs font-medium text-brandSecondary-800 underline underline-offset-2"
            >
              Blocking run #{guard.blockingRunId}
            </Link>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">
              Blocking run #{guard.blockingRunId}
            </p>
          )}
        </TableCell>
      )}
    </TableRow>
  );
}
