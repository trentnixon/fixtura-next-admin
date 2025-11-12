/**
 * Calculates the number of days between two dates
 * @param startDate - Start date string (ISO format)
 * @param endDate - End date string (ISO format)
 * @returns Number of days, or null if dates are invalid
 */
export function calculateDaysBetween(
  startDate: string | null,
  endDate: string | null
): number | null {
  if (!startDate || !endDate) {
    return null;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return null;
  }

  const millisPerDay = 1000 * 60 * 60 * 24;
  const diffDays = Math.round((end.getTime() - start.getTime()) / millisPerDay);

  return diffDays < 0 ? 0 : diffDays;
}

/**
 * Calculates the number of days between two dates (alias for calculateDaysBetween)
 * Used in OrdersOverviewTable for consistency
 */
export function calculateOrderLengthDays(
  startDate: string | null,
  endDate: string | null
): number | null {
  return calculateDaysBetween(startDate, endDate);
}

/**
 * Calculates the elapsed time in milliseconds between two dates
 * @param startDate - Start date string (ISO format)
 * @param endDate - End date string (ISO format)
 * @returns Elapsed time in milliseconds, or null if dates are invalid
 */
export function calculateElapsedMs(
  startDate: string | null,
  endDate: string | null
): number | null {
  if (!startDate || !endDate) {
    return null;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return null;
  }

  const difference = end.getTime() - start.getTime();
  return difference < 0 ? 0 : difference;
}

/**
 * Formats elapsed time between two dates as a human-readable string
 * @param startDate - Start date string (ISO format)
 * @param endDate - End date string (ISO format)
 * @returns Formatted string (e.g., "5d 3h", "2h 30m", "45m", "30s") or "—" if invalid
 */
export function formatElapsedTime(
  startDate: string | null,
  endDate: string | null
): string {
  const diffMs = calculateElapsedMs(startDate, endDate);
  if (diffMs === null) {
    return "—";
  }

  const minutes = Math.floor(diffMs / 60000);
  const seconds = Math.floor((diffMs % 60000) / 1000);

  if (minutes >= 1440) {
    const days = Math.floor(minutes / 1440);
    const hours = Math.floor((minutes % 1440) / 60);
    return `${days}d${hours ? ` ${hours}h` : ""}`;
  }

  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins ? ` ${mins}m` : ""}`;
  }

  if (minutes > 0) {
    return `${minutes}m`;
  }

  return `${seconds}s`;
}

/**
 * Formats order length as days
 * @param startDate - Start date string (ISO format)
 * @param endDate - End date string (ISO format)
 * @returns Formatted string (e.g., "365d") or "—" if invalid
 */
export function formatOrderLength(
  startDate: string | null,
  endDate: string | null
): string {
  const diffDays = calculateOrderLengthDays(startDate, endDate);
  if (diffDays === null) {
    return "—";
  }

  return `${diffDays}d`;
}

