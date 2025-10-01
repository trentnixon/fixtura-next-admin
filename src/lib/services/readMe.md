# Folder Overview

This folder contains API service functions that handle all external data fetching and manipulation for the Fixtura Admin application. Services are organized by domain (accounts, competitions, renders, etc.) and follow consistent patterns for error handling, type safety, and Strapi CMS integration.

## Files

### accounts/

- `fetchAccountById.ts`: Fetches detailed account information by ID with content hub integration
- `fetchAccounts.ts`: Retrieves paginated list of accounts with filtering capabilities
- `fetchAccountsSummary.ts`: Gets aggregated account statistics and analytics data

### competitions/

- `fetchCompetitionByID.ts`: Retrieves single competition details with populated relations
- `fetchCompetitions.ts`: Fetches account-specific competitions with organization filtering

### downloads/

- `fetchDownloadByID.ts`: Gets download details by ID
- `fetchDownloadByRenderID.ts`: Retrieves downloads associated with specific render

### games/

- `fetchGamesCricket.ts`: Fetches cricket game metadata using ID filters

### grades/

- `fetchGradesByID.ts`: Retrieves grade/division information by ID
- `fetchGradesInRenderByID.ts`: Gets grades associated with specific render operations

### renders/

- `deleteRender.ts`: Deletes render by ID with proper error handling
- `fetchGetAccountDetailsFromRenderId.ts`: Gets account information from render ID
- `fetchRecentRenders.ts`: Retrieves recently created renders
- `fetchRenderByID.ts`: Fetches detailed render information with populated relations

### scheduler/

- `fetchGetTodaysRenders.ts`: Gets renders scheduled for today
- `fetchGetTomorrowsRenders.ts`: Gets renders scheduled for tomorrow
- `fetchSchedulerById.ts`: Retrieves scheduler details with populated relations
- `fetchSchedulerRollup.ts`: Gets aggregated scheduler data and statistics
- `updateSchedulerById.ts`: Updates scheduler configuration and settings

### teams/

- `fetchGetTeamsOnSearchTerm.ts`: Searches teams by name or other criteria
- `fetchTeamsByID.ts`: Retrieves team details by ID

### fetch-test/

- `fetchAllFetchTests.ts`: Retrieves all fetch test data including test runs, summary, and charts
- `fetchFetchTestById.ts`: Retrieves detailed test information by ID with performance metrics and system info

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: React hooks in `src/hooks/`, React components, and API routes
- Key dependencies: `src/lib/axios.ts` for HTTP client, `src/types/` for type definitions

## Dependencies

- Internal:
  - `src/lib/axios.ts`: Configured Axios instance for API calls
  - `src/types/`: TypeScript interfaces and type definitions
- External:
  - `axios`: HTTP client library
  - `qs`: Query string serialization for Strapi API
  - Strapi CMS backend API endpoints

## Patterns

- **Server Actions**: All functions use `"use server"` directive for Next.js server-side execution
- **Error Handling**: Consistent AxiosError handling with detailed logging and user-friendly error messages
- **Type Safety**: Strong typing with TypeScript interfaces for requests and responses
- **Strapi Integration**: Uses `qs` library for query parameter serialization and population
- **Consistent Structure**: All services follow similar patterns for error handling, logging, and response formatting
