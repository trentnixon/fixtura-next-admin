import type { AccountHealthAbortErrorReason } from "@/types/accountHealth";

export const ACCOUNT_HEALTH_ABORT_ERROR_LABELS: Record<
  AccountHealthAbortErrorReason,
  string
> = {
  invalid_run_id: "Invalid run ID.",
  not_found: "Run not found.",
  run_not_active: "Run is not active — only pending, queued, or running runs can be aborted.",
  abort_failed: "Could not abort the run. Try again or use Strapi.",
};

export function getAccountHealthAbortErrorLabel(reason: string): string {
  if (reason in ACCOUNT_HEALTH_ABORT_ERROR_LABELS) {
    return ACCOUNT_HEALTH_ABORT_ERROR_LABELS[
      reason as AccountHealthAbortErrorReason
    ];
  }
  return reason;
}
