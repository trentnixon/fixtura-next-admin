# Folder Overview

Media showcase page for images, videos, code blocks, and markdown with LLM reference tokens.

## Guide reference

- Route: `/dashboard/labs/components/media`
- LLM guide: `/dashboard/labs/components/guide#media`
- Use when: Asset inspection; avoid decorative media on operational pages.
- Registry: `mediaTokens.ts`

## Reference Tokens

Tokens follow the pattern `media.{component}.{variant}` (e.g. `media.code.block`, `media.image.coming-soon`).

- `mediaTokens.ts` — `MEDIA_TOKENS` registry
- `ComponentRef.tsx` — token display with copy button (re-exports shared labs component)

## Files

- `page.tsx`: Media category page
- `_components/MediaShowcase.tsx`: Orchestrates all media showcases
- `_components/_elements/`:
  - `ImagesShowcase.tsx`
  - `VideosShowcase.tsx`
  - `CodeBlocksShowcase.tsx`
  - `MarkdownShowcase.tsx`
  - `UsageGuidelinesShowcase.tsx`

## Relations

- Parent: [`../readMe.md`](../readMe.md)
- Pattern reference: [`../type/readMe.md`](../type/readMe.md)
