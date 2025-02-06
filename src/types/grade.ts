/* eslint-disable @typescript-eslint/no-explicit-any */
import { Competition } from "./competition";
import { GameMetaData } from "./gameMetaData";
import { Team } from "./team";
import { Download } from "./download";

export interface GradeAttributes {
  gradeName: string;
  daysPlayed: string;
  gender: string;
  ageGroup: string;
  url: string;
  competition: { data: Competition };
  gradeId: string;
  game_meta_data: { data: GameMetaData[] };
  ladder: Record<string, any>;
  teams: { data: Team[] };
  downloads: { data: Download[] };
  grades_in_renders: { data: any[] };
  game_data_afls: { data: any[] };
  game_data_netballs: { data: any[] };
  game_data_hockeys: { data: any[] };
  game_data_basketballs: { data: any[] };
  game_results_in_renders: { data: any[] };
  upcoming_games_in_renders: { data: any[] };
  updatedAt: string;
  createdAt: string;
}

export interface Grade {
  id: number;
  attributes: GradeAttributes;
}

export interface GradeState {
  grade: Grade | null;
  grades: Grade[];
  loading: boolean;
  error: string | null;
}

export interface GradeResponse {
  data: Grade[];
}

///

export type TopLineData = {
  id: number;
  gradeName: string;
  daysPlayed: string;
  gender: string;
  ageGroup: string;
  url: string;

  gradeId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export type CompetitionData = {
  id: number;
  competitionName: string;
  season: string;
  startDate: string;
  endDate: string;
  status: string;

  href: string;
  isActive: boolean;
  association: {
    id: number;
    name: string;
    url: string;
    Logo: string;
  };
};

export type TeamData = {
  id: number;
  teamName: string;
  url?: string;
  gender?: string;
  age?: string;

  href: string;
  teamID: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  form: string;
};

export type GradeData = {
  topLineData: TopLineData;

  competitionData: CompetitionData;
  teamData: TeamData[];
};
