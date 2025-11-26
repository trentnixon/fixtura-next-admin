/**
 * TypeScript Type Definitions for Cricket Fixture Insights API
 *
 * This file contains all type definitions for the Fixture Insights API endpoints:
 * - GET /api/game-meta-data/admin/insights - Overview insights with categorized summaries
 * - GET /api/game-meta-data/admin/fixtures - Detailed fixtures (with optional filters)
 *
 * @see handOverNotes.md for full API documentation
 */

// ============================================================================
// Core Response Types
// ============================================================================

/**
 * Complete response structure from the insights endpoint
 */
export interface FixtureInsightsResponse {
  data: {
    overview: FixtureOverview;
    categories: FixtureCategories;
    charts: FixtureCharts;
    distributions: FixtureDistributions;
    meta: FixtureInsightsMeta;
  };
}

/**
 * Complete response structure from the detailed fixtures endpoint
 */
export interface FixtureDetailsResponse {
  data: {
    fixtures: FixtureSummary[];
    filters: FixtureFilters;
    meta: FixtureDetailsMeta;
  };
}

// ============================================================================
// Overview Types
// ============================================================================

/**
 * Overview statistics for cricket fixtures
 */
export interface FixtureOverview {
  totalFixtures: number;
  fixturesInRange: number;
  fixturesPast: number;
  fixturesFuture: number;
  fixturesToday: number;
  fixturesPastPercentage: number;
  fixturesFuturePercentage: number;
  fixturesTodayPercentage: number;
  uniqueCompetitions: number;
  uniqueAssociations: number;
  uniqueGrades: number;
  uniqueGrounds: number;
  averages: {
    fixturesPerCompetition: number;
    fixturesPerAssociation: number;
    fixturesPerGrade: number;
  };
  dateRange: {
    start: string; // ISO 8601
    end: string; // ISO 8601
    today: string; // ISO 8601
  };
}

// ============================================================================
// Category Types
// ============================================================================

/**
 * Categorized fixture summaries (NOT full fixtures)
 */
export interface FixtureCategories {
  byAssociation: AssociationSummary[];
  byCompetition: CompetitionSummary[];
  byGrade: GradeSummary[];
}

/**
 * Summary of fixtures by association
 */
export interface AssociationSummary {
  associationId: number;
  associationName: string;
  logoUrl: string; // Logo.url || PlayHQLogo.url || default logo
  fixtureCount: number;
  competitionCount: number;
  gradeCount: number;
  dateRange: {
    earliest: string | null; // ISO 8601
    latest: string | null; // ISO 8601
  };
}

/**
 * Summary of fixtures by competition
 */
export interface CompetitionSummary {
  competitionId: number;
  competitionName: string;
  associationName: string;
  fixtureCount: number;
  gradeCount: number;
  dateRange: {
    earliest: string | null; // ISO 8601
    latest: string | null; // ISO 8601
  };
}

/**
 * Summary of fixtures by grade
 */
export interface GradeSummary {
  gradeId: number;
  gradeName: string;
  competitionName: string;
  associationName: string;
  fixtureCount: number;
  dateRange: {
    earliest: string | null; // ISO 8601
    latest: string | null; // ISO 8601
  };
}

// ============================================================================
// Chart Types
// ============================================================================

/**
 * Chart-ready time series data
 */
export interface FixtureCharts {
  fixtureTimeline: FixtureTimelineEntry[];
  fixtureDistributionByMonth: MonthlyDistribution[];
  fixtureDistributionByWeek: WeeklyDistribution[];
}

/**
 * Timeline entry showing fixture count and status breakdown for a specific date
 */
export interface FixtureTimelineEntry {
  date: string; // YYYY-MM-DD
  fixtureCount: number;
  statusBreakdown: {
    upcoming: number;
    inProgress: number;
    finished: number;
    cancelled: number;
    unknown: number;
  };
}

/**
 * Monthly distribution of fixtures
 */
export interface MonthlyDistribution {
  month: string; // YYYY-MM
  fixtureCount: number;
  competitionsActive: number;
}

/**
 * Weekly distribution of fixtures
 */
