"use client";

import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  assetRunBlockingItemHeadline,
  getAssetRunStepIndex,
} from "@/lib/account-asset-run/displayRules";
import { getAccountAssetRunScopeLabel } from "@/lib/account-asset-run/scopeLabels";
import { cn } from "@/lib/utils";
import type { AccountAssetRunItem } from "@/types/accountAssetRun";
import {
  assetRunBlockingFailedStyles,
  assetRunBlockingInProgressStyles,
  assetRunItemStatusBadgeClass,
  assetRunSectionTitleClass,
} from "./assetRunPageStyles";

function blockingCardStyles(item: AccountAssetRunItem) {
  if (item.status === "failed") {
    return assetRunBlockingFailedStyles;
  }
  return assetRunBlockingInProgressStyles;
}

export function AccountAssetRunBlockingCard({ item }: { item: AccountAssetRunItem }) {
  const headline = assetRunBlockingItemHeadline(item);
  if (!headline) return null;

  const scopeLabel = getAccountAssetRunScopeLabel(item.scope);
  const styles = blockingCardStyles(item);
  const stepIndex = getAssetRunStepIndex(item.scope);

  const statusDetail =
    item.status === "failed"
      ? item.failureReason ?? "Failed"
      : item.status === "pending" ||
          item.status === "queued" ||
          item.status === "running"
        ? "In progress"
        : item.status;

  const targetLine =
    item.targetType != null || item.targetId != null
      ? `${item.targetType ?? "target"}${item.targetId != null ? ` #${item.targetId}` : ""}`
      : null;

  return (
    <div className="mb-6 space-y-3">
      <div className="flex items-center gap-2">
        <span
          className="h-4 w-1 shrink-0 rounded-full bg-brandWarning-500"
          aria-hidden
        />
        <div>
          <h2 className={assetRunSectionTitleClass}>Current blocker</h2>
          <p className="text-xs text-muted-foreground">
            Workflow step holding up completion of this run
          </p>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden rounded-md border bg-white",
          styles.border,
        )}
      >
        <div
          className={cn(
            "flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-start sm:justify-between",
            styles.header,
          )}
        >
          <div className="flex min-w-0 gap-3">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-md border",
                styles.icon,
              )}
            >
              <AlertTriangle
                className={cn("h-5 w-5", styles.iconGlyph)}
                aria-hidden
              />
            </div>
            <div className="min-w-0 space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Blocking step
              </p>
              <p className="text-base font-semibold text-slate-900">{scopeLabel}</p>
              <p className="text-sm text-muted-foreground">
                {statusDetail}
                {stepIndex > 0 && (
                  <>
                    <span className="text-slate-400"> · </span>
                    Step {stepIndex}
                  </>
                )}
                {targetLine && (
                  <>
                    <span className="text-slate-400"> · </span>
                    {targetLine}
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
            <Badge
              variant="outline"
              className={cn("capitalize", assetRunItemStatusBadgeClass(item.status))}
            >
              {item.status}
            </Badge>
          </div>
        </div>

        {item.failureReason && item.status !== "failed" && (
          <div className="border-t border-brandError-100 px-4 py-3 text-sm text-brandError-900">
            {item.failureReason}
          </div>
        )}
      </div>
    </div>
  );
}
