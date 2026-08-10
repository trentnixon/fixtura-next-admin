# Folder Overview

Navigation showcase for breadcrumbs, section tabs, side nav, workflow steps, tabs, and pagination with LLM reference tokens.

## Guide reference

- Route: `/dashboard/labs/components/navigation`
- LLM guide: `/dashboard/labs/components/guide#navigation`
- Use when: Movement between routes, peer sections, workflow steps, or paginated results.
- Pattern tokens: `navigation.pattern.breadcrumb-header`, `navigation.pattern.section-tabs`, `navigation.pattern.side-nav`, `navigation.pattern.workflow-steps`

## Reference Tokens

Tokens follow the pattern `navigation.{component}.{variant}` and `navigation.pattern.*`.

- `navigationTokens.ts` — `NAVIGATION_TOKENS` registry
- `ComponentRef.tsx` — token display with copy button (re-exports shared labs component)

## Files

- `page.tsx`: Navigation category page (uses `CategoryLabHeader`)
- `_components/NavigationShowcase.tsx`: Orchestrates all navigation showcases
- `_components/_elements/`:
  - `NavigationPatternsShowcase.tsx`
  - `TabsShowcase.tsx`
  - `PaginationShowcase.tsx`
  - `UsageGuidelinesShowcase.tsx`

## Relations

- Parent: [`../readMe.md`](../readMe.md)
- Pattern reference: [`../type/readMe.md`](../type/readMe.md)
