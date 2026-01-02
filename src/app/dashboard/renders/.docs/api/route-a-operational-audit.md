# Route A: Operational Audit (The Master List)

## Information
- **Endpoint**: `/api/renders/audit`
- **Controller Function**: `findAuditList`
- **Purpose**: Populate the `GlobalRenderTable` with high-density, low-load data.

## Request Configuration
- **Query Strategy**: Specialized custom query for speed and efficiency.
- **Payload Includes**:
  - **Account Context**: Core identification fields only.
  - **Relational Counts**: Direct counts for `downloads` and `ai_articles`.
  - **Timeline Flags**: `Processing`, `Complete`, `EmailSent`.
- **Sorting**: `publishedAt:desc`
- **Pagination**: Optimized 25-item chunks.

## Technical Rationale
This route is a specialized custom endpoint. Unlike the default Strapi collection, it is optimized at the database level to provide only the fields necessary for monitoring, avoiding the overhead of secondary relational lookups while maintaining the ability to see the "Output Density" (Asset counts) at a glance.

## Monitoring Metrics
- **Deduction**: Identify and flag "Ghost Renders" (Complete: true, Asset Count: 0).
- **Status Visibility**: Real-time `Processing` vs `Complete` badges.



# response

# Render Audit API Documentation

This document describes the Operational Audit endpoint for the GlobalRenderTable, providing high-density, low-load data for monitoring render operations.

---

## Overview

**Endpoint:** `GET /api/renders/audit`

**Purpose:** Populate the `GlobalRenderTable` with optimized render data including account context, relational counts, and timeline flags. This endpoint is specialized for operational monitoring and avoids the overhead of full relational lookups while maintaining visibility into render status and output density.

**Query Strategy:** Custom query optimized for speed and efficiency, returning only essential fields and direct counts.

---

## Request

### Endpoint
```
GET /api/renders/audit
```

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | `1` | Page number for pagination (1-based) |

### Example Requests

```bash
# Get first page (default)
GET /api/renders/audit

# Get specific page
GET /api/renders/audit?page=2
```

---

## Response Type

```typescript
type AuditResponse = {
  data: Array<{
    renderId: number;
    renderName: string | null;
    publishedAt: string; // ISO 8601 datetime
    createdAt: string; // ISO 8601 datetime
    updatedAt: string; // ISO 8601 datetime
    // Timeline Flags
    Processing: boolean;
    Complete: boolean;
    EmailSent: boolean;
    // Account Context (core identification fields only)
    account: {
      accountId: number;
      accountName: string | null;
      accountSport: string | null;
      accountType: string | null; // e.g., "Club", "Association"
    } | null;
    // Relational Counts (direct counts, not full relations)
    downloadsCount: number;
    aiArticlesCount: number;
    // Output Density Flag
    isGhostRender: boolean; // Complete: true, Asset Count: 0
  }>;
  pagination: {
    page: number; // Current page number (1-based)
    pageSize: number; // Items per page (fixed at 25)
    pageCount: number; // Total number of pages
    total: number; // Total number of renders
  };
};
```

---

## Example Response

```json
{
  "data": [
    {
      "renderId": 123,
      "renderName": "Week 15 Results",
      "publishedAt": "2023-11-21T09:00:05.123Z",
      "createdAt": "2023-11-21T09:00:05.123Z",
      "updatedAt": "2023-11-21T09:12:30.456Z",
      "Processing": false,
      "Complete": true,
      "EmailSent": true,
      "account": {
        "accountId": 456,
        "accountName": "Bayside Cricket Club",
        "accountSport": "Cricket",
        "accountType": "Club"
      },
      "downloadsCount": 45,
      "aiArticlesCount": 12,
      "isGhostRender": false
    },
    {
      "renderId": 124,
      "renderName": "Tuesday Morning Render",
      "publishedAt": "2023-11-21T08:30:00.000Z",
      "createdAt": "2023-11-21T08:30:00.000Z",
      "updatedAt": "2023-11-21T08:30:15.000Z",
      "Processing": false,
      "Complete": true,
      "EmailSent": false,
      "account": {
        "accountId": 457,
        "accountName": "Metro Basketball Association",
        "accountSport": "Basketball",
        "accountType": "Association"
      },
      "downloadsCount": 0,
      "aiArticlesCount": 0,
      "isGhostRender": true
    },
    {
      "renderId": 125,
      "renderName": "Wednesday Results",
      "publishedAt": "2023-11-22T10:00:00.000Z",
      "createdAt": "2023-11-22T10:00:00.000Z",
      "updatedAt": "2023-11-22T10:05:00.000Z",
      "Processing": true,
      "Complete": false,
      "EmailSent": false,
      "account": {
        "accountId": 458,
        "accountName": "City Football Club",
        "accountSport": "AFL",
        "accountType": "Club"
      },
      "downloadsCount": 0,
      "aiArticlesCount": 0,
      "isGhostRender": false
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 25,
    "pageCount": 8,
    "total": 193
  }
}
```

