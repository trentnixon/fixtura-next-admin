# Folder Overview

Overlays showcase page for dialogs, sheets, tooltips, and dropdown menus with LLM reference tokens.

## Guide reference

- Route: `/dashboard/labs/components/overlays`
- LLM guide: `/dashboard/labs/components/guide#overlays`
- Use when: Confirmations, secondary controls, icon-only clarifications.
- Registry: `overlayTokens.ts`

## Reference Tokens

Tokens follow the pattern `overlay.{component}.{variant}` (e.g. `overlay.dialog.basic`, `overlay.dropdown.submenu`).

- `overlayTokens.ts` — `OVERLAY_TOKENS` registry
- `ComponentRef.tsx` — token display with copy button (re-exports shared labs component)

## Files

- `page.tsx`: Overlays category page
- `_components/OverlaysShowcase.tsx`: Orchestrates all overlay showcases
- `_components/_elements/`:
  - `DialogsShowcase.tsx`
  - `SheetsShowcase.tsx`
  - `TooltipsShowcase.tsx`
  - `DropdownMenusShowcase.tsx`
  - `ComingSoonShowcase.tsx`
  - `UsageGuidelinesShowcase.tsx`

## Relations

- Parent: [`../readMe.md`](../readMe.md)
- Pattern reference: [`../type/readMe.md`](../type/readMe.md)
