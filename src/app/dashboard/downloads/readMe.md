# Folder Overview

This folder contains download management pages and components for the Fixtura Admin application. It provides functionality for viewing and managing file downloads associated with renders and other operations. All components use the new UI library patterns with standardized state management, error handling, and consistent styling.

## Files

- `page.tsx`: Main downloads listing page (currently placeholder - see TKT-2025-006)
- `[downloadID]/page.tsx`: Individual download detail page with UI library migration complete (TKT-2025-004, TKT-2025-005)
- `[downloadID]/components/index.tsx`: Component for displaying download details and information (DisplayDownload) - migrated to UI library
- `[downloadID]/components/DownloadHeader.tsx`: Action buttons header component with navigation and external links
- `[downloadID]/components/AssetDetailsViewer.tsx`: Central component for displaying structured asset details with asset type detection
- `[downloadID]/components/AssetDetailsCommon.tsx`: Component for displaying common asset metadata (render, account, timings, frames, videoMeta)
- `[downloadID]/components/AssetDetailsCricketResults.tsx`: Component for displaying CricketResults asset-specific data (games, teams, performances)
- `[downloadID]/components/CricketGameCard.tsx`: Component for displaying a single cricket game with teams and performances
- `[downloadID]/components/CricketTeamCard.tsx`: Component for displaying team information with batting and bowling performances
- `[downloadID]/components/BattingPerformanceList.tsx`: Component for displaying batting performances in a table (top 3, expandable)
- `[downloadID]/components/BowlingPerformanceList.tsx`: Component for displaying bowling performances in a table (top 3, expandable)
- `[downloadID]/components/MatchContextCard.tsx`: Component for displaying match context information (competition, grade, toss, etc.)
- `[downloadID]/components/AccountBiasCard.tsx`: Component for displaying account bias information (club teams, focused teams)
- `DevelopmentRoadMap.md`: Development roadmap for downloads feature improvements
- `Tickets.md`: Detailed tickets for UI migration and enhancements

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: Dashboard navigation and download management workflows
- Key dependencies: `../../components/` for UI components, `../../../../hooks/` for data fetching
- Related: Renders detail page (`/dashboard/renders/:renderID`) - reference for UI patterns

## Dependencies

- Internal:
  - `../../components/scaffolding/containers/`: PageContainer, SectionContainer, CreatePageTitle
  - `../../../../hooks/downloads/`: useDownloadQuery, useDownloadsQuery
  - `../../../../lib/services/downloads/`: fetchDownloadByID (with render population), fetchDownloadByRenderID
  - `../../../../types/download.ts`: Download, DownloadAttributes type definitions (includes render relationship)
  - `../../../../components/ui-library/states/`: LoadingState, ErrorState, EmptyState
  - `../../../../components/ui-library/foundation/`: Text, Link (StyledLink)
  - `../../../../components/ui/`: Button, Badge, Collapsible, Card, Table, Dialog
  - `../../../../components/type/titles.tsx`: Label for section labels
  - `../../../../components/providers/GlobalContext`: useGlobalContext for strapiLocation
  - `../../../../utils/downloadAsset.ts`: Asset type detection and data extraction utilities (detectAssetType, getCommonAssetDetails, getCricketResultsData, parsePromptData)
  - `../../../../types/downloadAsset.ts`: Asset type definitions (AssetType, CommonAssetDetails, CricketGame, CricketTeam, BattingPerformance, BowlingPerformance, MatchContext, AccountBias)
  - `next/image`: Next.js Image component for team logos and club logos
- External:
  - `next/link`: Next.js navigation
  - `next/navigation`: useParams hook
  - `@tanstack/react-query`: Data fetching and caching
  - `lucide-react`: Icons for badges and buttons

## Patterns

