# API Requirements: Global Render Data

To ensure the Global Render Monitor is performant, we need to carefully manage the `populate` query to Strapi. Requesting too much data (like game results or upcoming games) for a list of 25+ renders will slow down the page significantly.

## Proposed Collective Query (List View)

When fetching the list of renders for the `/dashboard/renders` page, we should use the following structured population:

```json
{
  "populate": {
    "scheduler": {
      "populate": {
        "account": {
          "fields": ["FirstName", "LastName", "Sport"],
          "populate": ["account_type"]
        }
      }
    },
    "downloads": {
        "count": true
    },
    "ai_articles": {
        "count": true
    }
  },
  "sort": ["publishedAt:desc"],
  "pagination": {
    "page": 1,
    "pageSize": 25
  }
}
```

### Rationale
- **`scheduler.account`**: Essential for knowing who the render belongs to.
- **`fields` filtering**: We only need names and sport for the list, avoiding heavy account blobs.
- **Count vs Data**: If possible, request the count of `downloads` and `ai_articles` rather than the full array of attributes to reduce payload size.

## Proposed Individual Query (Detail View)

When deep-diving into `/dashboard/renders/:id`, we use a much heavier population:

```json
{
  "populate": [
    "downloads",
    "ai_articles",
    "upcoming_games_in_renders",
    "game_results_in_renders",
    "grades_in_renders",
    "scheduler.account"
  ]
}
```

## Data Deductions & Operational Intelligence

Beyond basic counts, we can derive significant operational intelligence by correlating fields within the `render` schema:

### 1. The "Asset Multiplier" (Account Value)
By analyzing `downloads.count` relative to the `account_type`, we can calculate a **Value Multiplier**:
- **Deduction**: Associations naturally have higher asset counts than clubs. We can benchmark "Healthy" volume for a club (e.g., 2-4 assets) vs. an association (10-50 assets) to identify underperforming schedules.

### 2. Time-Based Load Analysis
Using `publishedAt`, we can deduce:
- **Peak Hour Stress**: Correlating render volume with the time of day.
- **Weekend vs Weekday**: Measuring the system load during the Saturday sport window vs. the mid-week result processing window.

### 3. Data Density vs. Performance
By populating the `count` for the relational "Data Points", we can calculate a **Complexity Score** for each render:
- **`upcoming_games_in_renders`**
- **`game_results_in_renders`**
- **`grades_in_renders`**
- **Deduction**: If a render has high counts in these fields but a low `publishedAt` to `updatedAt` delta, the worker is performing exceptionally well. If counts are high and it's stalling, we've identified a scaling bottleneck.

### 2. The "Ghost Render" Detection (Quality Guard)
- **Logic**: IF `Complete === true` AND (`downloads.count === 0` AND `ai_articles.count === 0`).
- **Deduction**: The system claims it finished, but produced no value. This flags a potential "silent fail" in the rendering engine where the script exits zero without outputting files.

### 3. Communication Lineage Audit
By combining the boolean flags, we can show a **Delivery Timeline**:
- **`sendEmail`**: Was it supposed to notify the user?
- **`EmailSent`**: Did the primary notification fire?
- **`hasTeamRosterEmail`**: Did the specific roster sub-workflow notify the user?
- **`forceRerenderEmail`**: Was the user notified of a manual correction?
- **Deduction**: We can visualize a "Comms Path" for each render to troubleshoot "I didn't get my email" tickets.

### 4. Workflow Identification
We can categorize renders into "Types" based on flags without needing a separate `Type` field:
- **Roster Workflow**: IF `hasTeamRosterRequest` OR `isCreatingRoster` is true.
- **Manual Override**: IF `forceRerender` OR `rerenderRequested` is true.
- **Standard Schedule**: If above are false.

## Optimized Population for Monitoring

To support these deductions, the **List View** population should be slightly expanded to include counts of the meta-data relations:

```json
{
  "populate": {
    "scheduler": { "populate": "account" },
    "downloads": { "count": true },
    "ai_articles": { "count": true },
    "game_results_in_renders": { "count": true },
    "upcoming_games_in_renders": { "count": true },
    "grades_in_renders": { "count": true }
  }
}
```

## Individual Detail View (Full Audit)
When viewing a single render, we should fetch the `attributes` of these relations to show exactly WHICH games were processed, allowing admins to answer "Why was the U14 game missing from my video?"
## Specialized Route Architecture (Backend Strategy)

To maintain high performance and avoid "Over-Population Stress" on the Strapi server, we will use a multi-route strategy. Instead of one massive query, we break requests down by UI concern:

## Custom Strapi Route Architecture

To maintain high performance and avoid the overhead of the generic Strapi REST API, we are implementing a specialized set of custom routes. These routes target specific database optimized queries (using `knex` or raw queries where appropriate) to provide the dashboard with exact telemetry.

### Route A: Operational Audit
**Endpoint**: `/api/renders/audit`
**Controller Function**: `findAuditList`
- **Functionality**: Performs a prioritized join between `renders` and `schedulers` to return a list of the 25 most recent renders. It specifically selects only the counts of associated `downloads` and `ai_articles` per row, avoiding the serialization of full object trees.
- **Deduction**: Returns a "Complexity Score" per render calculated from the sum of associated metadata relations.

### Route B: Live Telemetry
**Endpoint**: `/api/renders/telemetry`
**Controller Function**: `getSystemPulse`
- **Functionality**: A database-level aggregation utility. It runs a `COUNT` on currently `Processing: true` renders and a calculation of the `Complete: true` vs `Complete: false` ratio for the last 24 hours.
- **Output**: Returns a single small JSON object representing system "heat".

### Route C: Analytical Aggregations
**Endpoint**: `/api/renders/analytics`
**Controller Function**: `getThroughputAnalytics`
- **Functionality**: Uses a date-truncation grouping to bucket renders into days, weeks, or months. It calculates the average asset production volume per bucket.
- **Parameters**: `?period=month` | `?period=week`
- **Performance**: Pre-computes these buckets so the frontend receives a finalized time-series array (e.g., for Recharts).

### Route D: Resource Leaders
**Endpoint**: `/api/renders/distribution`
**Controller Function**: `getAccountLeaderboard`
- **Functionality**: Aggregates render counts and asset creation counts grouped by `account_id`. It identifies the top 10 most "data-heavy" accounts in the system.
- **Segments**: Groups results by `account_type` (Club/Association) for comparative analysis.

### Route E: Individual Lineage
**Endpoint**: `/api/renders/lineage/:id`
**Controller Function**: `getRenderDNA`
- **Functionality**: The most expensive route. It fetches every attribute of a single render ID and its relations.
- **Custom Logic**: If `checkIntegrity=true` is passed, the controller performs a cross-reference between the results stored in `game_results_in_renders` and the expected data from the scheduler's logic, returning a `mismatched_data` array.

## Implementation Rules (Backend)
1. **Custom Controllers**: All routes must bypass the default Strapi `find` and `findOne` methods to ensure optimized SQL queries.
2. **Selective Selection**: Only return fields required by the UI documentation.
3. **Caching**: Route B (Telemetry) should have a short-term Cache (e.g., 30s) to prevent DB hammering under high-frequency refreshes.


## Implementation Rules
1. **Never** request game metadata (`upcoming_games`, `game_results`) in Route A.
2. **Always** use Strapi's `fields` selector to limit account data to `FirstName` and `Sport`.
3. **Prefer** counts over full object arrays for all "List View" interactions.

