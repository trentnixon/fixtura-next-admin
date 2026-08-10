# Folder Overview

Containers showcase page for page/section/element containers and admin panel patterns with LLM reference tokens.

## Guide reference

- Route: `/dashboard/labs/components/containers`
- LLM guide: `/dashboard/labs/components/guide#containers`
- Use when: Large working surfaces, title/byline sections, footers with actions or pagination.
- Pattern tokens: `container.pattern.data-workspace`, `container.pattern.form-workspace`, `container.pattern.record-panel`

## Reference Tokens

Tokens follow the pattern `container.{component}.{variant}` (e.g. `container.page.default`, `container.section.compact`).

- `containerTokens.ts` — `CONTAINER_TOKENS` registry
- `ComponentRef.tsx` — token display with copy button (re-exports shared labs component)

## Files

- `page.tsx`: Containers category page
- `_components/ContainersShowcase.tsx`: Orchestrates all container showcases
- `_components/_elements/`:
  - `PageContainerShowcase.tsx`
  - `SectionContainerShowcase.tsx`
  - `ElementContainerShowcase.tsx`
  - `ContainerHierarchyShowcase.tsx`
  - `ContainerPatternsShowcase.tsx`

## Relations

- Parent: [`../readMe.md`](../readMe.md)
- Related: [`../layouts/readMe.md`](../layouts/readMe.md)
- Pattern reference: [`../type/readMe.md`](../type/readMe.md)
