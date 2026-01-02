import { Download } from "./download";
import { GameMetaData } from "./gameMetaData";
import { Scheduler } from "./scheduler";
import { Fixture } from "./fixture";
export interface RenderResponse {
  render: RenderData;
  fixtures: Fixture[];
}

export interface RenderData {
  id: number;
  name: string;
  complete: boolean;
  processing: boolean;
  emailSent: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RenderAttributes {
  Name: string;
  Processing: boolean;
  Complete: boolean;
  sendEmail: boolean;
  hasTeamRosterRequest: boolean;
  hasTeamRosters: boolean;
  forceRerender: boolean;
  EmailSent: boolean;
  forceRerenderEmail: boolean;
  hasTeamRosterEmail: boolean;
  updatedAt: string;
  publishedAt: string;
  isCreatingRoster: boolean;
  downloads: {
    data: Download[];
  };
  scheduler: {
    data: Scheduler;
  };
  game_results_in_renders: {
    data: GameMetaData[];
  };
  upcoming_games_in_renders: {
    data: GameMetaData[];
  };
  grades_in_renders: {
    data: Render[];
  };
  ai_articles: {
    data: { id: number; attributes: Record<string, unknown> }[];
  };
  rerenderRequested: boolean;
}

export interface Render {
  id: number;
  attributes: RenderAttributes;
}

export interface RenderState {
  render: Render | null;
  renders: Render[];
  loading: boolean;
  error: string | null;
}

export interface GetAccountFromRender {
  render: {
    id: number;
    Name: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    Processing: boolean;
    Complete: boolean;
  };
  scheduler: {
    id: number;
    Name: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    Time: string | null;
    isRendering: boolean;
  };
  account: {
    id: number;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    isActive: boolean;
    FirstName: string;
    LastName: string | null;
    DeliveryAddress: string;
    isSetup: boolean;
    isUpdating: boolean;
    hasCompletedStartSequence: boolean;
    isRightsHolder: boolean;
    isPermissionGiven: boolean;
    group_assets_by: boolean;
    Sport: string;
    hasCustomTemplate: boolean;
    include_junior_surnames: boolean;
  };
}

export interface RenderAuditItem {
  renderId: number;
  renderName: string | null;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  Processing: boolean;
  Complete: boolean;
  EmailSent: boolean;
  account: {
    accountId: number;
    accountName: string | null;
    accountSport: string | null;
    accountType: string | null;
  } | null;
  downloadsCount: number;
  aiArticlesCount: number;
  isGhostRender: boolean;
}

export interface RenderAuditResponse {
  data: RenderAuditItem[];
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

export interface RenderTelemetryResponse {
  activeCount: number;
  failedToday: number;
  successRate24h: number;
  systemStatus: "nominal" | "warning" | "degraded";
}

export type AnalyticsPeriod = "day" | "week" | "month";

export interface RenderAnalyticsDataPoint {
  period: string;
  date: string;
  renderVolume: number;
  assetDensity: number;
  failureCount: number;
  failureRate: number;
  totalRenders: number;
  totalAssets: number;
}

export interface RenderAnalyticsResponse {
  period: AnalyticsPeriod;
  range: {
    start: string;
    end: string;
  };
  data: RenderAnalyticsDataPoint[];
}

export interface TopAccountItem {
  accountId: number;
  accountName: string | null;
  accountType: string | null;
  accountSport: string | null;
  renderCount: number;
}

export interface RenderDistributionResponse {
  topAccounts: TopAccountItem[];
  assetDistribution: {
    video: number;
    image: number;
    content: number;
  };
}

export interface RenderLineageResponse {
  render: {
    id: number;
    name: string | null;
    processing: boolean;
    complete: boolean;
    emailSent: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  scheduler: {
    id: number;
    name: string;
    time: string;
    isRendering: boolean;
    queued: boolean;
    daysOfTheWeek: {
      id: number;
      name: string;
    } | null;
    account: {
      id: number;
      firstName: string | null;
      lastName: string | null;
      sport: string | null;
      accountType: {
        id: number;
        name: string;
      } | null;
      clubs: Array<{
        id: number;
        name: string;
      }>;
      associations: Array<{
        id: number;
        name: string;
      }>;
    } | null;
  } | null;
  downloads: Array<{
    id: number;
    name: string | null;
    assetType: {
      id: number;
      name: string;
    } | null;
    assetCategory: {
      id: number;
      name: string;
    } | null;
    grade: {
      id: number;
      gradeName: string;
    } | null;
    createdAt: string;
    updatedAt: string;
  }>;
  aiArticles: Array<{
    id: number;
    title: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
  gameResults: Array<{
    id: number;
    gameMetaDatum: {
      id: number;
      grade: {
        id: number;
        gradeName: string;
        competition: {
          id: number;
          name: string;
        } | null;
      } | null;
      teams: Array<{
        id: number;
        name: string;
        club: {
          id: number;
          name: string;
        } | null;
      }>;
    } | null;
    gameDataAfl: Record<string, unknown> | null;
    gameDataBasketball: Record<string, unknown> | null;
    gameDataHockey: Record<string, unknown> | null;
    gameDataNetball: Record<string, unknown> | null;
  }>;
  upcomingGames: Array<{
    id: number;
    gameMetaDatum: {
      id: number;
      grade: {
        id: number;
        gradeName: string;
        competition: {
          id: number;
          name: string;
        } | null;
      } | null;
      teams: Array<{
        id: number;
        name: string;
        club: {
          id: number;
          name: string;
        } | null;
      }>;
    } | null;
    gameDataAfl: Record<string, unknown> | null;
    gameDataBasketball: Record<string, unknown> | null;
    gameDataHockey: Record<string, unknown> | null;
    gameDataNetball: Record<string, unknown> | null;
  }>;
  grades: Array<{
    id: number;
    grade: {
      id: number;
      gradeName: string;
      ageGroup: string | null;
      competition: {
        id: number;
        name: string;
      } | null;
      teams: Array<{
        id: number;
        name: string;
      }>;
    } | null;
    team: {
      id: number;
      name: string;
    } | null;
  }>;
  integrityCheck?: {
    timestamp: string;
    summary: {
      totalGrades: number;
      totalGameResults: number;
      totalUpcomingGames: number;
      totalDownloads: number;
      totalAiArticles: number;
      totalFixtures: number;
      missingFixtureCount: number;
      warningCount: number;
      errorCount: number;
    };
    gradeAnalysis: Array<{
      gradeId: number;
      gradeName: string;
      ageGroup: string | null;
      competition: string | null;
    }>;
    fixtureAnalysis: {
      expectedGrades: Array<{
        gradeId: number;
        gradeName: string;
      }>;
      actualGameResults: Array<{
        gameMetaDatumId: number;
        gradeId: number | null;
        gradeName: string | null;
      }>;
      actualUpcomingGames: Array<{
        gameMetaDatumId: number;
        gradeId: number | null;
        gradeName: string | null;
      }>;
      missingFixtures: Array<{
        gradeId: number;
        gradeName: string;
        reason: string;
      }>;
      unexpectedFixtures: Array<unknown>;
    };
    assetAnalysis: {
      downloadsByType: Record<string, number>;
      downloadsByCategory: Record<string, number>;
      totalAssets: number;
    };
    warnings: string[];
    errors: string[];
  };
}
