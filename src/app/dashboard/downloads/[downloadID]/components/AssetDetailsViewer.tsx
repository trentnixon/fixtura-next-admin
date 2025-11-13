"use client";

import type { Download } from "@/types/download";
import { Card, CardContent } from "@/components/ui/card";
import Text from "@/components/ui-library/foundation/Text";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import EmptyState from "@/components/ui-library/states/EmptyState";
import AssetDetailsCricketResults from "./AssetDetailsCricketResults";
import AssetDetailsLadder from "./AssetDetailsLadder";
import AssetDetailsTop5Bowling from "./AssetDetailsTop5Bowling";
import AssetDetailsTop5Batting from "./AssetDetailsTop5Batting";
import AssetDetailsUpcoming from "./AssetDetailsUpcoming";
import AssetDetailsResultSingle from "./AssetDetailsResultSingle";
import {
  detectAssetType,
  getCricketResultsData,
  getCricketLadderData,
  getTop5BowlingData,
  getTop5BattingData,
  getCricketUpcomingData,
  getCricketResultSingleData,
  isCricketResults,
  isCricketLadder,
  isTop5Bowling,
  isTop5Batting,
  isCricketUpcoming,
  isCricketResultSingle,
} from "@/utils/downloadAsset";
import { AlertCircle } from "lucide-react";

interface AssetDetailsViewerProps {
  download: Download;
}

/**
 * AssetDetailsViewer Component
 *
 * Central component for displaying asset details:
 * - Detects asset type from download data
 * - Renders common asset details (always if OBJ exists)
 * - Conditionally renders asset-specific components based on type
 * - Handles unknown asset types gracefully
 * - Shows empty/error states when needed
 */
