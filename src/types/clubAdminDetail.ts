/**
 * Club Admin Detail Types for Club Admin Detail API
 *
 * Based on documentation in `src/app/dashboard/club/[id]/SingleClubNotes.md`.
 * This endpoint provides a bundled, read-only snapshot of a single club and
 * its related associations, teams, competitions, accounts, and insights.
 */

// ============================================================================
// MAIN RESPONSE TYPE
// ============================================================================

export interface ClubAdminDetailResponse {
  data: ClubAdminDetailPayload | null;
  meta?: unknown;
}

export interface ClubAdminDetailPayload {
  club: ClubCore;
  statistics: ClubStatistics;
  associations: ClubAssociationDetail[];
  teams: ClubTeamDetail[];
  competitions: ClubCompetitionDetail[];
  accounts: ClubAccountSummary[];
  insights: ClubInsights;
  meta: ClubDetailMeta;
}

// ============================================================================
// CORE CLUB DATA
// ============================================================================

export interface ClubCore {
  id: number;
  name: string;
  sport: "Cricket" | "AFL" | "Hockey" | "Netball" | "Basketball" | "Unknown";
  href: string | null;
  logoUrl: string;
  playHqId: string | null;
  parentLogo: string | null;
  contactDetails: {
    phone: string | null;
    email: string | null;
    address: string | null;
  } | null;
  location: {
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    coordinates: { lat: number; lng: number } | null;
  } | null;
  website: {
    website: string | null;
    domain: string | null;
  } | null;
  isActive: boolean;
  hasPlayhqLogoStored: boolean;
  createdAt: string;
  updatedAt: string;
  updateRelationalLookup: string | null;
  updateLogo: string | null;
}

// ============================================================================
// STATISTICS
// ============================================================================

export interface ClubStatistics {
  associations: {
    total: number;
    active: number;
    bySport: Record<string, number>;
  };
  teams: {
    total: number;
    acrossCompetitions: number;
    acrossGrades: number;
    bySport: Record<string, number>;
  };
  competitions: {
    total: number;
    active: number;
    upcoming: number;
    completed: number;
    byStatus: Record<string, number>;
    byAssociation: Record<number, number>;
  };
  grades: {
    total: number;
    withTeams: number;
    withoutTeams: number;
  };
  accounts: {
    total: number;
    active: number;
    withOrders: number;
  };
  trial: {
    hasTrial: boolean;
    isActive: boolean | null;
  } | null;
}

// ============================================================================
// ASSOCIATIONS (FOR THIS CLUB)
// ============================================================================

export interface ClubAssociationDetail {
  id: number;
  name: string;
  sport: string;
  href: string | null;
  logoUrl: string | null;
  playHqId: string | null;
  competitionCount: number;
  teamCount: number;
  isActive: boolean;
}

// ============================================================================
// TEAMS
// ============================================================================

export interface ClubTeamDetail {
  id: number;
  name: string;
  competition: {
    id: number;
    name: string;
    association: {
      id: number;
      name: string;
    } | null;
    startDate: string | null;
    endDate: string | null;
    status: string | null;
  } | null;
  grade: {
    id: number;
    name: string;
    gender: string | null;
    ageGroup: string | null;
  } | null;
  grades:
    | {
        id: number;
        name: string;
        gender: string | null;
        ageGroup: string | null;
      }[]
    | null;
  isActive: boolean;
}

// ============================================================================
// COMPETITIONS
// ============================================================================

export type ParticipationMethod =
  | "club_to_competition"
  | "team"
  | "both"
  | "unknown";

export interface ClubCompetitionDetail {
  id: number;
  name: string;
  season: string | null;
  startDate: string | null;
  endDate: string | null;
  status: string | null;
  isActive: boolean;
  url: string | null;
  association: {
    id: number;
    name: string;
    sport: string;
  } | null;
  gradeCount: number;
  teamCount: number;
  timeline: {
    status: "upcoming" | "in_progress" | "completed" | "unknown";
    daysTotal: number | null;
    daysElapsed: number | null;
    daysRemaining: number | null;
    progressPercent: number | null;
  };
  participationMethod: ParticipationMethod;
  competitionUrl: string | null;
}

// ============================================================================
// ACCOUNTS
// ============================================================================

export interface ClubAccountSummary {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  accountType: {
    id: number;
    name: string;
  } | null;
  subscriptionTier: {
    id: number;
    name: string;
  } | null;
  isActive: boolean;
  isSetup: boolean;
  hasActiveOrder: boolean;
}

// ============================================================================
// INSIGHTS
// ============================================================================

export interface ClubInsights {
  competitionTimeline: {
    date: string;
    competitions: number;
    starting: number;
    ending: number;
  }[];

  activityPatterns: {
    byMonth: {
      month: string;
      competitionsStarted: number;
      competitionsEnded: number;
      competitionsActive: number;
    }[];
    bySeason: {
      season: string;
      competitionCount: number;
      averageDuration: number;
    }[];
    byAssociation: {
      associationId: number;
      associationName: string;
      competitionCount: number;
      averageDuration: number;
    }[];
  };

  growthTrends: {
    competitionsOverTime: {
      year: number;
      count: number;
    }[];
    teamsOverTime: {
      year: number;
      count: number;
    }[];
  };

  competitionStartDates: {
    upcoming: {
      competitionId: number;
      competitionName: string;
      startDate: string;
      daysUntilStart: number;
      association: {
        id: number;
        name: string;
      } | null;
    }[];
    recent: {
      competitionId: number;
      competitionName: string;
      startDate: string;
      daysSinceStart: number;
      association: {
        id: number;
        name: string;
      } | null;
    }[];
    byMonth: Record<string, number>;
  };
}

// ============================================================================
// META
// ============================================================================

export interface ClubDetailMeta {
  generatedAt: string;
  dataPoints: {
    associations: number;
    competitions: number;
    grades: number;
    teams: number;
    accounts: number;
  };
  performance: {
    fetchTimeMs: number;
    calculationTimeMs: number;
    totalTimeMs: number;
  };
}
