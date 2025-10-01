# Folder Overview

This folder contains API routes for the Fixtura Admin application. These routes handle server-side API endpoints that can be called from client components or external services.

## Files

- `data/route.ts`: API route handler for data operations and external API integrations

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: Client components, external services, and API consumers
- Key dependencies: `../../lib/services/` for business logic, `../../types/` for type definitions

## Dependencies

- Internal:
  - `../../lib/services/`: API service functions for business logic
  - `../../types/`: TypeScript interfaces and type definitions
- External:
  - `next/server`: Next.js server-side API utilities
  - `@clerk/nextjs/server`: Server-side authentication utilities

## Patterns

- **API Routes**: Uses Next.js App Router API route conventions
- **Server Actions**: Implements server-side logic for data operations
- **Authentication**: Integrates with Clerk for server-side authentication
- **Type Safety**: Strong TypeScript integration with proper request/response types
- **Error Handling**: Consistent error handling and response formatting
