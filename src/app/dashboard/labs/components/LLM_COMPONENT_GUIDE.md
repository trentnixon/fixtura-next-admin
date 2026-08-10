# LLM Component Guide

Use this guide before building or refactoring a Fixtura Admin page. The labs routes are the source of truth for available UI patterns, naming, and composition style.

- Hub: `/dashboard/labs/components`
- This guide in-app: `/dashboard/labs/components/guide`

## Goal

Build pages by selecting existing lab patterns first, then adapting them to the page data. Prefer the smallest set of components that clearly supports the workflow. A good dashboard page usually combines:

- A page title and byline.
- One primary container pattern.
- Navigation only when the user needs to move between peer sections or records.
- Data cards or charts for summary context.
- Tables, lists, or forms for the main work.
- Feedback/status components for loading, empty, error, and health states.

Do not invent a new visual system when a labs pattern already covers the job.

## How To Use The Labs

1. Identify the page job.
   Decide whether the page is mainly a data overview, operational workflow, detail record, form, table, report, or media/status surface.

2. Pick the structure first.
   Start with `containers` and `layouts`. Containers define title/byline/content/footer regions. Layouts define the grid or flex arrangement inside those regions.

3. Add navigation only when needed.
   Use `navigation` for breadcrumbs, tabbers, side nav, workflow steps, and pagination. Do not use tabs when a simple section stack is easier to scan.

4. Add content patterns.
   Use `data`, `charts`, `tables`, `lists`, `forms`, `status`, `feedback`, and `media` based on the page job.

5. Use token references.
   Each lab category exposes token registries such as `CARD_TOKENS`, `CONTAINER_TOKENS`, and `NAVIGATION_TOKENS`. When asking another LLM to build a page, include the relevant route and token names.

6. Verify density and hierarchy.
   Admin pages should feel work-focused: compact spacing, clear labels, strong scan paths, and no marketing-style hero sections.

## Category Selection

### Containers

Route: `/dashboard/labs/components/containers`

Use containers as the outer div surfaces that hold data, forms, cards, titles, bylines, controls, and footer actions.

Use when:

- A page needs a large working surface.
- A section needs a title/byline above content.
- A data block needs a footer with actions, timestamps, or pagination.
- You need to group forms, cards, tables, or mixed content.

Good starting tokens:

- `container.pattern.data-workspace`
- `container.pattern.form-workspace`
- `container.pattern.record-panel`
- `container.section.default`
- `container.section.compact`
- `container.hierarchy.standard`

Watch out for:

- Do not put card after card inside another decorative card without a reason.
- Keep footers functional: actions, update timestamps, counts, or pagination.
- Use compact variants when a page has many repeated sections.

### Navigation

Route: `/dashboard/labs/components/navigation`

Use navigation for movement between routes, peer sections, workflow steps, or paginated results.

Use when:

- A detail page needs breadcrumbs.
- A route has peer sections such as Overview, Data, Analytics, Settings.
- A workflow has ordered steps.
- A page has enough subsections to justify a side nav.
- A table/list needs pagination.

Good starting tokens:

- `navigation.pattern.breadcrumb-header`
- `navigation.pattern.section-tabs`
- `navigation.pattern.side-nav`
- `navigation.pattern.workflow-steps`
- `navigation.tabs.basic`
- `navigation.pagination.with-info`

Watch out for:

- Tabs are for peer content, not unrelated actions.
- Breadcrumbs should show route context, not every filter or UI state.
- Side nav is best for stable sections, not temporary filters.
- Workflow steps should show sequence and state.

### Data Cards

Route: `/dashboard/labs/components/data`

Use cards for compact summaries, operational status, KPI groups, record snapshots, and recent activity.

Use when:

- A page needs top-level metrics.
- Users need quick status before reading a table.
- A section needs a compact summary above detailed content.

Good starting tokens:

- `card.stat.modern-overview`
- `card.stat.operations`
- `card.stat.with-trend`
- `card.metric-grid.cols-3`
- `card.base.compact-kpi`
- `card.base.operational-status`
- `card.base.comparison`
- `card.base.activity`

Watch out for:

