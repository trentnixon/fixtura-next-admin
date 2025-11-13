export interface Fixture {
  id: number;
  gameId: string;
  round: string;
  date: string;
  time: string;
  type: string;
  ground: string;
  status: string;
  teamHome: string;
  teamAway: string;
  homeScore: string;
  homeOvers: string;
  awayScore: string;
  awayOvers: string;
  dateRange: string;
  tossWinner: string | null;
  tossResult: string | null;
  urlToScoreCard: string;
  gradeName: string;
  createdAt: string;
  updatedAt: string;
}
