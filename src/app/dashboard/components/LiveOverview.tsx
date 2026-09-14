"use client";

import { useMemo } from "react";
import { PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import LoadingState from "@/components/ui-library/states/LoadingState";
import { useAccountSummaryQuery } from "@/hooks/accounts/useAccountSummaryQuery";
import { useAccountsQuery } from "@/hooks/accounts/useAccountsQuery";
import { useGetTodaysRenders } from "@/hooks/scheduler/useGetTodaysRenders";
import { useRerenderRequestsData } from "@/hooks/rerender-request/useRerenderRequests";
import { useContactFormSubmissionsData } from "@/hooks/contact-form/useContactFormSubmissions";
import { useNotificationHealth } from "@/hooks/data-collection/useNotificationHealth";
import { useRenderTelemetry } from "@/hooks/renders/useRenderTelemetry";
import { TodaysRenders } from "@/types/scheduler";
import { OverviewDataWorkspace } from "./live-snapshot/OverviewDataWorkspace";
import { OverviewRecordPanel } from "./live-snapshot/OverviewRecordPanel";
import { LIVE_OVERVIEW_REFETCH_MS } from "./live-snapshot/liveOverviewConfig";
import { useAccountHealthGlobalStatus } from "@/hooks/account-health/useAccountHealthGlobalStatus";
import { useDataRefreshAttentionState } from "@/hooks/account-health/useDataRefreshAttentionState";
import { formatDataSyncAttentionMeta } from "@/lib/account-health/globalRunAnalytics";
import { DataRefreshAttentionPanel } from "./account-health/DataRefreshAttentionPanel";
import { useLiveOverviewRefreshToast } from "./live-snapshot/useLiveOverviewRefreshToast";
import { DashboardLinkButton } from "./live-snapshot/DashboardLinkButton";
import { StuckRenderingAttentionList } from "./live-snapshot/StuckRenderingAttentionList";
import { RerenderRequestAttentionList } from "./live-snapshot/RerenderRequestAttentionList";
import { ContactFormAttentionList } from "./live-snapshot/ContactFormAttentionList";
import { NotificationHealthAttentionSummary } from "./live-snapshot/NotificationHealthAttentionSummary";
import { AccountFleetOverviewCards } from "./live-snapshot/AccountFleetOverviewCards";
import {
  getStuckRenderingAttention,
  STUCK_RENDERING_POLICY_DESCRIPTION,
} from "@/lib/scheduler/renderAttention";
import { buildAccountFleetOverview, buildAccountLookupMap } from "@/lib/overview/accountFleetSummary";
import {
  countContactFormActionQueue,
  countUnhandledRerenderRequests,
  countUnseenContactSubmissions,
  countVisibleOverviewPanels,
  formatRenderSystemStatus,
  getContactFormActionQueue,
  getUnhandledRerenderRequests,
  overviewAttentionGridClass,
  summarizeNotificationHealthAttention,
} from "@/lib/overview/overviewActionQueues";
import type { WorkspaceMetricTile } from "./live-snapshot/OverviewDataWorkspace";

const UNAVAILABLE = "—";
const UNAVAILABLE_META = "Unavailable";

function getRenderingCount(data: TodaysRenders[]) {
  return data?.filter((item) => item.isRendering).length || 0;
}

function getQueuedCount(data: TodaysRenders[]) {
  return data?.filter((item) => item.queued).length || 0;
}

function getCompletedTodayCount(data: TodaysRenders[]) {
  return data?.filter((item) => item.render?.complete).length || 0;
}

function getScheduledTodayCount(data: TodaysRenders[]) {
  return data?.length || 0;
}

/**
 * Dashboard overview — live ops pulse and action queues.
 */
export default function LiveOverview() {
  const {
    data: todaysRenders,
    isLoading: rendersLoading,
    isError: rendersError,
    isFetching: rendersFetching,
    error: rendersQueryError,
    refetch: refetchRenders,
  } = useGetTodaysRenders({ refetchInterval: LIVE_OVERVIEW_REFETCH_MS });

  const {
    data: accountSummary,
    isLoading: accountsLoading,
    isError: accountsError,
    error: accountsQueryError,
    refetch: refetchAccounts,
    isFetching: accountsFetching,
  } = useAccountSummaryQuery({ refetchInterval: LIVE_OVERVIEW_REFETCH_MS });

  const {
    data: accountsLookup,
    isFetching: accountsLookupFetching,
  } = useAccountsQuery();

  const {
    data: healthGlobal,
    isLoading: healthLoading,
    isError: healthError,
    error: healthQueryError,
    refetch: refetchHealth,
    isFetching: healthFetching,
  } = useAccountHealthGlobalStatus();

  const {
    data: rerenderRequests,
    isLoading: rerenderLoading,
    isError: rerenderError,
    error: rerenderQueryError,
    refetch: refetchRerender,
    isFetching: rerenderFetching,
  } = useRerenderRequestsData();

  const {
    data: contactSubmissions,
    isLoading: contactLoading,
    isError: contactError,
    error: contactQueryError,
    refetch: refetchContact,
    isFetching: contactFetching,
  } = useContactFormSubmissionsData();

  const {
    data: notificationHealth,
    isLoading: notificationLoading,
    isError: notificationError,
    error: notificationQueryError,
    refetch: refetchNotification,
    isFetching: notificationFetching,
  } = useNotificationHealth({
    params: { mode: "preset", days: 7 },
  });

  const {
    data: renderTelemetry,
    isLoading: telemetryLoading,
    isError: telemetryError,
    isFetching: telemetryFetching,
  } = useRenderTelemetry();

  const activeSyncCount = healthGlobal?.data?.activeCount ?? 0;
  const {
    policyRuns: attentionRuns,
    hiddenActiveCount: hiddenActiveSyncCount,
  } = useDataRefreshAttentionState(
    healthGlobal?.data?.latestRuns,
    activeSyncCount
  );

  const stuckRenderingItems = useMemo(
    () => getStuckRenderingAttention(todaysRenders ?? []),
    [todaysRenders]
  );

  const unhandledRerenderItems = useMemo(
    () => getUnhandledRerenderRequests(rerenderRequests),
    [rerenderRequests]
  );

  const contactActionItems = useMemo(
    () => getContactFormActionQueue(contactSubmissions),
    [contactSubmissions]
  );

  const notificationAttention = useMemo(
    () => summarizeNotificationHealthAttention(notificationHealth),
    [notificationHealth]
  );

  const accountLookupById = useMemo(() => {
    if (!accountsLookup) {
      return new Map();
    }

    return buildAccountLookupMap([
      ...accountsLookup.clubs.active,
      ...accountsLookup.clubs.inactive,
      ...accountsLookup.associations.active,
      ...accountsLookup.associations.inactive,
      ...accountsLookup.undefined.active,
      ...accountsLookup.undefined.inactive,
    ]);
  }, [accountsLookup]);

  const accountFleetOverview = useMemo(
    () =>
      buildAccountFleetOverview(accountSummary?.data?.Totals, {
        lookupById: accountLookupById,
      }),
    [accountSummary?.data?.Totals, accountLookupById]
  );

  const stuckRenderingCount = stuckRenderingItems.length;
  const unhandledRerenderCount = countUnhandledRerenderRequests(rerenderRequests);
  const contactActionCount = countContactFormActionQueue(contactSubmissions);
  const unseenContactCount = countUnseenContactSubmissions(contactSubmissions);

  const errorSyncCount = attentionRuns.filter(
    (run) => run.severity === "error"
  ).length;
  const issueSyncCount = attentionRuns.filter(
    (run) => run.severity === "issue"
  ).length;

  const isRefreshing =
    (rendersFetching && !rendersLoading) ||
    (accountsFetching && !accountsLoading) ||
    (accountsLookupFetching && !accountsLoading) ||
    (healthFetching && !healthLoading) ||
    (rerenderFetching && !rerenderLoading) ||
    (contactFetching && !contactLoading) ||
    (notificationFetching && !notificationLoading) ||
    (telemetryFetching && !telemetryLoading);

  useLiveOverviewRefreshToast(isRefreshing);

  const operationsMetrics = useMemo((): WorkspaceMetricTile[] => {
    const scheduledToday = getScheduledTodayCount(todaysRenders ?? []);
    const completedToday = getCompletedTodayCount(todaysRenders ?? []);
    const telemetry = renderTelemetry;

    return [
      {
        id: "rendering",
        label: "Rendering",
        value: rendersError
          ? UNAVAILABLE
          : String(getRenderingCount(todaysRenders ?? [])),
        meta: rendersError
          ? UNAVAILABLE_META
          : stuckRenderingCount > 0
            ? `${stuckRenderingCount} stuck · active today`
            : "Active today",
        isLoading: rendersLoading,
      },
      {
        id: "queued",
        label: "Queued",
        value: rendersError
          ? UNAVAILABLE
          : String(getQueuedCount(todaysRenders ?? [])),
        meta: rendersError ? UNAVAILABLE_META : "Waiting today",
        isLoading: rendersLoading,
      },
      {
        id: "completed",
        label: "Completed",
        value: rendersError ? UNAVAILABLE : String(completedToday),
        meta: rendersError
          ? UNAVAILABLE_META
          : `${scheduledToday} scheduled today`,
        isLoading: rendersLoading,
      },
      {
        id: "data-sync",
        label: "Data sync",
        value: healthError ? UNAVAILABLE : String(activeSyncCount),
        meta: healthError
          ? UNAVAILABLE_META
          : formatDataSyncAttentionMeta({
              errorCount: errorSyncCount,
              issueCount: issueSyncCount,
              policyRunCount: attentionRuns.length,
              activeCount: activeSyncCount,
              hiddenActiveCount: hiddenActiveSyncCount,
            }),
        metaTone:
          healthError || healthLoading
            ? "default"
            : hiddenActiveSyncCount > 0 || errorSyncCount > 0
              ? "critical"
              : issueSyncCount > 0 || attentionRuns.length > 0
                ? "warning"
                : activeSyncCount > 0
                  ? "warning"
                  : "default",
        isLoading: healthLoading,
      },
      {
        id: "render-health",
        label: "Render health",
        value: telemetryError
          ? UNAVAILABLE
          : telemetry
            ? formatRenderSystemStatus(telemetry.systemStatus)
            : UNAVAILABLE,
        meta: telemetryError
          ? UNAVAILABLE_META
          : telemetry
            ? `${telemetry.successRate24h.toFixed(1)}% success · 24h`
            : "Telemetry unavailable",
        isLoading: telemetryLoading,
      },
      {
        id: "failed-today",
        label: "Failed today",
        value: telemetryError
          ? UNAVAILABLE
          : telemetry
            ? String(telemetry.failedToday)
            : UNAVAILABLE,
        meta: telemetryError
          ? UNAVAILABLE_META
          : telemetry
            ? `${telemetry.activeCount} active now`
            : "Telemetry unavailable",
        isLoading: telemetryLoading,
      },
    ];
  }, [
    activeSyncCount,
    attentionRuns.length,
    errorSyncCount,
    healthError,
    healthLoading,
    hiddenActiveSyncCount,
    issueSyncCount,
    renderTelemetry,
    rendersError,
    rendersLoading,
    stuckRenderingCount,
    telemetryError,
    telemetryLoading,
    todaysRenders,
  ]);

  const initialLoad = rendersLoading;

  if (initialLoad) {
    return (
      <LoadingState
        variant="minimal"
        message="Loading overview…"
        className="py-6"
      />
    );
  }

  const showStuckRenderingSection =
    rendersLoading || rendersError || stuckRenderingItems.length > 0;

  const showAttentionSection =
    healthLoading ||
    healthError ||
    attentionRuns.length > 0 ||
    hiddenActiveSyncCount > 0;

  const showRerenderSection =
    rerenderLoading ||
    rerenderError ||
    unhandledRerenderItems.length > 0;

  const showContactSection =
    contactLoading || contactError || contactActionItems.length > 0;

  const showNotificationSection =
    notificationLoading ||
    notificationError ||
    notificationAttention.hasAttention;

  const attentionSummaryParts = [
    errorSyncCount > 0 ? `${errorSyncCount} error` : null,
    issueSyncCount > 0 ? `${issueSyncCount} issue` : null,
  ].filter(Boolean);

  const overviewPanelCount = countVisibleOverviewPanels([
    showStuckRenderingSection,
    showAttentionSection,
    showRerenderSection,
    showContactSection,
    showNotificationSection,
  ]);

  return (
    <div className="space-y-6">
      <OverviewDataWorkspace
        title="Today's operations"
        description="Render queue, fleet health, and data sync across the fleet"
        icon={PlayCircle}
        badge={<Badge variant="secondary">Live</Badge>}
        metrics={operationsMetrics}
        columns={3}
        action={
          <DashboardLinkButton
            href="/dashboard?tab=renders"
            trailingIcon="external"
          >
            Asset Creation
          </DashboardLinkButton>
        }
        footer={
          <>
            <span className="text-muted-foreground">
              Refreshes every 2 minutes
            </span>
            <DashboardLinkButton
              href="/dashboard/renders"
              intent="highlight"
              trailingIcon="arrow"
            >
              Open render workspace
            </DashboardLinkButton>
          </>
        }
      />

      <AccountFleetOverviewCards
        model={accountFleetOverview}
        isLoading={accountsLoading}
        error={
          accountsError
            ? accountsQueryError instanceof Error
              ? accountsQueryError
              : new Error(String(accountsQueryError))
            : null
        }
        onRetry={() => refetchAccounts()}
      />

      {overviewPanelCount > 0 ? (
        <div className={overviewAttentionGridClass(overviewPanelCount)}>
          {showStuckRenderingSection ? (
            <OverviewRecordPanel
              title="Stuck rendering"
              description={STUCK_RENDERING_POLICY_DESCRIPTION}
              badge={
                stuckRenderingItems.length > 0 ? (
                  <Badge
                    variant="outline"
                    className="border-amber-300 bg-amber-50"
                  >
                    {stuckRenderingItems.length} account
                    {stuckRenderingItems.length === 1 ? "" : "s"}
                  </Badge>
                ) : null
              }
              action={
                <DashboardLinkButton
                  href="/dashboard?tab=renders"
                  trailingIcon="external"
                >
                  Asset Creation
                </DashboardLinkButton>
              }
            >
              <StuckRenderingAttentionList
                items={stuckRenderingItems}
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
            </OverviewRecordPanel>
          ) : null}

          {showAttentionSection ? (
            <OverviewRecordPanel
              title="Needs attention"
              description="Sync runs ≥20m, stuck ≥2h, or completed without finalize"
              badge={
                attentionRuns.length > 0 ? (
                  <Badge variant="outline">
                    {attentionRuns.length} run
                    {attentionRuns.length === 1 ? "" : "s"}
                    {attentionSummaryParts.length > 0
                      ? ` · ${attentionSummaryParts.join(" · ")}`
                      : ""}
                  </Badge>
                ) : null
              }
              action={
                <DashboardLinkButton
                  href="/dashboard?tab=collection"
                  trailingIcon="external"
                >
                  Data Collection
                </DashboardLinkButton>
              }
            >
              <DataRefreshAttentionPanel
                runs={attentionRuns}
                activeCount={activeSyncCount}
                hiddenActiveCount={hiddenActiveSyncCount}
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
              />
            </OverviewRecordPanel>
          ) : null}

          {showRerenderSection ? (
            <OverviewRecordPanel
              title="Re-render requests"
              description="CMS requests waiting for admin handling"
              badge={
                unhandledRerenderCount > 0 ? (
                  <Badge variant="outline" className="border-amber-300 bg-amber-50">
                    {unhandledRerenderCount} unhandled
                  </Badge>
                ) : null
              }
              action={
                <DashboardLinkButton href="/dashboard/rerender-requests">
                  View all
                </DashboardLinkButton>
              }
            >
              <RerenderRequestAttentionList
                items={unhandledRerenderItems}
                isLoading={rerenderLoading}
                error={
                  rerenderError
                    ? rerenderQueryError instanceof Error
                      ? rerenderQueryError
                      : new Error(String(rerenderQueryError))
                    : null
                }
                onRetry={() => refetchRerender()}
              />
            </OverviewRecordPanel>
          ) : null}

          {showContactSection ? (
            <OverviewRecordPanel
              title="Contact submissions"
              description="Unseen or unacknowledged messages from the public form"
              badge={
                contactActionCount > 0 ? (
                  <Badge variant="outline">
                    {unseenContactCount} unseen
                    {contactActionCount !== unseenContactCount
                      ? ` · ${contactActionCount} in queue`
                      : ""}
                  </Badge>
                ) : null
              }
              action={
                <DashboardLinkButton href="/dashboard/contact">
                  Inbox
                </DashboardLinkButton>
              }
            >
              <ContactFormAttentionList
                items={contactActionItems}
                isLoading={contactLoading}
                error={
                  contactError
                    ? contactQueryError instanceof Error
                      ? contactQueryError
                      : new Error(String(contactQueryError))
                    : null
                }
                onRetry={() => refetchContact()}
              />
            </OverviewRecordPanel>
          ) : null}

          {showNotificationSection ? (
            <OverviewRecordPanel
              title="Notification failures"
              description="Scraper notification health over the last 7 days"
              badge={
                notificationAttention.hasAttention ? (
                  <Badge
                    variant="outline"
                    className="border-amber-300 bg-amber-50"
                  >
                    {notificationAttention.summaryParts.join(" · ")}
                  </Badge>
                ) : null
              }
              action={
                <DashboardLinkButton
                  href="/dashboard/notifications"
                  trailingIcon="external"
                >
                  Notification health
                </DashboardLinkButton>
              }
            >
              <NotificationHealthAttentionSummary
                summary={notificationAttention}
                isLoading={notificationLoading}
                error={
                  notificationError
                    ? notificationQueryError instanceof Error
                      ? notificationQueryError
                      : new Error(String(notificationQueryError))
                    : null
                }
                onRetry={() => refetchNotification()}
              />
            </OverviewRecordPanel>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
