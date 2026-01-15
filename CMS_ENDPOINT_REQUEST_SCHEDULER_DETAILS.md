# CMS Custom Endpoint Request: Scheduler Details (Lightweight)

## Requested Endpoint

**Route:** `GET /api/schedulers/:id/details`

**Method:** GET

**Path Parameter:**

- `id` (number) - The scheduler ID

## Purpose

A lightweight endpoint to fetch minimal scheduler details without heavy relation populates. This endpoint should return only the essential fields needed for displaying scheduler status information.

## Requested Response Structure

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

## Required Fields

The endpoint should return only these fields:

1. **id** (number) - Scheduler ID
2. **attributes.isRendering** (boolean) - Whether the scheduler is currently rendering
3. **attributes.Queued** (boolean) - Whether the scheduler is queued
4. **attributes.updatedAt** (string, ISO 8601 date) - Last update timestamp
5. **attributes.days_of_the_week** (relation) - Populate only the `days_of_the_week` relation with:
   - `id` (number)
   - `attributes.Name` (string) - Day name (e.g., "Monday", "Tuesday")

## Fields to Exclude

Do **NOT** populate or include:

- `renders` relation
- `account` relation
- Any nested relations within renders (downloads, ai_articles, etc.)
- Any other relations not listed above

## TypeScript Type Definition

```typescript
interface SchedulerDetailsResponse {
  data: {
    id: number;
    attributes: {
      isRendering: boolean;
      Queued: boolean;
      updatedAt: string;
      days_of_the_week: {
        data: {
          id: number;
          attributes: {
            Name: string;
          };
        } | null;
      };
    };
  };
}
```

## Performance Requirements

- Response time should be < 1 second
- Minimal database queries (only fetch required fields and single relation)
- No deep nesting or recursive populates

## Error Handling

Standard Strapi error responses:

- `404` - Scheduler not found
- `500` - Server error

---

**Priority:** HIGH
**Requested By:** Frontend Team
