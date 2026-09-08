import type { AccountHealthResumeErrorReason } from "@/types/accountHealth";

export const ACCOUNT_HEALTH_RESUME_ERROR_LABELS: Record<
  AccountHealthResumeErrorReason,
  string
> = {
  invalid_run_id: "Invalid run ID.",
  not_found: "Run not found.",
  resume_failed: "Could not resume the run. Try again or use Strapi.",
};

export function getAccountHealthResumeErrorLabel(reason: string): string {
  if (reason in ACCOUNT_HEALTH_RESUME_ERROR_LABELS) {
    return ACCOUNT_HEALTH_RESUME_ERROR_LABELS[
      reason as AccountHealthResumeErrorReason
    ];
  }
  return reason;
}
