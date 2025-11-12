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

