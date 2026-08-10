export const ACCOUNT_ASSET_TRIGGER_REASON_LABELS: Record<string, string> = {
  invalid_account_id: "Invalid account ID.",
  account_not_found: "Account not found.",
  scheduler_not_found: "Account has no scheduler.",
  account_inactive: "Account is inactive.",
  account_not_setup: "Account setup is not complete.",
  account_updating: "Account is already updating.",
  no_active_paid_order: "Account does not have an active paid order.",
  render_processing: "A render is already processing for this scheduler.",
  active_run_exists: "An asset run is already active for this account.",
  run_key_exists: "This on-demand run already exists.",
};

export function getAccountAssetTriggerReasonLabel(reason: string): string {
  return ACCOUNT_ASSET_TRIGGER_REASON_LABELS[reason] ?? reason;
}
