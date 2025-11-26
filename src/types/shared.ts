/**
 * Shared type definitions used across multiple type modules
 * This file contains types that are common to multiple API responses
 */

// ============================================================================
// COMPETITION DATE RANGE TYPES
// ============================================================================

/**
 * Competition date range information
 * Contains earliest start date and latest end date across all competitions
 * Used by both Association and Club insights
 */
export interface CompetitionDateRange {
  /** Earliest start date across all competitions (ISO string or null) */
  earliestStartDate: string | null;
  /** Latest end date across all competitions (ISO string or null) */
  latestEndDate: string | null;
  /** Number of competitions with valid start AND end dates */
  competitionsWithValidDates: number;
  /** Total number of competitions (for reference) */
  totalCompetitions: number;
}