- Do not overuse stat cards. Three to four strong metrics are better than eight weak ones.
- Trends need context: time window, direction, or comparison basis.
- Use status colors sparingly and consistently.

### Tables

Route: `/dashboard/labs/components/tables`

Use tables for dense comparable records, admin review queues, and sortable/filterable datasets.

Use when:

- Users compare many records across shared columns.
- Rows need actions, status, owner, dates, or amounts.
- Filtering/search/sorting is core to the workflow.

Watch out for:

- Do not use cards for datasets that need column comparison.
- Keep row actions predictable and visible.
- Pair long tables with pagination or result info.

### Lists

Route: `/dashboard/labs/components/lists`

Use lists for feeds, activity streams, compact entities, timelines, and grouped records where columns are not the main scan path.

Use when:

- Items have varied metadata.
- The order or recency matters.
- A table would be too rigid or too wide.

Watch out for:

- Keep primary text, metadata, and actions visually distinct.
- Use truncation for long entity names.

### Charts

Route: `/dashboard/labs/components/charts`

Use charts for trend, comparison, distribution, and summary visualization.

Use when:

- A user needs shape, movement, proportion, or anomaly detection.
- A number alone is not enough.

Watch out for:

- Choose the simplest chart that answers the question.
- Pair charts with plain-language summary stats.
- Do not use a chart where a stat card or table row is clearer.

### Forms

Route: `/dashboard/labs/components/forms`

Use forms for creation, editing, filtering, and configuration.

Use when:

- Users enter or change data.
- Inputs need labels, descriptions, validation, and save/cancel actions.

Watch out for:

- Prefer clear labels over placeholder-only fields.
- Group related fields inside a form container with footer actions.
- Use switches/checkboxes for binary settings and selects for constrained options.

### Actions

Route: `/dashboard/labs/components/actions`

Use actions for commands such as save, create, trigger, sync, download, retry, and filter.

Use when:

- A user performs an operation.
- A toolbar or footer needs clear commands.

Watch out for:

- Use icons from `lucide-react` inside icon buttons when available.
- Primary buttons should represent the main page or section action.
- Avoid multiple competing primary actions in one surface.

### Feedback

Route: `/dashboard/labs/components/feedback`

Use feedback patterns for loading, empty, error, and toast states.

Use when:

- Data is pending.
- A query fails.
- A section has no records.
- A user action succeeds or fails.

Watch out for:

- Empty states should offer the next useful action when one exists.
- Error states should be specific enough to help recovery.

### Status

Route: `/dashboard/labs/components/status`

Use status for badges, avatars, state indicators, health labels, and compact identity markers.

Use when:

- A record has state such as active, queued, failed, complete, trial, paid, unpaid.
- A row needs an owner/avatar.

Watch out for:

- Keep status language consistent across tables, cards, and detail pages.
- Avoid using color as the only signal.

### Type

Route: `/dashboard/labs/components/type`

Use type components for page titles, section titles, bylines, body copy, links, code, and quotes.

Use when:

- Establishing hierarchy.
- Adding supporting copy to a container or section.

Watch out for:

- Do not use hero-scale type inside dashboards or compact panels.
- Keep headings short and descriptive.

### Colors

Route: `/dashboard/labs/components/colors`

Use colors for brand, semantic state, and neutral UI decisions.

Watch out for:

- Avoid one-note palettes dominated by a single hue.
- Use semantic colors for state, not decoration.
- Neutral surfaces should carry most admin pages.

### Layouts

Route: `/dashboard/labs/components/layouts`

Use layouts for grids, flex rows, spacing, and dividers inside containers.

Watch out for:

- Define stable responsive grids for cards and fixed-format controls.
- Avoid layout shifts when content changes.

### Overlays

Route: `/dashboard/labs/components/overlays`

Use overlays for dialogs, sheets, dropdown menus, and tooltips.

Use when:

- A small focused action needs confirmation.
- Secondary controls should stay out of the main page.
- A tooltip clarifies an icon-only control.

Watch out for:

- Do not put primary workflows in modals if they deserve a page.
- Dialogs should have clear close/cancel paths.

