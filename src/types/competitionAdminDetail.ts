export type CompetitionMedia = {
  url: string | null;
  formats?: unknown;
};

export type CompetitionAccount = {
  id: number;
  firstName: string | null;
  lastName: string | null;
  name: string | null;
};

export type CompetitionTimelineSummary = {
  status: "upcoming" | "in_progress" | "completed" | "unknown";
  daysTotal: number | null;
  daysElapsed: number | null;
  daysRemaining: number | null;
  daysUntilStart: number | null;
  daysSinceEnd: number | null;
  progressPercent: number | null;
  startDate: string | null;
  endDate: string | null;
};

export type CompetitionAnalyticsSummary = {
  accountCoverage: {
    association: {
      hasAccount: boolean;
      accountCount: number;
      accountNames: string[];
    };
    clubs: {
      total: number;
      withAccount: number;
      withoutAccount: number;
      coveragePercent: number;
    };
  };
  gradeStructure: {
    gradeCount: number;
    totalTeams: number;
    averageTeamsPerGrade: number;
    largestGrade: { id: number; name: string; teamCount: number } | null;
    smallestGrade: { id: number; name: string; teamCount: number } | null;
    imbalance: number;
  };
  timeline: CompetitionTimelineSummary;
  logoCompleteness: {
    clubsWithLogo: number;
    clubsWithoutLogo: number;
    coveragePercent: number;
  };
};

export type CompetitionAnalyticsTables = {
  grades: Array<{
    id: number;
    name: string;
    gender: string | null;
    ageGroup: string | null;
    gradeCode: string | null;
    teamCount: number;
    teamsWithFixturaAccount: number;
    teamsWithoutFixturaAccount: number;
    accountCoveragePercent: number;
    clubsRepresented: number;
  }>;
  clubs: Array<{
    id: number;
    name: string;
    hasFixturaAccount: boolean;
    accountNames: string[];
    teamCount: number;
    grades: string[];
    competitionUrl: string | null;
    hasLogo: boolean;
  }>;
  teams: Array<{
    id: number;
    name: string;
    gender: string | null;
    ageGroup: string | null;
    clubId: number | null;
    clubName: string | null;
    clubHasFixturaAccount: boolean;
    clubAccountNames: string[];
    hasLogo: boolean;
    grades: Array<{ id: number; name: string | null }>;
  }>;
};

export type CompetitionAnalyticsCharts = {
  gradeDistribution: Array<{
    gradeId: number;
    gradeName: string;
    teamCount: number;
  }>;
  clubAccountPenetration: Array<{ label: string; count: number }>;
  timelineProgress: Array<{ segment: "elapsed" | "remaining"; days: number }>;
};

export type CompetitionAnalyticsInsights = {
  clubsMissingAccounts: Array<{
    id: number;
    name: string;
    teamCount: number;
    grades: string[];
  }>;
  gradesNeedingAccountSupport: Array<{
    id: number;
    name: string;
    teamCount: number;
  }>;
};

export type CompetitionAnalytics = {
  summary: CompetitionAnalyticsSummary;
  tables: CompetitionAnalyticsTables;
  charts: CompetitionAnalyticsCharts;
  insights: CompetitionAnalyticsInsights;
};

export type CompetitionClubLite = {
  id: number;
  name: string;
  sport: string | null;
  playHqId: string | null;
  logo: CompetitionMedia | null;
  playHqLogo: CompetitionMedia | null;
  hasFixturaAccount: boolean;
  accounts: CompetitionAccount[];
};

export type CompetitionTeam = {
  id: number;
  name: string;
  gender: string | null;
  ageGroup: string | null;
  grades: Array<{ id: number; name: string | null }>;
  club: CompetitionClubLite | null;
};

export type CompetitionGrade = {
  id: number;
  name: string;
  gender: string | null;
  ageGroup: string | null;
  gradeCode: string | null;
  teamCount: number;
  teamsWithFixturaAccount: number;
  teamsWithoutFixturaAccount: number;
  accountCoveragePercent: number;
  clubsRepresented: number;
  teams: CompetitionTeam[];
};

export type CompetitionClub = CompetitionClubLite & {
  competitionUrl: string | null;
  source: "link" | "team";
};

export type CompetitionCounts = {
  gradeCount: number;
  teamCount: number;
  clubCount: number;
};

export type CompetitionAssociation = {
  id: number;
  name: string;
  sport: string | null;
  playHqId: string | null;
  hasFixturaAccount: boolean;
  accounts: CompetitionAccount[];
};

export type CompetitionMeta = {
  id: number;
  competitionId: string | null;
  name: string;
  season: string | null;
  status: string;
  isActive: boolean;
  timeframe: {
    start: string | null;
    end: string | null;
  };
  url: string | null;
  lastSyncedAt: string | null;
};

export type CompetitionAdminDetailResponse = {
  meta: CompetitionMeta;
  association: CompetitionAssociation | null;
  counts: CompetitionCounts;
  grades: CompetitionGrade[];
  clubs: CompetitionClub[];
  analytics: CompetitionAnalytics;
};

export type FetchCompetitionAdminDetailParams = {
  competitionId: number;
};
