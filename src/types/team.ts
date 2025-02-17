import { Club } from "./club";
import { Competition } from "./competition";
import { GameDataAFL } from "./gameDataAFL";
import { GameDataBasketball } from "./gameDataBasketball";
import { GameDataHockey } from "./gameDataHockey";
import { GameDataNetball } from "./gameDataNetball";
import { GameMetaData } from "./gameMetaData";
import { Grade } from "./grade";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface TeamAttributes {
  teamName: string;
  gender: string;
  age: string;
  href: string;
  teamID: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  form: string;
  gameHistory: any;
  club: { data: Club };
  competition: { data: Competition };
  grades: Grade[];
  game_meta_data: GameMetaData[];
  game_data_afls: GameDataAFL[];
  game_data_netballs: GameDataNetball[];
  game_data_hockeys: GameDataHockey[];
  game_data_basketballs: GameDataBasketball[];
  updatedAt: string;
  createdAt: string;
}

export interface Team {
  id: number;
  attributes: TeamAttributes;
}

export interface TeamState {
  team: Team | null;
  teams: Team[];
  loading: boolean;
  error: string | null;
}

// create a type for the formatted teams

export interface FormattedTeam {
  age: string | null;
  createdAt: string | null;
  gamesPlayed: number | null;
  gender: string | null;
  href: string | null;
  id: number | null;
  publishedAt: string | null;
  teamID: string | null;
  teamName: string | null;
  updatedAt: string | null;
  club: string | null;
  clubID: string | null;
  clubHref: string | null;
  clubSport: string | null;
  clubLogo: string | null;
  competition: string | null;
  competitionSeason: string | null;
  competitionURL: string | null;
  competitionIsActive: boolean | null;
  grades: number | null;
}
