/**
 * Type definitions for download asset data structures
 *
 * These types define the structure of asset data stored in download objects,
 * including common metadata and asset-specific data (e.g., CricketResults).
 */

// ============================================================================
// Common Asset Metadata Types
// ============================================================================

/**
 * Asset metadata information
 */
export interface AssetMetadata {
  assetID: number;
  assetTypeID: number;
  assetCategoryID: number;
  assetsLinkID: string;
}

/**
 * Render metadata information
 */
export interface RenderMetadata {
  schedulerId: number;
  renderId: number;
}

/**
 * Account metadata information
 */
export interface AccountMetadata {
  accountId: number;
}

/**
 * Timing metadata for video rendering
 */
export interface TimingsMetadata {
  FPS_MAIN: number;
  FPS_INTRO: number;
  FPS_OUTRO: number;
  FPS_LADDER: number;
  FPS_SCORECARD: number;
}

/**
 * Club logo information
 */
export interface ClubLogo {
  hasLogo: boolean;
  url: string;
  width: number;
  height: number;
}

/**
 * Club sponsors information
 */
export interface ClubSponsors {
  primary: unknown[];
  default: Record<string, unknown>;
}

/**
 * Club information from videoMeta
 */
export interface ClubMetadata {
  logo: ClubLogo;
  name: string;
  sport: string;
  sponsors: ClubSponsors;
  IsAccountClub: boolean;
}

/**
 * Video metadata title and split information
 */
export interface VideoMetadataTitle {
  title?: string;
  titleSplit?: string[];
  videoTitle?: string;
  compositionId?: string;
  assetId?: number;
  assetTypeId?: number;
  frames?: number[];
  includeSponsors?: boolean;
}

/**
 * Video theme colors
 */
export interface VideoTheme {
  dark: string;
  white: string;
  primary: string;
  secondary: string;
}

/**
 * Video appearance settings
 */
export interface VideoAppearance {
  theme: VideoTheme;
  template?: string;
}

/**
 * Hero image settings
 */
export interface HeroImage {
  url: string;
  ratio: string;
  width: number;
  height: number;
  AgeGroup: string;
  AssetType: string;
  markerPosition: string;
}

/**
 * Audio settings
 */
export interface AudioSettings {
  url: string;
  audioOption: string | null;
}

/**
 * Video media settings
 */
export interface VideoMedia {
  HeroImage: HeroImage;
  audio: AudioSettings;
}

/**
 * Content layout settings for dividing fixtures
 */
export interface ContentLayout {
  divideFixturesBy: {
    CricketLadder: number;
    CricketRoster: number;
    CricketResults: number;
    CricketUpcoming: number;
    CricketResultSingle: number;
  };
}

/**
 * Video overlay settings
 */
export interface VideoOverlay {
  color: string;
  opacity: number;
}

/**
 * Video settings
 */
export interface VideoSettings {
  url: string | null;
  fallbackUrl: string | null;
  position: string;
  size: string;
  loop: string | null;
  muted: boolean;
  overlay: VideoOverlay;
  useOffthreadVideo: string | null;
  volume: number;
  playbackRate: string | null;
}

/**
 * Image settings
 */
export interface ImageSettings {
  url: string | null;
  ratio: string | null;
  width: number | null;
  height: number | null;
  type: string;
  direction: string;
  overlayStyle: string;
  gradientType: string;
  overlayOpacity: number;
}

/**
 * Gradient settings
 */
export interface GradientSettings {
  type: string;
  direction: string;
}

/**
 * Noise settings
 */
export interface NoiseSettings {
  type: string;
}

/**
 * Pattern settings
 */
export interface PatternSettings {
  type: string;
  animation: string;
  scale: number;
  rotation: string | null;
  opacity: number;
  animationDuration: string | null;
  animationSpeed: number;
}

/**
 * Particle settings
 */
export interface ParticleSettings {
  type: string;
  particleCount: string;
  speed: number;
  direction: string;
  animation: string;
}

/**
 * Texture overlay settings
 */
export interface TextureOverlay {
  opacity: number;
  blendMode: string;
}

/**
 * Texture settings
 */
export interface TextureSettings {
  name: string | null;
  url: string | null;
  repeat: string;
  scale: string;
  overlay: TextureOverlay;
}

/**
 * Template variation settings
 */
export interface TemplateVariation {
  useBackground: string;
  mode: string;
  category?: {
    slug: string;
    name: string;
    divideFixturesBy: {
      CricketUpcoming: number;
      CricketResults: number;
      CricketResultSingle: number;
      CricketLadder: number;
      CricketRoster: number;
    };
    bundleAudio?: {
      id: number;
      Name: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      audio_options?: Array<{
        id: number;
        Name: string;
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
        URL: string;
        CompositionID: string;
        ComponentName: string;
      }>;
    };
  };
  video?: VideoSettings;
  image?: ImageSettings;
  palette?: string;
  gradient?: GradientSettings;
  noise?: NoiseSettings;
  pattern?: PatternSettings;
  particle?: ParticleSettings;
  texture?: TextureSettings;
}

/**
 * Video metadata information
 */
