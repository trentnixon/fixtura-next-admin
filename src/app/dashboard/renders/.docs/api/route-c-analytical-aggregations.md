# Route C: Analytical Aggregations (The Charts)

## Information
- **Endpoint**: `/api/renders/analytics`
- **Controller Function**: `getThroughputAnalytics`
- **Purpose**: Populate the System Throughput and Asset Mix charts.

## Parameters
- `period`: `month` | `week` | `day`

## Technical Rationale
This route returns pre-computed time-series data. By calculating buckets (e.g., assets per day) on the server, we avoid downloading large datasets to the client for charting, resulting in a much smoother user experience.

## Tracking Metrics
- **Render Volume**: Total successful renders over the selected period.
- **Asset Density**: Average assets produced per render (Efficiency).
- **Failure Trends**: Spikes in failure rates over time.

# Response
# Render Analytics API Documentation

This document describes the Analytical Aggregations endpoint for System Throughput and Asset Mix charts, providing pre-computed time-series data grouped by time periods.

---

## Overview

**Endpoint:** `GET /api/renders/analytics`

**Purpose:** Populate the System Throughput and Asset Mix charts with pre-computed time-series data. By calculating buckets (e.g., assets per day) on the server, we avoid downloading large datasets to the client for charting, resulting in a much smoother user experience.

**Query Strategy:** Server-side time-series aggregation grouped by period buckets (day/week/month) with pre-computed metrics.

---

## Request

### Endpoint
```
GET /api/renders/analytics
```

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `period` | `"day" \| "week" \| "month"` | No | `"day"` | Time period for grouping data |

### Example Requests

```bash
# Get daily analytics (default)
GET /api/renders/analytics

# Get weekly analytics
GET /api/renders/analytics?period=week

# Get monthly analytics
GET /api/renders/analytics?period=month
```

---

## Response Type

```typescript
type AnalyticsResponse = {
  period: "day" | "week" | "month";
  range: {
    start: string; // ISO 8601 datetime
    end: string;   // ISO 8601 datetime
  };
  data: Array<{
    period: string;        // Bucket identifier (e.g., "2023-11-21", "2023-W47", "2023-11")
    date: string;          // ISO date string (YYYY-MM-DD) for sorting/display
    // Render Volume
    renderVolume: number;   // Total successful renders in this period
    // Asset Density (Efficiency)
    assetDensity: number;  // Average assets per render (downloads + ai_articles)
    // Failure Trends
    failureCount: number;  // Number of failed renders
    failureRate: number;   // Failure percentage (0-100)
    // Additional metrics
    totalRenders: number;  // Total renders in period
    totalAssets: number;   // Total assets produced (downloads + ai_articles)
  }>;
};
```

---

## Example Responses

### Daily Period Response

```json
{
  "period": "day",
  "range": {
    "start": "2023-10-03T00:00:00.000Z",
    "end": "2023-11-02T23:59:59.999Z"
  },
  "data": [
    {
      "period": "2023-11-01",
      "date": "2023-11-01",
      "renderVolume": 45,
      "assetDensity": 12.5,
      "failureCount": 2,
      "failureRate": 4.3,
      "totalRenders": 47,
      "totalAssets": 588
    },
    {
      "period": "2023-11-02",
      "date": "2023-11-02",
      "renderVolume": 38,
      "assetDensity": 11.2,
      "failureCount": 0,
      "failureRate": 0.0,
      "totalRenders": 38,
      "totalAssets": 426
    }
  ]
}
```

### Weekly Period Response

```json
{
  "period": "week",
  "range": {
    "start": "2023-08-10T00:00:00.000Z",
    "end": "2023-11-02T23:59:59.999Z"
  },
  "data": [
    {
      "period": "2023-W43",
      "date": "2023-10-23",
      "renderVolume": 312,
      "assetDensity": 13.8,
      "failureCount": 8,
      "failureRate": 2.5,
      "totalRenders": 320,
      "totalAssets": 4416
    },
    {
      "period": "2023-W44",
      "date": "2023-10-30",
      "renderVolume": 298,
      "assetDensity": 12.1,
      "failureCount": 5,
      "failureRate": 1.7,
      "totalRenders": 303,
      "totalAssets": 3666
    }
  ]
}
```

### Monthly Period Response

