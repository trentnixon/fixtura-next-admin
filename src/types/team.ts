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
