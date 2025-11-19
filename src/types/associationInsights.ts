/**
 * Association Insights Types for Association Admin Insights API
 *
 * This file contains comprehensive TypeScript type definitions for the Association Admin Insights API endpoint.
 * Based on the documentation in src/app/dashboard/association/CMS_Handover.md
 */

// ============================================================================
// MAIN RESPONSE TYPE
// ============================================================================

/**
 * Main response wrapper for Association Admin Insights API
 */
export interface AssociationInsightsResponse {
  data: {
    overview: OverviewAnalytics;
    gradesAndClubs: GradesAndClubsAnalytics;
    competitions: AssociationCompetitionAnalytics;
    associations: AssociationDetail[];
    meta: Metadata;
  };
}

// ============================================================================
// OVERVIEW ANALYTICS TYPES
// ============================================================================

/**
 * Overview analytics containing high-level association statistics
 */
export interface OverviewAnalytics {
  totalAssociations: number;
  activeAssociations: number;
  inactiveAssociations: number;
  associationsWithAccounts: number;
  associationsWithoutAccounts: number;
  /**
   * Sport distribution by type. Null when filtering by a specific sport.
   */
  sportDistribution: SportDistribution | null;
  associationsByAccountCount: AccountCountDistribution;
}

/**
 * Distribution of associations across different sports
 */
export interface SportDistribution {
  Cricket: number;
  AFL: number;
  Hockey: number;
  Netball: number;
  Basketball: number;
}

/**
 * Distribution of associations by number of associated accounts
 */
export interface AccountCountDistribution {
  zero: number;
  one: number;
  twoToFive: number;
  sixPlus: number;
}

// ============================================================================
// GRADES & CLUBS ANALYTICS TYPES
// ============================================================================

/**
 * Analytics for grades and clubs across all associations
 */
export interface GradesAndClubsAnalytics {
  totalGrades: number;
  totalClubs: number;
  averageGradesPerAssociation: number;
  averageClubsPerAssociation: number;
  gradeDistribution: GradeDistribution;
  clubDistribution: ClubDistribution;
}

/**
 * Distribution of associations by number of grades
 */
export interface GradeDistribution {
  zero: number;
  oneToFive: number;
  sixToTen: number;
  elevenPlus: number;
}

/**
 * Distribution of associations by number of clubs
 */
export interface ClubDistribution {
  zero: number;
  oneToFive: number;
  sixToTen: number;
  elevenToTwenty: number;
  twentyOnePlus: number;
}

// ============================================================================
// COMPETITION ANALYTICS TYPES
// ============================================================================

/**
 * Analytics for competitions across all associations
 */
export interface AssociationCompetitionAnalytics {
  totalCompetitions: number;
  activeCompetitions: number;
  inactiveCompetitions: number;
  /**
   * Dynamic status keys with competition counts
   */
  competitionsByStatus: Record<string, number>;
  competitionSizeDistribution: CompetitionSizeDistribution;
  competitionGradeDistribution: CompetitionGradeDistribution;
  datePatterns: DatePatterns;
}

/**
 * Distribution of competitions by team size
 */
export interface CompetitionSizeDistribution {
  /** 1-5 teams */
  small: number;
  /** 6-20 teams */
  medium: number;
  /** 21-50 teams */
  large: number;
  /** 51+ teams */
  xlarge: number;
}

/**
 * Distribution of competitions by number of grades
 */
export interface CompetitionGradeDistribution {
  /** 1 grade */
  single: number;
  /** 2-5 grades */
  few: number;
  /** 6-10 grades */
  many: number;
  /** 11+ grades */
  extensive: number;
}

/**
 * Date patterns and temporal analytics for competitions
 */
export interface DatePatterns {
  competitionsStartingThisMonth: number;
  competitionsEndingThisMonth: number;
  competitionsStartingNextMonth: number;
  competitionsEndingNextMonth: number;
  /** Average duration in days */
  averageCompetitionDurationDays: number;
  /** ISO timestamp or null if no valid dates exist */
  earliestStartDate: string | null;
  /** ISO timestamp or null if no valid dates exist */
  latestEndDate: string | null;
}

// ============================================================================
// ASSOCIATION DETAIL TYPES
// ============================================================================

/**
 * Consolidated per-association metrics
 * Contains aggregated data from grades, clubs, and competitions
 */
export interface AssociationDetail {
  id: number;
  name: string;
  /** External link to association (e.g., website) */
  href: string | null;
  /** Logo URL (Logo.url || PlayHQLogo.url || default logo) */
  logoUrl: string;
  gradeCount: number;
  clubCount: number;
  competitionCount: number;
  activeCompetitionCount: number;
  competitionTeams: number;
  competitionGrades: number;
  averageTeamsPerCompetition: number;
  averageGradesPerCompetition: number;
  /**
   * Sport type. Only present when NOT filtering by sport.
   */
  sport?: string;
}

// ============================================================================
// METADATA TYPES
// ============================================================================

/**
 * Response metadata including filters, data points, and performance metrics
 */
export interface Metadata {
  /** ISO timestamp of when the data was generated */
  generatedAt: string;
  filters: {
    sport: string | null;
  };
  dataPoints: {
    associations: number;
    competitions: number;
    grades: number;
    clubs: number;
    teams: number;
  };
  performance: {
    /** Fetch time in milliseconds */
    fetchTimeMs: number;
    /** Calculation time in milliseconds */
    calculationTimeMs: number;
    /** Total time in milliseconds */
    totalTimeMs: number;
    breakdown: {
      /** Percentage of total time spent fetching */
      fetchPercentage: number;
      /** Percentage of total time spent calculating */
      calculationPercentage: number;
    };
  };
}

// ============================================================================
// SPORT FILTER TYPES
// ============================================================================

/**
 * Valid sport filter values for the API
 */
export type SportFilter =
  | "Cricket"
  | "AFL"
  | "Hockey"
  | "Netball"
  | "Basketball";
