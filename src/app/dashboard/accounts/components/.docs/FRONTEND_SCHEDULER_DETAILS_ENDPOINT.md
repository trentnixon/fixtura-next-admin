# Frontend Guide: Scheduler Details Endpoint

## Endpoint Information

**Route:** `GET /api/scheduler/:id/details`

**Method:** GET

**Authentication:** Not required (`auth: false`)

**Base URL:** Your Strapi API base URL (e.g., `http://localhost:1337/api` or `https://api.yourdomain.com/api`)

## Usage

### Basic Request

```typescript
// Example: Fetch scheduler details for ID 123
const schedulerId = 123;
const response = await fetch(`${API_BASE_URL}/scheduler/${schedulerId}/details`);
const data = await response.json();
```

### With Error Handling

```typescript
async function getSchedulerDetails(schedulerId: number) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/scheduler/${schedulerId}/details`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Scheduler not found');
      }
      if (response.status === 500) {
        throw new Error('Server error occurred');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result: SchedulerDetailsResponse = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching scheduler details:', error);
    throw error;
  }
}
```

### Using with React Hook (Example)

```typescript
import { useQuery } from '@tanstack/react-query';

function useSchedulerDetails(schedulerId: number) {
  return useQuery({
    queryKey: ['scheduler', schedulerId, 'details'],
    queryFn: async () => {
      const response = await fetch(
        `${API_BASE_URL}/scheduler/${schedulerId}/details`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch scheduler details');
      }

      const data: SchedulerDetailsResponse = await response.json();
      return data;
    },
    enabled: !!schedulerId,
  });
}
```

## TypeScript Types

### Response Type

```typescript
interface SchedulerDetailsResponse {
  data: {
    id: number;
    attributes: {
      isRendering: boolean;
      Queued: boolean;
      updatedAt: string; // ISO 8601 date string
      days_of_the_week: {
        data: {
          id: number;
          attributes: {
            Name: string; // e.g., "Monday", "Tuesday", etc.
          };
        } | null; // null if no day is associated
      };
    };
  };
}
```

### Error Response Types

```typescript
// 404 - Scheduler not found
interface NotFoundError {
  error: {
    message: string; // "Scheduler not found"
  };
}

// 500 - Server error
interface ServerError {
  error: {
    message: string; // "An error occurred while fetching scheduler details."
  };
}

// 400 - Missing ID parameter (should not occur in normal usage)
interface BadRequestError {
  error: {
    message: string; // "Scheduler ID is required"
  };
}
```

## Response Structure

### Success Response (200 OK)

```json
{
  "data": {
    "id": 123,
    "attributes": {
      "isRendering": true,
      "Queued": false,
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "days_of_the_week": {
        "data": {
          "id": 1,
          "attributes": {
            "Name": "Monday"
          }
        }
      }
    }
  }
}
```

### Response with Null Day

```json
{
  "data": {
    "id": 123,
    "attributes": {
      "isRendering": false,
      "Queued": true,
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "days_of_the_week": {
        "data": null
      }
    }
  }
}
```

### Error Response (404 Not Found)

```json
{
  "error": {
    "message": "Scheduler not found"
  }
}
```

### Error Response (500 Server Error)

```json
{
  "error": {
    "message": "An error occurred while fetching scheduler details."
  }
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `data.id` | `number` | The scheduler's unique identifier |
| `data.attributes.isRendering` | `boolean` | Whether the scheduler is currently rendering |
| `data.attributes.Queued` | `boolean` | Whether the scheduler is queued |
| `data.attributes.updatedAt` | `string` | ISO 8601 timestamp of last update |
| `data.attributes.days_of_the_week.data.id` | `number \| null` | ID of the associated day of the week |
| `data.attributes.days_of_the_week.data.attributes.Name` | `string \| null` | Name of the day (e.g., "Monday") |

## Important Notes

1. **Lightweight Endpoint**: This endpoint is optimized for performance and returns only minimal required fields. It does NOT include:
   - `renders` relation
   - `account` relation
   - Any nested relations

2. **Null Handling**: The `days_of_the_week` relation may be `null` if no day is associated with the scheduler. Always check for null before accessing day properties.

3. **Performance**: This endpoint is designed to respond in < 1 second. It uses minimal database queries with only the `days_of_the_week` relation populated.

4. **Route Path**: The endpoint uses `/scheduler/:id/details` (singular "scheduler") to match the existing API pattern.

## Example Usage Scenarios

### Check Scheduler Status

```typescript
const details = await getSchedulerDetails(123);

if (details.data.attributes.isRendering) {
  console.log('Scheduler is currently rendering');
}

if (details.data.attributes.Queued) {
  console.log('Scheduler is queued');
}
```

### Display Day of Week

```typescript
const details = await getSchedulerDetails(123);
const dayName = details.data.attributes.days_of_the_week.data?.attributes.Name;

if (dayName) {
  console.log(`Scheduler runs on: ${dayName}`);
} else {
  console.log('No day assigned');
}
```

### Get Last Update Time

```typescript
const details = await getSchedulerDetails(123);
const lastUpdate = new Date(details.data.attributes.updatedAt);
console.log(`Last updated: ${lastUpdate.toLocaleString()}`);
```

## Error Handling Best Practices

```typescript
async function fetchSchedulerDetailsWithFallback(schedulerId: number) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/scheduler/${schedulerId}/details`
    );

    if (response.status === 404) {
      // Handle not found gracefully
      return null; // or show a "not found" UI state
    }

    if (!response.ok) {
      // Log error but don't crash
      console.error(`Failed to fetch scheduler ${schedulerId}:`, response.status);
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // Network errors, parsing errors, etc.
    console.error('Error fetching scheduler details:', error);
    throw error;
  }
}
```

---

**Endpoint Implemented:** 2025-01-27
**Last Updated:** 2025-01-27
**Requested By:** Frontend Team
**Priority:** HIGH
