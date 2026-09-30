export const COMPOSITION_IDS = [
  "CricketUpcoming",
  "CricketResults",
  "CricketTop5Batting",
  "CricketTop5Bowling",
  "CricketLadder",
  "Top5AFLScorers",
  "WeekendResultsAFL",
  "UpComingAFLFixtures",
  "AFLLadder",
  "WeekendResultsNetball",
  "UpComingNetBallFixtures",
  "NetballLadder",
] as const;

export type CompositionID = (typeof COMPOSITION_IDS)[number];

export const COMPONENT_NAMES = [
  "CricketUpcoming",
  "CricketResults",
  "CricketResultSingle",
  "CricketTop5Batting",
  "CricketTop5Bowling",
  "CricketLadder",
] as const;

export type ComponentName = (typeof COMPONENT_NAMES)[number];

export interface AudioOption {
  id: number;
  Name: string;
  URL: string | null;
  CompositionID: CompositionID | null;
  ComponentName: ComponentName | null;
  bundle_audios: unknown[] | null; // Replace with BundleAudio type if available
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export interface FetchAudioOptionsParams {
  page?: number;
  pageSize?: number;
  start?: number;
  limit?: number;
  populate?: string;
  sort?: string;
  filters?: {
    Name?: string;
    URL?: string;
    CompositionID?: CompositionID;
    ComponentName?: ComponentName;
    bundle_audios?: number;
  };
}

export interface ListAudioOptionsResponse {
  data: AudioOption[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
      start: number;
      limit: number;
    };
  };
}

export interface GetAudioOptionResponse {
  data: AudioOption;
}

export interface CreateAudioOptionRequest {
  data: {
    Name: string;
    URL?: string;
    CompositionID?: CompositionID;
    ComponentName?: ComponentName;
    bundle_audios?: number[];
  };
}

export interface UpdateAudioOptionRequest {
  data: {
    Name?: string;
    URL?: string | null;
    CompositionID?: CompositionID | null;
    ComponentName?: ComponentName | null;
    bundle_audios?: number[];
  };
}

export interface AudioOptionResponse {
  data: AudioOption;
}

export interface DeleteAudioOptionResponse {
  data: {
    id: number;
    message: string;
  };
}
