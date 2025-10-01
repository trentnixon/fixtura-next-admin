# Folder Overview

This folder contains the main application structure for the Fixtura Admin application using Next.js App Router. It includes the root layout, main pages, API routes, and authentication pages that form the foundation of the application.

## Files

- `layout.tsx`: Root layout component with authentication, providers, sidebar, and global styling
- `page.tsx`: Home page with sign-in functionality
- `globals.css`: Global CSS styles and Tailwind CSS configuration
- `favicon.ico`: Application favicon
- `api/`: API routes for server-side functionality
- `dashboard/`: Main dashboard application pages and components
- `sign-in/`: User authentication sign-in page
- `sign-up/`: User registration sign-up page

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: Next.js App Router and application routing
- Key dependencies: `../components/` for UI components, `../lib/` for utilities, `../hooks/` for data fetching

## Dependencies

- Internal:
  - `../components/`: UI components, providers, and scaffolding
  - `../lib/`: Utility functions and configurations
  - `../hooks/`: Custom React hooks for data fetching
  - `../types/`: TypeScript interfaces and type definitions
- External:
  - `@clerk/nextjs`: Authentication and user management
  - `next/font/google`: Google Fonts integration
  - `next/server`: Next.js server-side utilities
  - `tailwindcss`: CSS framework and styling

## Patterns

- **App Router**: Uses Next.js App Router for file-based routing
- **Authentication**: Clerk integration for user authentication and management
- **Provider Composition**: Multiple providers composed for global state and services
- **Layout Structure**: Consistent layout with sidebar, header, and main content areas
- **Type Safety**: Strong TypeScript integration throughout all pages
- **Responsive Design**: Mobile-first responsive design with Tailwind CSS
- **Font Integration**: Google Fonts integration with CSS variables
