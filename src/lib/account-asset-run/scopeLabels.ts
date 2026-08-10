import type { AccountAssetRunItemScope } from "@/types/accountAssetRun";

export const ACCOUNT_ASSET_RUN_SCOPE_LABELS: Record<
  AccountAssetRunItemScope,
  string
> = {
  eligibility_check: "Eligibility check",
  grades_comps_refresh: "Grades/competitions refresh",
  result_batch_scrape: "Result batch scrape",
  remove_fixtures_scrape: "Remove-fixtures scrape",
  asset_creation: "Asset creation",
  asset_completion: "Asset completion",
};

export function getAccountAssetRunScopeLabel(scope: string): string {
  return (
    ACCOUNT_ASSET_RUN_SCOPE_LABELS[scope as AccountAssetRunItemScope] ?? scope
  );
}
