# UI Component Library

A comprehensive, production-ready UI component library for the Fixtura Admin application. This library provides reusable, accessible, and consistent components built on top of Radix UI primitives and Tailwind CSS.

## Purpose

This library serves as the single source of truth for all UI components, ensuring:

- **Consistency**: Unified design language across the application
- **Reusability**: Components that work across different contexts
- **Accessibility**: WCAG-compliant components built on Radix UI
- **Type Safety**: Full TypeScript support with proper interfaces
- **Documentation**: Live examples and usage guides via the showcase page

## Component Architecture

Components are organized into three main locations:

1. **`ui-library/`** (this folder): Custom built components
2. **`ui/`**: Radix UI primitives with Tailwind styling
3. **`type/`**: Typography components (titles, headings)
4. **`scaffolding/`**: Layout containers and structure

## Custom Components (ui-library/)

### Foundation Components (`foundation/`)

Typography and text components:

- **`Text.tsx`**: Flexible text component with size and weight variants

  - Variants: `body`, `small`, `tiny`
  - Uses `TypographyProps` from `@/components/type/types`
  - Showcase: [`/dashboard/ui/type`](../../app/dashboard/ui/type/readMe.md)

- **`Code.tsx`**: Inline and block code display component

  - Variants: `inline`, `block`
  - Uses `TypographyProps`
  - Showcase: [`/dashboard/ui/type`](../../app/dashboard/ui/type/readMe.md)

- **`Link.tsx`**: Styled link component for navigation

  - Variants: `default`, `primary`, `secondary`, `accent`
  - Showcase: [`/dashboard/ui/type`](../../app/dashboard/ui/type/readMe.md)

- **`Paragraph.tsx`**: Styled paragraph component with consistent spacing

  - Uses `TypographyProps`
  - Showcase: [`/dashboard/ui/type`](../../app/dashboard/ui/type/readMe.md)

- **`Blockquote.tsx`**: Styled blockquote component for quotes
  - Uses `TypographyProps`
  - Showcase: [`/dashboard/ui/type`](../../app/dashboard/ui/type/readMe.md)

### State Components (`states/`)

Components for handling application states:

- **`LoadingState.tsx`**: Standardized loading state display

  - Variants: `default`, `minimal`, `skeleton`
  - Showcase: [`/dashboard/ui/feedback`](../../app/dashboard/ui/feedback/readMe.md)

- **`ErrorState.tsx`**: Standardized error state with retry functionality

  - Variants: `default`, `card`, `minimal`
  - Supports error objects and string messages
  - Optional retry functionality
  - Showcase: [`/dashboard/ui/feedback`](../../app/dashboard/ui/feedback/readMe.md)

- **`EmptyState.tsx`**: Standardized empty state display
  - Variants: `default`, `card`, `minimal`
  - Custom icons and actions support
  - Showcase: [`/dashboard/ui/feedback`](../../app/dashboard/ui/feedback/readMe.md)

### Badge Components (`badges/`)

Status and indicator components:

- **`StatusBadge.tsx`**: Boolean status badge component with automatic color coding
  - Automatically colors based on boolean value
  - Showcase: [`/dashboard/ui/status`](../../app/dashboard/ui/status/readMe.md)

### Metric Components (`metrics/`)

Metric and statistic display components:

- **`StatCard.tsx`**: Enhanced metric card with optional trend indicator

  - Variants: `primary`, `secondary`, `accent`, `light`, `dark`
  - Features: Top accent stripe, trend indicators, icon containers
  - Showcase: [`/dashboard/ui/data`](../../app/dashboard/ui/data/readMe.md)

- **`MetricGrid.tsx`**: Responsive grid container for metric cards
  - Automatic responsive grid layout
  - Showcase: [`/dashboard/ui/data`](../../app/dashboard/ui/data/readMe.md)

## Radix UI Components (`ui/`)

These components are built on Radix UI primitives with Tailwind CSS styling. Full documentation and examples available in the showcase pages:

### Foundation & Design System

- **Colors**: See [`/dashboard/ui/colors`](../../app/dashboard/ui/colors/readMe.md) for color system reference
- **Icons**: See [`/dashboard/ui/icons`](../../app/dashboard/ui/icons/readMe.md) for icon library browser
- **Typography**: See [`/dashboard/ui/type`](../../app/dashboard/ui/type/readMe.md) for typography components
  - Title components (`PageTitle`, `Title`, `Subtitle`, `SectionTitle`, etc.) are in `src/components/type/`
- **Layout**: See [`/dashboard/ui/layout`](../../app/dashboard/ui/layout/readMe.md) for containers, grids, flex, dividers
  - Container components (`PageContainer`, `SectionContainer`, etc.) are in `src/components/scaffolding/`

