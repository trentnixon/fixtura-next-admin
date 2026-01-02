# Route C: Analytical Aggregations (The Charts)

## Information
- **Endpoint**: `/api/renders/analytics` (Proposed Custom)
- **Purpose**: Populate the System Throughput and Asset Mix charts.

## Parameters
- `period`: `month` | `week` | `day`

## Technical Rationale
This route returns pre-computed time-series data. By calculating buckets (e.g., assets per day) on the server, we avoid downloading large datasets to the client for charting, resulting in a much smoother user experience.

## Tracking Metrics
- **Render Volume**: Total successful renders over the selected period.
- **Asset Density**: Average assets produced per render (Efficiency).
- **Failure Trends**: Spikes in failure rates over time.
