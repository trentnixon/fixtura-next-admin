"use client";

import type { Download } from "@/types/download";
import { Card, CardContent } from "@/components/ui/card";
import Text from "@/components/ui-library/foundation/Text";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import EmptyState from "@/components/ui-library/states/EmptyState";
import AssetDetailsCricketResults from "./AssetDetailsCricketResults";
import {
  detectAssetType,
  getCricketResultsData,
  isCricketResults,
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
