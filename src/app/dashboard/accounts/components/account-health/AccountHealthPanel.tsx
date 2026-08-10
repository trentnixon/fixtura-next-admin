"use client";

import Link from "next/link";
import { useAccountHealthAccountStatus } from "@/hooks/account-health/useAccountHealthAccountStatus";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { Badge } from "@/components/ui/badge";
import { formatHealthTimestamp } from "@/lib/account-health/formatHealthTimestamp";
import {
  EMPTY_RUN_RESULT_LABEL,
  accountHealthStatusLabel,
  blockingItemHeadline,
  getSummaryEmptyReason,
  healthRunStatusBadgeClass,
  isHealthRunActive,
} from "@/lib/account-health/displayRules";
import { getAccountHealthRunDetailHref } from "@/lib/account-health/accountRoutes";
import TriggerAccountHealthRunButton from "./TriggerAccountHealthRunButton";

interface AccountHealthPanelProps {
  accountId: number;
}

export default function AccountHealthPanel({ accountId }: AccountHealthPanelProps) {
  const { data, isLoading, error, isError, refetch } =
    useAccountHealthAccountStatus(accountId);

  if (isLoading) {
    return (
      <SectionContainer
        title="Data refresh"
        description="Season data refresh status and recent runs"
        variant="compact"
      >
        <LoadingState
          variant="default"
          message="Loading data refresh…"
        />
      </SectionContainer>
    );
  }

  if (isError && error) {
    return (
      <SectionContainer
        title="Data refresh"
        description="Season data refresh status and recent runs"
        variant="compact"
      >
        <ErrorState
          error={error instanceof Error ? error : new Error(String(error))}
          title="Could not load data refresh"
          variant="card"
        />
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-2 text-sm text-primary underline"
        >
          Retry
        </button>
      </SectionContainer>
    );
  }

  if (!data?.data) {
    return (
      <SectionContainer
        title="Data refresh"
        description="Season data refresh status and recent runs"
        variant="compact"
      >
        <p className="text-sm text-muted-foreground">No data available.</p>
      </SectionContainer>
    );
  }

  const { account, latestRun } = data.data;
  const blocking = latestRun?.blockingItem ?? null;
  const blockingLine = blockingItemHeadline(blocking);
  const latestEmpty = getSummaryEmptyReason(latestRun?.summary ?? null);
  const liveRun = latestRun && isHealthRunActive(latestRun.status);

  return (
    <SectionContainer
      title="Data refresh"
      description="Season data refresh status and recent runs"
      variant="compact"
      action={
        <TriggerAccountHealthRunButton
          accountId={account.id}
          liveRun={Boolean(liveRun)}
          activeRunId={latestRun?.id}
        />
      }
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">Account status</span>
        <Badge variant="outline" className="capitalize">
          {accountHealthStatusLabel(account.accountHealthStatus)}
        </Badge>
        {liveRun && latestRun && (
          <>
            <span className="text-sm text-muted-foreground">· Current run</span>
            <Badge
              variant="outline"
              className={healthRunStatusBadgeClass(latestRun.status)}
            >
              {latestRun.status}
            </Badge>
          </>
        )}
      </div>

      <dl className="mb-6 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-muted-foreground">Last queued</dt>
          <dd>{formatHealthTimestamp(account.accountHealthLastQueuedAt)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Last started</dt>
          <dd>{formatHealthTimestamp(account.accountHealthLastStartedAt)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Last completed</dt>
          <dd>{formatHealthTimestamp(account.accountHealthLastCompletedAt)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Last failed</dt>
          <dd>{formatHealthTimestamp(account.accountHealthLastFailedAt)}</dd>
        </div>
      </dl>

      {account.accountHealthFailureReason && (
        <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          <strong>Failure:</strong> {account.accountHealthFailureReason}
        </div>
      )}

      {latestRun && (
        <div className="rounded-md border bg-card p-4">
          <h3 className="mb-2 text-sm font-semibold">Latest run</h3>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge
              variant="outline"
              className={healthRunStatusBadgeClass(latestRun.status)}
            >
              {latestRun.status}
            </Badge>
            <span className="font-mono text-sm">
              <Link
                href={getAccountHealthRunDetailHref(
                  latestRun.id,
                  account.id
                )}
                className="text-primary underline underline-offset-2"
              >
                Run #{latestRun.id}
              </Link>
            </span>
          </div>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Started</dt>
              <dd>{formatHealthTimestamp(latestRun.startedAt)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Finalized</dt>
              <dd>{formatHealthTimestamp(latestRun.finalizedAt)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Current step index</dt>
              <dd>{latestRun.currentStepIndex}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Account type</dt>
              <dd className="capitalize">{latestRun.accountType}</dd>
            </div>
          </dl>
          {latestRun.failureReason && (
            <p className="mt-2 text-sm text-red-800">
              {latestRun.failureReason}
            </p>
          )}
          {latestEmpty.isEmptyResult && (
            <p className="mt-2 text-sm text-sky-900">
              {EMPTY_RUN_RESULT_LABEL}
              {latestEmpty.reasonDisplay
                ? `: ${latestEmpty.reasonDisplay}`
                : ""}
            </p>
          )}
          {blockingLine && (
            <p className="mt-2 rounded bg-amber-50 px-3 py-2 text-sm text-amber-950 border border-amber-200">
              <strong>Blocking:</strong> {blockingLine}
            </p>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            Expand <strong>Latest run — workflow</strong> below for step detail.
          </p>
        </div>
      )}
    </SectionContainer>
  );
}
