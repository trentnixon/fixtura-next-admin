# 📁 Tickets.md – Downloads UI Migration

## Completed Tickets

- TKT-2025-004
- TKT-2025-005
- TKT-2025-007

---

## Active Tickets

### TKT-2025-004

---

ID: TKT-2025-004
Status: Completed
Priority: High
Owner: Development Team
Created: 2025-01-27
Updated: 2025-01-XX
Related: UI Library Migration Initiative, Roadmap Downloads

---

## Overview

Migrate the download detail page (`/dashboard/downloads/:downloadID`) to use the new UI library components and patterns. Replace old CreatePage container, implement standardized state management, and update typography to use UI library components.

## Completion Summary

Migrated the download detail page to use UI library components, replacing CreatePage with PageContainer and SectionContainer, implementing LoadingState/ErrorState/EmptyState components, migrating typography to UI library Text and StyledLink components, organizing content into logical sections, and adding DownloadHeader component with action buttons and status badges.

---

### TKT-2025-005

---

ID: TKT-2025-005
Status: Completed
Priority: Medium
Owner: Development Team
Created: 2025-01-27
Updated: 2025-01-XX
Related: Roadmap Downloads, TKT-2025-004

---

## Overview

Enhance the download detail page with improved UI/UX, better information organization, status indicators, and action buttons. This ticket builds on TKT-2025-004 (UI Library Migration) to add enhanced features and better user experience.

## Completion Summary

Enhanced the download detail page with card-based information organization, status badges for all download states, formatted metadata display, DownloadHeader component with action buttons and CMS navigation, error handling with status badges, collapsible raw JSON display, and enhanced download links with video player for VIDEO assets and image gallery for IMAGE assets with keyboard navigation.

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

### TKT-2025-007

---

ID: TKT-2025-007
Status: Completed
Priority: Medium
Owner: Development Team
Created: 2025-01-27
Updated: 2025-01-27
Related: TKT-2025-004, TKT-2025-005, Roadmap Downloads

---

## Overview

Create a structured view for displaying asset details from download raw data. All asset objects share a common structure (asset, render, account, timings, frames, videoMeta) but have asset-specific data in the `OBJ.data` array. This ticket will implement a common component for shared data and asset-type-specific components for the variable data.

## Completion Summary

Implemented structured views for all major cricket asset types with an extensible component architecture for asset type detection and rendering, added support for 6 asset types (CricketResults, CricketLadder, CricketTop5Bowling, CricketTop5Batting, CricketUpcoming, CricketResultSingle), reorganized page layout for better information hierarchy, and separated Settings and Metadata components for improved organization.

---

## Summaries of Completed Tickets

### TKT-2025-004

Migrated the download detail page to use UI library components, replacing CreatePage with PageContainer and SectionContainer, implementing LoadingState/ErrorState/EmptyState components, migrating typography to UI library Text and StyledLink components, organizing content into logical sections, and adding DownloadHeader component with action buttons and status badges.

### TKT-2025-005

Enhanced the download detail page with card-based information organization, status badges for all download states, formatted metadata display, DownloadHeader component with action buttons and CMS navigation, error handling with status badges, collapsible raw JSON display, and enhanced download links with video player for VIDEO assets and image gallery for IMAGE assets with keyboard navigation.

### TKT-2025-007

Implemented structured views for all major cricket asset types with an extensible component architecture for asset type detection and rendering, added support for 6 asset types (CricketResults, CricketLadder, CricketTop5Bowling, CricketTop5Batting, CricketUpcoming, CricketResultSingle), reorganized page layout for better information hierarchy, and separated Settings and Metadata components for improved organization.