```json
{
  "period": "month",
  "range": {
    "start": "2022-11-01T00:00:00.000Z",
    "end": "2023-11-02T23:59:59.999Z"
  },
  "data": [
    {
      "period": "2023-09",
      "date": "2023-09-01",
      "renderVolume": 1245,
      "assetDensity": 14.2,
      "failureCount": 45,
      "failureRate": 3.5,
      "totalRenders": 1290,
      "totalAssets": 18318
    },
    {
      "period": "2023-10",
      "date": "2023-10-01",
      "renderVolume": 1389,
      "assetDensity": 13.8,
      "failureCount": 32,
      "failureRate": 2.3,
      "totalRenders": 1421,
      "totalAssets": 19610
    }
  ]
}
```

---

## Field Descriptions

### Response Metadata

- **`period`**: The period type used for grouping (`"day"`, `"week"`, or `"month"`)
- **`range`**: Date range covered by the data
  - `start`: Start of the period range (ISO 8601)
  - `end`: End of the period range (ISO 8601)

### Data Point Fields

Each item in the `data` array represents one time bucket:

- **`period`**: Unique identifier for the time bucket
  - Day: `"YYYY-MM-DD"` (e.g., `"2023-11-21"`)
  - Week: `"YYYY-Www"` (e.g., `"2023-W47"`) - ISO week format
  - Month: `"YYYY-MM"` (e.g., `"2023-11"`)

- **`date`**: ISO date string (YYYY-MM-DD) for sorting and display purposes

#### Render Volume Metrics

- **`renderVolume`**: Total number of successful renders (`Complete: true`) in this period bucket
- **`totalRenders`**: Total number of renders (successful + failed) in this period bucket

#### Asset Density Metrics (Efficiency)

- **`assetDensity`**: Average number of assets produced per render
  - Calculation: `(totalAssets / totalRenders)`
  - Assets = `downloadsCount + aiArticlesCount`
  - Rounded to 2 decimal places
  - **Use Case**: Measures render efficiency - higher density = more assets per render

- **`totalAssets`**: Total number of assets produced in this period
  - Sum of all downloads and AI articles across all renders in the bucket

#### Failure Trends Metrics

- **`failureCount`**: Number of failed renders in this period
  - Failed = `Complete: false` (and not currently processing)

- **`failureRate`**: Failure percentage (0-100)
  - Calculation: `(failureCount / totalRenders) * 100`
  - Rounded to 1 decimal place
  - **Use Case**: Identify spikes in failure rates over time

---

## Period Ranges

The endpoint automatically calculates appropriate date ranges based on the period:

| Period | Date Range | Bucket Count |
|--------|-----------|--------------|
| `day` | Last 30 days | ~30 buckets |
| `week` | Last 12 weeks | ~12 buckets |
| `month` | Last 12 months | ~12 buckets |

---

## Usage Examples

### Basic Fetch

```javascript
// Fetch daily analytics
const response = await fetch('/api/renders/analytics?period=day');
const { period, range, data } = await response.json();

console.log(`Period: ${period}`);
console.log(`Range: ${range.start} to ${range.end}`);
console.log(`Data points: ${data.length}`);
```

### System Throughput Chart

```javascript
const response = await fetch('/api/renders/analytics?period=week');
const { data } = await response.json();

// Prepare data for chart
const throughputData = {
  labels: data.map(d => d.period),
  datasets: [
    {
      label: 'Render Volume',
      data: data.map(d => d.renderVolume),
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
    },
    {
      label: 'Total Renders',
      data: data.map(d => d.totalRenders),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
    }
  ]
};

// Render chart
renderThroughputChart(throughputData);
```

### Asset Mix Chart (Efficiency)

```javascript
const response = await fetch('/api/renders/analytics?period=month');
const { data } = await response.json();

// Prepare asset density data
const assetMixData = {
  labels: data.map(d => d.period),
  datasets: [
    {
      label: 'Asset Density (Avg Assets per Render)',
      data: data.map(d => d.assetDensity),
      borderColor: 'rgb(54, 162, 235)',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
    },
    {
      label: 'Total Assets',
      data: data.map(d => d.totalAssets),
      borderColor: 'rgb(255, 206, 86)',
      backgroundColor: 'rgba(255, 206, 86, 0.2)',
      yAxisID: 'y1', // Secondary axis for scale
    }
  ]
};

renderAssetMixChart(assetMixData);
```

### Failure Trends Analysis

