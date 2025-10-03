# Folder Overview

This folder handles API service functions for fetching account-specific scrape test data from the backend.

## Files

- `fetchAllFetchTestAccounts.ts`: Service to fetch all account scrape test data
- `fetchFetchTestAccountById.ts`: Service to fetch specific account scrape test by ID

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Key dependencies: `fetch-account-scrape-test` types, `axios` instance
- Consumed by: `hooks/fetch-account-scrape-test` hooks

## Dependencies

- Internal: `@/types/fetch-account-scrape-test`, `@/lib/axios`
- External: axios for HTTP requests
