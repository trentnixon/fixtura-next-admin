# Route D: Resource Leaders (The Leaderboards)

## Information
- **Endpoint**: `/api/renders/distribution`
- **Controller Function**: `getAccountLeaderboard`
- **Purpose**: Identify larger accounts and global asset type distribution.

## Response Structure
Returns the Top 10 Accounts (by volume) and the total global counts for each asset category (`video`, `image`, `content`).

## Technical Rationale
Helps administrators identify "Heavy Hitters"—accounts that consume the most system resources. It also provides a global view of the product mix (Asset Type Distribution).

## Insights
- **Account Value**: Which accounts are getting the most ROI from the system.
- **Resource Allocation**: Differentiating load between Clubs vs Associations.


#response

# Render Distribution API Documentation

This document describes the Resource Leaders endpoint for account leaderboards and global asset type distribution, helping administrators identify "Heavy Hitters" and understand the product mix.

---

## Overview

**Endpoint:** `GET /api/renders/distribution`

**Purpose:** Identify larger accounts (by render volume) and provide a global view of asset type distribution. This endpoint helps administrators understand resource allocation and account value.

**Technical Rationale:** Helps administrators identify accounts that consume the most system resources and provides insights into the product mix (Asset Type Distribution).

---

## Request

### Endpoint
```
GET /api/renders/distribution
```

### Query Parameters

None required. This endpoint returns current distribution data.

### Example Request

```bash
GET /api/renders/distribution
```

---

## Response Type

```typescript
type DistributionResponse = {
  topAccounts: Array<{
    accountId: number;
    accountName: string | null;
    accountType: string | null; // e.g., "Club", "Association"
    accountSport: string | null; // e.g., "Cricket", "AFL", "Basketball", etc.
    renderCount: number; // Total number of renders for this account
  }>;
  assetDistribution: {
    video: number;   // Total count of video assets
    image: number;   // Total count of image assets
    content: number; // Total count of content assets (including AI articles)
  };
};
```

---

## Example Response

```json
{
  "topAccounts": [
    {
      "accountId": 456,
      "accountName": "Bayside Cricket Club",
      "accountType": "Club",
      "accountSport": "Cricket",
      "renderCount": 1245
    },
    {
      "accountId": 457,
      "accountName": "Metro Basketball Association",
      "accountType": "Association",
      "accountSport": "Basketball",
      "renderCount": 892
    },
    {
      "accountId": 458,
      "accountName": "City Football Club",
      "accountType": "Club",
      "accountSport": "AFL",
      "renderCount": 756
    },
    {
      "accountId": 459,
      "accountName": "Regional Hockey League",
      "accountType": "Association",
      "accountSport": "Hockey",
      "renderCount": 634
    },
    {
      "accountId": 460,
      "accountName": "Premier Netball Club",
      "accountType": "Club",
      "accountSport": "Netball",
      "renderCount": 521
    },
    {
      "accountId": 461,
      "accountName": "State Cricket Association",
      "accountType": "Association",
      "accountSport": "Cricket",
      "renderCount": 487
    },
    {
      "accountId": 462,
      "accountName": "Local Basketball Club",
      "accountType": "Club",
      "accountSport": "Basketball",
      "renderCount": 423
    },
    {
      "accountId": 463,
      "accountName": "Regional AFL League",
      "accountType": "Association",
      "accountSport": "AFL",
      "renderCount": 398
    },
    {
      "accountId": 464,
      "accountName": "Elite Hockey Club",
      "accountType": "Club",
      "accountSport": "Hockey",
      "renderCount": 356
    },
    {
      "accountId": 465,
      "accountName": "Metro Netball Association",
      "accountType": "Association",
      "accountSport": "Netball",
      "renderCount": 312
    }
  ],
  "assetDistribution": {
    "video": 45230,
    "image": 67890,
    "content": 123450
  }
}
```

---

## Field Descriptions

### Top Accounts

The `topAccounts` array contains the top 10 accounts sorted by render volume (descending):

