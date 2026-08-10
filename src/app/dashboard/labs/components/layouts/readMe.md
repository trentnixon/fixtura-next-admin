# Folder Overview

Layouts showcase page for grid, flex, divider patterns, and the Tailwind spacing scale with LLM reference tokens.

## Guide reference

- Route: `/dashboard/labs/components/layouts`
- LLM guide: `/dashboard/labs/components/guide#layouts`
- Use when: Grids and flex inside containers; stable responsive arrangement.
- Registry: `layoutTokens.ts`

## Reference Tokens

Tokens follow the pattern `layout.{component}.{variant}` (e.g. `layout.grid.responsive`, `layout.flex.row`).

- `layoutTokens.ts` — `LAYOUT_TOKENS` registry
- `ComponentRef.tsx` — token display with copy button (re-exports shared labs component)

## Files

- `page.tsx`: Layouts category page
- `_components/LayoutsShowcase.tsx`: Orchestrates all layout showcases
- `_components/_elements/`:
  - `GridShowcase.tsx`
  - `FlexShowcase.tsx`
  - `DividersShowcase.tsx`
  - `SpacingSystemShowcase.tsx`

## Relations

- Parent: [`../readMe.md`](../readMe.md)
- Related: [`../containers/readMe.md`](../containers/readMe.md)
- Pattern reference: [`../type/readMe.md`](../type/readMe.md)
