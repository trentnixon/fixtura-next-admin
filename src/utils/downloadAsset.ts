/**
 * Utility functions for download asset data
 *
 * These utilities help with asset type detection, data parsing, and type guards
 * for download asset data structures.
 */

import type { Download } from "@/types/download";
import type {
  AssetType,
  CricketGame,
  CricketResultsData,
  CricketLadderData,
  LadderGrade,
  Top5BowlingData,
  Top5BowlingPerformance,
  Top5BattingData,
  Top5BattingPerformance,
  CricketUpcomingData,
  UpcomingFixture,
  CricketResultSingleData,
  ParsedPromptData,
} from "@/types/downloadAsset";

/**
 * Detect asset type from download data
 * @param download - Download object containing asset information
 * @returns Asset type identifier (e.g., "CricketResults", "CricketUpcoming")
 */
export function detectAssetType(download: Download): AssetType | null {
  if (!download?.attributes?.asset?.data?.attributes?.CompositionID) {
    return null;
  }

  return download.attributes.asset.data.attributes.CompositionID;
}

/**
 * Type guard to check if asset type is CricketResults
 * @param assetType - Asset type identifier
 * @returns True if asset type is CricketResults
 */
export function isCricketResults(assetType: AssetType | null): boolean {
  return assetType === "CricketResults";
}

/**
 * Type guard to check if asset type is CricketLadder
 * @param assetType - Asset type identifier
 * @returns True if asset type is CricketLadder
 */
export function isCricketLadder(assetType: AssetType | null): boolean {
  return assetType === "CricketLadder";
}

/**
 * Type guard to check if asset type is CricketTop5Bowling
 * @param assetType - Asset type identifier
 * @returns True if asset type is CricketTop5Bowling
 */
export function isTop5Bowling(assetType: AssetType | null): boolean {
  return assetType === "CricketTop5Bowling";
}

/**
 * Type guard to check if asset type is CricketTop5Batting
 * @param assetType - Asset type identifier
 * @returns True if asset type is CricketTop5Batting
 */
export function isTop5Batting(assetType: AssetType | null): boolean {
  return assetType === "CricketTop5Batting";
}

/**
 * Type guard to check if asset type is CricketUpcoming
 * @param assetType - Asset type identifier
 * @returns True if asset type is CricketUpcoming
 */
export function isCricketUpcoming(assetType: AssetType | null): boolean {
  return assetType === "CricketUpcoming";
}

/**
 * Type guard to check if asset type is CricketResultSingle
 * @param assetType - Asset type identifier
 * @returns True if asset type is CricketResultSingle
 */
export function isCricketResultSingle(assetType: AssetType | null): boolean {
  return assetType === "CricketResultSingle";
}

/**
 * Type guard to check if OBJ data is CricketResults data
 * @param data - OBJ.data array from download
 * @returns True if data appears to be CricketResults data
 */
export function isCricketResultsData(data: unknown[]): data is CricketGame[] {
  if (!Array.isArray(data) || data.length === 0) {
    return false;
  }

  // Check first item for CricketResults structure
  const firstItem = data[0] as Partial<CricketGame>;
  return (
    typeof firstItem === "object" &&
    firstItem !== null &&
    "gameID" in firstItem &&
    "homeTeam" in firstItem &&
    "awayTeam" in firstItem &&
    "status" in firstItem
  );
}

/**
 * Type guard to check if OBJ data is CricketLadder data
 * @param data - OBJ.data array from download
 * @returns True if data appears to be CricketLadder data
 */
export function isCricketLadderData(data: unknown[]): data is LadderGrade[] {
  if (!Array.isArray(data) || data.length === 0) {
    return false;
  }

  // Check first item for CricketLadder structure
  const firstItem = data[0] as Partial<LadderGrade>;
  return (
    typeof firstItem === "object" &&
    firstItem !== null &&
    "ID" in firstItem &&
    "gradeName" in firstItem &&
    "League" in firstItem &&
    Array.isArray(firstItem.League)
  );
}

/**
 * Type guard to check if OBJ data is Top5Bowling data
 * @param data - OBJ.data array from download
 * @returns True if data appears to be Top5Bowling data
 */
export function isTop5BowlingData(
  data: unknown[]
): data is Top5BowlingPerformance[] {
  if (!Array.isArray(data) || data.length === 0) {
    return false;
  }

  // Check first item for Top5Bowling structure
  const firstItem = data[0] as Partial<Top5BowlingPerformance>;
  return (
    typeof firstItem === "object" &&
    firstItem !== null &&
    "name" in firstItem &&
    "runs" in firstItem &&
    "overs" in firstItem &&
    "wickets" in firstItem &&
    "playedFor" in firstItem &&
    "teamLogo" in firstItem
  );
}

/**
 * Type guard to check if OBJ data is Top5Batting data
 * @param data - OBJ.data array from download
 * @returns True if data appears to be Top5Batting data
 */
export function isTop5BattingData(
  data: unknown[]
): data is Top5BattingPerformance[] {
  if (!Array.isArray(data) || data.length === 0) {
    return false;
  }

  // Check first item for Top5Batting structure
  const firstItem = data[0] as Partial<Top5BattingPerformance>;
  return (
    typeof firstItem === "object" &&
    firstItem !== null &&
    "name" in firstItem &&
    "runs" in firstItem &&
    "balls" in firstItem &&
    "SR" in firstItem &&
    "notOut" in firstItem &&
    "playedFor" in firstItem &&
    "teamLogo" in firstItem
  );
}

