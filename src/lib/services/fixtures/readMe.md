# Folder Overview

This folder handles fixture data fetching from the CMS API.

## Files

- `fetchFixtureInsights.ts`: Fetches comprehensive fixture insights (overview, categories, charts, distributions)
- `fetchFixtureDetails.ts`: Fetches filtered fixture details based on association, grade, or competition filters
- `fetchSingleFixtureDetail.ts`: Fetches comprehensive detailed information about a single fixture by ID

## Relations

- Parent folder: [../readMe.md](../readMe.md)
- Key dependencies: `fixtureInsights` types, `axios` instance
- Consumed by: `hooks/fixtures/` module

## Dependencies

- Internal: `@/types/fixtureInsights`, `@/types/fixtureDetail`, `@/lib/axios`
- External: `axios` (AxiosError)

## Usage

### Fetch Fixture Insights

```typescript
import { fetchFixtureInsights } from "@/lib/services/fixtures/fetchFixtureInsights";

const insights = await fetchFixtureInsights();
// Returns: FixtureInsightsResponse with overview, categories, charts, distributions
```

### Fetch Fixture Details

```typescript
import { fetchFixtureDetails } from "@/lib/services/fixtures/fetchFixtureDetails";

// Without filters
const allFixtures = await fetchFixtureDetails();

// With association filter
const associationFixtures = await fetchFixtureDetails({
  association: 2771,
});

// With multiple filters
const filteredFixtures = await fetchFixtureDetails({
  association: 2771,
  grade: 123,
  competition: 456,
});
```

### Fetch Single Fixture Detail

```typescript
import { fetchSingleFixtureDetail } from "@/lib/services/fixtures/fetchSingleFixtureDetail";

// Fetch single fixture by ID
const fixtureDetail = await fetchSingleFixtureDetail(63731);
// Returns: SingleFixtureDetailResponse with complete fixture data, validation, and metadata
```

## Error Handling

All services handle:
- 400 Bad Request errors (invalid ID/filters/parameters)
- 404 Not Found errors (fixture not found)
- 500 Internal Server Error
- Request timeouts
- Network errors
- Other Axios errors

All errors are logged with detailed context and re-thrown with user-friendly messages.

## API Endpoints

- **Insights**: `/game-meta-data/admin/insights`
  - No query parameters
  - Response time: 10-15 seconds (slow, should be cached)

- **Details**: `/game-meta-data/admin/fixtures`
  - Query parameters: `association`, `grade`, `competition` (all optional)
  - Response time: Fast (< 2 seconds)

- **Single Fixture Detail**: `/game-meta-data/admin/fixture/{id}`
  - Path parameter: `id` (required, number)
  - Response time: Includes validation calculations and performance metrics
  - Response size: 5-10KB depending on scorecards data

