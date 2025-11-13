# Folder Overview

This folder contains download management pages and components for the Fixtura Admin application. It provides functionality for viewing and managing file downloads associated with renders and other operations. All components use the new UI library patterns with standardized state management, error handling, and consistent styling.

## Files

- `page.tsx`: Main downloads listing page (currently placeholder - see TKT-2025-006)
- `[downloadID]/page.tsx`: Individual download detail page with UI library migration complete (TKT-2025-004, TKT-2025-005)
- `[downloadID]/components/index.tsx`: Component for displaying download details and information (DisplayDownload) - migrated to UI library
- `[downloadID]/components/DownloadHeader.tsx`: Action buttons header component with navigation and external links
- `[downloadID]/components/AssetDetailsViewer.tsx`: Central component for displaying structured asset details with asset type detection and routing
- `[downloadID]/components/AssetDetailsCommon.tsx`: Component for displaying account header with club logo and badges (currently unused, kept for future use)
- `[downloadID]/components/AssetDetailsCricketResults.tsx`: Component for displaying CricketResults asset-specific data (games in accordion format)
- `[downloadID]/components/AssetDetailsLadder.tsx`: Component for displaying CricketLadder asset-specific data (grades with league tables)
- `[downloadID]/components/AssetDetailsTop5Bowling.tsx`: Component for displaying CricketTop5Bowling asset-specific data (bowling performances table)
- `[downloadID]/components/AssetDetailsTop5Batting.tsx`: Component for displaying CricketTop5Batting asset-specific data (batting performances table)
- `[downloadID]/components/AssetDetailsUpcoming.tsx`: Component for displaying CricketUpcoming asset-specific data (upcoming fixtures table)
- `[downloadID]/components/AssetDetailsResultSingle.tsx`: Component for displaying CricketResultSingle asset-specific data (single game card)
- `[downloadID]/components/Settings.tsx`: Component for displaying video settings, template settings, and theme
- `[downloadID]/components/MetadataTable.tsx`: Component for displaying technical metadata in table format
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
  - `../../../../utils/downloadAsset.ts`: Asset type detection and data extraction utilities (detectAssetType, getCommonAssetDetails, getCricketResultsData, getCricketLadderData, getTop5BowlingData, getTop5BattingData, getCricketUpcomingData, getCricketResultSingleData, parsePromptData)
  - `../../../../types/downloadAsset.ts`: Asset type definitions (AssetType, CommonAssetDetails, CricketGame, CricketTeam, BattingPerformance, BowlingPerformance, MatchContext, AccountBias, LadderGrade, LadderTeam, Top5BowlingPerformance, Top5BattingPerformance, UpcomingFixture)
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
  - Asset-specific data display for 6 asset types:
    - CricketResults: Game results with teams, performances, match context (accordion format)
    - CricketLadder: League tables with grades and team standings (collapsible)
    - CricketTop5Bowling: Top bowling performances table
    - CricketTop5Batting: Top batting performances table
    - CricketUpcoming: Upcoming fixtures table
    - CricketResultSingle: Single game result card
  - Asset type detection and conditional rendering
  - Empty states and error handling for missing/invalid data
  - Expandable performance tables (batting, bowling)
  - Match context and account bias display
  - Page layout: Download Links → Asset Data → Settings → Metadata
  - Settings component: Video Settings, Template Settings, Theme
  - MetadataTable component: Technical metadata in table format
  - CMS navigation buttons for Account, Scheduler, Render, Games, Grades
  - Interactive features: Copy to clipboard, tooltips, expandable sections
  - Visual indicators: Status badges, winner highlights, performance milestones, rank badges
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
- Conditionally renders asset-specific components based on type:
  - CricketResults: `AssetDetailsCricketResults` component (accordion with games)
  - CricketLadder: `AssetDetailsLadder` component (collapsible league tables)
  - CricketTop5Bowling: `AssetDetailsTop5Bowling` component (performance table)
  - CricketTop5Batting: `AssetDetailsTop5Batting` component (performance table)
  - CricketUpcoming: `AssetDetailsUpcoming` component (fixtures table)
  - CricketResultSingle: `AssetDetailsResultSingle` component (game card)
  - Unknown types: Informative message with raw JSON fallback
