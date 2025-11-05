# Folder Overview

This folder contains core utilities, configurations, and shared functionality for the Fixtura Admin application. It serves as the foundation layer providing HTTP client configuration, query management, utility functions, and API services that are consumed throughout the application.

## Files

- `axios.ts`: Configured Axios HTTP client with interceptors, authentication, and error handling
- `tanstack-query.ts`: React Query client configuration with caching, retry logic, and global error handling
- `utils.ts`: Common utility functions for CSS class merging, date formatting, and calculations
- `services/`: API service functions organized by domain (see [services/readMe.md](./services/readMe.md))

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: All React hooks, components, and API routes throughout the application
- Key dependencies: `src/types/` for type definitions, environment variables for configuration

## Dependencies

- Internal:
  - `src/types/`: TypeScript interfaces and type definitions
  - `src/services/`: API service functions (subfolder)
- External:
  - `axios`: HTTP client library with interceptors
  - `@tanstack/react-query`: Data fetching and caching library
  - `clsx`: Utility for conditional CSS classes
  - `tailwind-merge`: Tailwind CSS class merging utility
  - Environment variables: `NEXT_APP_API_BASE_URL`, `APP_API_KEY`

## Core Components

### HTTP Client (`axios.ts`)

- **Base Configuration**: 60-second timeout, JSON content type
- **Authentication**: Automatic Bearer token injection from environment variables
- **Interceptors**: Request/response logging and error standardization
- **Error Handling**: Enhanced error logging with status codes, response data, and timeout-specific error handling

### Query Management (`tanstack-query.ts`)

- **Caching Strategy**: 5-minute stale time, 30-minute garbage collection
- **Retry Logic**: 3 retries for queries, 2 for mutations with exponential backoff
- **Global Error Handling**: Automatic error logging and monitoring integration hooks
- **Performance**: Optimized for server-side rendering and client-side hydration

### Utilities (`utils.ts`)

- **CSS Classes**: `cn()` function for conditional Tailwind class merging
- **Date Formatting**: `formatDate()` for consistent date display
- **Date Calculations**: `daysFromToday()` for relative time calculations

### Services Layer (`services/`)

- **Domain Organization**: Services grouped by business domain (accounts, competitions, renders, etc.)
- **Consistent Patterns**: Server Actions, error handling, and TypeScript integration
- **API Integration**: Strapi CMS integration with query serialization