```javascript
const response = await fetch('/api/renders/analytics?period=day');
const { data } = await response.json();

// Identify failure spikes
const failureSpikes = data.filter(d => d.failureRate > 10);

console.log(`Found ${failureSpikes.length} periods with >10% failure rate`);
failureSpikes.forEach(spike => {
  console.log(`${spike.period}: ${spike.failureRate}% (${spike.failureCount} failures)`);
});

// Chart failure trends
const failureTrendData = {
  labels: data.map(d => d.period),
  datasets: [
    {
      label: 'Failure Rate (%)',
      data: data.map(d => d.failureRate),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
    },
    {
      label: 'Failure Count',
      data: data.map(d => d.failureCount),
      borderColor: 'rgb(255, 159, 64)',
      backgroundColor: 'rgba(255, 159, 64, 0.2)',
      yAxisID: 'y1',
    }
  ]
};

renderFailureTrendChart(failureTrendData);
```

### Period Switching

```javascript
// React component example
function AnalyticsDashboard() {
  const [period, setPeriod] = useState('day');
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/api/renders/analytics?period=${period}`)
      .then(res => res.json())
      .then(result => setData(result));
  }, [period]);

  return (
    <div>
      <select value={period} onChange={(e) => setPeriod(e.target.value)}>
        <option value="day">Daily</option>
        <option value="week">Weekly</option>
        <option value="month">Monthly</option>
      </select>

      {data && (
        <>
          <ThroughputChart data={data.data} />
          <AssetMixChart data={data.data} />
          <FailureTrendChart data={data.data} />
        </>
      )}
    </div>
  );
}
```

### Efficiency Analysis

```javascript
const response = await fetch('/api/renders/analytics?period=week');
const { data } = await response.json();

// Calculate efficiency trends
const efficiencyTrend = data.map(d => ({
  period: d.period,
  efficiency: d.assetDensity,
  volume: d.renderVolume,
  // Efficiency score: higher asset density with higher volume = better
  score: d.assetDensity * Math.log(d.renderVolume + 1)
}));

// Find most efficient periods
const mostEfficient = efficiencyTrend
  .sort((a, b) => b.score - a.score)
  .slice(0, 5);

console.log('Top 5 most efficient periods:');
mostEfficient.forEach((period, index) => {
  console.log(`${index + 1}. ${period.period}: ${period.efficiency} assets/render, ${period.volume} renders`);
});
```

---

## Chart Integration

### System Throughput Chart

Displays render volume over time:

```javascript
// Chart.js example
const chartData = {
  labels: analyticsData.data.map(d => formatPeriod(d.period, analyticsData.period)),
  datasets: [
    {
      label: 'Successful Renders',
      data: analyticsData.data.map(d => d.renderVolume),
      borderColor: 'rgb(34, 197, 94)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
    },
    {
      label: 'Total Renders',
      data: analyticsData.data.map(d => d.totalRenders),
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
    }
  ]
};
```

### Asset Mix Chart

Displays asset density and total assets:

```javascript
const chartData = {
  labels: analyticsData.data.map(d => formatPeriod(d.period, analyticsData.period)),
  datasets: [
    {
      label: 'Asset Density (Avg per Render)',
      data: analyticsData.data.map(d => d.assetDensity),
      type: 'line',
      borderColor: 'rgb(168, 85, 247)',
      backgroundColor: 'rgba(168, 85, 247, 0.1)',
      yAxisID: 'y',
    },
    {
      label: 'Total Assets',
      data: analyticsData.data.map(d => d.totalAssets),
      type: 'bar',
      backgroundColor: 'rgba(251, 191, 36, 0.5)',
      yAxisID: 'y1',
    }
  ]
};
```

### Failure Trends Chart

Displays failure rates and counts:

```javascript
const chartData = {
  labels: analyticsData.data.map(d => formatPeriod(d.period, analyticsData.period)),
  datasets: [
    {
      label: 'Failure Rate (%)',
      data: analyticsData.data.map(d => d.failureRate),
      borderColor: 'rgb(239, 68, 68)',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      yAxisID: 'y',
    },
    {
      label: 'Failure Count',
      data: analyticsData.data.map(d => d.failureCount),
      type: 'bar',
      backgroundColor: 'rgba(249, 115, 22, 0.5)',
      yAxisID: 'y1',
    }
  ]
};
```

---

## Performance Considerations

### Optimization Strategy

This endpoint is optimized for **pre-computed time-series data**:

1. **Server-Side Aggregation**: Buckets calculated on server, not client
2. **Efficient Grouping**: Time buckets created in-memory after fetching renders
3. **Parallel Asset Counts**: Asset counts fetched in parallel using `Promise.all`
4. **Limited Data Transfer**: Only aggregated metrics sent, not full render objects

### Expected Performance

- **Response Time**:
  - Day period: < 2s (30 days, ~30 buckets)
  - Week period: < 3s (12 weeks, ~12 buckets)
  - Month period: < 3s (12 months, ~12 buckets)
- **Database Load**: Moderate - fetches renders and counts assets
- **Memory Usage**: Moderate - processes renders in memory for bucketing

### Performance Tips

1. **Cache Results**: Consider caching responses for 5-10 minutes since historical data doesn't change frequently
2. **Period Selection**: Monthly period is fastest (fewer buckets), daily is slowest (more buckets)
3. **Client-Side**: Pre-computed buckets mean minimal client-side processing needed

---

## Period Format Details

### Day Period
- **Format**: `"YYYY-MM-DD"` (e.g., `"2023-11-21"`)
- **Range**: Last 30 days
- **Use Case**: Daily trend analysis, short-term monitoring

### Week Period
- **Format**: `"YYYY-Www"` (e.g., `"2023-W47"`)
  - Uses ISO week numbering (week 1 = first week with Thursday)
  - `W` prefix indicates week
  - `ww` is zero-padded week number (01-53)
- **Range**: Last 12 weeks (~84 days)
- **Use Case**: Weekly patterns, medium-term trends

### Month Period
- **Format**: `"YYYY-MM"` (e.g., `"2023-11"`)
- **Range**: Last 12 months
- **Use Case**: Long-term trends, monthly comparisons

---

## Error Handling

The endpoint returns standard HTTP status codes:

- **200 OK**: Success
- **400 Bad Request**: Invalid period parameter
- **500 Internal Server Error**: Server error (check logs)

Error response format:

```json
{
  "error": {
    "status": 400,
    "message": "Invalid period parameter. Must be one of: day, week, month"
  }
}
```

---

## Tracking Metrics

### Render Volume
- **Definition**: Total successful renders over the selected period
- **Calculation**: Count of renders where `Complete: true` in each time bucket
- **Use Case**: Track system throughput and capacity

### Asset Density (Efficiency)
- **Definition**: Average assets produced per render
- **Calculation**: `(totalAssets / totalRenders)` per bucket
- **Use Case**: Measure render efficiency - identify periods with high/low asset production

### Failure Trends
- **Definition**: Spikes in failure rates over time
- **Calculation**: `(failureCount / totalRenders) * 100` per bucket
- **Use Case**: Identify problematic periods, track system stability improvements

---

## Technical Implementation

### Time Bucketing Logic

```javascript
// Day: Group by calendar day
bucketKey = date.toISOString().split("T")[0]; // "2023-11-21"