- **`accountId`**: Unique identifier for the account
- **`accountName`**: Account's first name (typically the organization name)
- **`accountType`**: Type of account (`"Club"` or `"Association"`)
- **`accountSport`**: Sport associated with the account
  - Possible values: `"Cricket"`, `"AFL"`, `"Hockey"`, `"Netball"`, `"Basketball"`
- **`renderCount`**: Total number of renders associated with this account (all-time)

**Note:** Accounts are sorted by `renderCount` in descending order. Only accounts with at least one render are included.

### Asset Distribution

The `assetDistribution` object provides global counts for each asset category:

- **`video`**: Total count of video assets across all downloads
  - Categorized by `asset_category.Name === "VIDEO"` or asset type name patterns (video, mp4, mov, avi, mpeg)

- **`image`**: Total count of image assets across all downloads
  - Categorized by `asset_category.Name === "IMAGE"` or asset type name patterns (image, jpg, jpeg, png, gif, webp, poster, thumbnail)

- **`content`**: Total count of content assets
  - Includes all downloads that don't match video/image patterns
  - **Plus** all AI articles (counted separately and added to content)

---

## Usage Examples

### Basic Fetch

```javascript
// Fetch distribution data
const response = await fetch('/api/renders/distribution');
const { topAccounts, assetDistribution } = await response.json();

console.log(`Top account: ${topAccounts[0].accountName} with ${topAccounts[0].renderCount} renders`);
console.log(`Asset distribution:`, assetDistribution);
```

### Account Leaderboard Display

```javascript
const response = await fetch('/api/renders/distribution');
const { topAccounts } = await response.json();

// Render leaderboard table
topAccounts.forEach((account, index) => {
  console.log(`${index + 1}. ${account.accountName} (${account.accountType}) - ${account.renderCount} renders`);
});
```

### Resource Allocation Analysis

```javascript
const response = await fetch('/api/renders/distribution');
const { topAccounts } = await response.json();

// Analyze resource allocation between Clubs and Associations
const clubs = topAccounts.filter(a => a.accountType === 'Club');
const associations = topAccounts.filter(a => a.accountType === 'Association');

const clubTotal = clubs.reduce((sum, a) => sum + a.renderCount, 0);
const associationTotal = associations.reduce((sum, a) => sum + a.renderCount, 0);

console.log(`Clubs: ${clubTotal} renders (${clubs.length} accounts)`);
console.log(`Associations: ${associationTotal} renders (${associations.length} accounts)`);
console.log(`Club average: ${(clubTotal / clubs.length).toFixed(1)} renders per account`);
console.log(`Association average: ${(associationTotal / associations.length).toFixed(1)} renders per account`);
```

### Asset Mix Visualization

```javascript
const response = await fetch('/api/renders/distribution');
const { assetDistribution } = await response.json();

// Calculate percentages
const total = assetDistribution.video + assetDistribution.image + assetDistribution.content;
const videoPercent = (assetDistribution.video / total * 100).toFixed(1);
const imagePercent = (assetDistribution.image / total * 100).toFixed(1);
const contentPercent = (assetDistribution.content / total * 100).toFixed(1);

console.log(`Asset Mix:`);
console.log(`  Video: ${assetDistribution.video} (${videoPercent}%)`);
console.log(`  Image: ${assetDistribution.image} (${imagePercent}%)`);
console.log(`  Content: ${assetDistribution.content} (${contentPercent}%)`);

// Prepare data for pie chart
const chartData = {
  labels: ['Video', 'Image', 'Content'],
  datasets: [{
    data: [
      assetDistribution.video,
      assetDistribution.image,
      assetDistribution.content
    ],
    backgroundColor: [
      'rgb(239, 68, 68)',   // Red for video
      'rgb(59, 130, 246)',   // Blue for image
      'rgb(34, 197, 94)'      // Green for content
    ]
  }]
};

renderAssetMixChart(chartData);
```

### Heavy Hitters Identification