### Actions & Controls

- **`button.tsx`**: Button component with variants and sizes
  - Variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`, `primary`, `secondary`, `accent`
  - Sizes: `default`, `sm`, `lg`, `icon`
  - Showcase: [`/dashboard/ui/actions`](../../app/dashboard/ui/actions/readMe.md)

### Forms & Inputs

- **`input.tsx`**: Text input component

  - Various input types: text, email, password, number, tel, url, search
  - Showcase: [`/dashboard/ui/forms`](../../app/dashboard/ui/forms/readMe.md)

- **`label.tsx`**: Form label component

  - Showcase: [`/dashboard/ui/forms`](../../app/dashboard/ui/forms/readMe.md)

- **`select.tsx`**: Select dropdown component

  - Showcase: [`/dashboard/ui/forms`](../../app/dashboard/ui/forms/readMe.md)

- **`switch.tsx`**: Toggle switch component

  - Showcase: [`/dashboard/ui/forms`](../../app/dashboard/ui/forms/readMe.md)

- **Checkboxes & Radios**: Native HTML styled components

  - Showcase: [`/dashboard/ui/forms`](../../app/dashboard/ui/forms/readMe.md)

- **Textarea**: Native HTML styled component
  - Showcase: [`/dashboard/ui/forms`](../../app/dashboard/ui/forms/readMe.md)

### Navigation

- **`tabs.tsx`**: Tab navigation component

  - Components: `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
  - Variants: `default`, `primary`, `secondary`, `accent`
  - Fully rounded container with brand color backgrounds
  - Showcase: [`/dashboard/ui/navigation`](../../app/dashboard/ui/navigation/readMe.md)

- **`pagination.tsx`**: Complete pagination system

  - Components: `Pagination`, `PaginationPrevious`, `PaginationNext`, `PaginationPages`, `PaginationPage`, `PaginationEllipsis`, `PaginationInfo`
  - Variants: `default`, `primary`, `secondary`, `accent`
  - Context-based state management
  - Showcase: [`/dashboard/ui/navigation`](../../app/dashboard/ui/navigation/readMe.md)

- **`breadcrumb.tsx`**: Breadcrumb navigation component

  - Showcase: [`/dashboard/ui/navigation`](../../app/dashboard/ui/navigation/readMe.md)

- **`sidebar.tsx`**: Sidebar navigation component
  - Showcase: [`/dashboard/ui/navigation`](../../app/dashboard/ui/navigation/readMe.md)

### Data Display

- **`card.tsx`**: Card component for content display

  - Components: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
  - Showcase: [`/dashboard/ui/data`](../../app/dashboard/ui/data/readMe.md)

- **`table.tsx`**: Data table component

  - Components: `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableHead`, `TableRow`, `TableCell`, `TableCaption`
  - Used with pagination, search, filtering, sorting
  - Showcase: [`/dashboard/ui/tables`](../../app/dashboard/ui/tables/readMe.md)

- **Lists**: HTML list components with creative patterns
  - Showcase: [`/dashboard/ui/lists`](../../app/dashboard/ui/lists/readMe.md)

### Status & Indicators

- **`badge.tsx`**: Badge component

  - Variants: `default`, `destructive`, `secondary`, `outline`, `primary`, `secondary`, `accent`
  - Showcase: [`/dashboard/ui/status`](../../app/dashboard/ui/status/readMe.md)

- **`avatar.tsx`**: Avatar component
  - Components: `Avatar`, `AvatarImage`, `AvatarFallback`
  - Showcase: [`/dashboard/ui/status`](../../app/dashboard/ui/status/readMe.md)

### Feedback & States

- **`sonner.tsx`**: Toast notification component (wrapper for Sonner)

  - `Toaster` component (global, added to root layout)
  - `toast` API from `sonner` package
  - Variants: success, error, info, warning
  - Features: descriptions, actions, custom duration, promise support
  - Showcase: [`/dashboard/ui/feedback`](../../app/dashboard/ui/feedback/readMe.md)

- **`progress.tsx`**: Progress bar component

  - Showcase: [`/dashboard/ui/feedback`](../../app/dashboard/ui/feedback/readMe.md)

- **`skeleton.tsx`**: Skeleton loading component
  - Showcase: [`/dashboard/ui/feedback`](../../app/dashboard/ui/feedback/readMe.md)

### Overlays & Modals

- **`dialog.tsx`**: Modal dialog component

  - Components: `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`
  - Showcase: [`/dashboard/ui/overlays`](../../app/dashboard/ui/overlays/readMe.md)

