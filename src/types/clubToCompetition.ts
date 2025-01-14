export interface ClubToCompetitionAttributes {
  competitionUrl: string;
}

export interface ClubToCompetition {
  id: number;
  attributes: ClubToCompetitionAttributes;
}

export interface ClubToCompetitionState {
  clubToCompetition: ClubToCompetition | null;
  clubToCompetitions: ClubToCompetition[];
  loading: boolean;
  error: string | null;
}
