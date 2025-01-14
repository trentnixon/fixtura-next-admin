/* eslint-disable @typescript-eslint/no-explicit-any */
import { Competition } from './competition';
import { GameMetaData } from './gameMetaData';
import { Team } from './team';
import { Download } from './download';

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
