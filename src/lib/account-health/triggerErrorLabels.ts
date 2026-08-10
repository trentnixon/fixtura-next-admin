import type { AccountHealthTriggerErrorReason } from "@/types/accountHealth";

export const ACCOUNT_HEALTH_TRIGGER_ERROR_LABELS: Record<
  AccountHealthTriggerErrorReason,
  string
> = {
  invalid_account_id: "Invalid account ID.",
  not_found: "Account not found.",
  inactive: "Account is inactive.",
  not_setup: "Account setup is not complete.",
  account_updating: "Account is already updating.",
  not_billable:
    "Account does not have an active paid order or active trial.",
  invalid_health_plan:
    "Account does not have a valid organisation health plan.",
};

export function getAccountHealthTriggerErrorLabel(reason: string): string {
  if (reason in ACCOUNT_HEALTH_TRIGGER_ERROR_LABELS) {
    return ACCOUNT_HEALTH_TRIGGER_ERROR_LABELS[
      reason as AccountHealthTriggerErrorReason
    ];
  }
  return reason;
}
