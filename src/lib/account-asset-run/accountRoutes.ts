/** Routes for asset run drill-down */

export type AccountAssetRunAccountOrgType = "association" | "club";

export function getAccountAssetRunDetailHref(
  runId: number,
  accountId: number,
  accountType?: AccountAssetRunAccountOrgType
): string {
  const q = new URLSearchParams({ accountId: String(accountId) });
  if (accountType) {
    q.set("accountType", accountType);
  }
  return `/dashboard/accounts/asset-runs/${runId}?${q.toString()}`;
}