- **Page Structure**: Uses PageContainer and SectionContainer for consistent layout
- **Dynamic Routing**: Uses Next.js dynamic routing with [downloadID] parameter
- **State Management**: Uses LoadingState, ErrorState, and EmptyState components with retry functionality
- **Component Organization**: Organized into logical sections (General Information, Asset Information, Download Links, Status & Metadata, Raw Data)
- **Data Integration**: Centralized data fetching in page component with prop passing to child components
- **Typography**: Uses UI library Text, Label, and StyledLink components
- **Status Indicators**: Uses Badge components with icons and color coding for status display
- **Action Buttons**: DownloadHeader component with conditional rendering for Back to Render, External Link, and Strapi buttons
- **Error Recovery**: ErrorState component with retry functionality using refetch from useDownloadQuery
- **Type Safety**: Strong TypeScript integration with proper prop interfaces and type definitions

## Current Status

- **Download Detail Page**: ✅ UI library migration complete (TKT-2025-004, TKT-2025-005)
  - Page structure migrated to PageContainer and SectionContainer
  - State management using LoadingState, ErrorState, EmptyState
  - Typography migrated to UI library components
  - Status badges with icons and color coding
  - Action buttons with navigation and external links
  - Collapsible raw JSON display
  - Enhanced error message display
- **Asset Details Visualization**: ✅ Complete (TKT-2025-007)
  - Common asset details display (render, account, timings, frames, videoMeta)
  - CricketResults asset-specific data display (games, teams, performances)
  - Asset type detection and conditional rendering
  - Empty states and error handling for missing/invalid data
  - Expandable performance tables (batting, bowling)
  - Match context and account bias display
- **Downloads Listing Page**: Placeholder page, scheduled for implementation (TKT-2025-006)

## Implementation Details

### Page Structure (`[downloadID]/page.tsx`)

- Uses `PageContainer` for main page layout
- Uses `CreatePageTitle` for dynamic page title with download name
- Centralized data fetching with `useDownloadQuery`
- Conditional rendering for loading, error, and empty states
- Minimal loading state for background refetching
- Action buttons header component

### DisplayDownload Component (`[downloadID]/components/index.tsx`)

- Organized into sections using `SectionContainer`:
  - Download Details Card: Completion time, cost, file size
  - Asset Information Card: Asset name, category (badge), composition ID
  - Status Card: Status badges (processed, error, accurate, force rerender, error email sent)
  - Asset Details Viewer: Structured asset details with type detection
  - Download Links: Video player, image gallery, or download links based on asset type
  - Additional Information: Error message, related IDs (assetLinkID, gameID)
  - Raw Data: Collapsible JSON display (always available as fallback)
- Uses Badge components for status indicators with icons
- Uses Text and Label components for typography
- Uses StyledLink for external links
- Conditional rendering for optional fields
- Media display: Video player for VIDEO assets, image gallery for IMAGE assets
- Uses AssetDetailsViewer for structured asset data display

### DownloadHeader Component (`[downloadID]/components/DownloadHeader.tsx`)

- Conditional "Back to Render" button (if render ID available)
- Conditional external link button (if download URL available)
- Always-visible Strapi link button
- Right-aligned button group with consistent styling

### AssetDetailsViewer Component (`[downloadID]/components/AssetDetailsViewer.tsx`)

- Central component for displaying structured asset details
- Detects asset type from download data using `detectAssetType` utility
- Renders common asset details (always if OBJ exists) using `AssetDetailsCommon`
- Conditionally renders asset-specific components based on type:
  - CricketResults: `AssetDetailsCricketResults` component
  - Unknown types: Informative message with raw JSON fallback
- Handles edge cases:
  - Missing OBJ data: EmptyState
  - Empty OBJ.data: EmptyState with common details if available
  - Invalid data structure: Informative error message
  - Unknown asset type: Informative message with raw JSON fallback

### AssetDetailsCommon Component (`[downloadID]/components/AssetDetailsCommon.tsx`)

- Displays common asset metadata shared across all asset types:
  - Asset metadata: Asset ID, Asset Type ID, Asset Category ID, Assets Link ID
  - Render metadata: Scheduler ID, Render ID
  - Account metadata: Account ID
  - Timings: FPS values for all segments (MAIN, INTRO, OUTRO, LADDER, SCORECARD)
  - Frames: Frame count and frame numbers as badges
  - VideoMeta: Club information, video settings, appearance, template variation (collapsible)
  - Errors: Error list with styling (only shown if errors exist)
