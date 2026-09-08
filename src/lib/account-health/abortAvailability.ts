import type { AccountHealthRunStatus } from "@/types/accountHealth";
import { isHealthRunActive } from "@/lib/account-health/displayRules";

export const ABORT_INACTIVE_RUN_TOOLTIP =
  "Abort only works on pending, queued, or running runs. For completed runs, try Reconcile or Resume first.";

export function canAbortAccountHealthRun(
  status: AccountHealthRunStatus | undefined
): boolean {
  return status != null && isHealthRunActive(status);
}
