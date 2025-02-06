export type TopLineData = {
  id: number;
  teamName: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  gender: string | null;

  age: string | null;
  href: string;
  teamID: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  form: string;
  contactDetails: {
    name: string;
    role: string;
    phone: string;
    email: string;
  }[];
};

export type Club = {
  id: number;
  Name: string;
  href: string;
  ParentLogo: string;
  website: { website: string };
  location: { address: string };

  Sport: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export type Competition = {
  id: number;
  competitionName: string;
  season: string;
  startDate: string;
  endDate: string;
  status: string;

  url: string;
  isActive: boolean;
};

export type Association = {
  id: number;
  Name: string;
  href: string;
  ParentLogo: string;
  Sport: string;
};

export type Grades = {
  id: number;
  gradeName: string;
  daysPlayed: string;
  gender: string;
  ageGroup: string;
  url: string;

  createdAt: string;
  updatedAt: string;
};

export type GameMetaData = {
  id: number;
  round: string;
  date: string;
  type: string;
  time: string;
  ground: string;
  status: string;

  urlToScoreCard: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  gameID: string;
  teamHome: string;
  teamAway: string;
  isFinished: boolean;
  dayOne: string;
  finalDaysPlay: string;
};

export type TeamData = {
  TopLineData: TopLineData;
  club: Club;
  competition: Competition;
  association: Association;
  grades: Grades;
  gameMetaData: GameMetaData[];
};
