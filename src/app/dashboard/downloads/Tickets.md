# 📁 Tickets.md – Downloads UI Migration

## Completed Tickets

---

## Active Tickets

### TKT-2025-004

---

ID: TKT-2025-004
Status: Draft
Priority: High
Owner: Development Team
Created: 2025-01-27
Updated: 2025-01-27
Related: UI Library Migration Initiative, Roadmap Downloads

---

## Overview

Migrate the download detail page (`/dashboard/downloads/:downloadID`) to use the new UI library components and patterns. Replace old CreatePage container, implement standardized state management, and update typography to use UI library components.

## What We Need to Do

Migrate the download detail page to match the patterns established in the renders detail page, including:

- Replace `CreatePage` with `PageContainer` and `SectionContainer`
- Implement `LoadingState`, `ErrorState`, and `EmptyState` components
- Replace old typography (`P`, `h5`) with UI library typography components
- Organize content into logical sections using `SectionContainer`
- Add proper page title with dynamic download information
- Implement retry functionality for error states

## Phases & Tasks

### Phase 1: Page Structure Migration

- [x] Replace `CreatePage` with `PageContainer` in `[downloadID]/page.tsx`
- [x] Update `CreatePageTitle` to include dynamic download name
- [x] Convert page to client component if needed
- [ ] Add account/render context to page title (if available) - _Pending: Need to check if download has render relationship in API_
- [x] Remove old container structure

### Phase 2: State Management Migration

- [x] Replace `<p>Loading download...</p>` with `LoadingState` component
- [x] Replace error `<p>` tags with `ErrorState` component (card variant)
- [x] Add `EmptyState` component for when no download data is found
- [x] Implement retry functionality using `refetch` from `useDownloadQuery`
- [x] Add minimal loading state for background refetching
- [x] Ensure hook returns `refetch` function (update if needed)

### Phase 3: Component Structure Improvements

- [x] Replace `DisplayDownload` component structure
- [x] Organize content into sections using `SectionContainer`:
  - [x] General Information section
  - [x] Asset Information section
  - [x] Download Links section
  - [x] Status & Metadata section
- [x] Remove or improve raw JSON display (make it collapsible/optional)
- [x] Use `ElementContainer` for sub-sections if needed (using SectionContainer instead)

### Phase 4: Typography Migration

- [x] Replace `<h5>` tags with `SubsectionTitle` or `SectionTitle` (not needed - using SectionContainer titles)
- [x] Replace `<P>` component with `Text` or `Paragraph` from UI library
- [x] Replace `<strong>` tags with appropriate weight variants (using `Text` with `weight="semibold"`)
- [x] Update link styling to use UI library `Link` component (using `StyledLink` with `external` prop)
- [x] Ensure consistent typography hierarchy (using `Label` from titles for section labels, `Text` for content)

### Phase 5: Action Buttons & Navigation

- [x] Add "Back to Render" button (if render ID is available)
- [x] Add external link button for download URL
- [x] Add Strapi link button (if strapiLocation is available)
- [x] Organize action buttons in header section
- [x] Use consistent button styling and placement
- [x] Update fetchDownloadByID to populate render relationship
- [x] Update Download type to include render relationship
- [x] Create DownloadHeader component for action buttons

### Phase 6: Status Indicators & Badges

- [x] Add status badges for download state (processed, error, etc.)
- [x] Add cost display with proper formatting (already done in Phase 3)
- [x] Add completion time display (already done in Phase 3)
- [x] Add file size display (already done in Phase 3)
- [x] Add error message display (if hasError is true) (enhanced with styled container)
- [x] Use Badge components from UI library
- [x] Add badges for grouping category and asset category
- [x] Add icons to status badges (CheckCircle, XCircle, AlertCircle, RefreshCw, Mail)
- [x] Style error message with red background container

### Phase 7: Testing & Cleanup

- [x] Test all loading states (LoadingState component with proper conditional rendering)
- [x] Test all error states with retry functionality (ErrorState component with refetch)
- [x] Test empty state (EmptyState component for no download data)
- [x] Verify typography consistency (all using UI library Text, Label, StyledLink)
- [x] Verify container spacing and layout (PageContainer, SectionContainer with proper spacing)
- [x] Remove unused imports (all imports verified and in use)
- [x] Update documentation (readMe.md) (updated with completed migration details)

## Constraints, Risks, Assumptions

### Constraints

- Must maintain existing functionality and data display
- Should not break existing component interfaces
- Limited to available UI library components
- Must work with existing `useDownloadQuery` hook