- **`sheet.tsx`**: Slide-out panel component

  - Components: `Sheet`, `SheetTrigger`, `SheetContent`, `SheetHeader`, `SheetTitle`, `SheetDescription`, `SheetFooter`
  - Showcase: [`/dashboard/ui/overlays`](../../app/dashboard/ui/overlays/readMe.md)

- **`tooltip.tsx`**: Tooltip component

  - Components: `Tooltip`, `TooltipTrigger`, `TooltipContent`, `TooltipProvider`
  - Showcase: [`/dashboard/ui/overlays`](../../app/dashboard/ui/overlays/readMe.md)

- **`dropdown-menu.tsx`**: Dropdown menu component

  - Components: `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuLabel`, `DropdownMenuSeparator`, etc.
  - Showcase: [`/dashboard/ui/overlays`](../../app/dashboard/ui/overlays/readMe.md)

- **`collapsible.tsx`**: Collapsible component
  - Showcase: [`/dashboard/ui/overlays`](../../app/dashboard/ui/overlays/readMe.md)

### Media & Content

- **`chart.tsx`**: Chart component wrapper

  - Showcase: [`/dashboard/ui/media`](../../app/dashboard/ui/media/readMe.md)

- **Code Blocks**: See `Code.tsx` in foundation components
  - Showcase: [`/dashboard/ui/media`](../../app/dashboard/ui/media/readMe.md)

### Utilities

- **`scroll-area.tsx`**: Scrollable area component

  - Showcase: [`/dashboard/ui/utilities`](../../app/dashboard/ui/utilities/readMe.md)

- **`separator.tsx`**: Separator component
  - Horizontal and vertical separators
  - Showcase: [`/dashboard/ui/layout`](../../app/dashboard/ui/layout/readMe.md)

## Showcase Pages

All components have interactive examples, code snippets, and usage guidelines available in the showcase pages:

- **Foundation**: [`/dashboard/ui/colors`](../../app/dashboard/ui/colors/readMe.md), [`/dashboard/ui/type`](../../app/dashboard/ui/type/readMe.md), [`/dashboard/ui/icons`](../../app/dashboard/ui/icons/readMe.md), [`/dashboard/ui/layout`](../../app/dashboard/ui/layout/readMe.md)
- **Actions**: [`/dashboard/ui/actions`](../../app/dashboard/ui/actions/readMe.md)
- **Forms**: [`/dashboard/ui/forms`](../../app/dashboard/ui/forms/readMe.md)
- **Feedback**: [`/dashboard/ui/feedback`](../../app/dashboard/ui/feedback/readMe.md)
- **Status**: [`/dashboard/ui/status`](../../app/dashboard/ui/status/readMe.md)
- **Data Display**: [`/dashboard/ui/data`](../../app/dashboard/ui/data/readMe.md), [`/dashboard/ui/tables`](../../app/dashboard/ui/tables/readMe.md), [`/dashboard/ui/lists`](../../app/dashboard/ui/lists/readMe.md)
- **Overlays**: [`/dashboard/ui/overlays`](../../app/dashboard/ui/overlays/readMe.md)
- **Navigation**: [`/dashboard/ui/navigation`](../../app/dashboard/ui/navigation/readMe.md)
- **Utilities**: [`/dashboard/ui/utilities`](../../app/dashboard/ui/utilities/readMe.md)
- **Media**: [`/dashboard/ui/media`](../../app/dashboard/ui/media/readMe.md)

Visit [`/dashboard/ui`](../../app/dashboard/ui/readMe.md) for the main overview page with quick links to all categories.

## Usage

### Importing Custom Components

```tsx
import {
  LoadingState,
  ErrorState,
  EmptyState,
  StatusBadge,
  StatCard,
  MetricGrid,
  Text,
  Code,
  StyledLink,
  Paragraph,
  Blockquote,
} from "@/components/ui-library";
```

### Importing Radix UI Components

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
// etc.
```

### Importing Typography Components

```tsx
import {
  PageTitle,
  SectionTitle,
  Title,
  Subtitle,
} from "@/components/type/titles";
```

### Importing Layout Components

```tsx
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
```

## Component Locations

- **Custom Components**: `src/components/ui-library/` (this folder)
- **Radix UI Components**: `src/components/ui/`
- **Typography Components**: `src/components/type/`
- **Layout Containers**: `src/components/scaffolding/`
- **Showcase Pages**: `src/app/dashboard/ui/`

## Contributing

When adding new components:

1. Follow the existing component patterns
2. Include TypeScript types
3. Add JSDoc documentation
4. Include accessibility features
5. Add examples to the showcase page (`src/app/dashboard/ui/[category]/`)
6. Update this readMe and the roadmap
7. Update the category readMe if applicable

## Roadmap

See `DevelopmentRoadMap.md` for the complete roadmap and component checklist.
