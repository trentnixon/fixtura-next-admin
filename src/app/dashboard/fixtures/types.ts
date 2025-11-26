// Type definitions for Fixtures and Games
// These will be replaced with actual API types when routes are available

export type FixtureStatus = "scheduled" | "in_progress" | "completed" | "cancelled";
export type GameStatus = "scheduled" | "in_progress" | "completed" | "cancelled" | "postponed";

export interface Fixture {
  id: number;
  competitionId: number;
  competitionName: string;
  gradeId: number;
  gradeName: string;
  roundNumber: number;
  roundName: string;
  scheduledDate: Date;
  venue: string;
  venueAddress?: string;
  status: FixtureStatus;
  totalGames: number;
  completedGames: number;
}

export interface FixtureWithGames extends Fixture {
  games: Game[];
}

export interface Game {
  id: number;
  fixtureId: number;
  homeTeamId: number;
  homeTeam: string;
  awayTeamId: number;
  awayTeam: string;
  scheduledTime: Date;
  field: string;
  status: GameStatus;
  homeScore: number | null;
  awayScore: number | null;
  referee?: string;
  notes?: string;
}

export interface FixtureFilters {
  competitionId?: number;
  gradeId?: number;
  status?: FixtureStatus;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface FixtureStats {
  total: number;
  scheduled: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  totalGames: number;
  completedGames: number;
}

// API Response types (to be updated when actual API is available)
export interface FixturesResponse {
  fixtures: Fixture[];
  stats: FixtureStats;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
  };
}

export interface FixtureDetailResponse {
  fixture: FixtureWithGames;
}
