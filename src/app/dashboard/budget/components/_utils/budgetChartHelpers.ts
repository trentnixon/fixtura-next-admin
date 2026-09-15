/** Format rollup period keys for chart axes (e.g. "Nov 3 2025"). */
export function formatPeriodDate(period: string): string {
  try {
    const date = new Date(period);
    if (Number.isNaN(date.getTime())) return period;
    const formatted = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return formatted.replace(",", "");
  } catch {
    return period;
  }
}
