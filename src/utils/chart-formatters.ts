/**
 * Chart Formatting Utilities
 *
 * Shared formatting functions for chart components, tools, and data visualization.
 * These utilities provide consistent formatting across all chart types.
 */

/**
 * Format a duration value to a human-readable string
 *
 * @param value - Duration value (in seconds or milliseconds)
 * @param unit - Unit of the input value ('seconds' | 'milliseconds')
 * @returns Formatted duration string (e.g., "2.5s", "1.2m", "500ms")
 *
 * @example
 * ```ts
 * formatDuration(2.5) // "2.5s"
 * formatDuration(0.5, 'seconds') // "500ms"
 * formatDuration(3600, 'seconds') // "1.0h"
 * formatDuration(1500, 'milliseconds') // "1.5s"
 * ```
 */
export function formatDuration(
  value: number,
  unit: "seconds" | "milliseconds" = "seconds"
): string {
  const seconds = unit === "milliseconds" ? value / 1000 : value;

  if (seconds < 1) {
    const ms = unit === "milliseconds" ? value : seconds * 1000;
    return `${ms.toFixed(0)}ms`;
  }
  if (seconds < 60) {
    return `${seconds.toFixed(1)}s`;
  }
  if (seconds < 3600) {
    return `${(seconds / 60).toFixed(1)}m`;
  }
  return `${(seconds / 3600).toFixed(1)}h`;
}

/**
 * Format a memory value to a human-readable string
 *
 * @param value - Memory value (in MB or bytes)
 * @param unit - Unit of the input value ('mb' | 'bytes')
 * @returns Formatted memory string (e.g., "128MB", "1.5GB", "512KB")
 *
 * @example
 * ```ts
 * formatMemory(128) // "128.0MB"
 * formatMemory(2048) // "2.0GB"
 * formatMemory(512, 'bytes') // "512.0 B"
 * formatMemory(1572864, 'bytes') // "1.5 MB"
 * ```
 */
export function formatMemory(
  value: number,
  unit: "mb" | "bytes" = "mb"
): string {
  if (unit === "bytes") {
    if (value < 1024) return `${value.toFixed(0)} B`;
    const kb = value / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    const mb = kb / 1024;
    if (mb < 1024) return `${mb.toFixed(2)} MB`;
    const gb = mb / 1024;
    return `${gb.toFixed(2)} GB`;
  }

  // Unit is MB
  if (value < 1) return `${(value * 1024).toFixed(1)}KB`;
  if (value < 1024) return `${value.toFixed(1)}MB`;
  return `${(value / 1024).toFixed(1)}GB`;
}

/**
 * Format a percentage value to a string with % symbol
 *
 * @param value - Percentage value (0-100 range)
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string (e.g., "85.5%")
 *
 * @example
 * ```ts
 * formatPercentage(85.5) // "85.5%"
 * formatPercentage(100, 0) // "100%"
 * formatPercentage(42.123, 2) // "42.12%"
 * ```
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format a number with locale-specific formatting
 *
 * @param value - Number to format
 * @param options - Intl.NumberFormatOptions for customization
 * @returns Formatted number string (e.g., "1,234", "1,234.56")
 *
 * @example
 * ```ts
 * formatNumber(1234) // "1,234"
 * formatNumber(1234.56) // "1,234.56"
 * formatNumber(1234.56, { maximumFractionDigits: 1 }) // "1,234.6"
 * ```
 */
export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions
): string {
  return value.toLocaleString("en-US", options);
}

/**
 * Format a date string to a relative time string (e.g., "2 hours ago")
 *
 * @param dateString - ISO date string or Date object
 * @param fallback - Fallback string if date is invalid (default: "Never")
 * @returns Relative time string or formatted date
 *
 * @example
 * ```ts
 * formatRelativeTime("2024-01-01T00:00:00Z") // "2 hours ago" (if recent)
 * formatRelativeTime(null) // "Never"
 * ```
 */
export function formatRelativeTime(
  dateString: string | Date | null,
  fallback: string = "Never"
): string {
  if (!dateString) return fallback;

  try {
    const date = dateString instanceof Date ? dateString : new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) return "just now";
    if (diffMinutes < 60)
      return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return typeof dateString === "string" ? dateString : fallback;
  }
}

/**
 * Format a date string to a readable format with time
 *
 * @param dateString - ISO date string or Date object
 * @param fallback - Fallback string if date is invalid (default: "N/A")
 * @returns Formatted date string (e.g., "Jan 15, 2024, 10:30 AM")
 *
 * @example
 * ```ts
 * formatDate("2024-01-15T10:30:00Z") // "Jan 15, 2024, 10:30 AM"
 * formatDate(null) // "N/A"
 * ```
 */
export function formatDate(
  dateString: string | Date | null,
  fallback: string = "N/A"
): string {
  if (!dateString) return fallback;

  try {
    const date = dateString instanceof Date ? dateString : new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return typeof dateString === "string" ? dateString : fallback;
  }
}

/**
 * Format a date string to a short format (MMM DD)
 *
 * @param dateString - ISO date string or Date object
 * @returns Short formatted date string (e.g., "Jan 15")
 *
 * @example
 * ```ts
 * formatDateShort("2024-01-15T10:30:00Z") // "Jan 15"
 * formatDateShort(new Date()) // "Jan 15"
 * ```
 */
export function formatDateShort(dateString: string | Date): string {
  try {
    const date = dateString instanceof Date ? dateString : new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return typeof dateString === "string" ? dateString : "";
  }
}

/**
 * Format a date string to YYYY-MM-DD format
 *
 * @param dateString - ISO date string or Date object
 * @returns ISO date string (e.g., "2024-01-15")
 *
 * @example
 * ```ts
 * formatDateISO("2024-01-15T10:30:00Z") // "2024-01-15"
 * formatDateISO(new Date()) // "2024-01-15"
 * ```
 */
export function formatDateISO(dateString: string | Date): string {
  try {
    const date = dateString instanceof Date ? dateString : new Date(dateString);
    return date.toISOString().split("T")[0];
  } catch {
    return typeof dateString === "string" ? dateString : "";
  }
}

/**
 * Format a currency value
 *
 * @param value - Currency value
 * @param currency - Currency code (default: "USD")
 * @param options - Intl.NumberFormatOptions for customization
 * @returns Formatted currency string (e.g., "$1,234.56")
 *
 * @example
 * ```ts
 * formatCurrency(1234.56) // "$1,234.56"
 * formatCurrency(1234.56, "EUR") // "€1,234.56"
 * formatCurrency(1234.56, "USD", { minimumFractionDigits: 0 }) // "$1,235"
 * ```
 */
export function formatCurrency(
  value: number,
  currency: string = "USD",
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    ...options,
  }).format(value);
}

/**
 * Format a large number with abbreviated units (K, M, B)
 *
 * @param value - Number to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Abbreviated number string (e.g., "1.2K", "5.3M", "2.1B")
 *
 * @example
 * ```ts
 * formatAbbreviatedNumber(1200) // "1.2K"
 * formatAbbreviatedNumber(5300000) // "5.3M"
 * formatAbbreviatedNumber(2100000000) // "2.1B"
 * ```
 */
export function formatAbbreviatedNumber(
  value: number,
  decimals: number = 1
): string {
  if (value < 1000) return value.toString();
  if (value < 1000000) return `${(value / 1000).toFixed(decimals)}K`;
  if (value < 1000000000) return `${(value / 1000000).toFixed(decimals)}M`;
  return `${(value / 1000000000).toFixed(decimals)}B`;
}
