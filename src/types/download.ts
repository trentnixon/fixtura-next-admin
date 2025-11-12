import type { DownloadOBJ } from "./downloadAsset";

/**
 * Download attributes interface
 * Contains all fields for a download entity
 */
export interface DownloadAttributes {
  Name: string;
  URL: string | null;
  grouping_category: string;
  isAccurate: boolean | null;
  hasBeenProcessed: boolean;
  forceRerender: boolean;
  DisplayCost: number;
  CompletionTime: string;
  OutputFileSize: string;
  UserErrorMessage: string | null;
  hasError: boolean;
  downloads: object;
  numDownloads: number;
  assetLinkID: string;
  gameID: string | null;
  errorEmailSentToAdmin: boolean;
  updatedAt: string;
  publishedAt?: string | null;
  hasBeenEdited?: boolean;
  canEdit?: boolean;
  editTrigger?: boolean;
  editCount?: number | null;
  asset: {
    data: {
      id: number;
      attributes: {
        Name: string;
        CompositionID: string;
        updatedAt?: string;
        publishedAt?: string | null;
        description?: string;
        Metadata?: {
          Title?: string;
          TitleSplit?: string[];
          TIMINGS?: {
            FPS_INTRO?: number;
            FPS_SCORECARD?: number;
            FPS_OUTRO?: number;
            FPS_MAIN?: number | false;
          };
        };
        filter?: string;
        ContentType?: string;
        ArticleFormats?: unknown;
        assetDescription?: string;
        SubTitle?: string;
        Icon?: string;
        Blurb?: string;
        Sport?: string;
      };
    };
  };
  asset_category: {
    data: {
      id: number;
      attributes: {
        Identifier: string;
        Name?: string;
        updatedAt?: string;
        description?: string;
      };
    };
  };
  render?: {
    data: {
      id: number;
      attributes?: {
        Name?: string;
        updatedAt?: string;
        publishedAt?: string | null;
        Processing?: boolean;
        Complete?: boolean;
        sendEmail?: boolean;
        hasTeamRosterRequest?: boolean;
        hasTeamRosters?: boolean;
        forceRerender?: boolean;
        EmailSent?: boolean;
        forceRerenderEmail?: boolean;
        hasTeamRosterEmail?: boolean;
        isCreatingRoster?: boolean;
      };
    } | null;
  };
  // OBJ structure containing common metadata and asset-specific data
  OBJ?: DownloadOBJ;
}

export interface DownloadResponse {
  data: Download[];
}
export interface Download {
  id: number;
  attributes: DownloadAttributes;
}

export interface DownloadState {
  download: Download | null;
  downloads: Download[];
  loading: boolean;
  error: string | null;
}
