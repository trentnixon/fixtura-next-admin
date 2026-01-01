# API Requirements (Phase 2): Advanced Scheduler Monitoring

This document outlines the remaining data requirements for the Strapi CMS to support predictive analytics, error tracking, and long-term health trends in the Admin Dashboard.

---

## 1. New Endpoint: Historical Health Trend
**Route:** `GET /scheduler/getHealthHistory?days=14`
**Purpose:** To power time-series charts showing system stability and volume trends over time.

### Request
`GET /api/scheduler/getHealthHistory?days=14`

### Expected Response
An array of daily summaries:
```json
[
  {
    "date": "2023-11-20",
    "success": 45,
    "failed": 2,
    "avgDuration": 12.5,
    "totalVolume": 47
  },
  {
    "date": "2023-11-21",
    "success": 38,
    "failed": 0,
    "avgDuration": 11.2,
    "totalVolume": 38
  }
]
```

---

## 2. Error Telemetry & Latency Tracking
**Purpose:** To allow the dashboard to diagnose *why* renders are failing and track system pickup delays.

### Required Fields (Add to `render` object in all scheduler lists)
- **`failureReason`**: (String/Enum) Categorized reason for failure.
    - e.g., "TIMEOUT", "DATA_MISSING", "RENDER_ENGINE_ERROR", "ASSET_FAILURE".
- **`queueWaitTimeSeconds`**: Difference between `scheduledTime` and `startedAt`. This helps identify if the rendering server is falling behind.

---

## 3. Global Information & Deductions
By implementing the above, the Admin Dashboard will be able to provide the following "Intelligent Metrics":

1.  **System Latency Analysis**: Track the gap between "Scheduled" and "Started" to identify peak hours where the system is over-capacity.
2.  **Sport-Specific Stability**: cross-reference `failureReason` with `accountSport` to isolate if a template update broke a specific sport.
3.  **Projected Completion (Time to Zero)**: Combine `avgRenderTimeMinutes` with current `numberOfSchedulersQueued` to estimate when the current queue will be cleared.
4.  **Operational Risk Heatmap**: Plot failures against time-of-day to identify maintenance windows or data provider outages.

---

## Technical Context
- **Strapi Controller**: `api::scheduler.scheduler` (custom controller).
- **History Logic**:
    - Query the `renders` table grouped by calendar day.
    - Calculate counts for `Complete = true` vs `Complete = false`.
    - Provide the average of `(updatedAt - createdAt)` for completed items only.
