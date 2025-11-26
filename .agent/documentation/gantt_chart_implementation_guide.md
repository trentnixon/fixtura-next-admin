# Gantt Chart Implementation Guide

## Overview
This document outlines the implementation details, features, and potential pitfalls of the Competition Gantt Chart component used in the Fixtura Admin Dashboard. The chart provides a visual timeline of competitions, allowing admins to track start/end dates, duration, and priority weights.

## Architecture

The Gantt chart is built using a composite component pattern, primarily leveraging a custom UI library located at `@/components/ui/shadcn-io/gantt`.

### Key Components

1.  **`GanttSection.tsx` (Container)**
    *   **Role:** The main entry point. Handles data fetching (via props), state management (filters), data transformation (normalization), and rendering the layout.
    *   **Location:** `src/app/dashboard/competitions/components/CompetitionAdminStats/sections/GanttSection.tsx`

2.  **`GanttFilters.tsx` (Controls)**
    *   **Role:** Provides UI controls for filtering the dataset by Sport, Association, Season, and "Hide Finished" status.
    *   **Location:** `src/app/dashboard/competitions/components/CompetitionAdminStats/sections/GanttFilters.tsx`

3.  **`GanttTooltip.tsx` & `CompetitionTooltipContent.tsx` (Interactivity)**
    *   **Role:** Custom tooltip wrapper and content renderer to show detailed competition info on hover.
    *   **Location:** Same directory as `GanttSection`.

4.  **`gantt.tsx` (Core Library)**
    *   **Role:** The low-level rendering engine. Handles the timeline grid, sidebar, draggable bars (though dragging is disabled for this view), and context providers.
    *   **Location:** `src/components/ui/shadcn-io/gantt.tsx`

## Features

### 1. Smart Filtering
*   **Multi-criteria:** Filter by Sport, Association, and Season.
*   **"Hide Finished" Logic:** A smart toggle that hides competitions that have finished OR are finishing within the next month. This focuses the view on upcoming or currently active competitions.

### 2. Intelligent Weighting & Coloring
*   **Problem:** Raw "weight" scores from the backend vary significantly between sports (e.g., Cricket might max out at 50, while Football hits 100).
*   **Solution:** **Per-Sport Quartile Normalization**.
    *   The system calculates the 25th, 50th, and 75th percentiles of weights *within each sport*.
    *   **Green:** Top 25% (High Priority)
    *   **Yellow:** 50th-75th Percentile (Medium-High)
    *   **Orange:** 25th-50th Percentile (Medium)
    *   **Gray:** Bottom 25% (Low Priority)
*   **Visuals:** Bars are colored accordingly with increased opacity for better visibility. The *original* raw weight is displayed in the label for reference: `Competition Name (RawWeight)`.

### 3. Interactive Timeline
*   **Scroll-to-View:** Clicking a competition in the sidebar automatically scrolls the timeline to center that competition's bar.
*   **Hover Details:** Hovering over a bar reveals a rich tooltip with:
    *   Exact Start/End dates
    *   Duration
    *   Association & Season
    *   Teams/Grade counts

## Implementation Steps (How to Recreate)

1.  **Setup Core Component:**
    *   Ensure `@/components/ui/shadcn-io/gantt` is installed/created. This requires `dnd-kit` for the internal drag-and-drop logic (even if used read-only).

2.  **Prepare Data Structure:**
    *   Input data must be mapped to the `GanttFeature` interface:
        ```typescript
        type GanttFeature = {
          id: string;
          name: string;
          startAt: Date;
          endAt: Date;
          // ... custom fields like weight, season
        }
        ```

3.  **Implement Filtering Logic (`GanttSection`):**
    *   Use `useMemo` to filter the raw list based on state.
    *   *Crucial:* Handle missing `startDate`. If a competition has no start date, it cannot be placed on the chart.

4.  **Implement Weight Normalization:**
    *   **Step 1:** Iterate through all competitions to build a map of weights per sport.
    *   **Step 2:** Calculate quartiles (p25, p50, p75) for each sport.
    *   **Step 3:** During the mapping phase, compare the competition's raw weight against its sport's thresholds to assign a normalized "color score" (e.g., 80, 60, 40, 20).

5.  **Render:**
    *   Wrap the chart in `<GanttProvider>`.
    *   Render `<GanttSidebar>` for the list and `<GanttTimeline>` for the bars.
    *   Use `<GanttFeatureItem>` for the bars, wrapping them in your custom Tooltip component.

## Common Issues & Pitfalls

### 1. Date Handling
*   **Issue:** `startDate` is often a string from the API, but the Gantt component expects `Date` objects.
*   **Fix:** Always parse strings to `Date` objects immediately during the mapping phase.
*   **Issue:** Missing `durationDays`.
*   **Fix:** Default to a sensible minimum (e.g., 1 day) to ensure the bar renders at least a sliver.

### 2. Z-Index & Overflow
*   **Issue:** Tooltips getting clipped by container boundaries.
*   **Fix:** Use `createPortal` (via Radix UI Tooltip) or ensure the container has `overflow: visible` where appropriate. The current implementation uses a high z-index on the tooltip content.

### 3. URL Encoding
*   **Issue:** Manually constructing URLs with spaces (e.g., `/ dashboard / ...`) results in broken links like `/%20dashboard...`.
*   **Fix:** Ensure URL strings are clean: `/dashboard/competitions/${id}`.

### 4. Type Safety
*   **Issue:** The `weight` property might be a string "10" or number 10.
*   **Fix:** Always cast with `Number()` before doing math comparisons. `Number(comp.weight || 0)`.

### 5. Performance
*   **Issue:** Recalculating quartiles on every render.
*   **Fix:** Use `useMemo` for the threshold calculations. Only recalculate when the `competitions` prop changes, not when filters change (unless you want relative weighting based on *filtered* view, but currently it's based on the *global* view).

## Future Improvements
*   **Zoom Controls:** Allow users to switch between Weekly/Monthly views.
*   **Lazy Loading:** For datasets > 1000 items, virtualization might be needed for the sidebar and timeline.
