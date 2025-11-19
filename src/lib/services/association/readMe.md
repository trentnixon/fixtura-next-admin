# Folder Overview

This folder contains association service functions that handle Association Admin Insights API data fetching for the Fixtura Admin application. Services follow consistent patterns for error handling, type safety, and comprehensive analytics data retrieval.

## Files

- `fetchAssociationInsights.ts`: Fetches comprehensive association admin insights including overview statistics, grade/club distributions, competition insights, and detailed per-association metrics with optional sport filtering
- `fetchAssociationDetail.ts`: Fetches detailed association information by ID including core association data, relational data (competitions, clubs, grades, accounts), detailed statistics, and formatted responses for all related entities

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: React hooks in `src/hooks/association/`, React components, and API routes
- Key dependencies: `src/lib/axios.ts` for HTTP client, `src/types/associationInsights.ts` and `src/types/associationDetail.ts` for type definitions

## Dependencies

- Internal:
  - `src/lib/axios.ts`: Configured Axios instance for API calls
  - `src/types/associationInsights.ts`: TypeScript interfaces and type definitions for association insights data
  - `src/types/associationDetail.ts`: TypeScript interfaces and type definitions for association detail data
- External:
  - `axios`: HTTP client library
  - Association Admin Insights API backend endpoint at `/api/association/admin/insights`
  - Association Admin Detail API backend endpoint at `/api/association/admin/:id`

## Patterns

- **Server Actions**: All functions use `"use server"` directive for Next.js server-side execution
- **Error Handling**: Consistent AxiosError handling with detailed logging and user-friendly error messages
- **Type Safety**: Strong typing with TypeScript interfaces for requests and responses
- **Comprehensive Logging**: Detailed console logging for debugging and monitoring
- **Consistent Structure**: All services follow similar patterns for error handling, logging, and response formatting
- **Query Parameters**: Uses URLSearchParams for building query strings with optional filters

## API Endpoints

- `/api/association/admin/insights` - Association insights (Response time: 500-1500ms, Data volume: High ~600-700KB)

  - Optional query parameter: `sport` (Cricket, AFL, Hockey, Netball, Basketball)
  - Returns: Overview analytics, grades/clubs analytics, competition analytics, association details, and metadata

- `/api/association/admin/:id` - Association detail (Response time: 150-300ms, Data volume: Medium ~100-500KB)
  - Required path parameter: `id` (numeric association identifier)
  - Returns: Association detail, statistics, competitions, clubs, accounts, insights, and metadata
  - Error responses: 400 (invalid ID), 404 (not found), 500 (server error)

## Authentication Status

- **Current**: Endpoint has `auth: false` (TODO: Add proper admin authentication)
- **Planned**: Authentication will be implemented in the future
