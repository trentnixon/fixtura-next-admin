# Folder Overview

Tables showcase page for basic, paginated, and advanced table patterns with LLM reference tokens.

## Guide reference

- Route: `/dashboard/labs/components/tables`
- LLM guide: `/dashboard/labs/components/guide#tables`
- Use when: Column comparison, sort/filter datasets, row actions.
- Registry: `tableTokens.ts`

## Reference Tokens

Tokens follow the pattern `table.{component}.{variant}` (e.g. `table.basic`, `table.advanced`).

- `tableTokens.ts` — `TABLE_TOKENS` registry
- `tableSampleData.ts` — shared sample users and status badge helper
- `ComponentRef.tsx` — token display with copy button (re-exports shared labs component)

## Files

- `page.tsx`: Tables category page
- `_components/TablesShowcase.tsx`: Orchestrates all table showcases
- `_components/_elements/`:
  - `BasicTablesShowcase.tsx`
  - `PaginatedTableShowcase.tsx`
  - `AdvancedTableShowcase.tsx`
  - `UsageGuidelinesShowcase.tsx`

## Relations

- Parent: [`../readMe.md`](../readMe.md)
- Pattern reference: [`../type/readMe.md`](../type/readMe.md)