/**
 * Type guard to check if OBJ data is CricketUpcoming data
 * @param data - OBJ.data array from download
 * @returns True if data appears to be CricketUpcoming data
 */
export function isCricketUpcomingData(
  data: unknown[]
): data is UpcomingFixture[] {
  if (!Array.isArray(data) || data.length === 0) {
    return false;
  }

  // Check first item for CricketUpcoming structure
  const firstItem = data[0] as Partial<UpcomingFixture>;
  return (
    typeof firstItem === "object" &&
    firstItem !== null &&
    "date" in firstItem &&
    "time" in firstItem &&
    "gameID" in firstItem &&
    "teamHome" in firstItem &&
    "teamAway" in firstItem &&
    "ground" in firstItem &&
    "gradeName" in firstItem
  );
}

/**
 * Type guard to check if OBJ data is CricketResultSingle data
 * @param data - OBJ.data array from download
 * @returns True if data appears to be CricketResultSingle data
 * Note: CricketResultSingle uses the same structure as CricketResults (CricketGame)
 */
export function isCricketResultSingleData(
  data: unknown[]
): data is CricketGame[] {
  // Reuse the same validation as CricketResults since they have the same structure
  return isCricketResultsData(data);
}

/**
 * Parse prompt JSON string to ParsedPromptData
 * @param promptString - JSON string containing prompt data
 * @returns Parsed prompt data or null if parsing fails
 */
export function parsePromptData(
  promptString: string | undefined
): ParsedPromptData | null {
  if (!promptString) {
    return null;
  }

  try {
    return JSON.parse(promptString) as ParsedPromptData;
  } catch (error) {
    console.error("Failed to parse prompt data:", error);
    return null;
  }
}

/**
 * Get common asset details from download OBJ
 * @param download - Download object
 * @returns Common asset details or null if OBJ is not available
 */
export function getCommonAssetDetails(
  download: Download
): import("@/types/downloadAsset").CommonAssetDetails | null {
  if (!download?.attributes?.OBJ) {
    return null;
  }

  const { OBJ } = download.attributes;
  return {
    asset: OBJ.asset,
    render: OBJ.render,
    account: OBJ.account,
    timings: OBJ.timings,
    frames: OBJ.frames,
    videoMeta: OBJ.videoMeta,
    errors: OBJ.errors,
  };
}

/**
 * Get asset-specific data from download OBJ
 * @param download - Download object
 * @returns Asset-specific data array or null if OBJ is not available
 */
export function getAssetSpecificData(
  download: Download
): unknown[] | null {
  if (!download?.attributes?.OBJ?.data) {
    return null;
  }

  return download.attributes.OBJ.data;
}

/**
 * Get CricketResults data from download OBJ
 * @param download - Download object
 * @returns CricketResults data or null if not available or not CricketResults
 */
export function getCricketResultsData(
  download: Download
): CricketResultsData | null {
  const assetType = detectAssetType(download);
  if (!isCricketResults(assetType)) {
    return null;
  }

  const data = getAssetSpecificData(download);
  if (!data || !isCricketResultsData(data)) {
    return null;
  }

  return { data };
}

/**
 * Get CricketLadder data from download OBJ
 * @param download - Download object
 * @returns CricketLadder data or null if not available or not CricketLadder
 */
export function getCricketLadderData(
  download: Download
): CricketLadderData | null {
  const assetType = detectAssetType(download);
  if (!isCricketLadder(assetType)) {
    return null;
  }

  const data = getAssetSpecificData(download);
  if (!data || !isCricketLadderData(data)) {
    return null;
  }

  return { data };
}

/**
 * Get CricketTop5Bowling data from download OBJ
 * @param download - Download object
 * @returns CricketTop5Bowling data or null if not available or not CricketTop5Bowling
 */
export function getTop5BowlingData(
  download: Download
): Top5BowlingData | null {
  const assetType = detectAssetType(download);
  if (!isTop5Bowling(assetType)) {
    return null;
  }

  const data = getAssetSpecificData(download);
  if (!data || !isTop5BowlingData(data)) {
    return null;
  }

  return { data };
}

/**
 * Get CricketTop5Batting data from download OBJ
 * @param download - Download object
 * @returns CricketTop5Batting data or null if not available or not CricketTop5Batting
 */
export function getTop5BattingData(
  download: Download
): Top5BattingData | null {
  const assetType = detectAssetType(download);
  if (!isTop5Batting(assetType)) {
    return null;
  }

  const data = getAssetSpecificData(download);
  if (!data || !isTop5BattingData(data)) {
    return null;
  }

  return { data };
}

/**
 * Get CricketUpcoming data from download OBJ
 * @param download - Download object
 * @returns CricketUpcoming data or null if not available or not CricketUpcoming
 */
export function getCricketUpcomingData(
  download: Download
): CricketUpcomingData | null {
  const assetType = detectAssetType(download);
  if (!isCricketUpcoming(assetType)) {
    return null;
  }

  const data = getAssetSpecificData(download);
  if (!data || !isCricketUpcomingData(data)) {
    return null;
  }

  return { data };
}

/**
 * Get CricketResultSingle data from download OBJ
 * @param download - Download object
 * @returns CricketResultSingle data or null if not available or not CricketResultSingle
 * Note: CricketResultSingle uses the same structure as CricketResults (CricketGame)
 */
export function getCricketResultSingleData(
  download: Download
): CricketResultSingleData | null {
  const assetType = detectAssetType(download);
  if (!isCricketResultSingle(assetType)) {
    return null;
  }

  const data = getAssetSpecificData(download);
  if (!data || !isCricketResultSingleData(data)) {
    return null;
  }

  return { data };
}