export interface VideoMetadata {
  fixtureCategory: string;
  groupingCategory: string;
  metadata: VideoMetadataTitle;
  appearance: VideoAppearance;
  contentLayout: ContentLayout;
  templateVariation: TemplateVariation;
}

/**
 * Complete videoMeta structure
 */
export interface VideoMetaMetadata {
  club: ClubMetadata;
  video: VideoMetadata;
}

/**
 * OBJ structure in download attributes
 * Contains both common metadata and asset-specific data array
 */
export interface DownloadOBJ {
  data: unknown[]; // Asset-specific data array (e.g., CricketGame[] for CricketResults)
  asset: AssetMetadata;
  render: RenderMetadata;
  account: AccountMetadata;
  timings: TimingsMetadata;
  frames: number[];
  videoMeta: VideoMetaMetadata;
  errors: unknown[];
}

/**
 * Common asset details structure (extracted from OBJ)
 * Contains all shared metadata across all asset types
 */
export interface CommonAssetDetails {
  asset: AssetMetadata;
  render: RenderMetadata;
  account: AccountMetadata;
  timings: TimingsMetadata;
  frames: number[];
  videoMeta: VideoMetaMetadata;
  errors: unknown[];
}

// ============================================================================
// CricketResults Asset-Specific Types
// ============================================================================

/**
 * Team logo information
 */
export interface TeamLogo {
  url: string;
  width: number;
  height: number;
}

/**
 * Batting performance for a player
 */
export interface BattingPerformance {
  player: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  SR: number; // Strike Rate
  team: string;
  notOut: boolean;
}

/**
 * Bowling performance for a player
 */
export interface BowlingPerformance {
  player: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: string;
  team: string;
}

/**
 * Cricket team information
 */
export interface CricketTeam {
  name: string;
  isHome: boolean;
  logo: TeamLogo;
  score: string;
  overs: string;
  homeScoresFirstInnings?: string;
  awayScoresFirstInnings?: string;
  battingPerformances: BattingPerformance[];
  bowlingPerformances: BowlingPerformance[];
  isClubTeam: boolean;
}

/**
 * Team logo information (separate from team object)
 */
export interface TeamLogoInfo {
  url: string;
  width: number;
  height: number;
}

/**
 * Assign sponsors structure
 */
export interface AssignSponsors {
  competition: unknown[];
  grade: unknown[];
  team: unknown[];
}

/**
 * Match context information
 */
export interface MatchContext {
  competition: string;
  grade: string;
  round: string;
  ground: string;
  matchType: string;
  tossWinner: string;
  tossResult: string;
  resultStatement: string;
  dayOne: string;
  finalDaysPlay: string;
}

/**
 * Account bias information
 */
export interface AccountBias {
  isBias: string;
  clubTeams: string[];
  focusedTeams: string[];
}

/**
 * Cricket game data structure
 */
export interface CricketGame {
  gameID: string;
  status: string;
  homeTeam: CricketTeam;
  awayTeam: CricketTeam;
  teamHomeLogo: TeamLogoInfo;
  teamAwayLogo: TeamLogoInfo;
  date: string;
  type: string;
  ground: string;
  round: string;
  gender: string;
  ageGroup: string;
  gradeName: string;
  assignSponsors: AssignSponsors;
  prompt?: string; // JSON string containing matchContext, team data, accountBias
  result?: string;
}

/**
 * Parsed prompt data (when prompt is parsed from JSON string)
 */
export interface ParsedPromptData {
  matchContext: MatchContext;
  homeTeam: {
    teamName: string;
    innings: Array<{
      teamName: string;
      score: string;
      overs: string;
      wickets: number;
      battingOrder: Array<{
        description: string;
      }>;
      bowlingFigures: Array<{
        description: string;
      }>;
      fieldingStats: Array<{
        description: string;
      }>;
      fallOfWickets: Array<{
        wicketNumber: number;
        score: string;
        batsman: string;
      }>;
      inningsNumber: number;
      inningsName: string;
    }>;
    totalScore: string;
    totalWickets: number;
  };
  awayTeam: {
    teamName: string;
    innings: Array<{
      teamName: string;
      score: string;
      overs: string;
      wickets: number;
      battingOrder: Array<{
        description: string;
      }>;
      bowlingFigures: Array<{
        description: string;
      }>;
      fieldingStats: Array<{
        description: string;
      }>;
      fallOfWickets: Array<{
        wicketNumber: number;
        score: string;
        batsman: string;
      }>;
      inningsNumber: number;
      inningsName: string;
    }>;
    totalScore: string;
    totalWickets: number;
  };
  accountBias: AccountBias;
}

/**
 * CricketResults asset data structure
 * Contains the OBJ.data array for CricketResults assets
 */
export interface CricketResultsData {
  data: CricketGame[];
}

/**
 * Union type for all asset-specific data types
 * Extend this as new asset types are added
 */
export type AssetSpecificData = CricketResultsData;

/**
 * Asset type identifier
 */
export type AssetType = "CricketResults" | "CricketUpcoming" | "CricketLadder" | "CricketRoster" | "CricketResultSingle" | string;

