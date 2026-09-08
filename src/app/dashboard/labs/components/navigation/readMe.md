# Folder Overview

Navigation showcase for breadcrumbs, section tabs, side nav, workflow steps, tabs, and pagination with LLM reference tokens.

## Guide reference

- Route: `/dashboard/labs/components/navigation`
- LLM guide: `/dashboard/labs/components/guide#navigation`
- Use when: Movement between routes, peer sections, workflow steps, or paginated results.
- Pattern tokens: `navigation.pattern.breadcrumb-header`, `navigation.pattern.section-tabs`, `navigation.pattern.side-nav`, `navigation.pattern.workflow-steps`
- Section tab tokens: `navigation.tabs.section-default`, `navigation.tabs.section-inverse`
- Style source: `@/lib/actions/siteNavigationButtonStyles` (`sectionTabListClass`, `sectionTabTriggerClass`, inverse variants)

## Reference Tokens

Tokens follow the pattern `navigation.{component}.{variant}` and `navigation.pattern.*`.

- `navigationTokens.ts` — `NAVIGATION_TOKENS` registry
- `ComponentRef.tsx` — token display with copy button (re-exports shared labs component)

## Files

- `page.tsx`: Navigation category page (uses `CategoryLabHeader`)
- `_components/NavigationShowcase.tsx`: Orchestrates all navigation showcases
- `_components/_elements/`:
  - `SectionTabsShowcase.tsx`: Default + inverse section tabbers (canonical route tab pattern)
  - `NavigationPatternsShowcase.tsx`: Breadcrumbs, side nav, workflow steps
  - `TabsShowcase.tsx`: Legacy brand/basic tab variants
  - `PaginationShowcase.tsx`
  - `UsageGuidelinesShowcase.tsx`

## Relations

- Parent: [`../readMe.md`](../readMe.md)
- Pattern reference: [`../type/readMe.md`](../type/readMe.md)
