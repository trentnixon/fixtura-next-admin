"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useAccountAssetRunStatus } from "@/hooks/account-asset-run/useAccountAssetRunStatus";
import { useLiveRunClock } from "@/hooks/account-asset-run/useLiveRunClock";
import { useAccountQuery } from "@/hooks/accounts/useAccountQuery";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AccountAssetRunTimeline } from "@/app/dashboard/accounts/components/account-asset-run/run-detail/AccountAssetRunTimeline";
import { AccountAssetRunSummaryStrip } from "@/app/dashboard/accounts/components/account-asset-run/run-detail/AccountAssetRunSummaryStrip";
import { AccountAssetRunBlockingCard } from "@/app/dashboard/accounts/components/account-asset-run/run-detail/AccountAssetRunBlockingCard";
import { AccountAssetRunStepsTable } from "@/app/dashboard/accounts/components/account-asset-run/run-detail/AccountAssetRunStepsTable";
import {
  assetRunActionButtonClass,
  assetRunErrorBannerClass,
  assetRunLiveBannerClass,
  assetRunNoticeClass,
  assetRunPageStatusBadgeClass,
  assetRunWarningNoticeClass,
} from "@/app/dashboard/accounts/components/account-asset-run/run-detail/assetRunPageStyles";
import {
  assetRunStatusLabel,
  deriveBlockingItem,
  getAssetRunSummaryMeta,
  isAssetRunActive,
  sortAssetRunItems,
} from "@/lib/account-asset-run/displayRules";
import { getAccountPagePath } from "@/lib/account-health/accountRoutes";
import type { AccountAssetRunAccountOrgType } from "@/lib/account-asset-run/accountRoutes";
import { cn } from "@/lib/utils";

interface AccountAssetRunDetailClientProps {
  runId: number;
  accountIdFromSearch: string | null;
  accountTypeFromSearch: AccountAssetRunAccountOrgType | null;
}

