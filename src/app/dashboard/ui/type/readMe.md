# Folder Overview

This folder contains the Typography showcase page, demonstrating typography components including title hierarchy, text components, code, links, paragraphs, and blockquotes. The showcase provides examples and guidelines for text styling throughout the application.

## Purpose

This showcase serves as:
- **Typography Reference**: Visual display of all typography components
- **Usage Examples**: Code snippets showing how to use typography
- **Hierarchy Guide**: Demonstrates heading hierarchy and relationships
- **Design System**: Shows typography patterns and styling

## Components

### Typography Components

- **Titles**: Page-level and section titles
  - `PageTitle`, `Title`, `Subtitle`
  - `SectionTitle`, `SubsectionTitle`
  - `H1`, `H2`, `H3`, `H4`
- **Text Components**: Body text, code, links, paragraphs, blockquotes
  - `Text` component with variants (body, small, tiny)
  - `Code` component (inline and block)
  - `Link` component
  - `Paragraph` component
  - `Blockquote` component

### Showcase Structure

- `page.tsx`: Main page importing both showcases
- `_components/`:
  - `TitlesShowcase.tsx`: Title hierarchy examples
  - `TypographyShowcase.tsx`: Text component examples
  - `_elements/`: Individual example showcase components

## Usage

### Titles

```tsx
import { PageTitle, SectionTitle, SubsectionTitle } from "@/components/type/titles";

<PageTitle>Page Title</PageTitle>
<SectionTitle>Section Title</SectionTitle>
<SubsectionTitle>Subsection Title</SubsectionTitle>
```

### Text Components

```tsx
import Code from "@/components/ui-library/foundation/Code";
import Link from "@/components/ui-library/foundation/Link";

<Text variant="body">Body text</Text>
<Code variant="inline">const x = 1</Code>
<Link href="/">Link text</Link>
```

## File Location

- Typography components: `src/components/type/` and `src/components/ui-library/foundation/`
- Showcase: `src/app/dashboard/ui/type/_components/`
- Documentation: This file

## Dependencies

- `@/components/type/titles` - Title components
- `@/components/ui-library/foundation/Code` - Code component
- `@/components/ui-library/foundation/Link` - Link component
- Tailwind CSS for text styling

## Best Practices

- Use title hierarchy appropriately (one H1 per page)
- Maintain consistent text sizes and weights
- Use semantic HTML for accessibility
- Ensure sufficient color contrast
- Use code components for technical content
- Provide descriptive link text