---

## Field Descriptions

### Render Fields

- **`renderId`**: Unique identifier for the render
- **`renderName`**: Name of the render (may be null)
- **`publishedAt`**: ISO 8601 datetime when the render was published
- **`createdAt`**: ISO 8601 datetime when the render was created
- **`updatedAt`**: ISO 8601 datetime when the render was last updated

### Timeline Flags

- **`Processing`**: Boolean indicating if the render is currently being processed
- **`Complete`**: Boolean indicating if the render has completed successfully
- **`EmailSent`**: Boolean indicating if the completion email has been sent

### Account Context

The `account` object contains core identification fields only (high-density, low-load approach):

- **`accountId`**: Unique identifier for the account
- **`accountName`**: Account's first name (typically the organization name)
- **`accountSport`**: Sport associated with the account (e.g., "Cricket", "AFL", "Basketball", "Hockey", "Netball")
- **`accountType`**: Type of account (e.g., "Club", "Association")

**Note:** `account` may be `null` if the render is not associated with a scheduler/account.

### Relational Counts

These fields provide direct counts without loading full relational data:

- **`downloadsCount`**: Total number of downloads/assets associated with this render
- **`aiArticlesCount`**: Total number of AI articles associated with this render

### Output Density Flags

- **`isGhostRender`**: Boolean flag identifying "Ghost Renders" - renders that are marked as `Complete: true` but have zero assets (`downloadsCount === 0 && aiArticlesCount === 0`). This helps identify renders that completed but failed to generate expected output.

---

## Usage Examples

### Basic Fetch

```javascript
// Fetch first page of audit data
const response = await fetch('/api/renders/audit');
const { data, pagination } = await response.json();

console.log(`Page ${pagination.page} of ${pagination.pageCount}`);
console.log(`Total renders: ${pagination.total}`);
```

### Pagination

```javascript
// Fetch specific page
const page = 3;
const response = await fetch(`/api/renders/audit?page=${page}`);
const { data, pagination } = await response.json();

// Navigate through all pages
let currentPage = 1;
let allRenders = [];

do {
  const response = await fetch(`/api/renders/audit?page=${currentPage}`);
  const result = await response.json();
  allRenders = allRenders.concat(result.data);
  currentPage++;
} while (currentPage <= result.pagination.pageCount);
```

### Identify Ghost Renders

```javascript
const response = await fetch('/api/renders/audit');
const { data } = await response.json();

// Filter ghost renders
const ghostRenders = data.filter(render => render.isGhostRender);

console.log(`Found ${ghostRenders.length} ghost renders`);
ghostRenders.forEach(render => {
  console.log(`Render ${render.renderId} (${render.renderName}) completed with no assets`);
});
```

### Monitor Processing Status

```javascript
const response = await fetch('/api/renders/audit');
const { data } = await response.json();

// Categorize renders by status
const processing = data.filter(r => r.Processing);
const completed = data.filter(r => r.Complete && !r.Processing);
const incomplete = data.filter(r => !r.Complete && !r.Processing);

console.log(`Processing: ${processing.length}`);
console.log(`Completed: ${completed.length}`);
console.log(`Incomplete: ${incomplete.length}`);
```

### Output Density Analysis

```javascript
const response = await fetch('/api/renders/audit');
const { data } = await response.json();

// Analyze output density
const highDensity = data.filter(r => r.downloadsCount > 50 || r.aiArticlesCount > 20);
const lowDensity = data.filter(r => r.downloadsCount < 10 && r.aiArticlesCount < 5);
const noOutput = data.filter(r => r.downloadsCount === 0 && r.aiArticlesCount === 0);

console.log(`High density: ${highDensity.length}`);
console.log(`Low density: ${lowDensity.length}`);
console.log(`No output: ${noOutput.length}`);
```

### Filter by Account Type

```javascript
const response = await fetch('/api/renders/audit');
const { data } = await response.json();

// Filter by account type
const clubRenders = data.filter(r => r.account?.accountType === 'Club');
const associationRenders = data.filter(r => r.account?.accountType === 'Association');

console.log(`Club renders: ${clubRenders.length}`);
console.log(`Association renders: ${associationRenders.length}`);
```

