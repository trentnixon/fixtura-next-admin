# Folder Overview

This folder contains the Layout showcase page, demonstrating container components, grid systems, flex layouts, and dividers. The showcase provides examples and code snippets for building consistent page layouts and organizing content.

## Purpose

This showcase serves as:
- **Layout System Reference**: Visual display of all layout options
- **Usage Examples**: Code snippets showing layout patterns
- **Design System**: Demonstrates spacing and container hierarchy
- **Responsive Patterns**: Examples of responsive layouts

## Components

### Layout Components

- **Containers**: PageContainer, SectionContainer, ElementContainer
- **Grid System**: Responsive grid layouts
- **Flex System**: Flexbox layouts (row, column, center, between, around)
- **Dividers**: Horizontal and vertical dividers

### Showcase Structure

- `LayoutShowcase.tsx`: Main showcase component
- `_elements/`:
  - `ContainersShowcase.tsx`: Container hierarchy examples
  - `GridShowcase.tsx`: Grid system examples
  - `FlexShowcase.tsx`: Flexbox layout examples
  - `DividersShowcase.tsx`: Divider examples
  - `CodeExample.tsx`: Shared code snippet component

## Usage

### Container Hierarchy

Use containers in this order:
1. `PageContainer` - Top-level page wrapper
2. `SectionContainer` - Groups related content
3. `ElementContainer` - Wraps individual examples

```tsx
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";

<PageContainer padding="xs" spacing="lg">
  <SectionContainer title="Section Title" description="Section description">
    <ElementContainer title="Example">
      {/* Content */}
    </ElementContainer>
  </SectionContainer>
</PageContainer>
```

### Grid System

Use Tailwind grid classes for responsive layouts:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Grid items */}
</div>
```

### Flex System

Use Tailwind flex utilities:

```tsx
<div className="flex items-center justify-between gap-4">
  {/* Flex items */}
</div>
```

## File Location

- Components: `src/components/scaffolding/containers/`
- Showcase: `src/app/dashboard/ui/layout/_components/`
- Documentation: This file

## Dependencies

- `@/components/scaffolding/containers` - Container components
- Tailwind CSS - Grid and flex utilities

## Best Practices

- Use consistent spacing throughout
- Follow container hierarchy for structure
- Use responsive breakpoints appropriately
- Maintain consistent padding and margins

