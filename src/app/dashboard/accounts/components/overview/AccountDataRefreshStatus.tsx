"use client";

import Link from "next/link";
import { ArrowRight, Database, ListTree, TriangleAlert } from "lucide-react";
import { useAccountHealthAccountStatus } from "@/hooks/account-health/useAccountHealthAccountStatus";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  blockingItemHeadline,
  healthRunStatusBadgeClass,
  isHealthRunActive,
} from "@/lib/account-health/displayRules";
import { getAccountHealthRunDetailHref } from "@/lib/account-health/accountRoutes";
import { AccountSidebarStatusRow } from "./AccountSchedulerStatus";

type AccountDataRefreshStatusProps = {
  accountId: number;
  /** Render rows only — parent supplies `AccountSidebarStatusGroup`. */
  embedded?: boolean;
};

export default function AccountDataRefreshStatus({
  accountId,
  embedded = false,
}: AccountDataRefreshStatusProps) {
  const { data, isLoading, isError } = useAccountHealthAccountStatus(accountId);

  if (isLoading) {
    if (!embedded) return null;

    return (
      <>
        {[0, 1].map((item) => (
          <div key={item} className="flex items-start gap-3 px-4 py-3">
            <Skeleton className="h-8 w-8 shrink-0 rounded-md" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
        ))}
      </>
    );
  }

  if (isError || !data?.data) {
    if (!embedded) return null;

    return (
      <AccountSidebarStatusRow
        icon={<Database className="h-4 w-4" />}
        label="Latest run"
        value={
          <span className="text-sm font-medium text-brandError-700">
            Failed to load
          </span>
        }
      />
    );
  }

  const { account, latestRun } = data.data;
  const liveRun = latestRun != null && isHealthRunActive(latestRun.status);
  const blockingLine = blockingItemHeadline(latestRun?.blockingItem ?? null);
  const failureReason =
    latestRun?.failureReason ?? account.accountHealthFailureReason ?? null;

  if (!latestRun) {
    if (!embedded) return null;

    return (
      <AccountSidebarStatusRow
        icon={<Database className="h-4 w-4" />}
        label="Latest run"
        value={
          <span className="text-sm font-medium text-muted-foreground">
            No runs yet
          </span>
        }
      />
    );
  }

  const runHref = getAccountHealthRunDetailHref(latestRun.id, account.id);

  return (
    <>
      <AccountSidebarStatusRow
        icon={<Database className="h-4 w-4" />}
        label="Latest run"
        value={
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className={healthRunStatusBadgeClass(latestRun.status)}
            >
              {latestRun.status}
            </Badge>
            <span className="text-lg font-semibold leading-none text-slate-950 tabular-nums">
              Run #{latestRun.id}
            </span>
            {liveRun && (
              <span className="rounded-full border border-brandInfo-200 bg-brandInfo-50 px-2 py-0.5 text-[10px] font-medium text-brandInfo-800">
                Live
              </span>
            )}
          </div>
        }
        action={
          <Button variant="outline" size="sm" className="h-7 px-2" asChild>
            <Link href={runHref}>
              <ArrowRight className="h-3.5 w-3.5" />
              Open
            </Link>
          </Button>
        }
      />

      {failureReason && (
        <AccountSidebarStatusRow
          icon={<TriangleAlert className="h-4 w-4" />}
          label="Failure"
          value={
            <span className="text-sm font-semibold leading-snug text-brandError-800">
              {failureReason}
            </span>
          }
        />
      )}

      {blockingLine && (
        <AccountSidebarStatusRow
          icon={<ListTree className="h-4 w-4" />}
          label="Current step"
          value={
            <span className="text-sm font-semibold leading-snug text-brandWarning-900">
              {blockingLine}
            </span>
          }
        />
      )}
    </>
  );
}
