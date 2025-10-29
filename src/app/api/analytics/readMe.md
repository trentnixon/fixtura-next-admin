# Folder Overview

This folder contains API routes for the Order Analytics API system in the Fixtura Admin application. These routes handle server-side API endpoints that provide comprehensive analytics data including global metrics, account-specific insights, subscription trends, trial analytics, revenue analysis, and cohort analysis.

## Files

- `global-summary/route.ts`: API route handler for global analytics summary
- `account/[id]/route.ts`: API route handler for account-specific analytics with dynamic routing
- `subscription-trends/route.ts`: API route handler for subscription lifecycle analysis
- `trial-analytics/route.ts`: API route handler for trial conversion analysis
- `revenue-analytics/route.ts`: API route handler for financial insights
- `cohort-analysis/route.ts`: API route handler for customer retention analysis

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Consumed by: Client components, React hooks, and external API consumers
- Key dependencies: `../../lib/services/analytics/` for business logic, `../../types/analytics.ts` for type definitions

## Dependencies

- Internal:
  - `../../lib/services/analytics/`: Analytics service functions for business logic
  - `../../types/analytics.ts`: TypeScript interfaces and type definitions
- External:
  - `next/server`: Next.js server-side API utilities
  - Order Analytics API backend endpoints

## Patterns

- **API Routes**: Uses Next.js App Router API route conventions
- **Server Actions**: Implements server-side logic for analytics data operations
- **Caching**: Implements appropriate cache headers based on data volatility
- **Type Safety**: Strong TypeScript integration with proper request/response types
- **Error Handling**: Consistent error handling and response formatting
- **Dynamic Routing**: Uses Next.js dynamic routing with [id] parameters for account-specific analytics

## API Endpoints

| Endpoint                             | Method | Purpose                         | Cache Time | Response Time Target |
| ------------------------------------ | ------ | ------------------------------- | ---------- | -------------------- |
| `/api/analytics/global-summary`      | GET    | System-wide analytics           | 5 minutes  | <1s                  |
| `/api/analytics/account/[id]`        | GET    | Account-specific insights       | 1 minute   | <1s                  |
| `/api/analytics/subscription-trends` | GET    | Subscription lifecycle analysis | 10 minutes | <2s                  |
| `/api/analytics/trial-analytics`     | GET    | Trial conversion analysis       | 5 minutes  | <1s                  |
| `/api/analytics/revenue-analytics`   | GET    | Financial insights              | 5 minutes  | <2s                  |
| `/api/analytics/cohort-analysis`     | GET    | Customer retention analysis     | 10 minutes | <2s                  |

## Authentication Status

- **Current**: All endpoints have `auth: false` (Phase 1 implementation)
- **Planned**: Authentication will be implemented in Phase 2
- **Future**: Rate limiting and Redis caching planned for Phase 3

## Response Format

All endpoints return standardized responses:

**Success Response:**

```json
{
  "data": {
    // Analytics data object
  }
}
```

**Error Response:**

```json
{
  "error": {
    "status": 500,
    "name": "InternalServerError",
    "message": "Error description"
  }
}
```
