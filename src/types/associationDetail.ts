/**
 * Association Detail Types for Association Admin Detail API
 *
 * This file contains comprehensive TypeScript type definitions for the Association Admin Detail API endpoint.
 * Based on the documentation in src/app/dashboard/association/[id]/HandoverFromCMS.md
 */

// ============================================================================
// MAIN RESPONSE TYPE
// ============================================================================

/**
 * Main response wrapper for Association Admin Detail API
 */
export interface AssociationDetailResponse {
  data: {
    association: AssociationDetail;
    statistics: AssociationStatistics;
    competitions: CompetitionDetail[];
    clubs: ClubDetail[];
    accounts: AccountDetail[];
    insights: InsightsData;
    meta: Metadata;
  };
}

// ============================================================================
// CORE ASSOCIATION DATA TYPES
// ============================================================================

/**
 * Core association data with contact information, location, and website details
 */
export interface AssociationDetail {
  id: number;
  name: string;
  sport: string;
  /** External link to association (e.g., PlayHQ URL) */
  href: string | null;
  /** Logo URL (Logo.url || PlayHQLogo.url || default logo) - always returns a string */
  logoUrl: string;
  /** PlayHQ organization identifier */
  playHqId: string | null;
  /** Contact information - can be null if not available */
  contactDetails: ContactDetails | null;
  /** Location information - can be null if not available */
  location: Location | null;
  /** Website information - can be null if not available */
  website: Website | null;
  /** Active status based on publishedAt */
  isActive: boolean;
  /** ISO timestamp */
  createdAt: string;
  /** ISO timestamp */
  updatedAt: string;
}

/**
 * Contact details for the association
 */
export interface ContactDetails {
  phone: string | null;
  email: string | null;
  address: string | null;
}

/**
 * Location information for the association
 */
export interface Location {
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  /** Geographic coordinates - can be null if not available */
  coordinates: Coordinates | null;
}

/**
 * Geographic coordinates (latitude and longitude)
 */
export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Website information for the association
 */
export interface Website {
  website: string | null;
  domain: string | null;
}

// ============================================================================
// STATISTICS TYPES
// ============================================================================

/**
 * Comprehensive statistics for the association
 */
export interface AssociationStatistics {
  competitions: CompetitionStatistics;
  grades: GradeStatistics;
  clubs: ClubStatistics;
  teams: TeamStatistics;
  accounts: AccountStatistics;
  /** Trial status - can be null if no trial instance exists */
  trial: TrialStatus | null;
}

/**
 * Competition statistics breakdown
 */
export interface CompetitionStatistics {
  total: number;
  active: number;
  upcoming: number;
  completed: number;
  /** Dynamic status keys with competition counts */
  byStatus: Record<string, number>;
}

/**
 * Grade statistics breakdown
 */
export interface GradeStatistics {
  total: number;
  withTeams: number;
  withoutTeams: number;
}

/**
 * Club statistics breakdown
 */
export interface ClubStatistics {
  total: number;
  /** Active clubs based on publishedAt */
  active: number;
  withCompetitions: number;
}

/**
 * Team statistics breakdown
 */
export interface TeamStatistics {
  total: number;
  acrossCompetitions: number;
  acrossGrades: number;
}

/**
 * Account statistics breakdown
 */
export interface AccountStatistics {
  total: number;
  active: number;
  withOrders: number;
}

/**
 * Trial status information
 */
export interface TrialStatus {
  hasTrial: boolean;
  isActive: boolean | null;
}

// ============================================================================
// COMPETITION DETAIL TYPES
// ============================================================================

/**
 * Detailed competition information with timeline, grades, and clubs
 */
export interface CompetitionDetail {
  id: number;
  name: string;
  season: string | null;
  /** Date string - can be null if not set */
  startDate: string | null;
  /** Date string - can be null if not set */
  endDate: string | null;
  status: string | null;
  isActive: boolean;
  /** PlayHQ URL - can be null */
  url: string | null;
  gradeCount: number;
  teamCount: number;
  /** Unique clubs across grades/teams */
  clubCount: number;
  timeline: CompetitionTimeline;
  grades: GradeDetail[];
  clubs: CompetitionClubDetail[];
}

