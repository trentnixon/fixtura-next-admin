# Folder Overview

This folder contains download management pages and components for the Fixtura Admin application. It provides functionality for viewing and managing file downloads associated with renders and other operations. All components use the new UI library patterns with standardized state management, error handling, and consistent styling.

## Files

- `page.tsx`: Main downloads listing page (currently placeholder - see TKT-2025-006)
- `[downloadID]/page.tsx`: Individual download detail page with UI library migration complete (TKT-2025-004, TKT-2025-005)
- `[downloadID]/components/index.tsx`: Component for displaying download details and information (DisplayDownload) - migrated to UI library
- `[downloadID]/components/DownloadHeader.tsx`: Action buttons header component with navigation and external links
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
  - `../../../../components/ui/`: Button, Badge, Collapsible
  - `../../../../components/type/titles.tsx`: Label for section labels
  - `../../../../components/providers/GlobalContext`: useGlobalContext for strapiLocation
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
  - General Information: Name, category (badge), cost, completion time, file size
  - Asset Information: Asset name, category (badge), composition ID
  - Download Links: External download link with count display
  - Status & Metadata: Status badges, error message, related IDs
  - Raw Data: Collapsible JSON display
- Uses Badge components for status indicators with icons
- Uses Text and Label components for typography
- Uses StyledLink for external links
- Conditional rendering for optional fields

### DownloadHeader Component (`[downloadID]/components/DownloadHeader.tsx`)

- Conditional "Back to Render" button (if render ID available)
- Conditional external link button (if download URL available)
- Always-visible Strapi link button
- Right-aligned button group with consistent styling

## Completed Migrations

- ✅ Phase 1: Page Structure Migration (TKT-2025-004)
- ✅ Phase 2: State Management Migration (TKT-2025-004)
- ✅ Phase 3: Component Structure Improvements (TKT-2025-004)
- ✅ Phase 4: Typography Migration (TKT-2025-004)
- ✅ Phase 5: Action Buttons & Navigation (TKT-2025-005)
- ✅ Phase 6: Status Indicators & Badges (TKT-2025-005)
- ✅ Phase 7: Testing & Cleanup (TKT-2025-004, TKT-2025-005)

## Planned Improvements

See `DevelopmentRoadMap.md` and `Tickets.md` for detailed plans on:

- Downloads Listing Page Implementation (TKT-2025-006)
