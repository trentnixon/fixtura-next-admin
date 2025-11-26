# Ticket: Expand Fixture Insights Visualization

## Objective
Utilize the rich data available in the `fixture-insight` endpoint to create a comprehensive analytics dashboard for fixtures. The current implementation only displays basic high-level stats. We want to visualize distributions, trends, and detailed breakdowns.

## Data Source
The `useFixtureInsights` hook returns a `FixtureInsightsResponse` containing:
- **Overview:** Total counts, date ranges, averages.
- **Categories:** Summaries by Association, Competition, Grade.
- **Charts:** Timeline data, monthly/weekly distributions.
- **Distributions:** Breakdowns by status, day of week, etc.

## Proposed Components & Changes

### 1. Enhance `FixturesStats.tsx`
**Current:** Shows Total, Scheduled, In Progress, Completed.
**Additions:**
- **Scope Metrics:**
  - Unique Associations
  - Unique Competitions
  - Unique Grades
  - Unique Grounds
- **Averages:**
  - Fixtures per Competition
  - Fixtures per Association

### 2. Create `FixturesTimeline.tsx`
**Purpose:** Visualize the volume of fixtures over time.
**Data:** `data.charts.fixtureTimeline`
**Visualization:**
- Line or Area chart showing fixture counts by date.
- Differentiate between 'Upcoming' and 'Finished' if possible, or just total volume.

### 3. Create `FixturesDistributions.tsx`
**Purpose:** Show how fixtures are distributed across different dimensions.
**Data:** `data.distributions`
**Visualizations:**
- **Day of Week:** Bar chart showing busiest days (Monday vs Saturday etc.).
- **Status Split:** Donut chart for a visual representation of the status breakdown.

### 4. Create `TopEntities.tsx` (Optional/Later)
**Purpose:** Highlight the largest entities in the system.
**Data:** `data.categories`
**Visualization:**
- Top 5 Associations by fixture count.
- Top 5 Competitions by fixture count.

## Implementation Plan
1.  **Update `FixturesStats`:** Add the new metric cards using `MetricGrid` and `StatCard`.
2.  **Scaffold New Components:** Create `FixturesTimeline` and `FixturesDistributions` in `_components`.
3.  **Chart Integration:** Use `recharts` (or existing chart library if present) for visualizations.
4.  **Layout Update:** Update `FixturesOverview` to arrange these components effectively (e.g., Stats on top, Timeline full width, Distributions side-by-side).

## Acceptance Criteria
- [ ] `FixturesStats` shows Scope and Average metrics.
- [ ] `FixturesTimeline` displays a chart of fixture activity.
- [ ] `FixturesDistributions` shows Day of Week and Status charts.
- [ ] All components handle loading and error states gracefully.
- [ ] UI matches the application's design system (using `SectionContainer`, `Card`, etc.).
