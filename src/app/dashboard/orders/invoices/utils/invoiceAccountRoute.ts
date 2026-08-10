/**
 * Resolve admin account detail route from invoice aggregate account fields.
 * Falls back to club when type is missing or unrecognized.
 */
export function getInvoiceAccountRoute(
  accountId: number,
  accountType: string | null
): string {
  const normalized = accountType?.trim().toLowerCase();
  if (normalized === "association") {
    return `/dashboard/accounts/association/${accountId}`;
  }
  return `/dashboard/accounts/club/${accountId}`;
}
