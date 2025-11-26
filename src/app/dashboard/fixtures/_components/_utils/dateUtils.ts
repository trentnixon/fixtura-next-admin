import { format, parseISO } from "date-fns";
import type { AssociationSummary } from "@/types/fixtureInsights";

/**
 * Format a single date string to a readable format
 */
export function formatDate(dateString: string | null): string {
  if (!dateString) return "N/A";
  try {
    return format(parseISO(dateString), "MMM d, yyyy");
  } catch {
    return "Invalid date";
  }
}

/**
 * Format a date range from earliest to latest
 */
export function formatDateRange(
  dateRange: AssociationSummary["dateRange"]
): string {
  if (!dateRange.earliest || !dateRange.latest) {
    return "N/A";
  }

  try {
    const earliest = format(parseISO(dateRange.earliest), "MMM d, yyyy");
    const latest = format(parseISO(dateRange.latest), "MMM d, yyyy");
    return `${earliest} - ${latest}`;
  } catch {
    return "Invalid date";
  }
}

