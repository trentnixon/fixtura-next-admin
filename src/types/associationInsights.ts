/**
 * Association Insights Types for Association Admin Insights API
 *
 * This file contains comprehensive TypeScript type definitions for the Association Admin Insights API endpoint.
 * Based on the documentation in src/app/dashboard/association/CMS_Handover.md
 * Updated with competition date range support for Gantt chart visualization
 */

// ============================================================================
// COMPETITION DATE RANGE TYPES
// ============================================================================

import type { CompetitionDateRange } from "./shared";

// ============================================================================
// MAIN RESPONSE TYPE
// ============================================================================

/**
 * Main response wrapper for Association Admin Insights API
 */
export interface AssociationInsightsResponse {
  data: {
    overview: AssociationInsightsOverview;
    gradesAndClubs: AssociationInsightsGradesAndClubs;
    competitions: AssociationInsightsCompetitions;
    associations: AssociationDetail[];
    meta: AssociationInsightsMeta;
  };
}

// ============================================================================
// OVERVIEW ANALYTICS TYPES
// ============================================================================

/**
 * Overview analytics containing high-level association statistics
 */
export interface AssociationInsightsOverview {
  totalAssociations: number;
  activeAssociations: number;
  inactiveAssociations: number;
  associationsWithAccounts: number;
  associationsWithoutAccounts: number;
  sportDistribution: {
    Cricket: number;
    AFL: number;
    Hockey: number;
    Netball: number;
    Basketball: number;
  } | null;
  associationsByAccountCount: {
    zero: number;
    one: number;
    twoToFive: number;
    sixPlus: number;
  };
}

// ============================================================================
// GRADES & CLUBS ANALYTICS TYPES
// ============================================================================

/**
 * Analytics for grades and clubs across all associations
 */
export interface AssociationInsightsGradesAndClubs {
  totalGrades: number;
  totalClubs: number;
  averageGradesPerAssociation: number;
  averageClubsPerAssociation: number;
  gradeDistribution: {
    zero: number;
    oneToFive: number;
    sixToTen: number;
    elevenPlus: number;
  };
  clubDistribution: {
    zero: number;
    oneToFive: number;
    sixToTen: number;
    elevenToTwenty: number;
    twentyOnePlus: number;
  };
}

// ============================================================================
// COMPETITION ANALYTICS TYPES
// ============================================================================

/**
 * Analytics for competitions across all associations
 */
export interface AssociationInsightsCompetitions {
  totalCompetitions: number;
  activeCompetitions: number;
  inactiveCompetitions: number;
  competitionsByStatus: Record<string, number>;
  competitionSizeDistribution: {
    small: number;      // 1-5 teams
    medium: number;     // 6-20 teams
    large: number;      // 21-50 teams
    xlarge: number;     // 51+ teams
  };
  competitionGradeDistribution: {
    single: number;    // 1 grade
    few: number;       // 2-5 grades
    many: number;      // 6-10 grades
    extensive: number; // 11+ grades
  };
  datePatterns: {
    competitionsStartingThisMonth: number;
    competitionsEndingThisMonth: number;
    competitionsStartingNextMonth: number;
    competitionsEndingNextMonth: number;
    averageCompetitionDurationDays: number;
    earliestStartDate: string | null;
    latestEndDate: string | null;
  };
}

// ============================================================================
// ASSOCIATION DETAIL TYPES
// ============================================================================

/**
 * Consolidated per-association metrics
 * Contains aggregated data from grades, clubs, and competitions
 * Includes competition date range information for Gantt chart visualization
 */
export interface AssociationDetail {
  id: number;
  name: string;
  href: string | null;
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
  /** Competition date range information for Gantt chart visualization */
  competitionDateRange: CompetitionDateRange | null;
}

// ============================================================================
// METADATA TYPES
// ============================================================================

/**
 * Response metadata including filters, data points, and performance metrics
 */
export interface AssociationInsightsMeta {
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

// ============================================================================
// LEGACY TYPE ALIASES (for backward compatibility)
// ============================================================================

/**
 * @deprecated Use AssociationInsightsOverview instead
 */
export type OverviewAnalytics = AssociationInsightsOverview;

/**
 * @deprecated Use AssociationInsightsGradesAndClubs instead
 */
export type GradesAndClubsAnalytics = AssociationInsightsGradesAndClubs;

/**
 * @deprecated Use AssociationInsightsCompetitions instead
 */
export type AssociationCompetitionAnalytics = AssociationInsightsCompetitions;

/**
 * @deprecated Use AssociationInsightsMeta instead
 */
export type Metadata = AssociationInsightsMeta;

/**
 * @deprecated Use SportDistribution from AssociationInsightsOverview instead
 */
export interface SportDistribution {
  Cricket: number;
  AFL: number;
  Hockey: number;
  Netball: number;
  Basketball: number;
}

/**
 * @deprecated Use associationsByAccountCount from AssociationInsightsOverview instead
 */
export interface AccountCountDistribution {
  zero: number;
  one: number;
  twoToFive: number;
  sixPlus: number;
}

/**
 * @deprecated Use gradeDistribution from AssociationInsightsGradesAndClubs instead
 */
export interface GradeDistribution {
  zero: number;
  oneToFive: number;
  sixToTen: number;
  elevenPlus: number;
}

/**
 * @deprecated Use clubDistribution from AssociationInsightsGradesAndClubs instead
 */
export interface ClubDistribution {
  zero: number;
  oneToFive: number;
  sixToTen: number;
  elevenToTwenty: number;
  twentyOnePlus: number;
}

/**
 * @deprecated Use competitionSizeDistribution from AssociationInsightsCompetitions instead
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
 * @deprecated Use competitionGradeDistribution from AssociationInsightsCompetitions instead
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
 * @deprecated Use datePatterns from AssociationInsightsCompetitions instead
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
