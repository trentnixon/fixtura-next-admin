"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useAccountHealthRunStatus } from "@/hooks/account-health/useAccountHealthRunStatus";
import { useAccountQuery } from "@/hooks/accounts/useAccountQuery";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import { getAccountPagePath } from "@/lib/account-health/accountRoutes";
import {
  EMPTY_RUN_RESULT_LABEL,
  getSummaryEmptyReason,
  healthRunStatusLabel,
  isHealthRunActive,
} from "@/lib/account-health/displayRules";
import {
  healthRunActionButtonClass,
  healthRunErrorBannerClass,
  healthRunInfoNoticeClass,
  healthRunLiveBannerClass,
  healthRunNoticeClass,
  healthRunPageStatusBadgeClass,
} from "@/app/dashboard/accounts/components/account-health/run-detail/healthRunPageStyles";
import { cn } from "@/lib/utils";
import { AccountHealthRunTimeline } from "@/app/dashboard/accounts/components/account-health/run-detail/AccountHealthRunTimeline";
import { AccountHealthRunBlockingCard } from "@/app/dashboard/accounts/components/account-health/run-detail/AccountHealthRunBlockingCard";
import { AccountHealthRunStepsTable } from "@/app/dashboard/accounts/components/account-health/run-detail/AccountHealthRunStepsTable";

interface AccountHealthRunDetailClientProps {
  runId: number;
  accountIdFromSearch: string | null;
}

export function AccountHealthRunDetailClient({
  runId,
  accountIdFromSearch,
}: AccountHealthRunDetailClientProps) {
  const { data, isLoading, error, isError, refetch } =
    useAccountHealthRunStatus(runId);
  const { strapiLocation } = useGlobalContext();

  const run = data?.data;

  const orgQueryAccountId = useMemo(() => {
    if (run != null && run.accountId > 0) {
      return String(run.accountId);
    }
    const q = accountIdFromSearch?.trim();
    if (!q) return "";
    const n = Number(q);
    return Number.isFinite(n) && n > 0 ? String(n) : "";
  }, [run?.accountId, accountIdFromSearch]);

  const { data: accountDetailsData } = useAccountQuery(orgQueryAccountId);

  const accountHref = run
    ? getAccountPagePath(run.accountId, run.accountType)
    : "";
  const accountQueryMismatch =
    run &&
    accountIdFromSearch &&
    String(run.accountId) !== accountIdFromSearch.trim();

  useEffect(() => {
    if (isLoading || isError || !run) return;
    const org = accountDetailsData?.data?.accountOrganisationDetails;
    const resolvedOrgName =
      org?.Name?.trim() || `Account ${run.accountId}`;
    document.title = `Data refresh run #${run.id} · ${resolvedOrgName} · Fixtura Admin`;
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
          title="Data refresh run"
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
          title="Data refresh run"
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
            className={cn("mt-4", healthRunActionButtonClass)}
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
          title="Data refresh run"
          byLine={`Run #${runId}`}
          byLineBottom="Not found"
        />
        <PageContainer padding="xs" spacing="md">
          <p className="text-sm text-muted-foreground">No run data returned.</p>
        </PageContainer>
      </>
    );
  }

  const summaryMeta = getSummaryEmptyReason(run.summary);
  const sortedItems = [...run.items].sort(
    (a, b) => a.stepIndex - b.stepIndex || a.id - b.id
  );
  const org = accountDetailsData?.data?.accountOrganisationDetails;
  const orgName =
    org?.Name?.trim() || `Account ${run.accountId}`;
  const orgLogo = org?.ParentLogo?.trim()
    ? org.ParentLogo.trim()
    : undefined;
  const accountTypeLabel =
    run.accountType === "club" ? "Club" : "Association";
  const liveRun = isHealthRunActive(run.status);

  return (
    <>
      <CreatePageTitle
        title={orgName}
        byLine={`Run #${run.id} · ${accountTypeLabel}`}
        byLineBottom="Season data refresh workflow · steps and fixture discovery progress"
        image={orgLogo}
      >
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Badge
            variant="outline"
            className={healthRunPageStatusBadgeClass(run.status)}
          >
            {healthRunStatusLabel(run.status)}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            className={healthRunActionButtonClass}
            asChild
          >
            <Link href={accountHref}>Back to account</Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={healthRunActionButtonClass}
            asChild
          >
            <a
              href={`${strapiLocation.accountHealthRun}${run.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1"
            >
              Open in Strapi
              <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
            </a>
          </Button>
        </div>
      </CreatePageTitle>
      <PageContainer padding="xs" spacing="lg">
        {accountQueryMismatch && (
          <p className={cn("mb-4", healthRunNoticeClass)}>
            Query <code className="font-mono">accountId</code> does not match
            this run’s account.
          </p>
        )}

        {liveRun && (
          <p className={cn("mb-4", healthRunLiveBannerClass)}>
            <span className="font-medium text-brandInfo-800">Live run</span>
            {" — "}
            Status refreshes automatically every 12 seconds.
          </p>
        )}

        <AccountHealthRunTimeline
          startedAt={run.startedAt}
          queuedAt={run.queuedAt}
          completedAt={run.completedAt}
          finalizedAt={run.finalizedAt}
        />

        {run.failureReason && (
          <div className={cn("mb-6", healthRunErrorBannerClass)}>
            <strong className="text-brandError-950">Run failure:</strong>{" "}
            {run.failureReason}
          </div>
        )}

        {summaryMeta.isEmptyResult && (
          <div className={cn("mb-6", healthRunInfoNoticeClass)}>
            <span className="font-medium text-brandInfo-800">
              {EMPTY_RUN_RESULT_LABEL}
            </span>
            {summaryMeta.reasonDisplay
              ? `: ${summaryMeta.reasonDisplay}`
              : ""}
          </div>
        )}

        {run.blockingItem && (
          <AccountHealthRunBlockingCard
            item={run.blockingItem}
            runFailed={run.status === "failed"}
            itemStrapiBase={strapiLocation.accountHealthItem}
          />
        )}

        <AccountHealthRunStepsTable
          items={sortedItems}
          runFailed={run.status === "failed"}
          itemStrapiBase={strapiLocation.accountHealthItem}
        />
      </PageContainer>
    </>
  );
}
