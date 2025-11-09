export type CompetitionAdminStatsSummary = {
  totals: {
    competitions: number;
    active: number;
    inactive: number;
  };
  breakdowns: {
    bySeason: Array<{ season: string; count: number }>;
    byStatus: Array<{ status: string; count: number }>;
  };
  timing: {
    started: number;
    upcoming: number;
    withoutStartDate: number;
  };
  duration: {
    averageDays: number | null;
    shortestDays: number | null;
    longestDays: number | null;
  };
};

export type CompetitionAdminStatsAvailableCompetition = {
  id: number;
  name: string;
  season: string | null;
  associationName: string | null;
  sport: string | null;
  gradeCount: number;
  sizeCategory: "none" | "small" | "medium" | "large";
  weight: number;
  durationDays: number | null;
  startDate?: string | null;
};

export type CompetitionAdminStatsTables = {
  available: CompetitionAdminStatsAvailableCompetition[];
};

export type CompetitionAdminStatsCharts = {
  byStatus: Array<{ status: string; count: number }>;
  byTiming: Array<{
    timing: "started" | "upcoming" | "unknown";
    count: number;
  }>;
  sizeCategories: Array<{
    category: "none" | "small" | "medium" | "large";
    count: number;
  }>;
};

export type CompetitionAdminStatsHighlightTitle =
  | "Most Teams"
  | "Most Clubs"
  | "Next Start"
  | "Latest Sync"
  | "Longest Duration"
  | "Active Competitions"
  | "Largest By Grades";

export type CompetitionAdminStatsHighlight = {
  title: CompetitionAdminStatsHighlightTitle;
  competitionId: number | null;
  competitionName: string | null;
  value: string | number;
};

export type CompetitionAdminStatsFacts = {
  highlights: CompetitionAdminStatsHighlight[];
};

export type CompetitionAdminStatsResponse = {
  summary: CompetitionAdminStatsSummary;
  tables: CompetitionAdminStatsTables;
  charts: CompetitionAdminStatsCharts;
  facts: CompetitionAdminStatsFacts;
};

export type FetchCompetitionAdminStatsParams = {
  associationId?: number;
  season?: string;
};
