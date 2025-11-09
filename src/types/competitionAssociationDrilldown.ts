export type CompetitionAssociationAccount = {
  id: number;
  firstName: string | null;
  lastName: string | null;
  name: string | null;
};

export type CompetitionAssociationMedia = {
  url: string | null;
};

export type CompetitionAssociationCompetitionClub = {
  id: number;
  name: string;
  sport: string | null;
  playHqId: string | null;
  competitionUrl: string | null;
  logo: CompetitionAssociationMedia | null;
  playHqLogo: CompetitionAssociationMedia | null;
  hasFixturaAccount: boolean;
  accounts: CompetitionAssociationAccount[];
  source: "link" | "team";
};

export type CompetitionAssociationTeam = {
  id: number;
  name: string;
  gender: string | null;
  ageGroup: string | null;
  grades: Array<{ id: number; name: string | null }>;
  club: CompetitionAssociationCompetitionClub | null;
};

export type CompetitionAssociationGrade = {
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
  teams: CompetitionAssociationTeam[];
};

export type CompetitionAssociationCompetition = {
  id: number;
  name: string;
  season: string | null;
  status: string;
  isActive: boolean;
  timeframe: {
    start: string | null;
    end: string | null;
  };
  counts: {
    gradeCount: number;
    teamCount: number;
    clubCount: number;
  };
  grades: CompetitionAssociationGrade[];
  clubs: CompetitionAssociationCompetitionClub[];
};

export type CompetitionAssociationSummary = {
  id: number;
  name: string;
  sport: string | null;
  playHqId: string | null;
  hasFixturaAccount: boolean;
  accounts: CompetitionAssociationAccount[];
};

export type CompetitionAssociationCompetitionSummary = {
  competitionCount: number;
  activeCompetitions: number;
  inactiveCompetitions: number;
};

export type CompetitionAssociationDrilldownResponse = {
  association: CompetitionAssociationSummary;
  summary: CompetitionAssociationCompetitionSummary;
  competitions: CompetitionAssociationCompetition[];
};
