/* eslint-disable @typescript-eslint/no-explicit-any */
import { Team } from "./team";
import { Grade } from "./grade";
import { Download } from "./download";

export interface GameDataHockeyAttributes {
  round: string;
  date: string;
  time: string;
  ground: string;
  status: string;
  urlToScoreCard: string;
  teams: { data: Team[] };
  gameID: string;
  teamHome: string;
  teamAway: string;
  Homescores: string;
  Awayscores: string;
  scorecards: Record<string, any>;
  isFinished: boolean;
  grade: { data: Grade };
  BasePromptInformation: string;
  hasBasePrompt: boolean;
  ResultStatement: string;
  UpcomingFixturePrompt: string;
  hasUpcomingFixturePrompt: boolean;
  lastPromptUpdate: string;
  downloads: { data: Download[] };
  upcoming_games_in_renders: Record<string, any>;
  game_results_in_renders: Record<string, any>;
  gameContext: string;
  TeamRoster: Record<string, any>;
  dateObj: string;
}

export interface GameDataHockey {
  id: number;
  attributes: GameDataHockeyAttributes;
}

export interface GameDataHockeyState {
  gameDataHockey: GameDataHockey[];
  loading: boolean;
  error: string | null;
}
