export function getAccountPagePath(
  accountId: number,
  accountType: "association" | "club"
): string {
  const segment = accountType === "club" ? "club" : "association";
  return `/dashboard/accounts/${segment}/${accountId}`;
}

export function getAccountHealthRunDetailHref(
  runId: number,
  accountId: number
): string {
  const q = new URLSearchParams({ accountId: String(accountId) });
  return `/dashboard/accounts/health/runs/${runId}?${q.toString()}`;
}
