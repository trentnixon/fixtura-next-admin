# Folder Overview

Charts showcase page for containers, cards, formatters, chart types, and layouts with LLM reference tokens.

## Guide reference

- Route: `/dashboard/labs/components/charts`
- LLM guide: `/dashboard/labs/components/guide#charts`
- Use when: Trend, comparison, and proportion — when a number alone is not enough.
- Registry: `chartTokens.ts`

## Reference Tokens

Tokens follow the pattern `chart.{component}.{variant}` (e.g. `chart.container.basic`, `chart.bar.basic`).

- `chartTokens.ts` — `CHART_TOKENS` registry
- `chartSampleData.ts` — shared sample data and config for showcases
- `ComponentRef.tsx` — token display with copy button (re-exports shared labs component)

## Files

- `page.tsx`: Charts category page
- `_components/ChartsShowcase.tsx`: Orchestrates all chart showcases
- `_components/_elements/`: Individual showcase components

## Relations

- Parent: [`../readMe.md`](../readMe.md)
- Pattern reference: [`../type/readMe.md`](../type/readMe.md)
