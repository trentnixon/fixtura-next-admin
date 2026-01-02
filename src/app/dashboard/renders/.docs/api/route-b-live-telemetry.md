# Route B: Live Telemetry (The Headliners)

## Information
- **Endpoint**: `/api/renders/telemetry` (Proposed Custom)
- **Purpose**: Populate the `GlobalRenderRollup` headline stats.

## Expected Response Payload
```json
{
  "activeCount": 5,
  "failedToday": 12,
  "successRate24h": 94.2,
  "systemStatus": "nominal"
}
```

## Technical Rationale
This route uses database-level aggregations (`COUNT`, `AVG`) rather than full object serialization. It provides the "heartbeat" of the system with near-zero performance overhead on the Strapi server.

## UI Usage
- Counters for the top-level StatCards.
- Real-time "Active" indicator for the dashboard.
