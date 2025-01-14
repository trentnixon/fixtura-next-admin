import { Team } from './team';
import { Grade } from './grade';
import { Download } from './download';

export interface GameMetaDataAttributes {
  round: string;
  date: string;
  type: string;
  time: string;
  ground: string;
  status: string;
  urlToScoreCard: string;
  teams: { data: Team[] };
  gameID: string;
  teamHome: string;
  teamAway: string;
  Homescores: string;
  HomeOvers: string;
  Awayscores: string;
  AwayOvers: string;
  dateRange: string;
  tossWinner: string;
  tossResult: string;
  scorecards: Record<string, any>;
  isFinished: boolean;
  dayOne: string;
  grade: { data: Grade };
  BasePromptInformation: string;
  hasBasePrompt: boolean;
  ResultStatement: string;
  UpcomingFixturePrompt: string;
  hasUpcomingFixturePrompt: boolean;
  lastPromptUpdate: string;
  downloads: { data: Download[] };
  upcoming_games_in_renders: { data: any[] };
  game_results_in_renders: { data: any[] };
  gameContext: string;
  HomescoresFirstInnings: string;
  AwayscoresFirstInnings: string;
  dateRangeObj: Record<string, any>;
  TeamRoster: Record<string, any>;
}

export interface GameMetaData {
  id: number;
  attributes: GameMetaDataAttributes;
}

export interface GameMetaDataState {
  gameMetaData: GameMetaData | null;
  gameMetaDatas: GameMetaData[];
  loading: boolean;
  error: string | null;
}
