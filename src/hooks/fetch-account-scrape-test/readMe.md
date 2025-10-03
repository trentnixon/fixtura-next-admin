# Folder Overview

This folder handles React Query hooks for fetching account-specific scrape test data.

## Files

- `useFetchAccountTestsQuery.ts`: Hook to fetch all account scrape test data
- `useFetchAccountTestByIdQuery.ts`: Hook to fetch specific account scrape test by ID

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Key dependencies: `fetch-account-scrape-test` services, Tanstack Query
- Consumed by: Dashboard components and pages

## Dependencies

- Internal: `@/lib/services/fetch-account-scrape-test`, `@/types/fetch-account-scrape-test`
- External: Tanstack Query for data fetching and caching
