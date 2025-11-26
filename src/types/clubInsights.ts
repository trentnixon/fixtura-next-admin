/**
 * Club Insights Types for Club Admin Insights API
 *
 * This file contains comprehensive TypeScript type definitions for the Club Admin Insights API endpoint.
 * Based on the documentation in src/app/dashboard/club/route_notes.md
 * Updated with competition date range support for Gantt chart visualization
 */

// ============================================================================
// MAIN RESPONSE TYPE
// ============================================================================

/**
 * Main response wrapper for Club Admin Insights API
 */
export interface ClubInsightsResponse {
  data: ClubInsightsData;
}

export interface ClubInsightsData {
  overview: ClubOverview;
  distributions: Distributions;
  clubs: ClubInsight[];
  teams: TeamsInsights;
  accounts: AccountsInsights;
  insights: Insights;
  meta: Meta;
}

// ============================================================================
// OVERVIEW TYPES
// ============================================================================

/**
 * Overview statistics for clubs
 */
export interface ClubOverview {
  totalClubs: number;
  activeClubs: number;
  inactiveClubs: number;
  clubsWithAccounts: number;
  clubsWithoutAccounts: number;
  sport: string;
  associationsCount: number;
  averageTeamsPerClub: number;
  averageCompetitionsPerClub: number;
}

// ============================================================================
// DISTRIBUTIONS TYPES
// ============================================================================

/**
 * Distribution analytics for clubs
 */
export interface Distributions {
  clubsByTeams: ClubsByTeamsDistribution;
  clubsByCompetitions: ClubsByCompetitionsDistribution;
  clubsByAssociations: ClubsByAssociationsDistribution;
  clubsByAccountCoverage: ClubsByAccountCoverageDistribution;
}

/**
 * Distribution of clubs by team count ranges
 */
export interface ClubsByTeamsDistribution {
  zero: number;
  oneToFive: number;
  sixToTen: number;
  elevenToTwenty: number;
  twentyOnePlus: number;
}

/**
 * Distribution of clubs by competition count ranges
 */
export interface ClubsByCompetitionsDistribution {
  zero: number;
  one: number;
  twoToThree: number;
  fourToSix: number;
  sevenPlus: number;
}

/**
 * Distribution of clubs by association count ranges
 */
export interface ClubsByAssociationsDistribution {
  zero: number;
  one: number;
  twoToThree: number;
  fourPlus: number;
}

/**
 * Distribution of clubs by account coverage
 */
export interface ClubsByAccountCoverageDistribution {
  withAccounts: number;
  withoutAccounts: number;
  withTrials: number;
}

// ============================================================================
// COMPETITION DATE RANGE TYPES
// ============================================================================

import type { CompetitionDateRange } from "./shared";

// ============================================================================
// CLUB TYPES
// ============================================================================

/**
 * Club detail in the insights response
 * Includes competition date range information for Gantt chart visualization
 */
export interface ClubInsight {
  id: number;
  name: string;
  sport: string;
  logoUrl: string;
  associationNames: string[];
  associationCount: number;
  teamCount: number;
  competitionCount: number;
  hasAccount: boolean;
  /** Competition date range information for Gantt chart visualization */
  competitionDateRange: CompetitionDateRange | null;
}

// ============================================================================
// TEAMS INSIGHTS TYPES
// ============================================================================

/**
 * Teams insights across all clubs
 */
export interface TeamsInsights {
  totalTeams: number;
  averageTeamsPerClub: number;
}

// ============================================================================
// ACCOUNTS INSIGHTS TYPES
// ============================================================================

/**
 * Accounts insights across all clubs
 */
export interface AccountsInsights {
  totalAccounts: number;
  /** Currently null, can be populated when account.isActive is available */
  activeAccounts: number | null;
  clubsWithAccounts: number;
  clubsWithTrials: number;
  clubsWithActiveTrials: number;
}

// ============================================================================
// INSIGHTS TYPES
// ============================================================================

/**
 * Competition insights and timeline
 */
export interface Insights {
  competitionTimeline: CompetitionTimelineEntry[];
}

/**
 * Competition timeline entry for a specific month
 */
export interface CompetitionTimelineEntry {
  /** Format: "YYYY-MM" (e.g., "2024-09") */
  month: string;
  competitionsStarting: number;
  competitionsEnding: number;
  competitionsActive: number;
}

// ============================================================================
// META TYPES
// ============================================================================

/**
 * Response metadata including data points and performance metrics
 */
export interface Meta {
  sport: string;
  /** ISO 8601 timestamp */
  generatedAt: string;
  dataPoints: DataPoints;
  performance: ClubInsightsPerformanceMetrics;
}

/**
 * Data point counts used in the response
 */
export interface DataPoints {
  clubs: number;
  associations: number;
  competitions: number;
  teams: number;
  accounts: number;
}

/**
 * Performance metrics for the API response
 */
export interface ClubInsightsPerformanceMetrics {
  /** Fetch time in milliseconds */
  fetchTimeMs: number;
  /** Calculation time in milliseconds */
  calculationTimeMs: number;
  /** Total time in milliseconds */
  totalTimeMs: number;
}

// ============================================================================
// SPORT FILTER TYPES
// ============================================================================

/**
 * Valid sport filter values for the Club Insights API
 * Note: Sport parameter is REQUIRED for club insights (unlike association insights)
 */
export type ClubSportFilter =
  | "Cricket"
  | "AFL"
  | "Hockey"
  | "Netball"
  | "Basketball";

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard to check if a club has a valid competition date range
 */
export function hasCompetitionDateRange(
  club: ClubInsight
): club is ClubInsight & { competitionDateRange: CompetitionDateRange } {
  return (
    club.competitionDateRange !== null &&
    club.competitionDateRange !== undefined &&
    club.competitionDateRange.earliestStartDate !== null &&
    club.competitionDateRange.latestEndDate !== null
  );
}

/**
 * Type guard to check if response is a successful ClubInsightsResponse
 */
export function isClubInsightsResponse(
  response: unknown
): response is ClubInsightsResponse {
  return (
    typeof response === "object" &&
    response !== null &&
    "data" in response &&
    typeof (response as { data: unknown }).data === "object" &&
    (response as { data: { clubs?: unknown } }).data !== null &&
    "clubs" in (response as { data: { clubs?: unknown } }).data
  );
}