- Handles edge cases:
  - Missing OBJ data: EmptyState
  - Empty OBJ.data: EmptyState with common details if available
  - Invalid data structure: Informative error message
  - Unknown asset type: Informative message with raw JSON fallback

### Settings Component (`[downloadID]/components/Settings.tsx`)

- Displays video settings, template settings, and theme
- Video Settings: Fixture Category, Grouping Category, Template, Title, Video Title, Composition ID
- Template Settings: Use Background, Mode, Category Name, Category Slug, Palette, Audio Bundle Name, Audio Options
- Theme: Primary, Secondary, Dark, White color palette with visual swatches
- Uses grid layout (2 columns for Video & Template Settings, full width for Theme)
- Always visible (no collapsible wrapper)

### MetadataTable Component (`[downloadID]/components/MetadataTable.tsx`)

- Displays technical metadata in a compact table format
- Categories: Asset Metadata, Render Metadata, Account Metadata, Render Timings, Frames
- Includes copy-to-clipboard functionality for IDs
- Always visible (no collapsible wrapper)
- Shows badges for frame numbers
- Organizes less important metadata at the bottom of the page

### AssetDetailsCricketResults Component (`[downloadID]/components/AssetDetailsCricketResults.tsx`)

- Displays CricketResults asset-specific data
- Shows games list with count in section description
- Displays each game in an accordion format:
  - Game summary in trigger (grade name, status, date, ground, round, scores with winner highlight)
  - CMS link button on each accordion trigger
  - Full game details when expanded (teams, performances, match context, account bias)
- Uses `CricketGameCard` component with `variant="nested"` for game details

### AssetDetailsLadder Component (`[downloadID]/components/AssetDetailsLadder.tsx`)

- Displays CricketLadder asset-specific data
- Shows grades list with count
- Each grade displayed in `LadderGradeCard` with collapsible league table
- Includes CMS link button for each grade

### AssetDetailsTop5Bowling Component (`[downloadID]/components/AssetDetailsTop5Bowling.tsx`)

- Displays CricketTop5Bowling asset-specific data
- Shows bowling performances in table format
- Includes rank badges, team logos, wickets, runs, overs, economy rate
- Grade and competition badges

### AssetDetailsTop5Batting Component (`[downloadID]/components/AssetDetailsTop5Batting.tsx`)

- Displays CricketTop5Batting asset-specific data
- Shows batting performances in table format
- Includes rank badges, team logos, runs, balls, strike rate, not out indicator
- Grade and competition badges

### AssetDetailsUpcoming Component (`[downloadID]/components/AssetDetailsUpcoming.tsx`)

- Displays CricketUpcoming asset-specific data
- Shows upcoming fixtures in table format
- Includes date, time, teams with logos, ground, round, grade, match type, age group, gender
- CMS link button for each fixture

### AssetDetailsResultSingle Component (`[downloadID]/components/AssetDetailsResultSingle.tsx`)

- Displays CricketResultSingle asset-specific data
- Shows single game result using `CricketGameCard` component
- Includes CMS link button at the top
- Displays full game details (teams, performances, match context, account bias)

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
- ✅ Phase 5: Styling & UX Improvements (TKT-2025-007)
- ✅ Additional Asset Type Support:
  - ✅ CricketLadder (TKT-2025-007)
  - ✅ CricketTop5Bowling (TKT-2025-007)
  - ✅ CricketTop5Batting (TKT-2025-007)
  - ✅ CricketUpcoming (TKT-2025-007)
  - ✅ CricketResultSingle (TKT-2025-007)
- ✅ Page Layout Reorganization
- ✅ Button Alignment Updates

## Remaining Work

See `DevelopmentRoadMap.md` and `Tickets.md` for detailed plans on:

- Downloads Listing Page Implementation (TKT-2025-006)
- Testing & Documentation (TKT-2025-007 Phase 6)
- Additional asset type support: CricketRoster (if needed)