/**
 * Competition timeline information for progress tracking
 */
export interface CompetitionTimeline {
  /** Timeline status: "upcoming" | "in_progress" | "completed" | "unknown" */
  status: "upcoming" | "in_progress" | "completed" | "unknown";
  /** Total days - can be null if dates are invalid */
  daysTotal: number | null;
  /** Days elapsed - can be null if dates are invalid */
  daysElapsed: number | null;
  /** Days remaining - can be null if dates are invalid */
  daysRemaining: number | null;
  /** Progress percentage (0-100) - can be null */
  progressPercent: number | null;
}

/**
 * Grade detail within a competition
 */
export interface GradeDetail {
  id: number;
  name: string;
  gender: string | null;
  ageGroup: string | null;
  teamCount: number;
}

/**
 * Club detail within a competition
 */
export interface CompetitionClubDetail {
  id: number;
  name: string;
  /** Logo URL (Logo.url || PlayHQLogo.url || default logo) - can be null */
  logoUrl: string | null;
  /** Teams in this competition */
  teamCount: number;
}

// ============================================================================
// CLUB DETAIL TYPES
// ============================================================================

/**
 * Detailed club information with competition and team counts
 */
export interface ClubDetail {
  id: number;
  name: string;
  sport: string;
  /** External link to club (e.g., PlayHQ URL) */
  href: string | null;
  /** Logo URL (Logo.url || PlayHQLogo.url || default logo) - can be null */
  logoUrl: string | null;
  /** PlayHQ organization identifier */
  playHqId: string | null;
  /** Competitions this club participates in (for this association) */
  competitionCount: number;
  /** Total teams across all competitions (for this association) */
  teamCount: number;
  isActive: boolean;
}

// ============================================================================
// ACCOUNT DETAIL TYPES
// ============================================================================

/**
 * Detailed account information with type and subscription details
 */
export interface AccountDetail {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  accountType: AccountType | null;
  subscriptionTier: SubscriptionTier | null;
  isActive: boolean;
  isSetup: boolean;
  hasActiveOrder: boolean;
}

/**
 * Account type information
 */
export interface AccountType {
  id: number;
  name: string;
}

/**
 * Subscription tier information
 */
export interface SubscriptionTier {
  id: number;
  name: string;
}

// ============================================================================
// INSIGHTS TYPES (Phase 8 - Currently Empty)
// ============================================================================

/**
 * Insights data (Phase 8 - Currently empty object, reserved for future implementation)
 * Structure is defined for future enhancement
 */
export interface InsightsData {
  competitionTimeline?: CompetitionTimelineEntry[];
  activityPatterns?: {
    byMonth?: MonthActivity[];
    bySeason?: SeasonActivity[];
  };
  growthTrends?: {
    competitionsOverTime?: YearCount[];
    clubsOverTime?: YearCount[];
  };
}

/**
 * Competition timeline entry for insights
 */
export interface CompetitionTimelineEntry {
  /** ISO date */
  date: string;
  /** Active competitions on this date */
  competitions: number;
  /** Competitions starting on this date */
  starting: number;
  /** Competitions ending on this date */
  ending: number;
}

/**
 * Monthly activity pattern
 */
export interface MonthActivity {
  /** Month in YYYY-MM format */
  month: string;
  competitionsStarted: number;
  competitionsEnded: number;
  competitionsActive: number;
}

/**
 * Seasonal activity pattern
 */
export interface SeasonActivity {
  season: string;
  competitionCount: number;
  averageDuration: number;
}

/**
 * Year-over-year count data
 */
export interface YearCount {
  year: number;
  count: number;
}

// ============================================================================
// METADATA TYPES
// ============================================================================

/**
 * Response metadata including data points and performance metrics
 */
export interface Metadata {
  /** ISO timestamp of when the data was generated */
  generatedAt: string;
  dataPoints: {
    competitions: number;
    grades: number;
    clubs: number;
    teams: number;
    accounts: number;
  };
  performance: {
    /** Fetch time in milliseconds */
    fetchTimeMs: number;
    /** Calculation time in milliseconds */
    calculationTimeMs: number;
    /** Total time in milliseconds */
    totalTimeMs: number;
  };
}
