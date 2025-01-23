// Type definition for the provided JSON object

type Theme = {
  primary: string;
  secondary: string;
  dark: string;
  white: string;
};

export type Render = {
  id: number;
  created: string;
  time: string;
  Name: string;
  Processing: boolean;
  Complete: boolean;
  sendEmail: boolean;
  EmailSent: boolean;
  hasTeamRosterRequest: boolean;
  hasTeamRosters: boolean;
  hasTeamRosterEmail: boolean;
  forceRerender: boolean;
  forceRerenderEmail: boolean;
  game_results_in_renders_count: number;
  upcoming_games_in_renders_count: number;
  grades_in_renders_count: number;
  downloads_count: number;
  ai_articles_count: number;
};

type Scheduler = {
  id: number;
  Name: string;
  updatedAt: string;
  publishedAt: string;
  Time: string | null;
  isRendering: boolean;
  Queued: boolean;
};

export type AccountOrganisationDetails = {
  id: number;
  Name: string;
  href: string;
  ParentLogo: string;
  Sport: string;
};

type RenderToken = {
  id: number;
  token: string;
  expiration: string;
  updatedAt: string;
};

type Rollup = {
  totalRenders: number;
  totalProcessingRenders: number;
  totalCompleteRenders: number;
  totalEmailsSent: number;
  totalTeamRosterRequests: number;
  totalTeamRosters: number;
  totalTeamRosterEmails: number;
  totalForceRerenders: number;
  totalForceRerenderEmails: number;
  totalGameResults: number;
  totalUpcomingGames: number;
  totalGrades: number;
  totalDownloads: number;
  totalAiArticles: number;
};

type MetricsOverTime = {
  totalRenders: number;
  totalCompleteRenders: number;
  totalDownloads: number;
  totalEmailsSent: number;
  totalGameResults: number;
  totalUpcomingGames: number;
  totalGrades: number;
  totalAiArticles: number;
  GameResultsArr: number[];
  UpcomingGamesArr: number[];
  GradesArr: number[];
  AiArticlesArr: number[];
  DownloadsArr: number[];
};

type MetricsAsPercentageOfCost = {
  valuePerRender: number;
  totalCostByAccount: number;
  totalDigitalAssets: number;
  percentageCompleteRenders: number;
  percentageProcessingRenders: number;
  percentageGameResults: number;
  percentageDownloads: number;
  percentageAiArticles: number;
  averageCostPerDigitalAsset: number;
  averageCostOverTime: number[];
};

export type fixturaContentHubAccountDetails = {
  id: number;
  FirstName: string;
  LastName: string | null;
  DeliveryAddress: string;
  isActive: boolean;
  isSetup: boolean;
  isRightsHolder: boolean;
  isPermissionGiven: boolean;
  group_assets_by: boolean;
  include_junior_surnames: boolean;
  isUpdating: boolean;
  Sport: string;
  scheduler: Scheduler;
  account_type: number;
  accountOrganisationDetails: AccountOrganisationDetails;
  render_token: RenderToken;
  template: string;
  theme: Theme;
  renders: Render[];
  rollup: Rollup;
  metricsOverTime: MetricsOverTime;
  metricsAsPercentageOfCost: MetricsAsPercentageOfCost;
};
