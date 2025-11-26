/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * TypeScript Type Definitions for Single Fixture Detail API
 *
 * This file contains all type definitions for the Single Fixture Detail API endpoint:
 * - GET /api/game-meta-data/admin/fixture/{id} - Comprehensive single fixture details
 *
 * @see CMS_HandoverNotes.md for full API documentation
 */

// ============================================================================
// Core Response Types
// ============================================================================

/**
 * Complete response structure from the single fixture detail endpoint
 */
export interface SingleFixtureDetailResponse {
  fixture: FixtureDetailData;
  grade: GradeDetail | null;
  teamsData: FixtureTeamData[];
  downloads: FixtureDownload[];
  renderStatus: RenderStatus;
  club: ClubData[];
  context: Context;
  meta: MetaData;
}

// ============================================================================
// Fixture Data Types
// ============================================================================

/**
 * Core fixture data from database schema
 */
export interface FixtureDetailData {
  id: number;
  gameID: string;
  round: string | null;
  status: string;
  type: string;
  isFinished: boolean;
  dates: FixtureDates;
  venue: Venue;
  teams: Teams;
  matchDetails: MatchDetails;
  content: Content;
  teamRoster: Record<string, TeamRoster> | null; // JSON data
}
export interface DateRangeObj {
  start: string;
  end: string;
}
export interface TeamRoster {
  batting: BattingPlayer[];
  bowling: BowlingPlayer[];
}

/**
 * Parsed date information with multiple formats
 */
export interface FixtureDates {
  dayOne: string | null; // ISO datetime
  finalDaysPlay: string | null; // ISO date only
  date: string | null; // Display format
  time: string | null;
  dateRange: string | null;
  dateRangeObj: Record<string, DateRangeObj> | null; // Parsed JSON
}

/**
 * Venue information
 */
export interface Venue {
  ground: string | null;
}

/**
 * Team scores and information
 */
export interface Teams {
  home: TeamInfo;
  away: TeamInfo;
}

/**
 * Team information with scores
 */
export interface TeamInfo {
  name: string | null;
  scores: TeamScores;
}

/**
 * Team scores breakdown
 */
export interface TeamScores {
  total: string | null;
  overs: string | null;
  firstInnings: string | null;
}

/**
 * Batting player statistics
 */
export interface BattingPlayer {
  name?: string;
  player?: string;
  dismissal?: string;
  runs?: number | string;
  R?: number | string;
  balls?: number | string;
  B?: number | string;
  fours?: number | string;
  "4s"?: number | string;
  sixes?: number | string;
  "6s"?: number | string;
  strikeRate?: number | string;
  SR?: number | string;
}

/**
 * Bowling player statistics
 */
export interface BowlingPlayer {
  name?: string;
  player?: string;
  overs?: number | string;
  O?: number | string;
  maidens?: number | string;
  M?: number | string;
  runs?: number | string;
  R?: number | string;
  wickets?: number | string;
  W?: number | string;
  economy?: number | string;
  Econ?: number | string;
}

/**
 * Team scorecard data with batting and bowling arrays
 */
export interface TeamScorecardData {
  batting?: BattingPlayer[];
  bowling?: BowlingPlayer[];
}

/**
 * Match details including toss and scorecard
 */
export interface MatchDetails {
  tossWinner: string | null;
  tossResult: string | null;
  urlToScoreCard: string | null;
  scorecards: Record<string, TeamScorecardData> | null;
  resultStatement: string | null;
}

/**
 * Content and prompts information
 */
export interface Content {
  gameContext: string | null;
  basePromptInformation: string | null;
  hasBasePrompt: boolean;
  upcomingFixturePrompt: string | null;
  hasUpcomingFixturePrompt: boolean;
  lastPromptUpdate: string | null;
}

// ============================================================================
// Related Entity Types
// ============================================================================

/**
 * Grade information with association
 */
export interface GradeDetail {
  id: number;
  gradeName: string;
  logoUrl: string | null;
  association: FixtureAssociationDetail | null;
}

/**
 * Association detail information (for fixture context)
 */
export interface FixtureAssociationDetail {
  id: number;
  name: string;
  logoUrl: string | null;
}

/**
 * Team data with logo (for fixture context)
 */
export interface FixtureTeamData {
  id: number;
  name: string;
  logoUrl: string | null;
}

/**
 * Download/media file associated with fixture
 */
export interface FixtureDownload {
  id: number;
  name: string | null;
  url: string | null;
  type: string | null;
}

/**
 * Render processing status
 */
export interface RenderStatus {
  upcomingGamesRenders: RenderEntry[];
  gameResultsRenders: RenderEntry[];
}

/**
 * Individual render entry
 */
export interface RenderEntry {
  id: number;
  status: string | null;
  processedAt: string | null;
}

/**
 * Club data (top-level access)
 */
export interface ClubData {
  id: number;
  name: string;
  logoUrl: string | null;
}

// ============================================================================
// Context Types
// ============================================================================

/**
 * Administrative context
 */
export interface Context {
  admin: AdminContext;
}

/**
 * Admin metadata and timestamps
 */
export interface AdminContext {
  createdAt: string | null;
  updatedAt: string | null;
  publishedAt: string | null;
  lastPromptUpdate: string | null;
}

// ============================================================================
// Meta Data Types
// ============================================================================

/**
 * Validation and performance metadata
 */
export interface MetaData {
  generatedAt: string;
  fixtureId: number;
  validation: ValidationData;
  performance: FixturePerformanceMetrics;
}

/**
 * Validation status type
 */
export type ValidationStatus =
  | "excellent"
  | "good"
  | "fair"
  | "poor"
  | "critical";

/**
 * Validation data with scores and recommendations
 */
export interface ValidationData {
  overallScore: number; // 0-100
  status: ValidationStatus;
  statusBased: boolean;
  breakdown: ValidationBreakdown;
  missingFields: string[];
  recommendations: string[];
}

/**
 * Validation breakdown by category
 */
export interface ValidationBreakdown {
  basicInfo: number;
  scheduling: number;
  matchDetails: number;
  content: number;
  relations: number;
  results: number;
}

/**
 * Performance metrics (for fixture detail context)
 */
export interface FixturePerformanceMetrics {
  fetchTimeMs: number;
  processingTimeMs: number;
  totalTimeMs: number;
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard to check if response is a valid SingleFixtureDetailResponse
 */
export function isSingleFixtureDetailResponse(
  data: any
): data is SingleFixtureDetailResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof data.fixture === "object" &&
    typeof data.meta === "object" &&
    typeof data.meta.validation === "object" &&
    Array.isArray(data.club) &&
    Array.isArray(data.teamsData) &&
    Array.isArray(data.downloads)
  );
}
