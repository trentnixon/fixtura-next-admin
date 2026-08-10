# Folder Overview

Feedback showcase page for loading, error, empty states, and toast notifications with LLM reference tokens.

## Guide reference

- Route: `/dashboard/labs/components/feedback`
- LLM guide: `/dashboard/labs/components/guide#feedback`
- Use when: Pending data, failures, empty sections, action toasts.
- Registry: `feedbackTokens.ts`

## Reference Tokens

Tokens follow the pattern `feedback.{component}.{variant}` (e.g. `feedback.loading.default`, `feedback.toast.promise`).

- `feedbackTokens.ts` — `FEEDBACK_TOKENS` registry
- `ComponentRef.tsx` — token display with copy button (re-exports shared labs component)

## Files

- `page.tsx`: Feedback category page
- `_components/FeedbackShowcase.tsx`: Orchestrates all feedback showcases
- `_components/_elements/`:
  - `LoadingStatesShowcase.tsx`
  - `ErrorStatesShowcase.tsx`
  - `EmptyStatesShowcase.tsx`
  - `ToastShowcase.tsx`
  - `UsageGuidelinesShowcase.tsx`

## Relations

- Parent: [`../readMe.md`](../readMe.md)
- Pattern reference: [`../type/readMe.md`](../type/readMe.md)