// Week: Group by ISO week
const week = getISOWeek(date);
bucketKey = `${year}-W${week}`; // "2023-W47"

// Month: Group by calendar month
bucketKey = `${year}-${month}`; // "2023-11"
```

### Asset Count Calculation

For each render, asset counts are fetched in parallel:

```javascript
const [downloadsCount, aiArticlesCount] = await Promise.all([
  strapi.db.query("api::download.download").count({
    where: { render: renderId }
  }),
  strapi.db.query("api::ai-article.ai-article").count({
    where: { render: renderId }
  })
]);

const totalAssets = downloadsCount + aiArticlesCount;
```

### Metric Calculations

```javascript
// Render Volume
renderVolume = successfulRenders.length;

// Asset Density
assetDensity = totalAssets / totalRenders;

// Failure Rate
failureRate = (failureCount / totalRenders) * 100;
```

---

## Files

- **Handler**: `src/api/render/controllers/analytics/index.js`
- **Controller**: `src/api/render/controllers/render.js` (getThroughputAnalytics method)
- **Route**: `src/api/render/routes/custom-render.js`

---

## Testing

Test the endpoint using:

```bash
# Daily analytics
curl http://localhost:1337/api/renders/analytics?period=day

# Weekly analytics
curl http://localhost:1337/api/renders/analytics?period=week

# Monthly analytics
curl http://localhost:1337/api/renders/analytics?period=month
```

---

## Integration Notes

This endpoint is designed specifically for the **System Throughput and Asset Mix charts** in the Admin Dashboard. It provides:

1. **Pre-computed Data**: Server-side aggregation reduces client processing
2. **Chart-Ready Format**: Data structured for direct chart library consumption
3. **Multiple Metrics**: Single endpoint provides data for multiple chart types
4. **Flexible Periods**: Switch between daily/weekly/monthly views

The endpoint avoids downloading large datasets to the client by pre-computing time buckets on the server, resulting in a much smoother user experience for chart rendering.
