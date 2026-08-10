# Folder Overview

Utilities showcase page for copy, time, currency, number formatting, and search patterns with LLM reference tokens.

## Guide reference

- Route: `/dashboard/labs/components/utilities`
- LLM guide: `/dashboard/labs/components/guide#utilities`
- Use when: Shared formatters and copy-to-clipboard — avoid ad hoc formatting.
- Registry: `utilityTokens.ts`

## Reference Tokens

Tokens follow the pattern `utility.{component}.{variant}` (e.g. `utility.copy.button`, `utility.number.compact`).

- `utilityTokens.ts` — `UTILITY_TOKENS` registry
- `ComponentRef.tsx` — token display with copy button (re-exports shared labs component)

## Files

- `page.tsx`: Utilities category page
- `_components/UtilitiesShowcase.tsx`: Orchestrates all utility showcases
- `_components/_elements/`:
  - `CopyToClipboardShowcase.tsx`
  - `TimeFormattingShowcase.tsx`
  - `CurrencyFormattingShowcase.tsx`
  - `NumberFormattingShowcase.tsx`
  - `SearchComponentsShowcase.tsx`
  - `UsageGuidelinesShowcase.tsx`

## Relations

- Parent: [`../readMe.md`](../readMe.md)
- Pattern reference: [`../type/readMe.md`](../type/readMe.md)
