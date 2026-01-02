# UI Component Architecture: Global Render Monitor

This document outlines the specific UI components to be developed for the `/dashboard/renders` route, maintaining consistency with the Fixtura Admin design system.

## 1. `GlobalRenderRollup` (Stat Headliners)
**Purpose**: Provide a high-level heartbeat of the rendering system.
- **Components**:
    - **Active Renders Card**: Pulsating `PlayCircle` icon with a live count.
    - **Health Card**: 24h success rate percentage with a color-coded trend (Green/Red).
    - **System Volume Card**: Total assets (Videos + AI) generated in the current window.
- **Aesthetics**: Use the `StatCard` from the UI library with `primary`, `secondary`, and `accent` variants.

## 2. `GlobalRenderFilters` (Operational Controls)
**Purpose**: Allow administrators to slice through thousands of renders to find specific issues.
- **Components**:
    - **Search Bar**: Combines Render Name and Account Name search.
    - **Sport Selector**: Multi-select for Cricket, AFL, Netball.
    - **Status Toggle Group**: Filter by "Live", "Completed", "Failed", "Stalled".
    - **Date Range Picker**: Filter renders by execution window.
- **Aesthetics**: Use `Select`, `Input`, and `TabsList` variants for a clean, horizontally aligned filter bar at the top of the table.

## 3. `GlobalRenderTable` (Master Audit Log)
**Purpose**: The primary data grid for auditing system output.
- **Key Columns**:
    - **Timestamp**: Relative time (e.g., "2 mins ago") with absolute time on hover.
    - **Entity**: Account Name + Organization Name (sub-label) + Sport Icon.
    - **Status**: Dynamic `StatusBadge` (Rendering, Queued, Success, Failed, Stalled).
    - **Output Metrics**:
        - **Assets**: Count of download objects.
        - **AI**: Count of AI article objects.
    - **Actions**: `variant="primary"` icon buttons for "View Details" and "View in CMS".
- **Interaction**: Hover states on rows to show deep-links.

## 4. `StalledRenderWarning` (Conditional Alert)
**Purpose**: A specific UI state for renders that are mathematically determined to be stuck.
- **Logic**: IF `Processing === true` AND `startTime > 30 mins ago`.
- **UI**: A specialized `StatusBadge` with a warning glow and a "Report Stalled" action button.

## 5. `RenderDetailLineage` (In Detail View)
**Purpose**: Show the "DNA" of a specific render.
- **Components**:
    - **Source Link**: Direct link to the parent Scheduler.
    - **Data Manifest**: A summary of what was inside the render (e.g., "3 Results, 12 Upcoming Games").
    - **Asset Grid**: Visual thumbnails of generated images/videos.
    - **AI Preview**: Snippet of the generated AI write-up.

## Standardized Tokens & Icons
- **Icon Set**: Lucide-React (`Activity`, `PlayCircle`, `Clock`, `Database`, `Eye`, `FileText`, `Video`).
- **Color Palette**:
    - `brandPrimary` (Blue/Indigo) for active/rendering.
    - `error` (Red) for failures.
    - `warning` (Amber) for stalled/queued.
    - `success` (Emerald) for completed.
