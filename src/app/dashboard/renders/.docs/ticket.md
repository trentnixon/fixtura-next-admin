# Ticket: Implement Global Render Monitor

**Status**: Planning
**Priority**: High
**Objective**: Build a centralized monitoring hub for all system rendering activity to replace the placeholder `/dashboard/renders` page.

## Detailed Requirements

### 1. New Service: `fetchGlobalRenders`
- **Endpoint**: `/api/renders`
- **Method**: GET
- **Population**:
    - `scheduler` -> `account` (for naming and sport identification)
    - `downloads` (for asset counting)
    - `ai_articles` (for content counting)
- **Sorting**: `publishedAt:desc` (Newest first)

### 2. UI Components
- **`GlobalRenderTable.tsx`**:
    - Columns: Date/Time, Account Name, Sport, Status (Badges), Assets (Count), AI (Count), Actions.
    - Actions: View Details (`/dashboard/renders/:id`), View in CMS (Deep link to Strapi).
- **`GlobalRenderRollup.tsx`**:
    - Cards: "Active Renders", "Success Rate (24h)", "Total Assets Generated".

### 3. Logic & State
- Implement pagination (standard Strapi 25 items per page).
- Implement "Stalled" detection logic: IF `Processing: true` AND `publishedAt` > 30 mins ago THEN show `warning` badge.
- Map `forceRerender` flag to a status indicator.

## Success Criteria
- Administrators can see immediately if a specific sport or account type is experiencing system-wide render failures.
- Navigating from the global list to a single render's detail is seamless.
- Asset counts provide an immediate audit of system output.
