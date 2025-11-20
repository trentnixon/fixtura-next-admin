/**
 * Format a number as currency
 * @param value - The number to format
 * @param fallback - What to return if value is invalid (default: "-")
 * @returns Formatted currency string or fallback
 */
export function formatCurrency(
  value: number | undefined | null,
  fallback: string = "-"
): string {
  if (value === undefined || value === null || isNaN(value)) {
    return fallback;
  }
  return `$${value.toFixed(2)}`;
}

/**
 * Format a number with commas
 * @param value - The number to format
 * @param fallback - What to return if value is invalid (default: "0")
 * @returns Formatted number string or fallback
 */
export function formatNumber(
  value: number | undefined | null,
  fallback: string = "0"
): string {
  if (value === undefined || value === null || isNaN(value)) {
    return fallback;
  }
  return value.toLocaleString();
}
