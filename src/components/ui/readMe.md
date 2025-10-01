# Folder Overview

This folder contains base UI components built on Radix UI primitives with Tailwind CSS styling. These components form the foundation of the design system and provide accessible, reusable UI elements for the Fixtura Admin application.

## Files

- `avatar.tsx`: User avatar component with image fallback and customizable styling
- `badge.tsx`: Badge/label component for status indicators and categorization
- `breadcrumb.tsx`: Breadcrumb navigation component for page hierarchy
- `button.tsx`: Button component with multiple variants (default, destructive, outline, secondary, ghost, link) and sizes
- `card.tsx`: Card container component for content grouping and visual separation
- `chart.tsx`: Chart container and utilities for data visualization components
- `collapsible.tsx`: Collapsible content component for expandable sections
- `dialog.tsx`: Modal dialog component for overlays and popups
- `dropdown-menu.tsx`: Dropdown menu component for contextual actions
- `input.tsx`: Form input component with validation and styling support
- `label.tsx`: Form label component for form accessibility
- `scroll-area.tsx`: Custom scrollable area component with custom scrollbars
- `separator.tsx`: Visual separator component for content division
- `sheet.tsx`: Side panel/sheet component for slide-out content
- `sidebar.tsx`: Sidebar component for navigation and content organization
- `skeleton.tsx`: Loading skeleton component for content placeholders
- `switch.tsx`: Toggle switch component for boolean inputs
- `table.tsx`: Table components (Table, TableBody, TableCell, TableHead, TableHeader, TableRow)
- `tabs.tsx`: Tab navigation component for content organization
- `tooltip.tsx`: Tooltip component for contextual information

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: All other component folders and application pages
- Key dependencies: `../../lib/utils.ts` for utility functions

## Dependencies

- Internal:
  - `../../lib/utils.ts`: Utility functions (cn for class merging)
- External:
  - `@radix-ui/*`: UI primitive components for accessibility and functionality
  - `class-variance-authority`: Component variant management
  - `tailwind-merge`: Tailwind CSS class merging utility
  - `react`: React component library

## Patterns

- **Accessibility First**: Built on Radix UI primitives for WCAG compliance
- **Variant Management**: Uses class-variance-authority for consistent variant handling
- **Ref Forwarding**: Proper ref forwarding for DOM access and integration
- **Slot Pattern**: Some components support `asChild` prop for composition
- **Type Safety**: Strong TypeScript integration with proper prop interfaces
- **Consistent Styling**: Standardized Tailwind CSS classes and design tokens
- **Composition**: Components are designed for composition and reusability
