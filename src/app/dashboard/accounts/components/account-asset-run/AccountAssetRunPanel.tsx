"use client";

import Link from "next/link";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAccountAssetRunLatest } from "@/hooks/account-asset-run/useAccountAssetRunLatest";
import { useLiveRunClock } from "@/hooks/account-asset-run/useLiveRunClock";
import {
  assetRunBlockingItemHeadline,
  assetRunStatusLabel,
  deriveBlockingItem,
  isAssetRunActive,
  sortAssetRunItems,
} from "@/lib/account-asset-run/displayRules";
import type { AccountAssetRunDetail } from "@/types/accountAssetRun";
import {
  getAccountAssetRunDetailHref,
  type AccountAssetRunAccountOrgType,
} from "@/lib/account-asset-run/accountRoutes";
import { assetRunPageStatusBadgeClass } from "@/app/dashboard/accounts/components/account-asset-run/run-detail/assetRunPageStyles";
import { cn } from "@/lib/utils";
import { AccountAssetRunTimeline } from "@/app/dashboard/accounts/components/account-asset-run/run-detail/AccountAssetRunTimeline";
import { AccountAssetRunStepsTable } from "@/app/dashboard/accounts/components/account-asset-run/run-detail/AccountAssetRunStepsTable";
import TriggerAccountAssetRunMenu from "./TriggerAccountAssetRunMenu";
import { ArrowRightIcon, ExternalLinkIcon } from "lucide-react";

interface AccountAssetRunPanelProps {
  accountId: number;
  accountType: AccountAssetRunAccountOrgType;
}

export default function AccountAssetRunPanel({
  accountId,
  accountType,
}: AccountAssetRunPanelProps) {
  const { data, isLoading, error, isError, refetch } =
    useAccountAssetRunLatest(accountId);

  const latest = data?.data ?? null;
  const liveRun = latest !== null && isAssetRunActive(latest.status);
  const nowMs = useLiveRunClock(liveRun);

  if (isLoading) {
    return (
      <SectionContainer
        title="Asset runs"
        description="Tracked asset workflows and on-demand renders for this account"
        variant="compact"
      >
        <LoadingState variant="default" message="Loading latest asset run…" />
      </SectionContainer>
    );
  }

  if (isError && error) {
    return (
      <SectionContainer
        title="Asset runs"
        description="Tracked asset workflows and on-demand renders for this account"
        variant="compact"
      >
        <ErrorState
          error={error instanceof Error ? error : new Error(String(error))}
          title="Could not load asset run"
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

  return (
    <SectionContainer
      title="Asset runs"
      description="Tracked asset workflows and on-demand renders for this account"
      variant="compact"
      action={
        <TriggerAccountAssetRunMenu
          accountId={accountId}
          accountType={accountType}
          liveRun={Boolean(liveRun)}
          activeRunId={latest?.id}
        />
      }
    >
      {latest == null ? (
        <p className="text-sm text-muted-foreground">
          No asset run recorded yet. Use the asset run menu to queue one.
        </p>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Latest run
              </span>
              <Badge
                variant="outline"
                className={assetRunPageStatusBadgeClass(latest.status)}
              >
                {assetRunStatusLabel(latest.status)}
              </Badge>
              {liveRun && (
                <span
                  className={cn(
                    "rounded-full border border-brandInfo-200 bg-brandInfo-50 px-2 py-0.5 text-xs text-brandInfo-800",
                  )}
                >
                  Live · 12s poll
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <ButtonLinkToRun
                runId={latest.id}
                accountId={accountId}
                accountType={accountType}
              />
              {latest.renderId != null && Number.isFinite(latest.renderId) && (
                <ButtonLinkToRender renderId={latest.renderId} />
              )}
            </div>
          </div>

          <PanelBlockingLine run={latest} />

          <AccountAssetRunTimeline
            className="mb-6"
            showHeading={false}
            startedAt={latest.startedAt}
            scheduledFor={latest.scheduledFor}
            completedAt={latest.completedAt}
            failedAt={latest.failedAt}
            isLive={liveRun}
            nowMs={nowMs}
          />

          {latest.failureReason && (
            <div className="mb-6 rounded-md border border-brandError-200 bg-brandError-50 px-4 py-3 text-sm text-brandError-900">
              <strong>Failure:</strong> {latest.failureReason}
            </div>
          )}

          {(latest.items?.length ?? 0) > 0 && (
            <div className="space-y-2">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-900">Steps</h3>
                <Link
                  href={getAccountAssetRunDetailHref(
                    latest.id,
                    accountId,
                    accountType,
                  )}
                  className="text-xs text-primary underline underline-offset-2"
                >
                  View full run
                </Link>
              </div>
              <div className="rounded-md border overflow-x-auto">
                <AccountAssetRunStepsTable
                  items={sortAssetRunItems(latest.items ?? [])}
                  variant="compact"
                  run={latest}
                  isLive={liveRun}
                  nowMs={nowMs}
                />
              </div>
            </div>
          )}
        </>
      )}
    </SectionContainer>
  );
}

function PanelBlockingLine({ run }: { run: AccountAssetRunDetail }) {
  if (!run) return null;
  const blocking = deriveBlockingItem(run);
  const line = assetRunBlockingItemHeadline(blocking);
  if (!line) return null;

  return (
    <p className="mb-4 rounded-md border border-brandWarning-200 bg-brandWarning-50 px-3 py-2 text-sm text-brandWarning-950">
      <span className="font-medium text-brandWarning-800">Current step: </span>
      {line}
    </p>
  );
}

function ButtonLinkToRun({
  runId,
  accountId,
  accountType,
}: {
  runId: number;
  accountId: number;
  accountType: AccountAssetRunAccountOrgType;
}) {
  return (
    <Button variant="primary" size="sm" asChild>
      <Link href={getAccountAssetRunDetailHref(runId, accountId, accountType)}>
        Run #{runId}
        <ArrowRightIcon className="h-4 w-4" />
      </Link>
    </Button>
  );
}

function ButtonLinkToRender({ renderId }: { renderId: number }) {
  return (
    <Button variant="secondary" size="sm" asChild>
      <Link href={`/dashboard/renders/${renderId}`}>
        <ExternalLinkIcon className="h-4 w-4" />
        Render #{renderId}
      </Link>
    </Button>
  );
}
