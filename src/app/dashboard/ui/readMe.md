# Folder Overview

This folder contains a comprehensive UI component library showcase page for testing and displaying all reusable UI components in the Fixtura Admin application. This serves as both a component playground and documentation.

## Structure

The showcase is organized into category pages with modular showcase components:

### Category Pages

Each category (`/actions`, `/forms`, `/feedback`, etc.) contains:

- `page.tsx`: Main page that imports and renders showcase components
- `readMe.md`: Category-specific documentation (see individual folders)
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

## Category Folders

Each category folder contains its own `readMe.md` with detailed documentation. For specific component information, see the relevant category folder:

### Foundation & Design System

- **[`colors/`](./colors/readMe.md)**: Color system, semantic colors, brand colors, and palettes
- **[`type/`](./type/readMe.md)**: Typography components, titles, text, code, links
- **[`icons/`](./icons/readMe.md)**: Icon library browser with search and filtering
- **[`layout/`](./layout/readMe.md)**: Containers, grids, flex layouts, dividers, spacing

### Interactive Components

- **[`actions/`](./actions/readMe.md)**: Button components with variants, sizes, states, icons
- **[`forms/`](./forms/readMe.md)**: Inputs, textareas, selects, switches, checkboxes, radios
- **[`navigation/`](./navigation/readMe.md)**: Tabs, pagination components

### Data Display

- **[`data/`](./data/readMe.md)**: Stat cards, metric grids, base cards
- **[`tables/`](./tables/readMe.md)**: Data tables with pagination, search, filtering, sorting
- **[`lists/`](./lists/readMe.md)**: List patterns including checklists, avatars, timelines, expandable lists

### Feedback & Status

- **[`feedback/`](./feedback/readMe.md)**: Loading states, error states, empty states, toast notifications
- **[`status/`](./status/readMe.md)**: Badges, avatars, status indicators

### Overlays & Utilities

- **[`overlays/`](./overlays/readMe.md)**: Dialogs, sheets, tooltips, dropdown menus
- **[`utilities/`](./utilities/readMe.md)**: Copy to clipboard, time formatting, currency formatting, number formatting, search components
- **[`media/`](./media/readMe.md)**: Images, videos, code blocks, markdown (some components coming soon)

## Files

- `page.tsx`: Main overview page with progress tracking and quick links
- `layout.tsx`: Sidebar navigation layout for all showcase pages
- `readMe.md`: This file - overview and navigation guide
- `_components/`: Shared components (Navigation, Overview)
- `[category]/`: Category-specific showcase pages
  - `page.tsx`: Category page
  - `readMe.md`: Category documentation (see links above)
  - `_components/`: Category showcase components
    - `_elements/`: Individual example showcase components

## Finding Components

### By Component Type

- **Buttons**: [`actions/`](./actions/readMe.md) - Button variants, sizes, states
- **Form Inputs**: [`forms/`](./forms/readMe.md) - All form input types
- **Cards**: [`data/`](./data/readMe.md) - Stat cards, metric grids, base cards
- **Tables**: [`tables/`](./tables/readMe.md) - Basic and advanced tables
- **Lists**: [`lists/`](./lists/readMe.md) - Various list patterns
- **Badges & Avatars**: [`status/`](./status/readMe.md) - Status indicators
- **Modals & Overlays**: [`overlays/`](./overlays/readMe.md) - Dialogs, sheets, tooltips
- **Typography**: [`type/`](./type/readMe.md) - Titles, text components
- **Colors**: [`colors/`](./colors/readMe.md) - Color system reference
- **Icons**: [`icons/`](./icons/readMe.md) - Icon library browser
- **Layout**: [`layout/`](./layout/readMe.md) - Containers, grids, spacing

### By Route

All categories are accessible via:

- `/dashboard/ui` - Overview page
- `/dashboard/ui/[category]` - Individual category pages

See [`_components/Navigation.tsx`](./_components/Navigation.tsx) for the complete navigation structure.

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
- **Navigation Hub**: Quick access to all component categories and their documentation
