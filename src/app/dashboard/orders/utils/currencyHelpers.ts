import { formatCurrency } from "@/utils/chart-formatters";

/**
 * Converts cents to units (dollars)
 * @param value - Amount in cents
 * @returns Amount in units, or 0 if value is null/undefined
 */
export function centsToUnits(value: number | null | undefined): number {
  if (value === undefined || value === null) {
    return 0;
  }
  return value / 100;
}

/**
 * Converts units (dollars) to cents
 * Used for invoice creation form where user enters dollars
 * @param amount - Amount in dollars (as string or number)
 * @returns Amount in cents, or 0 if invalid
 */
export function unitsToCents(amount: string | number): number {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num) || !isFinite(num)) {
    return 0;
  }
  // Convert dollars to cents (multiply by 100)
  // e.g., 650.00 -> 65000
  return Math.round(num * 100);
}

/**
 * Formats money amount from cents to currency string
 * @param amount - Amount in cents
 * @param currency - Currency code (e.g., "AUD", "USD")
 * @returns Formatted currency string or "—" if amount is null/undefined
 */
export function formatMoney(
  amount: number | null | undefined,
  currency: string | null | undefined
): string {
  if (amount === null || amount === undefined) {
    return "—";
  }

  return formatCurrency(centsToUnits(amount), currency ?? undefined);
}
