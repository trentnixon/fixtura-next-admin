# Folder Overview

This folder contains a comprehensive UI component library showcase page for testing and displaying all reusable UI components in the Fixtura Admin application. This serves as both a component playground and documentation.

## Structure

The showcase is organized into category pages with modular showcase components:

### Category Pages

Each category (`/actions`, `/forms`, `/feedback`, etc.) contains:

- `page.tsx`: Main page that imports and renders showcase components
- `_components/`: Showcase components for the category
  - `[Category]Showcase.tsx`: Main showcase component that imports and renders sub-components
  - `_elements/`: Smaller, focused showcase components for specific examples
    - Examples: `ButtonVariantsShowcase.tsx`, `ButtonSizesShowcase.tsx`, etc.

### Container System

Showcase components use a consistent container hierarchy:

- `PageContainer`: Top-level wrapper for page content (handled by page.tsx)
- `SectionContainer`: Groups related examples into sections
- `ElementContainer`: Wraps individual examples with optional title/subtitle
- `CodeExample`: Shared component for displaying code snippets with copy functionality

## Files

- `page.tsx`: Main overview page with progress tracking and quick links
- `layout.tsx`: Sidebar navigation layout for all showcase pages
- `_components/`: Shared components (Navigation, Overview)
- `[category]/`: Category-specific showcase pages
  - `page.tsx`: Category page
  - `_components/`: Category showcase components
    - `_elements/`: Individual example showcase components

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Component library: `../../../../components/ui-library/` for component definitions
- Consumed by: Developers and designers for component reference and testing

## Dependencies

- Internal:
  - `../../../../components/ui-library/`: Reusable UI component definitions
  - `../../../../components/scaffolding/`: Layout and container components
  - `../../../../components/type/`: Typography components
  - `../../../../components/ui/`: Base Radix UI components
- External:
  - Next.js App Router for page rendering
  - React for component rendering

## Purpose

This page serves as:

- **Component Showcase**: Visual display of all available UI components
- **Interactive Testing**: Test components with different props and variants
- **Documentation**: Reference for component usage and API
- **Design System**: Centralized view of the design system
