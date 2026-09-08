"use client";

import { AlertTriangle, ExternalLink } from "lucide-react";
import { OverviewRecordPanel } from "@/app/dashboard/components/live-snapshot/OverviewRecordPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { blockingItemHeadline } from "@/lib/account-health/displayRules";
import { getAccountHealthScopeLabel } from "@/lib/account-health/scopeLabels";
import { cn } from "@/lib/utils";
import type { AccountHealthItem } from "@/types/accountHealth";
import { FixtureDiscoveryDetails } from "./AccountHealthFixtureDiscovery";
import {
  healthRunActionButtonClass,
  healthRunBlockingFailedStyles,
  healthRunBlockingInProgressStyles,
  healthRunItemStatusBadgeClass,
} from "./healthRunPageStyles";

function blockingCardStyles(item: AccountHealthItem) {
  if (item.status === "failed") {
    return healthRunBlockingFailedStyles;
  }
  return healthRunBlockingInProgressStyles;
}

export function AccountHealthRunBlockingCard({
  item,
  runFailed,
  itemStrapiBase,
}: {
  item: AccountHealthItem;
  runFailed: boolean;
  itemStrapiBase: string;
}) {
  const headline = blockingItemHeadline(item);
  if (!headline) return null;

  const scopeLabel = getAccountHealthScopeLabel(item.scope);
  const styles = blockingCardStyles(item);

  const statusDetail =
    item.status === "failed"
      ? item.failureReason ?? "Failed"
      : item.status === "pending" ||
          item.status === "queued" ||
          item.status === "running"
        ? "In progress"
        : item.status;

  const hasFixtureProgress =
    item.fixtureDiscovery != null &&
    item.fixtureDiscovery.expectedTerminalCount > 0;

  return (
    <OverviewRecordPanel
      title="Current blocker"
      description="Workflow step holding up completion of this run"
      badge={
        <Badge
          variant="outline"
          className={cn("capitalize", healthRunItemStatusBadgeClass(item.status))}
        >
          {item.status}
        </Badge>
      }
      action={
        itemStrapiBase ? (
          <Button
            variant="secondary"
            size="sm"
            className={healthRunActionButtonClass}
            asChild
          >
            <a
              href={`${itemStrapiBase}${item.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Strapi
              <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
            </a>
          </Button>
        ) : null
      }
      className="mb-6"
    >
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
              <p className="text-base font-semibold text-slate-900">
                {scopeLabel}
              </p>
              <p className="text-sm text-muted-foreground">
                {statusDetail}
                <span className="text-slate-400"> · </span>
                Step {item.stepIndex}
                <span className="text-slate-400"> · </span>
                {item.targetType} #{item.targetId}
              </p>
            </div>
          </div>
        </div>

        {hasFixtureProgress && (
          <div className="border-t p-4">
            <FixtureDiscoveryDetails
              item={item}
              runFailed={runFailed}
              itemStrapiBase={itemStrapiBase}
            />
          </div>
        )}

        {!hasFixtureProgress && item.failureReason && (
          <div className="border-t border-brandError-100 px-4 py-3 text-sm text-brandError-900">
            {item.failureReason}
          </div>
        )}
      </div>
    </OverviewRecordPanel>
  );
}
