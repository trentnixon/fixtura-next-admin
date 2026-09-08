import type { AccountHealthReconcileErrorReason } from "@/types/accountHealth";

export const ACCOUNT_HEALTH_RECONCILE_ERROR_LABELS: Record<
  AccountHealthReconcileErrorReason,
  string
> = {
  invalid_run_id: "Invalid run ID.",
  not_found: "Run not found.",
  reconcile_failed: "Could not reconcile the run. Try again or use Strapi.",
};

export function getAccountHealthReconcileErrorLabel(reason: string): string {
  if (reason in ACCOUNT_HEALTH_RECONCILE_ERROR_LABELS) {
    return ACCOUNT_HEALTH_RECONCILE_ERROR_LABELS[
      reason as AccountHealthReconcileErrorReason
    ];
  }
  return reason;
}

export function formatAccountHealthReconcileSuccessToast(
  runId: number,
  reconciled: number,
  requeued: number
): string {
  if (requeued === 0 && reconciled === 0) {
    return `Run #${runId} reconciled — no rows changed`;
  }
  return `Run #${runId} reconciled — ${requeued} requeued, ${reconciled} finalized`;
}