```javascript
const response = await fetch('/api/renders/distribution');
const { topAccounts } = await response.json();

// Identify "Heavy Hitters" - accounts consuming most resources
const heavyHitters = topAccounts.filter(account => account.renderCount > 500);

console.log(`Heavy Hitters (${heavyHitters.length} accounts with >500 renders):`);
heavyHitters.forEach(account => {
  console.log(`  ${account.accountName}: ${account.renderCount} renders`);
});
```

### Sport-Specific Analysis

```javascript
const response = await fetch('/api/renders/distribution');
const { topAccounts } = await response.json();

// Group by sport
const bySport = topAccounts.reduce((acc, account) => {
  const sport = account.accountSport || 'Unknown';
  if (!acc[sport]) {
    acc[sport] = { count: 0, totalRenders: 0, accounts: [] };
  }
  acc[sport].count++;
  acc[sport].totalRenders += account.renderCount;
  acc[sport].accounts.push(account);
  return acc;
}, {});

console.log('Top accounts by sport:');
Object.entries(bySport).forEach(([sport, data]) => {
  console.log(`${sport}: ${data.count} accounts, ${data.totalRenders} total renders`);
});
```

### Account Value Analysis

```javascript
const response = await fetch('/api/renders/distribution');
const { topAccounts } = await response.json();

// Calculate account value (ROI indicator)
// Higher render count = more value from the system
topAccounts.forEach((account, index) => {
  const rank = index + 1;
  const valueTier = account.renderCount > 1000 ? 'High' :
                   account.renderCount > 500 ? 'Medium' : 'Low';

  console.log(`#${rank} ${account.accountName} - ${valueTier} Value (${account.renderCount} renders)`);
});
```

---

## Insights

### Account Value

The `topAccounts` list helps identify which accounts are getting the most ROI from the system:

- **High-Value Accounts**: Top accounts by render volume represent the most active users
- **Resource Consumption**: Higher render counts indicate higher system resource usage
- **Account Segmentation**: Distinguish between high-volume and low-volume accounts

### Resource Allocation

Differentiate load between Clubs vs Associations:

- **Club vs Association**: Compare render volumes between account types
- **Sport Distribution**: Understand which sports generate the most renders
- **Load Balancing**: Identify if certain account types or sports require more resources

### Product Mix

The `assetDistribution` provides insights into the global product mix:

- **Video vs Image vs Content**: Understand the balance of asset types produced
- **Content Dominance**: High content counts may indicate AI article generation is a major feature
- **Asset Strategy**: Use distribution data to inform asset generation strategies

---

## Technical Implementation

### Top Accounts Calculation

```javascript
// Fetch all renders with account relationship
renders = await strapi.db.query("api::render.render").findMany({
  populate: {
    scheduler: {
      populate: {
        account: {
          populate: { account_type: true }
        }
      }
    }
  }
});

// Group by account and count
accountVolumeMap = new Map();
renders.forEach(render => {
  const accountId = render.scheduler?.account?.id;
  if (accountId) {
    accountVolumeMap.get(accountId).renderCount++;
  }
});

// Sort by renderCount descending, take top 10
topAccounts = Array.from(accountVolumeMap.values())
  .sort((a, b) => b.renderCount - a.renderCount)
  .slice(0, 10);
```

### Asset Type Categorization

```javascript
// Fetch all downloads with asset_type and asset_category
downloads = await strapi.db.query("api::download.download").findMany({
  populate: {
    asset_type: true,
    asset_category: true
  }
});

// Categorize each download
downloads.forEach(download => {
  const category = download.asset_category?.Name?.toUpperCase();
  const typeName = download.asset_type?.Name?.toLowerCase();

  if (category === "VIDEO" || isVideoType(typeName)) {
    distribution.video++;
  } else if (category === "IMAGE" || isImageType(typeName)) {
    distribution.image++;
  } else {
    distribution.content++;
  }
});

