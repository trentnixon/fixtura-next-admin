export type CompetitionClubAccount = {
  id: number;
  firstName: string | null;
  lastName: string | null;
  name: string | null;
};

export type CompetitionClubMedia = {
  url: string | null;
};

export type CompetitionClubAssociation = {
  id: number | null;
  name: string | null;
};

export type CompetitionClubSummary = {
  id: number;
  name: string;
  sport: string | null;
  playHqId: string | null;
  hasFixturaAccount: boolean;
  accounts: CompetitionClubAccount[];
  association: CompetitionClubAssociation | null;
};

export type CompetitionClubCompetitionSummary = {
  competitionCount: number;
  activeCompetitions: number;
  inactiveCompetitions: number;
};

export type CompetitionClubCompetitionClub = {
  id: number;
  name: string;
  sport: string | null;
  playHqId: string | null;
  competitionUrl: string | null;
  logo: CompetitionClubMedia | null;
  playHqLogo: CompetitionClubMedia | null;
  hasFixturaAccount: boolean;
  accounts: CompetitionClubAccount[];
  source: "link" | "team";
};

export type CompetitionClubTeam = {
  id: number;
  name: string;
  gender: string | null;
  ageGroup: string | null;
  grades: Array<{ id: number; name: string | null }>;
  club: CompetitionClubCompetitionClub | null;
};

export type CompetitionClubGrade = {
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
  teams: CompetitionClubTeam[];
};

export type CompetitionClubCompetition = {
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
  grades: CompetitionClubGrade[];
  clubs: CompetitionClubCompetitionClub[];
};

export type CompetitionClubDrilldownResponse = {
  club: CompetitionClubSummary;
  summary: CompetitionClubCompetitionSummary;
  competitions: CompetitionClubCompetition[];
};