### Risks

- Potential data structure changes if API response format changes
- Need to verify `useDownloadQuery` returns `refetch` function
- May need to fetch additional data (render ID, account info) for navigation
- Raw JSON display removal may impact debugging (consider making it optional)

### Assumptions

- `useDownloadQuery` hook can be updated to return `refetch` if needed
- Download data structure matches `Download` type definition
- Render ID may be available in download data or can be fetched separately
- Strapi location configuration is available via `useGlobalContext`

---

## Notes

- Current download page uses old `CreatePage` container and basic `<p>` tag states
- Typography uses old `P` component and `<h5>` tags instead of UI library components
- Raw JSON display should be improved (collapsible section or removed for production)
- No status indicators or badges currently displayed
- No action buttons for navigation or external links
- Reference renders detail page (`/dashboard/renders/:renderID`) for patterns and structure

---

### TKT-2025-005

---

ID: TKT-2025-005
Status: Draft
Priority: Medium
Owner: Development Team
Created: 2025-01-27
Updated: 2025-01-27
Related: Roadmap Downloads, TKT-2025-004

---

## Overview

Enhance the download detail page with improved UI/UX, better information organization, status indicators, and action buttons. This ticket builds on TKT-2025-004 (UI Library Migration) to add enhanced features and better user experience.

## What We Need to Do

Improve the download detail page with:

- Better information organization and visual hierarchy
- Status indicators and badges for download state
- Action buttons for navigation and external links
- Improved metadata display (cost, completion time, file size)
- Better error message display
- Optional/collapsible raw JSON display
- Download link preview or better link display

## Phases & Tasks

### Phase 1: Information Organization

- [ ] Review current information display and identify improvement opportunities
- [ ] Organize information into logical groups:
  - General Information (Name, Category, Cost, Completion Time)
  - Asset Information (Asset Name, Asset Category, Composition ID)
  - Download Information (Download URL, File Size, Number of Downloads)
  - Status Information (Processed, Error, Error Message)
  - Metadata (Updated At, Game ID, Asset Link ID)
- [ ] Use `SectionContainer` for each major section
- [ ] Use `ElementContainer` or cards for sub-sections

### Phase 2: Status Indicators & Badges

- [ ] Add status badges for:
  - Processed status (hasBeenProcessed)
  - Error status (hasError)
  - Accuracy status (isAccurate)
  - Force Rerender status (forceRerender)
- [ ] Use Badge components from UI library
- [ ] Add conditional rendering (only show relevant badges)
- [ ] Use appropriate colors and icons for each status

### Phase 3: Metadata Display

- [ ] Format and display cost with currency symbol
- [ ] Format and display completion time
- [ ] Format and display file size
- [ ] Display number of downloads
- [ ] Display updated at date (formatted)
- [ ] Use appropriate UI library components for metadata display
- [ ] Consider using StatCard or similar for key metrics

### Phase 4: Action Buttons & Navigation

- [ ] Add "Back to Render" button (fetch render ID from download data or context)
- [ ] Add external link button for download URL
- [ ] Add Strapi link button (if strapiLocation is available)
- [ ] Organize action buttons in header section (similar to renders page)
- [ ] Use consistent button styling and icons
- [ ] Add download preview button (if applicable)

### Phase 5: Error Handling & Messages

- [ ] Display error message prominently if hasError is true
- [ ] Use ErrorState or Alert component for error messages
- [ ] Display user error message if available
- [ ] Add error email sent indicator if errorEmailSentToAdmin is true
- [ ] Improve error message styling and visibility

### Phase 6: Raw JSON Display Improvement

- [ ] Make raw JSON display collapsible (using Accordion or similar)
- [ ] Move raw JSON to a separate section at bottom
- [ ] Add toggle to show/hide raw JSON
- [ ] Consider removing raw JSON for production (dev-only feature)
- [ ] Format JSON display better (syntax highlighting if possible)

### Phase 7: Download Links Enhancement

- [ ] Improve download link display
- [ ] Add download button with icon
- [ ] Show download URL in a more user-friendly way
- [ ] Add copy to clipboard functionality for download URL
- [ ] Consider adding download preview for supported file types
- [ ] Show multiple download links if available

### Phase 8: Testing & Polish

- [ ] Test all status badge displays
- [ ] Test all action buttons and navigation
- [ ] Test error message display
- [ ] Test metadata display formatting
- [ ] Verify responsive design
- [ ] Test collapsible raw JSON display
- [ ] Verify accessibility