### Utilities

Route: `/dashboard/labs/components/utilities`

Use utilities for copy-to-clipboard, search, number formatting, time formatting, and currency formatting.

Watch out for:

- Use shared formatters instead of ad hoc formatting.
- Copy controls should provide feedback.

### Media

Route: `/dashboard/labs/components/media`

Use media for images, video, markdown, code blocks, and asset presentation.

Watch out for:

- Use real media when users need to inspect the asset.
- Avoid decorative media on operational admin pages.

## Page Composition Recipes

### Dashboard Overview

Use:

- `container.pattern.data-workspace`
- `navigation.pattern.breadcrumb-header`
- `card.stat.modern-overview`
- `chart.card.with-summary-stats` or another relevant chart token
- table/list for recent records

Shape:

1. Page title.
2. Breadcrumb header if route context matters.
3. Stat cards or operations strip.
4. Main chart/table container.
5. Footer with last updated or pagination.

### Detail Page

Use:

- `navigation.pattern.breadcrumb-header`
- `navigation.pattern.section-tabs` or `navigation.pattern.side-nav`
- `container.pattern.record-panel`
- status badges and compact data cards

Shape:

1. Breadcrumb/title/status.
2. Tabs or side nav for peer sections.
3. Record panel with metadata.
4. Table/list/chart depending on selected section.

### Form Or Settings Page

Use:

- `container.pattern.form-workspace`
- form inputs and selects
- status/feedback for validation and save states
- footer actions

Shape:

1. Title/byline explaining the setting area.
2. Form container with grouped fields.
3. Supporting side data if useful.
4. Footer with cancel/save/apply.

### Queue Or Operations Page

Use:

- `card.stat.operations`
- `navigation.pattern.side-nav` for queue sections
- tables for records
- feedback/error states for failed jobs

Shape:

1. Operational status strip.
2. Filters/search.
3. Table or list queue.
4. Pagination/result info footer.

## Implementation Rules

- Prefer existing components from `@/components/ui`, `@/components/ui-library`, `@/components/scaffolding`, and `@/components/type`.
- Use `lucide-react` icons for buttons, nav items, status blocks, and cards.
- Keep cards and containers at `rounded-lg` or smaller unless an existing component decides otherwise.
- Do not create landing-page hero sections for admin workflows.
- Do not put cards inside cards unless the inner card represents a repeated item or a distinct nested record.
- Use compact spacing for dense admin screens.
- Use title, byline, content, and footer zones consistently.
- Keep footer actions aligned and predictable.
- Include loading, empty, and error states for data-backed pages.
- Prefer structured data mapping arrays over repeated JSX when rendering repeated nav items, cards, rows, or status blocks.
- Run targeted formatting and linting for touched files.

## Prompt Template For Another LLM

Use this when directing another LLM to build a page:

```text
Before building, read:
- src/app/dashboard/labs/components/LLM_COMPONENT_GUIDE.md
- src/app/dashboard/labs/components/[category]/readMe.md for each relevant category
- token files in the selected categories, such as cardTokens.ts, containerTokens.ts, navigationTokens.ts

Build the page using existing Fixtura Admin lab patterns. Select tokens first, then compose the page. Prefer compact dashboard surfaces with title/byline/content/footer regions. Do not invent a new visual system.

Page job:
[describe the user workflow]

Likely patterns:
- [token 1]
- [token 2]
- [token 3]

Data available:
[describe data shape]

Required states:
- loading
- empty
- error
- success/normal
```

## Quick Token Map

Start here for recent high-value patterns:

- Containers: `container.pattern.data-workspace`, `container.pattern.form-workspace`, `container.pattern.record-panel`
- Navigation: `navigation.pattern.breadcrumb-header`, `navigation.pattern.section-tabs`, `navigation.pattern.side-nav`, `navigation.pattern.workflow-steps`
- Cards: `card.stat.modern-overview`, `card.stat.operations`, `card.base.compact-kpi`, `card.base.operational-status`, `card.base.comparison`, `card.base.activity`

For the full source of available tokens, inspect each category's `_components/_elements/*Tokens.ts` file.
