# Folder Overview

This folder contains the sign-up registration page for the Fixtura Admin application. It handles user registration using Clerk's authentication system with custom routing and styling.

## Files

- `[[...sign-up]]/page.tsx`: Dynamic catch-all route for sign-up functionality with Clerk integration

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: Application authentication flow and routing
- Key dependencies: `@clerk/nextjs` for authentication components

## Dependencies

- Internal:
  - `../layout.tsx`: Root layout with ClerkProvider configuration
- External:
  - `@clerk/nextjs`: Authentication components and routing
  - `next/navigation`: Next.js routing utilities

## Patterns

- **Dynamic Routing**: Uses Next.js catch-all routing `[[...sign-up]]` for flexible registration paths
- **Clerk Integration**: Leverages Clerk's built-in authentication components
- **Registration Flow**: Handles user registration and account creation
- **Type Safety**: Strong TypeScript integration with proper authentication types
