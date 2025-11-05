# UI Component Library

A comprehensive, production-ready UI component library for the Fixtura Admin application. This library provides reusable, accessible, and consistent components built on top of Radix UI primitives and Tailwind CSS.

## Purpose

This library serves as the single source of truth for all UI components, ensuring:

- **Consistency**: Unified design language across the application
- **Reusability**: Components that work across different contexts
- **Accessibility**: WCAG-compliant components built on Radix UI
- **Type Safety**: Full TypeScript support with proper interfaces
- **Documentation**: Live examples and usage guides via the showcase page

## Structure

Components are organized into logical categories:

### foundation/

Foundation components for typography, colors, icons, and spacing:

- `Text.tsx`: Flexible text component with size and weight variants (uses `TypographyProps` from `@/components/type/types`)
- `Code.tsx`: Inline and block code display component (uses `TypographyProps`)
- `Link.tsx`: Styled link component for navigation with variants
- `Paragraph.tsx`: Styled paragraph component with consistent spacing (uses `TypographyProps`)
- `Blockquote.tsx`: Styled blockquote component for quotes (uses `TypographyProps`)

### states/

Components for handling application states:

- `LoadingState.tsx`: Standardized loading state display with multiple variants
- `ErrorState.tsx`: Standardized error state with retry functionality
- `EmptyState.tsx`: Standardized empty state display

### badges/

Status and indicator components:

- `StatusBadge.tsx`: Boolean status badge component with automatic color coding

### metrics/

Metric and statistic display components:

- `StatCard.tsx`: Enhanced metric card with optional trend indicator
- `MetricGrid.tsx`: Responsive grid container for metric cards

---

## Categories

- **Typography**: Text components, headings, labels
- **Colors**: Color system, theme tokens, variants
- **Icons**: Icon library integration and icon components
- **Spacing**: Layout utilities and spacing system

### Layout & Structure

- **Containers**: Page containers, section wrappers, content grids
- **Grids**: Responsive grid systems
- **Flex**: Flexbox utilities and components
- **Dividers**: Visual separators and dividers

### Navigation

Navigation components for page and content navigation:

- **Tabs**: Tab navigation with brand color variants and fully rounded styling
  - `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` components
  - Variants: default, primary, secondary, accent
  - Container: Fully rounded with brand color backgrounds
  - Triggers: White background with rounded-full styling

- **Pagination**: Complete pagination system with state management
  - `Pagination`: Main wrapper with context-based state
  - `PaginationPrevious`: Auto-disabled previous button
  - `PaginationNext`: Auto-disabled next button
  - `PaginationPages`: Smart page number buttons with ellipsis
  - `PaginationPage`: Individual page button
  - `PaginationEllipsis`: Ellipsis separator
  - `PaginationInfo`: Page information with short/long formats
  - Variants: default, primary, secondary, accent
  - Fully rounded buttons and container

Showcase examples available at `/dashboard/ui/navigation` with code snippets and usage guidelines.

See `src/app/dashboard/ui/navigation/readMe.md` for detailed component documentation.

### Forms & Inputs

- **Inputs**: Text inputs, textareas, selects
- **Checkboxes**: Checkbox inputs
- **Radio**: Radio button groups
- **Switches**: Toggle switches
- **Date Pickers**: Date and time selection
- **File Upload**: File upload components
- **Form Groups**: Form layout and validation

### Feedback & States

- **Loading States**: Loading indicators and skeletons
- **Error States**: Error displays with retry
- **Empty States**: Empty data states
- **Success States**: Success confirmations
- **Alerts**: Alert messages and notifications
- **Toasts**: Toast notifications
- **Progress**: Progress bars and indicators

### Status & Indicators

- **Badges**: Status badges and labels
- **Status Indicators**: Status dots and indicators
- **Avatars**: User avatars and initials
- **Tags**: Tag components for categorization

### Data Display

- **Tables**: Data tables with sorting, filtering, pagination
- **Lists**: List components (ordered, unordered, description)
- **Cards**: Card components for content display
- **Stat Cards**: Metric and statistic displays
- **Charts**: Chart components and wrappers
- **Timelines**: Timeline components
- **Tree Views**: Hierarchical data display

### Overlays & Modals

- **Dialogs**: Modal dialogs
- **Sheets**: Slide-out panels
- **Popovers**: Popover components
- **Tooltips**: Tooltip components
- **Dropdowns**: Dropdown menus
- **Context Menus**: Right-click menus

### Actions & Controls

- **Buttons**: Button variants and sizes
- **Button Groups**: Button groups and toolbars
- **Icon Buttons**: Icon-only buttons
- **Floating Actions**: Floating action buttons

### Media & Content

- **Images**: Image components with loading states
- **Videos**: Video player components
- **Code Blocks**: Code display components
- **Markdown**: Markdown renderer

### Utilities

- **Copy to Clipboard**: Copy functionality
- **Relative Time**: Time formatting components
- **Currency**: Currency formatting
- **Number Formatting**: Number formatting utilities
- **Search**: Search input components

## Showcase

Visit `/dashboard/ui` to see all components in action with:

- Interactive examples
- Prop variations
- Usage code snippets
- Accessibility features
- Responsive behavior

**Available Categories:**

- Foundation: Typography, Colors, Icons, Layout
- Forms & Inputs: Inputs, Selects, Checkboxes, Switches
- Feedback: Loading, Error, Empty states
- Status: Badges, Indicators, Avatars
- Data Display: Tables, Lists, Cards, Metrics
- Overlays: Dialogs, Sheets, Tooltips, Dropdowns
- Actions: Buttons and Button Groups
- Navigation: Breadcrumbs, Tabs, Sidebar, Pagination

## Usage

```tsx
import { LoadingState, ErrorState, StatCard } from "@/components/ui-library";
```

## Contributing

When adding new components:

1. Follow the existing component patterns
2. Include TypeScript types
3. Add JSDoc documentation
4. Include accessibility features
5. Add examples to the showcase page
6. Update this readMe and the roadmap

## Roadmap

See `DevelopmentRoadMap.md` for the complete roadmap and component checklist.