export default function AssetDetailsViewer({
  download,
}: AssetDetailsViewerProps) {
  // Detect asset type
  const assetType = detectAssetType(download);

  // Check if OBJ data exists
  const hasOBJ = !!download?.attributes?.OBJ;
  const hasOBJData = !!download?.attributes?.OBJ?.data;
  const objDataLength =
    Array.isArray(download?.attributes?.OBJ?.data) &&
    download.attributes.OBJ.data.length > 0;

  // If no OBJ data exists, show empty state
  if (!hasOBJ) {
    return (
      <SectionContainer
        title="Asset Details"
        description="Asset metadata and structured data"
      >
        <EmptyState
          variant="card"
          title="No asset data available"
          description="This download does not contain structured asset data."
        />
      </SectionContainer>
    );
  }

  // If OBJ exists but data array is empty, show empty state
  if (hasOBJ && (!hasOBJData || !objDataLength)) {
    return (
      <SectionContainer
        title="Asset-Specific Data"
        description="Structured data for this asset type"
      >
        <EmptyState
          variant="card"
          title="No asset-specific data available"
          description="This download contains metadata but no structured asset-specific data."
        />
      </SectionContainer>
    );
  }

  // Render asset-specific component based on type
  const renderAssetSpecificSection = () => {
    if (assetType && isCricketResults(assetType)) {
      // CricketResults asset type
      const cricketResultsData = getCricketResultsData(download);
      if (
        cricketResultsData &&
        cricketResultsData.data &&
        cricketResultsData.data.length > 0
      ) {
        return <AssetDetailsCricketResults games={cricketResultsData.data} />;
      } else {
        // Asset type is CricketResults but data structure is invalid
        return (
          <SectionContainer
            title="Cricket Results"
            description="Game results and team performances"
          >
            <Card className="shadow-none border border-yellow-200 bg-yellow-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-700" />
                  <Text className="text-yellow-700">
                    Asset type is CricketResults but the data structure is invalid or empty.
                  </Text>
                </div>
              </CardContent>
            </Card>
          </SectionContainer>
        );
      }
    }

    if (assetType && isCricketLadder(assetType)) {
      // CricketLadder asset type
      const cricketLadderData = getCricketLadderData(download);
      if (
        cricketLadderData &&
        cricketLadderData.data &&
        cricketLadderData.data.length > 0
      ) {
        return <AssetDetailsLadder grades={cricketLadderData.data} />;
      } else {
        // Asset type is CricketLadder but data structure is invalid
        return (
          <SectionContainer
            title="Ladder"
            description="League tables and standings"
          >
            <Card className="shadow-none border border-yellow-200 bg-yellow-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-700" />
                  <Text className="text-yellow-700">
                    Asset type is CricketLadder but the data structure is invalid or empty.
                  </Text>
                </div>
              </CardContent>
            </Card>
          </SectionContainer>
        );
      }
    }

    if (assetType && isTop5Bowling(assetType)) {
      // CricketTop5Bowling asset type
      const top5BowlingData = getTop5BowlingData(download);
      if (
        top5BowlingData &&
        top5BowlingData.data &&
        top5BowlingData.data.length > 0
      ) {
        return (
          <AssetDetailsTop5Bowling performances={top5BowlingData.data} />
        );
      } else {
        // Asset type is CricketTop5Bowling but data structure is invalid
        return (
          <SectionContainer
            title="Top 5 Bowling"
            description="Top bowling performances"
          >
            <Card className="shadow-none border border-yellow-200 bg-yellow-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-700" />
                  <Text className="text-yellow-700">
                    Asset type is CricketTop5Bowling but the data structure is invalid or empty.
                  </Text>
                </div>
              </CardContent>
            </Card>
          </SectionContainer>
        );
      }
    }

    if (assetType && isTop5Batting(assetType)) {
      // CricketTop5Batting asset type
      const top5BattingData = getTop5BattingData(download);
      if (
        top5BattingData &&
        top5BattingData.data &&
        top5BattingData.data.length > 0
      ) {
        return (
          <AssetDetailsTop5Batting performances={top5BattingData.data} />
        );
      } else {
        // Asset type is CricketTop5Batting but data structure is invalid
        return (
          <SectionContainer
            title="Top 5 Batting"
            description="Top batting performances"
          >
            <Card className="shadow-none border border-yellow-200 bg-yellow-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-700" />
                  <Text className="text-yellow-700">
                    Asset type is CricketTop5Batting but the data structure is invalid or empty.
                  </Text>
                </div>
              </CardContent>
            </Card>
          </SectionContainer>
        );
      }
    }

    if (assetType && isCricketUpcoming(assetType)) {
      // CricketUpcoming asset type
      const cricketUpcomingData = getCricketUpcomingData(download);
      if (
        cricketUpcomingData &&
        cricketUpcomingData.data &&
        cricketUpcomingData.data.length > 0
      ) {
        return (
          <AssetDetailsUpcoming fixtures={cricketUpcomingData.data} />
        );
      } else {
        // Asset type is CricketUpcoming but data structure is invalid
        return (
          <SectionContainer
            title="Upcoming Fixtures"
            description="Upcoming cricket fixtures"
          >
            <Card className="shadow-none border border-yellow-200 bg-yellow-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-700" />
                  <Text className="text-yellow-700">
                    Asset type is CricketUpcoming but the data structure is invalid or empty.
                  </Text>
                </div>
              </CardContent>
            </Card>
          </SectionContainer>
        );
      }
    }

    if (assetType && isCricketResultSingle(assetType)) {
      // CricketResultSingle asset type
      const cricketResultSingleData = getCricketResultSingleData(download);
      if (
        cricketResultSingleData &&
        cricketResultSingleData.data &&
        cricketResultSingleData.data.length > 0
      ) {
        // Get the first (and only) game from the array
        const game = cricketResultSingleData.data[0];
        return <AssetDetailsResultSingle game={game} />;
      } else {
        // Asset type is CricketResultSingle but data structure is invalid
        return (
          <SectionContainer
            title="Game Result"
            description="Single cricket game result"
          >
            <Card className="shadow-none border border-yellow-200 bg-yellow-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-700" />
                  <Text className="text-yellow-700">
                    Asset type is CricketResultSingle but the data structure is invalid or empty.
                  </Text>
                </div>
              </CardContent>
            </Card>
          </SectionContainer>
        );
      }
    }

    if (assetType) {
      // Unknown asset type (but we detected one)
      return (
        <SectionContainer
          title="Asset-Specific Data"
          description={`Structured data for ${assetType} asset type`}
        >
          <Card className="shadow-none border border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-blue-700" />
                <Text className="text-blue-700">
                  Asset type &quot;{assetType}&quot; is not yet supported. Please view the raw data for
                  details.
                </Text>
              </div>
            </CardContent>
          </Card>
        </SectionContainer>
      );
    }

    // No asset type detected
    return (
      <SectionContainer
        title="Asset-Specific Data"
        description="Structured data for this asset"
      >
        <Card className="shadow-none border border-slate-200 bg-slate-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-slate-700" />
              <Text className="text-slate-700">
                Unable to detect asset type. Please view the raw data for details.
              </Text>
            </div>
          </CardContent>
        </Card>
      </SectionContainer>
    );
  };

  return (
    <>
      {/* Asset-specific section only */}
      {renderAssetSpecificSection()}
    </>
  );
}
