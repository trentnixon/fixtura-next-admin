# Folder Overview

This folder contains all React components for the Fixtura Admin application, organized into logical categories. Components range from basic UI primitives to complex business logic components, providing a comprehensive component library with consistent patterns, styling, and functionality.

## Files

### modules/

Business logic components that combine multiple UI elements for specific functionality:

- `charts/BarChartComponent.tsx`: Reusable bar chart component with Recharts integration
- `tables/AccountTable.tsx`: Account data table with search, filtering, and navigation

### providers/

React Context providers for global state and configuration:

- `GlobalContext.tsx`: Global context for domain URLs and Strapi locations
- `QueryProvider.tsx`: React Query client provider with dev tools integration

### scaffolding/

Layout and structural components for page organization:

- `containers/createPage.tsx`: Page container with consistent spacing and layout
- `containers/createPageTitle.tsx`: Title container component
- `layout/Breadcrumbs.tsx`: Breadcrumb navigation component
- `layout/Header.tsx`: Application header with authentication integration
- `layout/nav/app-sidebar.tsx`: Main application sidebar navigation
- `layout/nav/nav-main.tsx`: Primary navigation component
- `layout/nav/nav-user.tsx`: User-specific navigation component

### type/

Typography and text styling components:

- `titles.tsx`: Comprehensive typography components (Title, Subtitle, SectionTitle, H1-H4, Label, ByLine)
- `type.tsx`: Additional type-related components

### ui/

Base UI components built on Radix UI primitives with Tailwind CSS styling:

- `avatar.tsx`: User avatar component
- `badge.tsx`: Badge/label component
- `breadcrumb.tsx`: Breadcrumb navigation component
- `button.tsx`: Button component with multiple variants and sizes
- `card.tsx`: Card container component
- `chart.tsx`: Chart container and utilities
- `collapsible.tsx`: Collapsible content component
- `dialog.tsx`: Modal dialog component
- `dropdown-menu.tsx`: Dropdown menu component
- `input.tsx`: Form input component
- `label.tsx`: Form label component
- `scroll-area.tsx`: Custom scrollable area component
- `separator.tsx`: Visual separator component
- `sheet.tsx`: Side panel/sheet component
- `sidebar.tsx`: Sidebar component
- `skeleton.tsx`: Loading skeleton component
- `switch.tsx`: Toggle switch component
- `table.tsx`: Table components (Table, TableBody, TableCell, TableHead, TableHeader, TableRow)
- `tabs.tsx`: Tab navigation component
- `tooltip.tsx`: Tooltip component

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: All pages and layouts in `src/app/`
- Key dependencies: `src/hooks/` for data fetching, `src/types/` for type definitions, `src/lib/utils.ts` for utilities

## Dependencies

- Internal:
  - `src/hooks/`: Custom React hooks for data fetching
  - `src/types/`: TypeScript interfaces and type definitions
  - `src/lib/utils.ts`: Utility functions (cn, formatDate, etc.)
- External:
  - `@radix-ui/*`: UI primitive components
  - `@clerk/nextjs`: Authentication components
  - `@tanstack/react-query`: Data fetching and caching
  - `recharts`: Chart library
  - `lucide-react`: Icon library
  - `class-variance-authority`: Component variant management
  - `tailwind-merge`: Tailwind CSS class merging

## Patterns

### Component Architecture

- **Composition**: Components are built using composition patterns with children props
- **Type Safety**: Strong TypeScript integration with proper prop interfaces
- **Styling**: Consistent Tailwind CSS styling with custom utility functions
- **Accessibility**: Built on Radix UI primitives for accessibility compliance

### UI Component Patterns

- **Variants**: Components use class-variance-authority for variant management
- **Forwarding Refs**: Components properly forward refs for DOM access
- **Slot Pattern**: Some components support `asChild` prop for composition
- **Responsive Design**: Components include responsive design considerations

### Business Logic Components

- **Data Integration**: Components integrate with custom hooks for data fetching
- **State Management**: Local state management with React hooks
- **Event Handling**: Consistent event handling patterns
- **Navigation**: Integration with Next.js routing

### Provider Patterns

- **Context API**: Global state management using React Context
- **Environment Configuration**: Environment-specific configuration management
- **Error Boundaries**: Error handling and recovery patterns
