# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Next.js 15 admin dashboard for Fixtura, a sports fixture management platform. The application provides comprehensive management tools for accounts, competitions, fixtures, renders, schedulers, analytics, and cost tracking through a Strapi CMS backend.

## Development Commands

### Running the Application
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run lint:fix     # Run ESLint with auto-fix
```

### Testing
There are no test scripts configured. To add tests, you would need to configure a testing framework (e.g., Jest, Vitest).

## Environment Variables

Required environment variables (stored in `.env.local`):
- `NEXT_APP_API_BASE_URL` - Base URL for the Strapi CMS API
- `APP_API_KEY` - Bearer token for CMS authentication
- Clerk authentication variables for user management

## Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router and React Server Components
- **Styling**: Tailwind CSS with shadcn/ui components
- **Data Fetching**: TanStack Query (React Query) for client-side state management
- **HTTP Client**: Axios with interceptors for authentication and error handling
- **State Management**: Jotai for global state, TanStack Query for server state
- **Authentication**: Clerk
- **UI Components**: Radix UI primitives via shadcn/ui
- **Forms**: Native Radix UI form components
- **Notifications**: Sonner for toast notifications
- **Drag & Drop**: @dnd-kit for sortable interactions

### Directory Structure

```
src/
├── app/                           # Next.js App Router pages
│   ├── api/                       # API routes
│   ├── dashboard/                 # Main dashboard pages
│   │   ├── accounts/              # Account management
│   │   ├── analytics/             # Analytics dashboards
│   │   ├── association/           # Association management
│   │   ├── budget/                # Budget tracking
│   │   ├── club/                  # Club management
│   │   ├── competitions/          # Competition management
│   │   ├── contact/               # Contact form submissions
│   │   ├── downloads/             # Download management
│   │   ├── fixtures/              # Fixture management
│   │   ├── grades/                # Grade management
│   │   ├── orders/                # Order management
│   │   ├── renders/               # Render tracking
│   │   ├── rerender-requests/     # Re-render request management
│   │   ├── schedulers/            # Scheduler configuration
│   │   └── teams/                 # Team management
│   ├── layout.tsx                 # Root layout with providers
│   └── page.tsx                   # Landing page
├── components/
│   ├── modules/                   # Feature-specific components (charts, tables)
│   ├── providers/                 # React context providers
│   ├── scaffolding/               # Layout and container components
│   ├── ui/                        # shadcn/ui components
│   └── ui-library/                # Custom UI components (badges, metrics, states)
├── hooks/                         # TanStack Query hooks organized by domain
│   ├── accounts/
│   ├── analytics/
│   ├── competitions/
│   ├── fixtures/
│   ├── renders/
│   ├── rollups/                   # Cost tracking hooks
│   └── [other domains]/
├── lib/
│   ├── services/                  # API service functions organized by domain
│   ├── utils/                     # Utility functions
│   ├── axios.ts                   # Axios instance with auth interceptors
│   └── tanstack-query.ts          # Query client configuration
└── types/                         # TypeScript type definitions organized by domain
```

### Data Fetching Pattern

The application follows a consistent three-layer pattern:

1. **Service Layer** (`src/lib/services/[domain]/`): Server-side functions marked with `"use server"` that make authenticated API calls
   - Uses the shared Axios instance with Bearer token authentication
   - Handles errors with try-catch and standardized error messages
   - Uses `qs` library for building complex Strapi query parameters

2. **Hook Layer** (`src/hooks/[domain]/`): TanStack Query hooks that wrap services
   - Provides caching, refetching, and state management
   - Configured with retry logic and exponential backoff
   - Uses semantic query keys for cache invalidation

3. **Component Layer**: React components that consume hooks
   - Server Components for initial data loading
   - Client Components for interactive features

Example pattern:
```typescript
// 1. Service (src/lib/services/accounts/fetchAccounts.ts)
"use server";
export async function fetchAccounts(): Promise<FetchAccountsResponse> {
  const response = await axiosInstance.get(`/accounts?${query}`);
  return response.data;
}

// 2. Hook (src/hooks/accounts/useAccountsQuery.ts)
export function useAccountsQuery() {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: fetchAccounts,
    staleTime: 5 * 60 * 1000,
  });
}