export interface WeeklyDistribution {
  week: string; // YYYY-WW (ISO week format)
  fixtureCount: number;
}

// ============================================================================
// Distribution Types
// ============================================================================

/**
 * Distribution data by various metrics
 */
export interface FixtureDistributions {
  byStatus: StatusDistribution;
  byCompetition: FixtureCompetitionDistribution[];
  byAssociation: FixtureAssociationDistribution[];
  byGrade: FixtureGradeDistribution[];
  byDayOfWeek: DayOfWeekDistribution;
}

/**
 * Distribution of fixtures by status
 */
export interface StatusDistribution {
  upcoming: number;
  inProgress: number;
  finished: number;
  cancelled: number;
  unknown: number;
}

/**
 * Distribution of fixtures by competition
 */
export interface FixtureCompetitionDistribution {
  competitionId: number;
  competitionName: string;
  count: number;
  percentage: number;
}

/**
 * Distribution of fixtures by association
 */
export interface FixtureAssociationDistribution {
  associationId: number;
  associationName: string;
  count: number;
  percentage: number;
}

/**
 * Distribution of fixtures by grade
 */
export interface FixtureGradeDistribution {
  gradeId: number;
  gradeName: string;
  count: number;
  percentage: number;
}

/**
 * Distribution of fixtures by day of week
 */
export interface DayOfWeekDistribution {
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  sunday: number;
}

// ============================================================================
// Fixture Summary Types
// ============================================================================

/**
 * Simplified fixture data for table display (from detailed fixtures endpoint)
 */
export interface FixtureSummary {
  id: number;
  date: string | null; // YYYY-MM-DD
  round: string | null;
  status: string | null;
  type: string | null;
  teams: {
    home: string | null;
    away: string | null;
  };
  grade: {
    id: number;
    name: string;
  } | null;
  competition: {
    id: number;
    name: string;
  } | null;
  association: {
    id: number;
    name: string;
  } | null;
}

// ============================================================================
// Filter Types
// ============================================================================

/**
 * Optional filters for detailed fixtures endpoint
 */
export interface FixtureFilters {
  association?: number;
  grade?: number;
  competition?: number;
}

// ============================================================================
// Meta Types
// ============================================================================

/**
 * Metadata for fixture insights response
 */
export interface FixtureInsightsMeta {
  generatedAt: string; // ISO 8601
  dateRange: {
    start: string; // ISO 8601
    end: string; // ISO 8601
    today: string; // ISO 8601
  };
  dataPoints: {
    fixtures: number;
    competitions: number;
    associations: number;
    grades: number;
  };
  performance: {
    fetchTimeMs: number;
    calculationTimeMs: number;
    totalTimeMs: number;
  };
}

/**
 * Metadata for fixture details response
 */
export interface FixtureDetailsMeta {
  total: number;
  dateRange: {
    start: string; // ISO 8601
    end: string; // ISO 8601
  };
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard to check if a response is a valid FixtureInsightsResponse
 * @param response - The response to check
 * @returns True if the response matches the FixtureInsightsResponse structure
 */
export function isFixtureInsightsResponse(
  response: unknown
): response is FixtureInsightsResponse {
  if (
    typeof response !== "object" ||
    response === null ||
    !("data" in response)
  ) {
    return false;
  }

  const data = (response as { data: unknown }).data;
  if (typeof data !== "object" || data === null) {
    return false;
  }

  return (
    "overview" in data &&
    "categories" in data &&
    "charts" in data &&
    "distributions" in data &&
    "meta" in data
  );
}

/**
 * Type guard to check if a response is a valid FixtureDetailsResponse
 * @param response - The response to check
 * @returns True if the response matches the FixtureDetailsResponse structure
 */
export function isFixtureDetailsResponse(
  response: unknown
): response is FixtureDetailsResponse {
  if (
    typeof response !== "object" ||
    response === null ||
    !("data" in response)
  ) {
    return false;
  }

  const data = (response as { data: unknown }).data;
  if (typeof data !== "object" || data === null) {
    return false;
  }

  return (
    "fixtures" in data &&
    Array.isArray((data as { fixtures: unknown }).fixtures) &&
    "filters" in data &&
    "meta" in data
  );
}
