"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { DataRefreshAttentionPanel } from "@/app/dashboard/components/account-health/DataRefreshAttentionPanel";
import { StuckRenderingAttentionList } from "@/app/dashboard/components/live-snapshot/StuckRenderingAttentionList";
import { LIVE_OVERVIEW_REFETCH_MS } from "@/app/dashboard/components/live-snapshot/liveOverviewConfig";
import { DashboardLinkButton } from "@/app/dashboard/components/live-snapshot/DashboardLinkButton";
import { OverviewRecordPanel } from "@/app/dashboard/components/live-snapshot/OverviewRecordPanel";
import { useAccountHealthGlobalStatus } from "@/hooks/account-health/useAccountHealthGlobalStatus";
import { useDataRefreshAttentionState } from "@/hooks/account-health/useDataRefreshAttentionState";
import { useGetTodaysRenders } from "@/hooks/scheduler/useGetTodaysRenders";
import {
  getStuckRenderingAttention,
  STUCK_RENDERING_POLICY_DESCRIPTION,
} from "@/lib/scheduler/renderAttention";

function AttentionSubheading({
  title,
  detail,
}: {
  title: string;
  detail: string;
}) {
  return (
    <div className="space-y-0.5">
      <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
      <p className="text-xs text-muted-foreground">{detail}</p>
    </div>
  );
}

interface FleetAttentionSectionProps {
  /** Show reconcile/abort on sync rows (accounts hub). */
  showSyncOperatorActions?: boolean;
}

/**
 * Combined fleet attention: render pipeline + season data sync.
 */
export function FleetAttentionSection({
  showSyncOperatorActions = false,
}: FleetAttentionSectionProps) {
  const {
    data: todaysRenders,
    isLoading: rendersLoading,
    isError: rendersError,
    error: rendersQueryError,
    refetch: refetchRenders,
  } = useGetTodaysRenders({ refetchInterval: LIVE_OVERVIEW_REFETCH_MS });

  const {
    data: healthGlobal,
    isLoading: healthLoading,
    isError: healthError,
    error: healthQueryError,
    refetch: refetchHealth,
  } = useAccountHealthGlobalStatus();

  const stuckItems = useMemo(
    () => getStuckRenderingAttention(todaysRenders ?? []),
    [todaysRenders]
  );

  const activeSyncCount = healthGlobal?.data?.activeCount ?? 0;
  const { policyRuns, hiddenActiveCount } = useDataRefreshAttentionState(
    healthGlobal?.data?.latestRuns,
    activeSyncCount
  );

  const hasSyncAttention = policyRuns.length > 0 || hiddenActiveCount > 0;
  const hasRenderAttention = stuckItems.length > 0;
  const hasAnyAttention = hasRenderAttention || hasSyncAttention;

  const syncBadgeLabel = (() => {
    if (!hasSyncAttention) return null;
    const plural = policyRuns.length === 1 ? "" : "s";
    const hidden =
      hiddenActiveCount > 0 ? ` (+${hiddenActiveCount} hidden)` : "";
    return `${policyRuns.length} sync issue${plural}${hidden}`;
  })();

  const attentionBadgeParts = [
    hasRenderAttention
      ? `${stuckItems.length} stuck render${stuckItems.length === 1 ? "" : "s"}`
      : null,
    syncBadgeLabel,
  ].filter((part): part is string => part != null);

  const summaryBadge = hasAnyAttention ? (
    <Badge variant="outline" className="border-amber-300 bg-amber-50">
      {attentionBadgeParts.join(" · ")}
    </Badge>
  ) : (
    <Badge variant="outline" className="border-emerald-200 bg-emerald-50">
      All clear
    </Badge>
  );

  const syncPanel = (
    <DataRefreshAttentionPanel
      runs={policyRuns}
      activeCount={activeSyncCount}
      hiddenActiveCount={hiddenActiveCount}
      isLoading={healthLoading}
      error={
        healthError
          ? healthQueryError instanceof Error
            ? healthQueryError
            : new Error(String(healthQueryError))
          : null
      }
      onRetry={() => refetchHealth()}
      embedded
      layout="rows"
      showOperatorActions={showSyncOperatorActions}
    />
  );

  return (
    <OverviewRecordPanel
      title="Fleet operations - needs attention"
      description="Render pipeline and season data sync are separate. An account can be stuck rendering while sync is healthy."
      badge={summaryBadge}
      action={
        <div className="flex flex-wrap gap-2">
          <DashboardLinkButton
            href="/dashboard/accounts?tab=operations"
            trailingIcon="external"
          >
            Accounts hub
          </DashboardLinkButton>
          <DashboardLinkButton href="/dashboard?tab=collection" trailingIcon="external">
            Data Collection
          </DashboardLinkButton>
        </div>
      }
    >
      <div className="space-y-8">
        <section className="space-y-3">
          <AttentionSubheading
            title="Stuck rendering"
            detail={STUCK_RENDERING_POLICY_DESCRIPTION}
          />
          {rendersLoading || rendersError ? (
            <StuckRenderingAttentionList
              items={stuckItems}
              isLoading={rendersLoading}
              error={
                rendersError
                  ? rendersQueryError instanceof Error
                    ? rendersQueryError
                    : new Error(String(rendersQueryError))
                  : null
              }
              onRetry={() => refetchRenders()}
            />
          ) : hasRenderAttention ? (
            <StuckRenderingAttentionList
              items={stuckItems}
              isLoading={false}
              error={null}
            />
          ) : (
            <EmptyState
              variant="minimal"
              title="No stuck renders in scheduler window"
              description="Nothing processing longer than 30 minutes in the current today-schedulers payload."
              className="py-3"
            />
          )}
        </section>

        <div className="border-t border-slate-200" />

        <section className="space-y-3">
          <AttentionSubheading
            title="Account sync (season data refresh)"
            detail="Runs 20m+, stuck 2h+, or completed without finalize - not the same as render processing above."
          />
          {healthLoading || healthError || hasSyncAttention
            ? syncPanel
            : (
              <EmptyState
                variant="minimal"
                title="No account sync issues"
                description={
                  hasRenderAttention
                    ? "Season data sync is clear for the recent window. Use Stuck rendering above for scheduler/render issues."
                    : "Nothing slow, stuck, or waiting to finalize in the recent account-health window."
                }
                className="py-3"
              />
            )}
        </section>
      </div>
    </OverviewRecordPanel>
  );
}
