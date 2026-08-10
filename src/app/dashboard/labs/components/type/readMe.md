# Folder Overview

This folder contains the Typography showcase page, demonstrating typography components including title hierarchy, text components, code, links, paragraphs, and blockquotes. The showcase provides live previews and LLM reference tokens for text styling throughout the application.

## Guide reference

- Route: `/dashboard/labs/components/type`
- LLM guide: `/dashboard/labs/components/guide#type`
- Use when: Page and section hierarchy; supporting copy in containers.
- Registry: `typeTokens.ts`

## Purpose

This showcase serves as:

- **Typography Reference**: Visual display of all typography components
- **LLM Reference Tokens**: Canonical `type.{component}.{variant}` identifiers with copy-to-clipboard
- **Hierarchy Guide**: Demonstrates heading hierarchy and relationships
- **Design System**: Shows typography patterns and styling

## Reference Tokens

Tokens follow the pattern `type.{component}.{variant}` (e.g. `type.title.page`, `type.text.body`).

The canonical list lives in:

- `type/_components/_elements/typeTokens.ts` — `TYPE_TOKENS` registry
- `type/_components/_elements/ComponentRef.tsx` — token display with copy button

### Examples

- `type.title.page` — main page title (alias: PageTitle)
- `type.title.section` — major section heading
- `type.text.body` — standard body text
- `type.link.default` — default styled link
- `type.code.inline` — inline code snippet

## Components

### Typography Components

- **Titles**: Page-level and section titles
  - Tokens: `type.title.page`, `type.title.subtitle`, `type.title.section`, etc.
- **Text Components**: Body text, code, links, paragraphs, blockquotes
  - Tokens: `type.text.*`, `type.code.*`, `type.link.*`, `type.paragraph.*`, `type.blockquote.*`

### Showcase Structure

- `page.tsx`: Main page importing both showcases
- `_components/`:
  - `TitlesShowcase.tsx`: Title hierarchy examples
  - `TypographyShowcase.tsx`: Text component examples
  - `_elements/`: Individual example showcase components
    - `ComponentRef.tsx`: Re-exports shared `labs/_components/ComponentRef`
    - `typeTokens.ts`: Canonical token registry

## File Location

- Typography components: `src/components/type/` and `src/components/ui-library/foundation/`
- Showcase: `src/app/dashboard/labs/components/type/_components/`
- Documentation: This file

## Dependencies

- `@/components/type/titles` - Title components
- `@/components/ui-library/foundation/Code` - Code component
- `@/components/ui-library/foundation/Link` - Link component
- Tailwind CSS for text styling

## Best Practices

- Use title hierarchy appropriately (one H1 per page)
- Reference components by token name in LLM prompts and docs
- Maintain consistent text sizes and weights
- Use semantic HTML for accessibility
- Ensure sufficient color contrast
