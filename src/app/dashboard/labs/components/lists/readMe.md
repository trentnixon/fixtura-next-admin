# Folder Overview

Lists showcase page for basic, interactive, media, and feed list patterns with LLM reference tokens.

## Guide reference

- Route: `/dashboard/labs/components/lists`
- LLM guide: `/dashboard/labs/components/guide#lists`
- Use when: Feeds and timelines where columns are not the main scan path.
- Registry: `listTokens.ts`

## Reference Tokens

Tokens follow the pattern `list.{component}.{variant}` (e.g. `list.basic`, `list.checklist`).

- `listTokens.ts` — `LIST_TOKENS` registry
- `listSampleData.ts` — shared sample data for all list examples
- `ComponentRef.tsx` — token display with copy button (re-exports shared labs component)

## Files

- `page.tsx`: Lists category page
- `_components/ListsShowcase.tsx`: Orchestrates all list showcases
- `_components/_elements/`:
  - `BasicListsShowcase.tsx`
  - `InteractiveListsShowcase.tsx`
  - `MediaListsShowcase.tsx`
  - `FeedListsShowcase.tsx`
  - `UsageGuidelinesShowcase.tsx`

## Relations

- Parent: [`../readMe.md`](../readMe.md)
- Pattern reference: [`../type/readMe.md`](../type/readMe.md)
