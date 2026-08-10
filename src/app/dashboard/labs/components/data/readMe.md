# Folder Overview

Data cards showcase for StatCard, MetricGrid, and base Card components with LLM reference tokens.

## Guide reference

- Route: `/dashboard/labs/components/data`
- LLM guide: `/dashboard/labs/components/guide#data-cards`
- Use when: Top-level metrics, quick status, compact summaries above detail.
- Pattern tokens: `card.stat.modern-overview`, `card.stat.operations`, `card.base.compact-kpi`

## Reference Tokens

Tokens follow the pattern `card.{component}.{variant}` (e.g. `card.stat.with-trend`, `card.base.default`).

- `cardTokens.ts` — `CARD_TOKENS` registry
- `ComponentRef.tsx` — token display with copy button (re-exports shared labs component)

## Files

- `page.tsx`: Cards category page
- `_components/DataDisplayShowcase.tsx`: Orchestrates all card showcases
- `_components/_elements/`:
  - `StatCardsShowcase.tsx`
  - `MetricGridShowcase.tsx`
  - `CardsShowcase.tsx`
  - `UsageGuidelinesShowcase.tsx`

## Relations

- Parent: [`../readMe.md`](../readMe.md)
- Pattern reference: [`../type/readMe.md`](../type/readMe.md)
