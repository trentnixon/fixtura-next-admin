# Folder Overview

This folder contains React Context providers that manage global state, configuration, and application-wide services for the Fixtura Admin application. These providers wrap the application and provide essential functionality to all child components.

## Files

- `GlobalContext.tsx`: Global context provider for domain URLs, Strapi locations, and environment-specific configuration
- `QueryProvider.tsx`: React Query client provider with development tools integration for data fetching and caching

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: Application root layout and all child components
- Key dependencies: `../../lib/tanstack-query.ts` for query client configuration

## Dependencies

- Internal:
  - `../../lib/tanstack-query.ts`: React Query client configuration
- External:
  - `react`: React Context API and hooks
  - `@tanstack/react-query`: Data fetching and caching library
  - `@tanstack/react-query-devtools`: Development tools for React Query

## Patterns

- **Context API**: Uses React Context for global state management
- **Environment Configuration**: Manages environment-specific URLs and settings
- **Provider Composition**: Providers can be composed together for complex setups
- **Type Safety**: Strong TypeScript integration with proper context types
- **Error Handling**: Includes error boundaries and fallback mechanisms
- **Development Tools**: Integrates development tools for debugging and monitoring
