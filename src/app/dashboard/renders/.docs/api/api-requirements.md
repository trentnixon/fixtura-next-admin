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

### Route A: Operational Audit (The Master List)
**Endpoint**: `/api/renders`
**Purpose**: Populate the `GlobalRenderTable`.
- **Query Strategy**: Flat population with counts only.
- **Population**: `scheduler.account(fields:Name)`, `downloads(count:true)`, `ai_articles(count:true)`.
- **Server Load**: Low. Minimal relational depth.

### Route B: Live Telemetry (The Headliners)
**Endpoint**: `/api/renders/telemetry` (Proposed Custom)
**Purpose**: Populate the `GlobalRenderRollup` cards.
- **Expected Payload**:
  ```json
  {
    "activeCount": 5,
    "failedToday": 12,
    "successRate24h": 94.2,
    "systemStatus": "nominal"
  }
  ```
- **Server Load**: Extremely Low. Uses database aggregation (`count`, `avg`) rather than object serialization.

### Route C: Analytical Aggregations (The Charts)
**Endpoint**: `/api/renders/analytics` (Proposed Custom)
**Purpose**: Populate the System Throughput and Asset Mix charts.
- **Query Parameters**: `?period=month` or `?period=week`.
- **Deduction Engine**: This route should return buckets of data pre-computed by the server to avoid client-side heavy lifting.
- **Server Load**: Moderate. Only called on dashboard load or filter change.

### Route D: Resource Leaders (The Leaderboards)
**Endpoint**: `/api/renders/account-distribution` (Proposed Custom)
**Purpose**: Identify large accounts and asset type distribution.
- **Goal**: Returns the Top 10 Accounts and global counts for `video`, `image`, and `content` asset types.
- **Server Load**: Moderate.

### Route E: Individual Lineage (Deep Audit)
**Endpoint**: `/api/renders/:id`
**Purpose**: Full audit of a single render's DNA.
- **Query Strategy**: Complete relational expansion.
- **Custom Population**:
  ```json
  {
    "populate": {
      "scheduler": { "populate": "account" },
      "downloads": true,
      "ai_articles": true,
      "game_results_in_renders": true,
      "upcoming_games_in_renders": true,
      "grades_in_renders": {
        "populate": ["grade", "team"]
      }
    }
  }
  ```
- **Custom Option: Data Integrity Check**: A specific flag `?checkIntegrity=true` (Proposed) that compares the expected games in the scheduler against what was actually written to the render's many-to-many relations, highlighting missing data points.
- **Server Load**: High per-request. Reserved for technical troubleshooting and dispute resolution.

## Implementation Rules
1. **Never** request game metadata (`upcoming_games`, `game_results`) in Route A.
2. **Always** use Strapi's `fields` selector to limit account data to `FirstName` and `Sport`.
3. **Prefer** counts over full object arrays for all "List View" interactions.

