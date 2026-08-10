# Folder Overview

Actions showcase page for button variants, sizes, icons, states, groups, and full-width patterns with LLM reference tokens.

## Guide reference

- Route: `/dashboard/labs/components/actions`
- LLM guide: `/dashboard/labs/components/guide#actions`
- Use when: Save, create, trigger, sync, download, retry, filter commands.
- Registry: `actionTokens.ts`

## Reference Tokens

Tokens follow the pattern `action.{component}.{variant}` (e.g. `action.button.brand`, `action.button.loading`).

- `actionTokens.ts` — `ACTION_TOKENS` registry
- `ComponentRef.tsx` — token display with copy button (re-exports shared labs component)

## Files

- `page.tsx`: Actions category page
- `_components/ButtonShowcase.tsx`: Orchestrates all button showcases
- `_components/_elements/`:
  - `ButtonVariantsShowcase.tsx`
  - `ButtonSizesShowcase.tsx`
  - `ButtonIconsShowcase.tsx`
  - `ButtonStatesShowcase.tsx`
  - `ButtonGroupsShowcase.tsx`
  - `ButtonFullWidthShowcase.tsx`
  - `ButtonUsageGuidelinesShowcase.tsx`

## Relations

- Parent: [`../readMe.md`](../readMe.md)
- Pattern reference: [`../type/readMe.md`](../type/readMe.md)