// Add AI articles to content
aiArticlesCount = await strapi.db.query("api::ai-article.ai-article").count();
distribution.content += aiArticlesCount;
```

### Asset Type Detection

The handler uses pattern matching to categorize assets:

**Video Detection:**
- Asset category name: `"VIDEO"`
- Asset type name contains: `"video"`, `"mp4"`, `"mov"`, `"avi"`, `"mpeg"`

**Image Detection:**
- Asset category name: `"IMAGE"`
- Asset type name contains: `"image"`, `"jpg"`, `"jpeg"`, `"png"`, `"gif"`, `"webp"`, `"poster"`, `"thumbnail"`

**Content (Default):**
- Everything else (including all AI articles)

---

## Performance Considerations

### Optimization Strategy

This endpoint processes all renders and downloads, which can be resource-intensive:

1. **Single Query**: Fetches all renders with account relationships in one query
2. **In-Memory Aggregation**: Groups and counts in memory rather than multiple database queries
3. **Parallel Processing**: Asset distribution and top accounts calculated in parallel

### Expected Performance

- **Response Time**: 2-5 seconds (depends on total render/download count)
- **Database Load**: Moderate - fetches all renders and downloads
- **Memory Usage**: Moderate - processes data in memory

### Performance Tips

1. **Caching**: Consider caching results for 5-10 minutes since this is aggregate data
2. **Pagination**: If needed in future, could add pagination for top accounts beyond top 10
3. **Indexing**: Ensure `scheduler.account` relationship is indexed for faster queries

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
    "message": "Failed to fetch account leaderboard. Please try again later."
  }
}
```

---

## UI Integration

### Leaderboard Component

```javascript
function Leaderboard({ topAccounts }) {
  return (
    <div className="leaderboard">
      <h2>Top 10 Accounts by Render Volume</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Account</th>
            <th>Type</th>
            <th>Sport</th>
            <th>Render Count</th>
          </tr>
        </thead>
        <tbody>
          {topAccounts.map((account, index) => (
            <tr key={account.accountId}>
              <td>{index + 1}</td>
              <td>{account.accountName}</td>
              <td>{account.accountType}</td>
              <td>{account.accountSport}</td>
              <td>{account.renderCount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Asset Distribution Chart

```javascript
function AssetDistributionChart({ assetDistribution }) {
  const total = assetDistribution.video + assetDistribution.image + assetDistribution.content;

  return (
    <div className="asset-distribution">
      <h2>Global Asset Type Distribution</h2>
      <div className="stats-grid">
        <StatCard
          title="Video"
          value={assetDistribution.video.toLocaleString()}
          percentage={((assetDistribution.video / total) * 100).toFixed(1)}
          color="red"
        />
        <StatCard
          title="Image"
          value={assetDistribution.image.toLocaleString()}
          percentage={((assetDistribution.image / total) * 100).toFixed(1)}
          color="blue"
        />
        <StatCard
          title="Content"
          value={assetDistribution.content.toLocaleString()}
          percentage={((assetDistribution.content / total) * 100).toFixed(1)}
          color="green"
        />
      </div>
    </div>
  );
}
```

---

## Files

- **Handler**: `src/api/render/controllers/distribution/index.js`
- **Controller**: `src/api/render/controllers/render.js` (getAccountLeaderboard method)
- **Route**: `src/api/render/routes/custom-render.js`

---

## Testing

Test the endpoint using:

```bash
# Get distribution data
curl http://localhost:1337/api/renders/distribution
```

---

## Integration Notes

This endpoint is designed for the **Resource Leaders (Leaderboards)** component in the Admin Dashboard. It provides:

1. **Heavy Hitters Identification**: Top accounts consuming most resources
2. **Account Value Insights**: Which accounts get the most ROI
3. **Resource Allocation**: Understanding load distribution (Clubs vs Associations)
4. **Product Mix**: Global view of asset type distribution

The endpoint helps administrators:
- Identify accounts that need attention or optimization
- Understand resource consumption patterns
- Make data-driven decisions about account management
- Monitor the balance of asset types being produced
