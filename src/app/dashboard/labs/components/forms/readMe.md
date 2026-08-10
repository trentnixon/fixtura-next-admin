# Folder Overview

Forms showcase page for inputs, selects, checkboxes, switches, and composed form patterns with LLM reference tokens.

## Guide reference

- Route: `/dashboard/labs/components/forms`
- LLM guide: `/dashboard/labs/components/guide#forms`
- Use when: Create, edit, filter, and configuration with validation.
- Registry: `formTokens.ts`

## Reference Tokens

Tokens follow the pattern `form.{component}.{variant}` (e.g. `form.input.basic`, `form.select.with-groups`).

- `formTokens.ts` — `FORM_TOKENS` registry
- `ComponentRef.tsx` — token display with copy button (re-exports shared labs component)

## Files

- `page.tsx`: Forms category page
- `_components/FormsShowcase.tsx`: Orchestrates all form showcases
- `_components/_elements/`:
  - `TextInputsShowcase.tsx`
  - `TextareaShowcase.tsx`
  - `SelectShowcase.tsx`
  - `CheckboxRadioShowcase.tsx`
  - `SwitchShowcase.tsx`
  - `FormExamplesShowcase.tsx`
  - `UsageGuidelinesShowcase.tsx`

## Relations

- Parent: [`../readMe.md`](../readMe.md)
- Pattern reference: [`../type/readMe.md`](../type/readMe.md)