---

## Pagination

The endpoint uses **fixed pagination** with 25 items per page. This is optimized for the GlobalRenderTable display requirements.

### Pagination Parameters

- **Page Size**: Fixed at 25 items per page
- **Page Number**: 1-based (first page is `page=1`)
- **Total Pages**: Calculated as `Math.ceil(total / pageSize)`

### Pagination Metadata

The response includes pagination metadata in the `pagination` object:

```typescript
{
  page: number;        // Current page number (1-based)
  pageSize: number;    // Items per page (always 25)
  pageCount: number;   // Total number of pages
  total: number;       // Total number of renders across all pages
}
```

---

## Sorting

Renders are sorted by **`publishedAt` in descending order** (newest first). This ensures the most recent renders appear at the top of the list.

---

## Performance Considerations

### Optimization Strategy

This endpoint is optimized for **high-density, low-load** data retrieval:

1. **Direct Counts**: Uses `.count()` queries instead of loading full relational data
2. **Selective Population**: Only populates essential account identification fields
3. **Fixed Pagination**: 25-item chunks reduce memory footprint
4. **Minimal Fields**: Returns only fields necessary for monitoring

### Expected Performance

- **Response Time**: < 500ms for a single page (25 items)
- **Database Load**: Minimal - uses count queries and selective population
- **Memory Usage**: Low - only essential fields returned

---

## Error Handling

The endpoint returns standard HTTP status codes:

- **200 OK**: Success
- **500 Internal Server Error**: Server error (check logs)

Error response format:

```json
{
  "error": {
    "status": 500,
    "message": "Failed to fetch audit list. Please try again later."
  }
}
```

---

## Monitoring Metrics

### Status Visibility

Use the timeline flags to track render status:
- **Real-time Processing**: Filter by `Processing: true`
- **Completed Renders**: Filter by `Complete: true && Processing: false`
- **Email Status**: Track `EmailSent` flag for delivery confirmation

### Ghost Render Detection

The `isGhostRender` flag identifies problematic renders:
- **Definition**: `Complete: true && downloadsCount === 0 && aiArticlesCount === 0`
- **Use Case**: Identify renders that completed but failed to generate expected output
- **Action**: Investigate why these renders completed without assets

### Output Density

Monitor render output quality:
- **High Density**: Renders with high `downloadsCount` or `aiArticlesCount`
- **Low Density**: Renders with minimal assets
- **Zero Output**: Renders with no assets (may indicate failures)

---

## Technical Implementation

### Query Strategy

The endpoint uses a specialized custom query approach:

1. **Primary Query**: Fetches renders with nested account population (scheduler → account → account_type)
2. **Count Queries**: Parallel count queries for downloads and ai_articles per render
3. **Pagination**: Applied at database level using `limit` and `offset`
4. **Sorting**: Database-level sorting by `publishedAt:desc`

### Database Queries

```javascript
// Main render query
renders = await strapi.db.query("api::render.render").findMany({
  populate: {
    scheduler: {
      populate: {
        account: {
          populate: { account_type: true }
        }
      }
    }
  },
  orderBy: { publishedAt: "desc" },
  limit: 25,
  offset: (page - 1) * 25
});

// Count queries (per render, in parallel)
downloadsCount = await strapi.db.query("api::download.download").count({
  where: { render: renderId }
});

aiArticlesCount = await strapi.db.query("api::ai-article.ai-article").count({
  where: { render: renderId }
});
```

---

## Files

- **Handler**: `src/api/render/controllers/audit/index.js`
- **Controller**: `src/api/render/controllers/render.js` (findAuditList method)
- **Route**: `src/api/render/routes/custom-render.js`

---

## Testing

Test the endpoint using:

```bash
# Get first page
curl http://localhost:1337/api/renders/audit

# Get specific page
curl http://localhost:1337/api/renders/audit?page=2
```

---

## Integration Notes

This endpoint is designed specifically for the **GlobalRenderTable** component in the Admin Dashboard. It provides:

1. **Sufficient Data**: All fields needed for table display
2. **Efficient Queries**: Optimized to avoid performance issues
3. **Pagination Ready**: Built-in pagination support
4. **Monitoring Ready**: Includes flags for status tracking and anomaly detection

The endpoint avoids loading full relational data (like complete download/ai_article objects) in favor of simple counts, making it suitable for high-volume monitoring scenarios.
