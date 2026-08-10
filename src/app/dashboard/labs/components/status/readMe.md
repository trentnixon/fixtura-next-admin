# Folder Overview

Status showcase page for badges, indicators, and avatars with LLM reference tokens.

## Guide reference

- Route: `/dashboard/labs/components/status`
- LLM guide: `/dashboard/labs/components/guide#status`
- Use when: Record state, owners, health labels — consistent language.
- Registry: `statusTokens.ts`

## Reference Tokens

Tokens follow the pattern `status.{component}.{variant}` (e.g. `status.status-badge.basic`, `status.avatar.sizes`).

- `statusTokens.ts` — `STATUS_TOKENS` registry
- `ComponentRef.tsx` — token display with copy button (re-exports shared labs component)

## Files

- `page.tsx`: Status category page
- `_components/StatusShowcase.tsx`: Orchestrates all status showcases
- `_components/_elements/`:
  - `StatusBadgesShowcase.tsx`
  - `BaseBadgeShowcase.tsx`
  - `AvatarsShowcase.tsx`
  - `StatusIndicatorsShowcase.tsx`
  - `UsageGuidelinesShowcase.tsx`

## Relations

- Parent: [`../readMe.md`](../readMe.md)
- Pattern reference: [`../type/readMe.md`](../type/readMe.md)