export function AccountAssetRunDetailClient({
  runId,
  accountIdFromSearch,
  accountTypeFromSearch,
}: AccountAssetRunDetailClientProps) {
  const { data, isLoading, error, isError, refetch } =
    useAccountAssetRunStatus(runId);

  const run = data?.data;
  const liveRun = run != null && isAssetRunActive(run.status);
  const nowMs = useLiveRunClock(liveRun);

  const orgQueryAccountId = useMemo(() => {
    if (run != null && run.accountId > 0) {
      return String(run.accountId);
    }
    const q = accountIdFromSearch?.trim();
    if (!q) return "";
    const n = Number(q);
    return Number.isFinite(n) && n > 0 ? String(n) : "";
  }, [run, accountIdFromSearch]);

  const { data: accountDetailsData } = useAccountQuery(orgQueryAccountId);

  const accountHref =
    run && accountTypeFromSearch
      ? getAccountPagePath(run.accountId, accountTypeFromSearch)
      : null;

  const accountQueryMismatch =
    run &&
    accountIdFromSearch &&
    String(run.accountId) !== accountIdFromSearch.trim();

  useEffect(() => {
    if (isLoading || isError || !run) return;
    const org = accountDetailsData?.data?.accountOrganisationDetails;
    const resolvedOrgName =
      org?.Name?.trim() || `Account ${run.accountId}`;
    document.title = `Asset run #${run.id} · ${resolvedOrgName} · Fixtura Admin`;
  }, [
    isLoading,
    isError,
    run,
    accountDetailsData?.data?.accountOrganisationDetails,
  ]);

  if (isLoading) {
    return (
      <>
        <CreatePageTitle
          title="Asset run"
          byLine={`Run #${runId}`}
          byLineBottom="Loading…"
        />
        <PageContainer padding="xs" spacing="md">
          <LoadingState variant="default" message="Loading run…" />
        </PageContainer>
      </>
    );
  }

  if (isError && error) {
    return (
      <>
        <CreatePageTitle
          title="Asset run"
          byLine={`Run #${runId}`}
          byLineBottom="Error"
        />
        <PageContainer padding="xs" spacing="md">
          <ErrorState
            error={error instanceof Error ? error : new Error(String(error))}
            title="Could not load run"
            variant="default"
          />
          <Button
            type="button"
            variant="outline"
            className={cn("mt-4", assetRunActionButtonClass)}
            onClick={() => refetch()}
          >
            Retry
          </Button>
        </PageContainer>
      </>
    );
  }

  if (!run) {
    return (
      <>
        <CreatePageTitle
          title="Asset run"
          byLine={`Run #${runId}`}
          byLineBottom="Not found"
        />
        <PageContainer padding="xs" spacing="md">
          <p className="text-sm text-muted-foreground">
            No run data returned from the CMS.
          </p>
        </PageContainer>
      </>
    );
  }

  const sortedItems = sortAssetRunItems(run.items ?? []);
  const blockingItem = deriveBlockingItem(run);
  const summaryMeta = getAssetRunSummaryMeta(run.summary);
  const org = accountDetailsData?.data?.accountOrganisationDetails;
  const orgName = org?.Name?.trim() || `Account ${run.accountId}`;
  const orgLogo = org?.ParentLogo?.trim() ? org.ParentLogo.trim() : undefined;
  const accountTypeLabel =
    accountTypeFromSearch === "club"
      ? "Club"
      : accountTypeFromSearch === "association"
        ? "Association"
        : "Account";

  const showRenderPendingNotice =
    summaryMeta.mode === "full" &&
    (run.renderId == null || !Number.isFinite(run.renderId));

  return (
    <>
      <CreatePageTitle
        title={orgName}
        byLine={`Run #${run.id} · ${accountTypeLabel}`}
        byLineBottom="Asset orchestration workflow · scrape stages and asset creation progress"
        image={orgLogo}
      >
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Badge
            variant="outline"
            className={assetRunPageStatusBadgeClass(run.status)}
          >
            {assetRunStatusLabel(run.status)}
          </Badge>
          {accountHref ? (
            <Button
              variant="outline"
              size="sm"
              className={assetRunActionButtonClass}
              asChild
            >
              <Link href={accountHref}>Back to account</Link>
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className={assetRunActionButtonClass}
              asChild
            >
              <Link href="/dashboard">Back to dashboard</Link>
            </Button>
          )}
          {run.renderId != null && Number.isFinite(run.renderId) && (
            <Button
              variant="outline"
              size="sm"
              className={assetRunActionButtonClass}
              asChild
            >
              <Link href={`/dashboard/renders/${run.renderId}`}>
                Open render #{run.renderId}
              </Link>
            </Button>
          )}
        </div>
      </CreatePageTitle>
      <PageContainer padding="xs" spacing="lg">
        {accountQueryMismatch && (
          <p className={cn("mb-4", assetRunNoticeClass)}>
            Query <code className="font-mono">accountId</code> does not match
            this run&apos;s account.
          </p>
        )}

        {!accountHref && (
          <p className={cn("mb-4", assetRunNoticeClass)}>
            Pass <code className="font-mono">accountType=club</code> or{" "}
            <code className="font-mono">association</code> in the URL for a direct
            back-to-account link.
          </p>
        )}

        {liveRun && (
          <p className={cn("mb-4", assetRunLiveBannerClass)}>
            <span className="font-medium text-brandInfo-800">Live run</span>
            {" — "}
            Status refreshes automatically every 12 seconds.
          </p>
        )}

        <AccountAssetRunTimeline
          startedAt={run.startedAt}
          scheduledFor={run.scheduledFor}
          completedAt={run.completedAt}
          failedAt={run.failedAt}
          isLive={liveRun}
          nowMs={nowMs}
        />

        {run.failureReason && (
          <div className={cn("mb-6", assetRunErrorBannerClass)}>
            <strong className="text-brandError-950">Run failure:</strong>{" "}
            {run.failureReason}
          </div>
        )}

        {blockingItem && <AccountAssetRunBlockingCard item={blockingItem} />}

        <AccountAssetRunStepsTable
          items={sortedItems}
          variant="full"
          run={run}
          isLive={liveRun}
          nowMs={nowMs}
        />

        {showRenderPendingNotice && (
          <div className={cn("mt-6", assetRunWarningNoticeClass)}>
            <span className="font-medium">Render pending</span> — will appear after
            scrape stages complete in full mode. Refresh this page or wait for
            automatic polling.
          </div>
        )}

        <AccountAssetRunSummaryStrip
          schedulerId={run.schedulerId}
          scheduledDate={run.scheduledDate}
          runKey={run.runKey}
          mode={summaryMeta.mode}
          trigger={summaryMeta.trigger}
          force={summaryMeta.force}
        />
      </PageContainer>
    </>
  );
}
