/* eslint-disable @typescript-eslint/no-explicit-any */
import { Team } from "./team";
import { Grade } from "./grade";
import { Download } from "./download";

export interface GameDataNetballAttributes {
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

export interface GameDataNetball {
  id: number;
  attributes: GameDataNetballAttributes;
}

export interface GameDataNetballState {
  gameDataNetball: GameDataNetball | null;
  gameDataNetballs: GameDataNetball[];
  loading: boolean;
  error: string | null;
}