## Constraints, Risks, Assumptions

### Constraints

- Must work with existing download data structure
- Limited to available UI library components
- May need to fetch additional data (render ID) for navigation
- Download URL format may vary

### Risks

- Render ID may not be directly available in download data
- Error messages may not be user-friendly
- Download URLs may require authentication or special handling
- File size and completion time formats may vary

### Assumptions

- Render ID can be fetched from download data or related data
- Strapi location configuration is available
- Download URLs are accessible
- Error messages are available in download data
- File size and completion time are in consistent formats

---

## Notes

- This ticket depends on TKT-2025-004 (UI Library Migration) being completed first
- Reference renders detail page for patterns and structure
- Consider adding download analytics or tracking if available
- Consider adding download history or timeline if available
- Raw JSON display should be improved or made optional for better UX

---

### TKT-2025-006

---

ID: TKT-2025-006
Status: Draft
Priority: Low
Owner: Development Team
Created: 2025-01-27
Updated: 2025-01-27
Related: Roadmap Downloads

---

## Overview

Create a comprehensive downloads listing page (`/dashboard/downloads`) with table display, filtering, sorting, search, and pagination. Currently, the downloads listing page is just a placeholder.

## What We Need to Do

Build a complete downloads listing page with:

- Downloads table with all relevant columns
- Filtering by category, status, asset type
- Sorting by various columns (name, cost, completion time, etc.)
- Search functionality
- Pagination
- Bulk actions
- Link to download detail page
- Link to related render

## Phases & Tasks

### Phase 1: Data Fetching & Setup

- [ ] Create or update hook for fetching all downloads
- [ ] Implement pagination in data fetching
- [ ] Add filtering and sorting to data fetching
- [ ] Add search functionality to data fetching
- [ ] Handle loading, error, and empty states

### Phase 2: Table Structure

- [ ] Create downloads table component
- [ ] Define table columns (Name, Category, Cost, Status, Asset, Render, Actions)
- [ ] Implement table with UI library Table component
- [ ] Add table header with sorting indicators
- [ ] Add table rows with download data
- [ ] Add action buttons (View, External Link, Strapi Link)

### Phase 3: Filtering & Sorting

- [ ] Add filter dropdowns (Category, Status, Asset Type)
- [ ] Implement sorting for each column
- [ ] Add sort indicators (arrows)
- [ ] Handle multiple filters
- [ ] Add clear filters button
- [ ] Persist filter state in URL or local storage

### Phase 4: Search Functionality

- [ ] Add search input field
- [ ] Implement search across download name, category, asset name
- [ ] Add search debouncing
- [ ] Clear search functionality
- [ ] Display search results count

### Phase 5: Pagination

- [ ] Implement pagination component
- [ ] Add page size selector
- [ ] Add page navigation (previous, next, page numbers)
- [ ] Display total results count
- [ ] Handle pagination state

### Phase 6: Bulk Actions

- [ ] Add checkbox column for row selection
- [ ] Add select all functionality
- [ ] Implement bulk actions (delete, export, etc.)
- [ ] Add bulk actions toolbar
- [ ] Handle bulk action confirmations

### Phase 7: Navigation & Links

- [ ] Add link to download detail page
- [ ] Add link to related render (if available)
- [ ] Add external link to download URL
- [ ] Add Strapi link
- [ ] Implement proper navigation patterns

### Phase 8: UI/UX Polish

- [ ] Use UI library components throughout
- [ ] Implement LoadingState, ErrorState, EmptyState
- [ ] Add proper typography
- [ ] Use SectionContainer for page structure
- [ ] Add action buttons in header
- [ ] Improve table styling and spacing
- [ ] Add responsive design
- [ ] Test accessibility

## Constraints, Risks, Assumptions

### Constraints

- Must work with existing download data structure
- Limited to available UI library components
- May need to implement server-side pagination if data set is large
- Filtering and sorting may require API updates

### Risks

- Large data set may require server-side pagination
- Filtering and sorting may impact performance
- Search functionality may need optimization
- Bulk actions may require API support

### Assumptions

- Download data is available via API
- Pagination can be implemented client-side or server-side
- Filtering and sorting can be implemented efficiently
- Search functionality can search across multiple fields
- Bulk actions are supported by API

---

## Notes

- This is a larger feature that may be split into multiple tickets
- Consider implementing server-side pagination if data set is large
- Reference other listing pages (orders, accounts) for patterns
- Consider adding export functionality for downloads
- Consider adding download analytics or statistics

---

## Summaries of Completed Tickets
