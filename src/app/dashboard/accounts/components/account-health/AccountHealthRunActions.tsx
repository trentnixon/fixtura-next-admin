"use client";

import AbortAccountHealthRunButton from "@/app/dashboard/accounts/components/account-health/AbortAccountHealthRunButton";
import ReconcileAccountHealthRunButton from "@/app/dashboard/accounts/components/account-health/ReconcileAccountHealthRunButton";
import ResumeAccountHealthRunButton from "@/app/dashboard/accounts/components/account-health/ResumeAccountHealthRunButton";
import {
  accountHealthActionGroupDividerClass,
  accountHealthActionGroupItemClass,
  accountHealthActionGroupShellClass,
  accountHealthToolbarLabelClass,
} from "@/app/dashboard/accounts/components/account-health/run-detail/accountHealthActionGroupStyles";
import { canAbortAccountHealthRun } from "@/lib/account-health/abortAvailability";
import {
  canReconcileAccountHealthRun,
  canResumeAccountHealthRun,
} from "@/lib/account-health/displayRules";
import type { AccountHealthRunStatus } from "@/types/accountHealth";
import { cn } from "@/lib/utils";

interface AccountHealthRunActionsProps {
  runId: number;
  accountId: number;
  runStatus: AccountHealthRunStatus;
  finalizedAt: string | null;
  /** Compact styling for header toolbars */
  size?: "sm" | "default";
  /** Labs horizontal button group vs loose wrap */
  layout?: "default" | "group";
  className?: string;
}

/**
 * Support actions for account-health (data refresh) runs.
 * Gating: reconcile in completed limbo; abort on active runs; resume on active or limbo.
 */
export default function AccountHealthRunActions({
  runId,
  accountId,
  runStatus,
  finalizedAt,
  size = "sm",
  layout = "default",
  className,
}: AccountHealthRunActionsProps) {
  const run = { status: runStatus, finalizedAt };
  const showReconcile = canReconcileAccountHealthRun(run);
  const showResume = canResumeAccountHealthRun(run);
  const showAbort = canAbortAccountHealthRun(runStatus);

  if (!showReconcile && !showResume && !showAbort) {
    return null;
  }

  const groupedItemClass = cn(
    accountHealthActionGroupItemClass,
    accountHealthActionGroupDividerClass
  );

  const actions = (
    <>
      {showReconcile && (
        <ReconcileAccountHealthRunButton
          runId={runId}
          accountId={accountId}
          size={size}
          grouped={layout === "group"}
          className={layout === "group" ? groupedItemClass : undefined}
        />
      )}
      {showResume && (
        <ResumeAccountHealthRunButton
          runId={runId}
          accountId={accountId}
          size={size}
          grouped={layout === "group"}
          className={layout === "group" ? groupedItemClass : undefined}
        />
      )}
      {showAbort && (
        <AbortAccountHealthRunButton
          runId={runId}
          accountId={accountId}
          size={size}
          grouped={layout === "group"}
          className={
            layout === "group" ? accountHealthActionGroupItemClass : undefined
          }
        />
      )}
    </>
  );

  if (layout === "group") {
    return (
      <div className={cn("flex flex-col gap-1 sm:items-end", className)}>
        <span className={accountHealthToolbarLabelClass}>Recovery</span>
        <div className={accountHealthActionGroupShellClass}>{actions}</div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {actions}
    </div>
  );
}
