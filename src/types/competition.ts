import { Association } from './association';
import { Grade } from './grade';
import { ClubToCompetition } from './clubToCompetition';
import { Team } from './team';

export interface CompetitionAttributes {
  competitionName: string;
  season: string;
  startDate: string;
  endDate: string;
  status: string;
  url: string;
  association: { data: Association };
  competitionId: string;
  grades: { data: Grade[] };
  club_to_competitions: { data: ClubToCompetition[] };
  teams: { data: Team[] };
  isActive: boolean;
}

export interface Competition {
  id: number;
  attributes: CompetitionAttributes;
}

export interface CompetitionState {
  competition: Competition | null;
  competitions: Competition[];
  loading: boolean;
  error: string | null;
}
