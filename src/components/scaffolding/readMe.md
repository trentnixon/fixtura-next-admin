# Folder Overview

This folder contains layout and structural components that provide consistent page organization, navigation, and scaffolding for the Fixtura Admin application. These components establish the visual hierarchy and structural foundation for all pages.

## Files

### containers/

- `createPage.tsx`: Page container component with consistent spacing, layout, and border styling
- `createPageTitle.tsx`: Title container component for page headers and section titles
- `PageContainer.tsx`: Top-level container for page content with configurable padding and spacing, no visual styling (borders/backgrounds)
- `SectionContainer.tsx`: Card-based container for organizing components into logical sections with title, description, and optional action button. Used as a child of PageContainer
- `ElementContainer.tsx`: Flexible container for individual UI elements, designed as a child of SectionContainer. Supports light/dark variants, optional border, and configurable padding/margin with optional title/subtitle
- `ComponentContainer.tsx`: Flexible wrapper component for individual components with consistent spacing, borders, or background styling variants
- `SectionWrapper.tsx`: Semantic wrapper for page sections that provides consistent spacing and layout, commonly used with SectionTitle

### layout/

- `Breadcrumbs.tsx`: Breadcrumb navigation component for page hierarchy
- `Header.tsx`: Application header with authentication integration and branding
- `nav/app-sidebar.tsx`: Main application sidebar navigation component
- `nav/nav-main.tsx`: Primary navigation component for main menu items
- `nav/nav-user.tsx`: User-specific navigation component for user actions

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: Page layouts, dashboard components, and application structure
- Key dependencies: `../ui/` for base components, `@clerk/nextjs` for authentication

## Dependencies

- Internal:
  - `../ui/`: Base UI components (Button, Card, etc.)
  - `../type/`: Typography components for consistent text styling
- External:
  - `@clerk/nextjs`: Authentication components (SignInButton, UserButton, SignedIn, SignedOut)
  - `next/navigation`: Next.js routing and navigation
  - `lucide-react`: Icon library for navigation elements

## Patterns

- **Layout Composition**: Components use composition patterns for flexible layouts
- **Consistent Spacing**: Standardized spacing and padding throughout the application
- **Navigation Integration**: Seamless integration with Next.js routing
- **Authentication Integration**: Built-in authentication state management
- **Responsive Design**: Components adapt to different screen sizes
- **Type Safety**: Strong TypeScript integration with proper prop interfaces