// 3. Component usage
const { data, isLoading } = useAccountsQuery();
```

### Authentication Flow

- Uses Clerk for authentication
- Protected routes check `auth()` and redirect to sign-in if unauthenticated
- API requests automatically include Bearer token via Axios interceptors
- Sidebar only renders for authenticated users

### Styling Conventions

- Uses Tailwind CSS with custom design tokens in `tailwind.config.ts`
- Extended color system with semantic naming (success, error, warning, info)
- Brand color scales (50-950) for consistent theming
- CSS variables for dynamic theming (HSL color space)
- Font stack: Heebo, Roboto, Roboto Condensed

## Key Architectural Patterns

### API Integration with Strapi CMS

The backend is a Strapi headless CMS. When working with endpoints:
- All API calls go through the Axios instance in `src/lib/axios.ts`
- Use `qs` library to build Strapi query parameters (filters, populate, sorting)
- Responses follow Strapi's data structure with nested `data` and `attributes`
- Related entities must be explicitly populated in queries

### Rollup System for Cost Tracking

The application includes a comprehensive cost rollup system (`ROLLUP_CMS_DOCS.md`):
- Tracks rendering costs at multiple levels (render, account, daily, weekly, monthly)
- All rollup endpoints follow consistent response format with `{ data: T, meta?: {...} }`
- Hooks are in `src/hooks/rollups/`
- Services are in `src/lib/services/rollups/`

### Type Safety

- All API responses have corresponding TypeScript types in `src/types/`
- Types are organized by domain (account.ts, render.ts, rollups.ts, etc.)
- Use existing types when creating new features
- Complex nested Strapi responses are fully typed

### Component Organization

- **Scaffolding components**: Reusable layout patterns (PageContainer, SectionContainer)
- **UI components**: shadcn/ui Radix primitives
- **UI Library components**: Custom components (StatusBadge, MetricCard)
- **Module components**: Feature-specific (charts, tables)

### State Management

- **Server state**: Managed by TanStack Query
- **Global client state**: Jotai atoms (see `src/components/providers/GlobalContext.tsx`)
- **Local component state**: React useState/useReducer
- **Form state**: Controlled components with native React

## Working with This Codebase

### Adding New API Endpoints

1. Create service function in `src/lib/services/[domain]/[featureName].ts`
2. Mark function with `"use server"` directive
3. Add TypeScript types to `src/types/[domain].ts`
4. Create TanStack Query hook in `src/hooks/[domain]/[hookName].ts`
5. Use hook in component

### Query Client Configuration

The global query client is configured in `src/lib/tanstack-query.ts` with:
- 5-minute stale time for queries
- 30-minute garbage collection time
- Automatic retry with exponential backoff (3 attempts)
- Global error logging

### Debugging

- TanStack Query DevTools enabled in development mode
- Axios interceptors log all requests/responses (currently commented out)
- Error boundaries catch React errors
- Console logging for API errors with detailed context

### Path Aliases

Use the `@/` alias for absolute imports:
```typescript
import { Component } from '@/components/Component';
import { fetchData } from '@/lib/services/domain/fetchData';
import type { Type } from '@/types/type';
```

## Related Documentation

- `ROLLUP_CMS_DOCS.md` - Comprehensive documentation for the cost rollup system
- `ENDPOINT_SPECIFICATION.md` - Spec for CMS endpoints
- `CMS_ENDPOINT_REQUEST.md` - Endpoint request documentation
- Various `Tickets.md` and `Notes.md` files in feature directories contain implementation details and requirements

## Important Notes

### API Timeout
The Axios instance has a 60-second timeout to handle slow CMS responses. Adjust if needed in `src/lib/axios.ts`.

### Image Optimization
Next.js image component is configured for:
- `fixtura.s3.ap-southeast-2.amazonaws.com`
- `res.cloudinary.com`

### Server Actions
Next.js server actions have a 10MB body size limit (configured in `next.config.ts`).

### Windows Development
This project is developed on Windows using PowerShell. Be mindful of path separators and line endings when working cross-platform.
