# Asset Type Support Guide

This guide explains how to add support for new asset types in the download detail page.

## Current Status

- ✅ **CricketResults** - Fully implemented with structured views
- ✅ **CricketLadder** - Fully implemented with league tables
- ✅ **CricketTop5Bowling** - Fully implemented with table view
- ✅ **CricketTop5Batting** - Fully implemented with table view
- ✅ **CricketUpcoming** - Fully implemented with table view
- ✅ **CricketResultSingle** - Fully implemented with game card view
- ❌ **CricketRoster** - Not yet implemented

## Architecture Overview

The asset details visualization system is designed to be extensible:

1. **Common Metadata** - Always displayed for all asset types (asset info, render info, timings, video settings)
2. **Asset-Specific Data** - Conditionally rendered based on asset type (e.g., game results, upcoming fixtures, ladder standings)

## How It Works

### 1. Asset Type Detection

Asset types are detected from the `CompositionID` field in the download's asset data:

```typescript
// utils/downloadAsset.ts
export function detectAssetType(download: Download): AssetType | null {
  if (!download?.attributes?.asset?.data?.attributes?.CompositionID) {
    return null;
  }
  return download.attributes.asset.data.attributes.CompositionID;
}
```

### 2. Component Routing

The `AssetDetailsViewer` component detects the asset type and renders the appropriate component:

```typescript
// components/AssetDetailsViewer.tsx
const renderAssetSpecificSection = () => {
  if (assetType && isCricketResults(assetType)) {
    // Render CricketResults component
    return <AssetDetailsCricketResults games={cricketResultsData.data} />;
  }

  if (assetType) {
    // Unknown asset type - show message
    return <UnsupportedAssetTypeMessage assetType={assetType} />;
  }

  // No asset type detected
  return <NoAssetTypeMessage />;
};
```

## Adding Support for a New Asset Type

To add support for a new asset type (e.g., `CricketUpcoming`), follow these steps:

### Step 1: Define TypeScript Types

Add type definitions in `src/types/downloadAsset.ts`:

```typescript
// Example: CricketUpcoming types
export interface CricketUpcomingFixture {
  fixtureID: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  ground: string;
  round: string;
  gradeName: string;
  // ... other fields
}

export interface CricketUpcomingData {
  data: CricketUpcomingFixture[];
}

// Update AssetSpecificData union type
export type AssetSpecificData =
  | CricketResultsData
  | CricketUpcomingData;
```

### Step 2: Add Utility Functions

Add utility functions in `src/utils/downloadAsset.ts`:

```typescript
// Type guard for CricketUpcoming
export function isCricketUpcoming(
  assetType: AssetType | null
): assetType is "CricketUpcoming" {
  return assetType === "CricketUpcoming";
}

// Data extraction function
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

// Type guard for data structure
export function isCricketUpcomingData(
  data: unknown[]
): data is CricketUpcomingFixture[] {
  if (!Array.isArray(data) || data.length === 0) {
    return false;
  }

  const firstItem = data[0] as Partial<CricketUpcomingFixture>;
  return (
    typeof firstItem === "object" &&
    firstItem !== null &&
    "fixtureID" in firstItem &&
    "homeTeam" in firstItem &&
    "awayTeam" in firstItem
  );
}
```

### Step 3: Create Asset-Specific Component

Create a new component in `src/app/dashboard/downloads/[downloadID]/components/`:

```typescript
// AssetDetailsCricketUpcoming.tsx
"use client";

import type { CricketUpcomingFixture } from "@/types/downloadAsset";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { formatDate } from "@/lib/utils";

interface AssetDetailsCricketUpcomingProps {
  fixtures: CricketUpcomingFixture[];
}

export default function AssetDetailsCricketUpcoming({
  fixtures,
}: AssetDetailsCricketUpcomingProps) {
  if (!fixtures || fixtures.length === 0) {
    return null;
  }

  return (
    <SectionContainer
      title="Cricket Upcoming Fixtures"
      description={`Upcoming fixtures (${fixtures.length} fixtures)`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {fixtures.map((fixture, index) => (
          <Card key={index} className="shadow-none border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {fixture.gradeName || "Fixture"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Date</p>
                <p className="font-medium">{formatDate(fixture.date)}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Home Team</p>
                <p className="font-medium">{fixture.homeTeam}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Away Team</p>
                <p className="font-medium">{fixture.awayTeam}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Ground</p>
                <p className="font-medium">{fixture.ground}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </SectionContainer>
  );
}
```

### Step 4: Update AssetDetailsViewer

Update `AssetDetailsViewer.tsx` to handle the new asset type:

```typescript
// components/AssetDetailsViewer.tsx
import AssetDetailsCricketUpcoming from "./AssetDetailsCricketUpcoming";
import {
  detectAssetType,
  getCommonAssetDetails,
  getCricketResultsData,
  getCricketUpcomingData, // Add this
  isCricketResults,
  isCricketUpcoming, // Add this
} from "@/utils/downloadAsset";

// In renderAssetSpecificSection():
const renderAssetSpecificSection = () => {
  if (assetType && isCricketResults(assetType)) {
    // ... existing CricketResults logic
  }

  if (assetType && isCricketUpcoming(assetType)) {
    // NEW: CricketUpcoming asset type
    const cricketUpcomingData = getCricketUpcomingData(download);
    if (
      cricketUpcomingData &&
      cricketUpcomingData.data &&
      cricketUpcomingData.data.length > 0
    ) {
      return <AssetDetailsCricketUpcoming fixtures={cricketUpcomingData.data} />;
    } else {
      // Handle invalid data
      return (
        <SectionContainer
          title="Cricket Upcoming Fixtures"
          description="Upcoming fixtures information"
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

  // ... rest of the logic
};
```

### Step 5: Update Type Definitions

Update the `AssetType` type in `src/types/downloadAsset.ts` if needed:

```typescript
export type AssetType =
  | "CricketResults"
  | "CricketUpcoming"
  | "CricketLadder"
  | "CricketRoster"
  | "CricketResultSingle"
  | string;
```

## Testing

After adding support for a new asset type:

1. **Test with real data** - Use a download with the new asset type
2. **Test error handling** - Test with invalid or missing data
3. **Test responsive design** - Ensure components work on mobile devices
4. **Test performance** - Ensure large datasets don't cause performance issues

## Best Practices

1. **Follow the pattern** - Use the same structure as `CricketResults` for consistency
2. **Reuse components** - Use shared components (e.g., `CricketTeamCard`, `BattingPerformanceList`) when possible
3. **Handle errors gracefully** - Always show informative error messages for invalid data
4. **Use TypeScript** - Leverage type safety for better code quality
5. **Document components** - Add JSDoc comments to all components
6. **Test thoroughly** - Test with various data scenarios

## Example: Complete Implementation

See `AssetDetailsCricketResults.tsx` and `CricketGameCard.tsx` for a complete implementation example.

## Questions?

If you need help adding support for a new asset type, refer to:
- `src/app/dashboard/downloads/[downloadID]/components/AssetDetailsCricketResults.tsx` - Example implementation
- `src/utils/downloadAsset.ts` - Utility functions
- `src/types/downloadAsset.ts` - Type definitions
- `src/app/dashboard/downloads/Tickets.md` - Detailed planning