- Uses Card components for each section
- Uses Collapsible components for videoMeta and templateVariation sections
- Uses Badge components for status indicators
- Uses Image component for club logo display

### AssetDetailsCricketResults Component (`[downloadID]/components/AssetDetailsCricketResults.tsx`)

- Displays CricketResults asset-specific data:
  - Games list with count
  - Each game in a card with teams and performances
  - Match context (if available from prompt)
  - Account bias (if available from prompt)
- Uses CricketGameCard component for each game
- Uses SectionContainer for organization

### CricketGameCard Component (`[downloadID]/components/CricketGameCard.tsx`)

- Displays a single cricket game:
  - Game information: ID, status, date, type, ground, round, grade, gender, ageGroup
  - Result statement
  - Home and away teams with performances
  - Match context (collapsible, if available from prompt)
  - Account bias (collapsible, if available from prompt)
- Uses CricketTeamCard component for teams
- Uses MatchContextCard and AccountBiasCard for additional information
- Parses prompt JSON string to extract match context and account bias

### CricketTeamCard Component (`[downloadID]/components/CricketTeamCard.tsx`)

- Displays team information:
  - Team name, logo, isClubTeam badge, home/away badge
  - Score and overs
  - Batting performances (top 3, expandable)
  - Bowling performances (top 3, expandable)
- Uses BattingPerformanceList and BowlingPerformanceList components
- Uses Image component for team logo display
- Uses Badge components for status indicators

### BattingPerformanceList Component (`[downloadID]/components/BattingPerformanceList.tsx`)

- Displays batting performances in a table:
  - Columns: Player, Runs, Balls, 4s, 6s, SR, Not Out
  - Shows top 3 by default, expandable to show all
  - Sorted by runs (descending)
- Uses Table component from UI library
- Uses Button component for expand/collapse functionality

### BowlingPerformanceList Component (`[downloadID]/components/BowlingPerformanceList.tsx`)

- Displays bowling performances in a table:
  - Columns: Player, Overs, Maidens, Runs, Wickets, Economy
  - Shows top 3 by default, expandable to show all
  - Sorted by wickets (descending), then economy (ascending)
- Uses Table component from UI library
- Uses Button component for expand/collapse functionality

### MatchContextCard Component (`[downloadID]/components/MatchContextCard.tsx`)

- Displays match context information:
  - Competition, grade, round, ground
  - Match type, toss winner, toss result
  - Result statement
  - Day one and final days play
- Uses Card components for organization
- Uses Badge components for status indicators
- Uses icons from lucide-react for visual indicators

### AccountBiasCard Component (`[downloadID]/components/AccountBiasCard.tsx`)

- Displays account bias information:
  - Is bias indicator (badge)
  - Club teams list (badges)
  - Focused teams list (badges)
- Uses Card components for organization
- Uses Badge components for team lists
- Uses icons from lucide-react for visual indicators

## Completed Migrations

- ✅ Phase 1: Page Structure Migration (TKT-2025-004)
- ✅ Phase 2: State Management Migration (TKT-2025-004)
- ✅ Phase 3: Component Structure Improvements (TKT-2025-004)
- ✅ Phase 4: Typography Migration (TKT-2025-004)
- ✅ Phase 5: Action Buttons & Navigation (TKT-2025-005)
- ✅ Phase 6: Status Indicators & Badges (TKT-2025-005)
- ✅ Phase 7: Testing & Cleanup (TKT-2025-004, TKT-2025-005)
- ✅ Phase 1: Data Structure Analysis & Type Definitions (TKT-2025-007)
- ✅ Phase 2: Common Asset Details Component (TKT-2025-007)
- ✅ Phase 3: CricketResults Asset-Specific Component (TKT-2025-007)
- ✅ Phase 4: Component Integration & Asset Type Detection (TKT-2025-007)

## Planned Improvements

See `DevelopmentRoadMap.md` and `Tickets.md` for detailed plans on:

- Downloads Listing Page Implementation (TKT-2025-006)
- Additional asset type support (CricketUpcoming, CricketLadder, CricketRoster, CricketResultSingle)
- Styling & UX Improvements (TKT-2025-007 Phase 5)
- Testing & Documentation (TKT-2025-007 Phase 6)
