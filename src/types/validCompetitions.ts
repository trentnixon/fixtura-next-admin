// Grade type
export interface Grade {
  id: number;
  name: string;
}

// Team type
export interface Team {
  id: number;
  name: string;
}

// Association type
export interface Association {
  id: number;
  name: string;
}

// Competition type
export interface Competition {
  competitionId: number;
  competitionName: string;
  season: string;
  startDate: string;
  endDate: string;
  status: string;
  url: string;
  isActive: boolean;
  grades: Grade[]; // Array of grades
  teams: Team[]; // Array of teams
  association: Association | null; // Optional association
}

// Main response type for competitions
export type ValidCompetitionsResponse = Competition[];
