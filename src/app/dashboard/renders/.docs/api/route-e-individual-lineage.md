# Route E: Individual Lineage (Deep Audit)

## Information
- **Endpoint**: `/api/renders/lineage/:id`
- **Controller Function**: `getRenderDNA`
- **Purpose**: Full "DNA" audit of a single render.

## Request Configuration
- **Query Strategy**: Complete relational expansion.
- **Population**:
  - `scheduler` -> `account`
  - `downloads` (complete attributes)
  - `ai_articles` (complete attributes)
  - `game_results_in_renders`
  - `upcoming_games_in_renders`
  - `grades_in_renders` (populating `grade` and `team`)

## Custom Logic: Data Integrity Check
- **Parameter**: `?checkIntegrity=true`
- **Function**: Compares the expected fixtures from the scheduler against the actual objects written to the render's relations.

## Technical Rationale
This is a high-cost request reserved for deep technical troubleshooting. It allows an admin to see exactly what went into a render to resolve data disputes (e.g., "Why did my game miss its video?").


# Response
# Render Lineage API Documentation

This document describes the Individual Lineage (Deep Audit) endpoint for complete render "DNA" inspection, enabling administrators to troubleshoot data disputes and verify render integrity.

---

## Overview

**Endpoint:** `GET /api/renders/lineage/:id`

**Purpose:** Provides a complete "DNA" audit of a single render with full relational expansion. This is a high-cost request reserved for deep technical troubleshooting, allowing administrators to see exactly what went into a render to resolve data disputes (e.g., "Why did my game miss its video?").

**Technical Rationale:** Complete relational expansion provides full visibility into render composition, enabling precise troubleshooting of data integrity issues and missing content.

---

## Request

### Endpoint
```
GET /api/renders/lineage/:id
```

### Path Parameters

- **`id`** (required): The render ID to fetch lineage for

### Query Parameters

- **`checkIntegrity`** (optional): Set to `"true"` to perform data integrity check
  - Compares expected fixtures from scheduler against actual objects in render
  - Identifies missing fixtures, unexpected fixtures, and data inconsistencies
  - Analyzes asset distribution and flags warnings/errors

### Example Requests

```bash
# Basic lineage request
GET /api/renders/lineage/123

# With integrity check
GET /api/renders/lineage/123?checkIntegrity=true
```

---

## Response Type

```typescript
type LineageResponse = {
  render: {
    id: number;
    name: string | null;
    processing: boolean;
    complete: boolean;
    emailSent: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
  scheduler: {
    id: number;
    name: string;
    time: string;
    isRendering: boolean;
    queued: boolean;
    daysOfTheWeek: {
      id: number;
      name: string;
    } | null;
    account: {
      id: number;
      firstName: string | null;
      lastName: string | null;
      sport: string | null;
      accountType: {
        id: number;
        name: string;
      } | null;
      clubs: Array<{
        id: number;
        name: string;
      }>;
      associations: Array<{
        id: number;
        name: string;
      }>;
    } | null;
  } | null;
  downloads: Array<{
    id: number;
    name: string | null;
    assetType: {
      id: number;
      name: string;
    } | null;
    assetCategory: {
      id: number;
      name: string;
    } | null;
    grade: {
      id: number;
      gradeName: string;
    } | null;
    createdAt: string;
    updatedAt: string;
  }>;
  aiArticles: Array<{
    id: number;
    title: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
  gameResults: Array<{
    id: number;
    gameMetaDatum: {
      id: number;
      grade: {
        id: number;
        gradeName: string;
        competition: {
          id: number;
          name: string;
        } | null;
      } | null;
      teams: Array<{
        id: number;
        name: string;
        club: {
          id: number;
          name: string;
        } | null;
      }>;
    } | null;
    gameDataAfl: any | null;
    gameDataBasketball: any | null;
    gameDataHockey: any | null;
    gameDataNetball: any | null;
  }>;
  upcomingGames: Array<{
    id: number;
    gameMetaDatum: {
      id: number;
      grade: {
        id: number;
        gradeName: string;
        competition: {
          id: number;
          name: string;
        } | null;
      } | null;
      teams: Array<{
        id: number;
        name: string;
        club: {
          id: number;
          name: string;
        } | null;
      }>;
    } | null;
    gameDataAfl: any | null;
    gameDataBasketball: any | null;
    gameDataHockey: any | null;
    gameDataNetball: any | null;
  }>;
  grades: Array<{
    id: number;
    grade: {
      id: number;
      gradeName: string;
      ageGroup: string | null;
      competition: {
        id: number;
        name: string;
      } | null;
      teams: Array<{
        id: number;
        name: string;
      }>;
    } | null;
    team: {
      id: number;
      name: string;
    } | null;
  }>;
  integrityCheck?: {
    timestamp: string;
    summary: {
      totalGrades: number;
      totalGameResults: number;
      totalUpcomingGames: number;
      totalDownloads: number;
      totalAiArticles: number;
      totalFixtures: number;
      missingFixtureCount: number;
      warningCount: number;
      errorCount: number;
    };
    gradeAnalysis: Array<{
      gradeId: number;
      gradeName: string;
      ageGroup: string | null;
      competition: string | null;
    }>;
    fixtureAnalysis: {
      expectedGrades: Array<{
        gradeId: number;
        gradeName: string;
      }>;
      actualGameResults: Array<{
        gameMetaDatumId: number;
        gradeId: number | null;
        gradeName: string | null;
      }>;
      actualUpcomingGames: Array<{
        gameMetaDatumId: number;
        gradeId: number | null;
        gradeName: string | null;
      }>;
      missingFixtures: Array<{
        gradeId: number;
        gradeName: string;
        reason: string;
      }>;
      unexpectedFixtures: Array<any>;
    };
    assetAnalysis: {
      downloadsByType: Record<string, number>;
      downloadsByCategory: Record<string, number>;
      totalAssets: number;
    };
    warnings: string[];
    errors: string[];
  };
};
```

---

## Example Response

### Basic Lineage (without integrity check)

```json
{
  "render": {
    "id": 123,
    "name": "Weekly Render - 2025-01-15",
    "processing": false,
    "complete": true,
    "emailSent": true,
    "createdAt": "2025-01-15T08:00:00.000Z",
    "updatedAt": "2025-01-15T09:30:00.000Z",
    "publishedAt": "2025-01-15T08:00:00.000Z"
  },
  "scheduler": {
    "id": 45,
    "name": "Bayside Cricket Club - Weekly",
    "time": "08:00:00",
    "isRendering": false,
    "queued": false,
    "daysOfTheWeek": {
      "id": 1,
      "name": "Monday"
    },
    "account": {
      "id": 456,
      "firstName": "Bayside Cricket Club",
      "lastName": null,
      "sport": "Cricket",
      "accountType": {
        "id": 1,
        "name": "Club"
      },
      "clubs": [
        {
          "id": 789,
          "name": "Bayside Cricket Club"
        }
      ],
      "associations": []
    }
  },
  "downloads": [
    {
      "id": 1001,
      "name": "Match Highlights - Round 5",
      "assetType": {
        "id": 10,
        "name": "Video"
      },
      "assetCategory": {
        "id": 5,
        "name": "VIDEO"
      },
      "grade": {
        "id": 25,
        "gradeName": "First Grade"
      },
      "createdAt": "2025-01-15T08:15:00.000Z",
      "updatedAt": "2025-01-15T08:15:00.000Z"
    },
    {
      "id": 1002,
      "name": "Team Photo - Round 5",
      "assetType": {
        "id": 11,
        "name": "Image"
      },
      "assetCategory": {
        "id": 6,
        "name": "IMAGE"
      },
      "grade": {
        "id": 25,
        "gradeName": "First Grade"
      },
      "createdAt": "2025-01-15T08:16:00.000Z",
      "updatedAt": "2025-01-15T08:16:00.000Z"
    }
  ],
  "aiArticles": [
    {
      "id": 201,
      "title": "Match Report: Bayside vs Riverside",
      "createdAt": "2025-01-15T08:20:00.000Z",
      "updatedAt": "2025-01-15T08:20:00.000Z"
    }
  ],
  "gameResults": [
    {
      "id": 301,
      "gameMetaDatum": {
        "id": 501,
        "grade": {
          "id": 25,
          "gradeName": "First Grade",
          "competition": {
            "id": 12,
            "name": "Metro Cricket League"
          }
        },
        "teams": [
          {
            "id": 101,
            "name": "Bayside CC",
            "club": {
              "id": 789,
              "name": "Bayside Cricket Club"
            }
          },
          {
            "id": 102,
            "name": "Riverside CC",
            "club": {
              "id": 790,
              "name": "Riverside Cricket Club"
            }
          }
        ]
      },
      "gameDataAfl": null,
      "gameDataBasketball": null,
      "gameDataHockey": null,
      "gameDataNetball": null
    }
  ],
  "upcomingGames": [
    {
      "id": 401,
      "gameMetaDatum": {
        "id": 502,
        "grade": {
          "id": 25,
          "gradeName": "First Grade",
          "competition": {
            "id": 12,
            "name": "Metro Cricket League"
          }
        },
        "teams": [
          {
            "id": 101,
            "name": "Bayside CC",
            "club": {
              "id": 789,
              "name": "Bayside Cricket Club"
            }
          },
          {
            "id": 103,
            "name": "Central CC",
            "club": {
              "id": 791,
              "name": "Central Cricket Club"
            }
          }
        ]
      },
      "gameDataAfl": null,
      "gameDataBasketball": null,
      "gameDataHockey": null,
      "gameDataNetball": null
    }
  ],
  "grades": [
    {
      "id": 601,
      "grade": {
        "id": 25,
        "gradeName": "First Grade",
        "ageGroup": "Senior",
        "competition": {
          "id": 12,
          "name": "Metro Cricket League"
        },
        "teams": [
          {
            "id": 101,
            "name": "Bayside CC"
          }
        ]
      },
      "team": {
        "id": 101,
        "name": "Bayside CC"
      }
    }
  ]
}
```

### With Integrity Check

```json
{
  "render": { /* ... same as above ... */ },
  "scheduler": { /* ... same as above ... */ },
  "downloads": [ /* ... same as above ... */ ],
  "aiArticles": [ /* ... same as above ... */ ],
  "gameResults": [ /* ... same as above ... */ ],
  "upcomingGames": [ /* ... same as above ... */ ],
  "grades": [ /* ... same as above ... */ ],
  "integrityCheck": {
    "timestamp": "2025-01-15T10:00:00.000Z",
    "summary": {
      "totalGrades": 1,
      "totalGameResults": 1,
      "totalUpcomingGames": 1,
      "totalDownloads": 2,
      "totalAiArticles": 1,
      "totalFixtures": 2,
      "missingFixtureCount": 0,
      "warningCount": 0,
      "errorCount": 0
    },
    "gradeAnalysis": [
      {
        "gradeId": 25,
        "gradeName": "First Grade",
        "ageGroup": "Senior",
        "competition": "Metro Cricket League"
      }
    ],
    "fixtureAnalysis": {
      "expectedGrades": [
        {
          "gradeId": 25,
          "gradeName": "First Grade"
        }
      ],
      "actualGameResults": [
        {
          "gameMetaDatumId": 501,
          "gradeId": 25,
          "gradeName": "First Grade"
        }
      ],
      "actualUpcomingGames": [
        {
          "gameMetaDatumId": 502,
          "gradeId": 25,
          "gradeName": "First Grade"
        }
      ],
      "missingFixtures": [],
      "unexpectedFixtures": []
    },
    "assetAnalysis": {
      "downloadsByType": {
        "Video": 1,
        "Image": 1
      },
      "downloadsByCategory": {
        "VIDEO": 1,
        "IMAGE": 1
      },
      "totalAssets": 3
    },
    "warnings": [],
    "errors": []
  }
}
```

### Integrity Check with Issues

```json
{
  "integrityCheck": {
    "timestamp": "2025-01-15T10:00:00.000Z",
    "summary": {
      "totalGrades": 3,
      "totalGameResults": 1,
      "totalUpcomingGames": 0,
      "totalDownloads": 0,
      "totalAiArticles": 0,
      "totalFixtures": 1,
      "missingFixtureCount": 2,
      "warningCount": 2,
      "errorCount": 1
    },
    "gradeAnalysis": [
      {
        "gradeId": 25,
        "gradeName": "First Grade",
        "ageGroup": "Senior",
        "competition": "Metro Cricket League"
      },
      {
        "gradeId": 26,
        "gradeName": "Second Grade",
        "ageGroup": "Senior",
        "competition": "Metro Cricket League"
      },
      {
        "gradeId": 27,
        "gradeName": "Third Grade",
        "ageGroup": "Senior",
        "competition": "Metro Cricket League"
      }
    ],
    "fixtureAnalysis": {
      "expectedGrades": [
        { "gradeId": 25, "gradeName": "First Grade" },
        { "gradeId": 26, "gradeName": "Second Grade" },
        { "gradeId": 27, "gradeName": "Third Grade" }
      ],
      "actualGameResults": [
        {
          "gameMetaDatumId": 501,
          "gradeId": 25,
          "gradeName": "First Grade"
        }
      ],
      "actualUpcomingGames": [],
      "missingFixtures": [
        {
          "gradeId": 26,
          "gradeName": "Second Grade",
          "reason": "No game results or upcoming games found for this grade"
        },
        {
          "gradeId": 27,
          "gradeName": "Third Grade",
          "reason": "No game results or upcoming games found for this grade"
        }
      ],
      "unexpectedFixtures": []
    },
    "assetAnalysis": {
      "downloadsByType": {},
      "downloadsByCategory": {},
      "totalAssets": 0
    },
    "warnings": [
      "Grade \"Second Grade\" has no associated fixtures",
      "Grade \"Third Grade\" has no associated fixtures"
    ],
    "errors": [
      "Render marked as complete but has no assets (Ghost Render)"
    ]
  }
}
```

---

## Field Descriptions

### Render Object

- **`id`**: Unique render identifier
- **`name`**: Render name/title
- **`processing`**: Whether render is currently processing
- **`complete`**: Whether render is marked as complete
- **`emailSent`**: Whether notification email was sent
- **`createdAt`**: Render creation timestamp
- **`updatedAt`**: Last update timestamp
- **`publishedAt`**: Publication timestamp

### Scheduler Object

- **`id`**: Scheduler identifier
- **`name`**: Scheduler name
- **`time`**: Scheduled time (HH:mm:ss format)
- **`isRendering`**: Whether scheduler is currently rendering
- **`queued`**: Whether scheduler is queued
- **`daysOfTheWeek`**: Day of week configuration
- **`account`**: Complete account details including:
  - Account type (Club/Association)
  - Associated clubs and associations
  - Sport type

### Downloads Array

Each download includes:
- **`id`**: Download identifier
- **`name`**: Asset name
- **`assetType`**: Type of asset (Video, Image, etc.)
- **`assetCategory`**: Category classification (VIDEO, IMAGE, etc.)
- **`grade`**: Associated grade (if any)
- **`createdAt`** / **`updatedAt`**: Timestamps

### AI Articles Array

Each article includes:
- **`id`**: Article identifier
- **`title`**: Article title
- **`createdAt`** / **`updatedAt`**: Timestamps

### Game Results Array

Each result includes:
- **`id`**: Result identifier
- **`gameMetaDatum`**: Complete game metadata including:
  - Grade information
  - Competition details
  - Team information with club associations
- **`gameDataAfl`** / **`gameDataBasketball`** / **`gameDataHockey`** / **`gameDataNetball`**: Sport-specific game data (null if not applicable)

### Upcoming Games Array

Same structure as game results, but for future fixtures.

### Grades Array

Each grade entry includes:
- **`id`**: Grade-in-render identifier
- **`grade`**: Complete grade information including:
  - Grade name, age group
  - Competition details
  - Associated teams
- **`team`**: Specific team filter (if any)

### Integrity Check Object

When `checkIntegrity=true`, includes:

- **`timestamp`**: When integrity check was performed
- **`summary`**: High-level statistics
- **`gradeAnalysis`**: Breakdown of all grades in render
- **`fixtureAnalysis`**: Comparison of expected vs actual fixtures
  - **`expectedGrades`**: Grades that should have fixtures
  - **`actualGameResults`**: Game results actually present
  - **`actualUpcomingGames`**: Upcoming games actually present
  - **`missingFixtures`**: Grades with no associated fixtures
  - **`unexpectedFixtures`**: Fixtures not matching expected grades
- **`assetAnalysis`**: Asset distribution analysis
  - **`downloadsByType`**: Count by asset type
  - **`downloadsByCategory`**: Count by asset category
  - **`totalAssets`**: Total asset count (downloads + AI articles)
- **`warnings`**: Array of warning messages
- **`errors`**: Array of error messages

---

## Usage Examples

### Basic Lineage Fetch

```javascript
// Fetch complete render lineage
const response = await fetch('/api/renders/lineage/123');
const lineage = await response.json();

console.log(`Render: ${lineage.render.name}`);
console.log(`Account: ${lineage.scheduler?.account?.firstName}`);
console.log(`Downloads: ${lineage.downloads.length}`);
console.log(`Game Results: ${lineage.gameResults.length}`);
console.log(`Upcoming Games: ${lineage.upcomingGames.length}`);
```

### With Integrity Check

```javascript
// Fetch lineage with integrity check
const response = await fetch('/api/renders/lineage/123?checkIntegrity=true');
const lineage = await response.json();

if (lineage.integrityCheck) {
  const { summary, warnings, errors } = lineage.integrityCheck;

  console.log('Integrity Summary:');
  console.log(`  Total Grades: ${summary.totalGrades}`);
  console.log(`  Total Fixtures: ${summary.totalFixtures}`);
  console.log(`  Missing Fixtures: ${summary.missingFixtureCount}`);
  console.log(`  Warnings: ${summary.warningCount}`);
  console.log(`  Errors: ${summary.errorCount}`);

  if (warnings.length > 0) {
    console.warn('Warnings:', warnings);
  }

  if (errors.length > 0) {
    console.error('Errors:', errors);
  }
}
```

### Troubleshooting Missing Content

```javascript
const response = await fetch('/api/renders/lineage/123?checkIntegrity=true');
const lineage = await response.json();

// Check for missing fixtures
if (lineage.integrityCheck?.fixtureAnalysis.missingFixtures.length > 0) {
  console.log('Missing Fixtures:');
  lineage.integrityCheck.fixtureAnalysis.missingFixtures.forEach(fixture => {
    console.log(`  - ${fixture.gradeName} (ID: ${fixture.gradeId})`);
    console.log(`    Reason: ${fixture.reason}`);
  });
}

// Check for ghost renders
if (lineage.render.complete && lineage.downloads.length === 0 && lineage.aiArticles.length === 0) {
  console.error('Ghost Render detected: Marked complete but has no assets');
}
```

### Asset Distribution Analysis

```javascript
const response = await fetch('/api/renders/lineage/123?checkIntegrity=true');
const lineage = await response.json();

if (lineage.integrityCheck?.assetAnalysis) {
  const { downloadsByType, downloadsByCategory, totalAssets } =
    lineage.integrityCheck.assetAnalysis;

  console.log('Asset Distribution:');
  console.log(`  Total Assets: ${totalAssets}`);
  console.log('  By Type:', downloadsByType);
  console.log('  By Category:', downloadsByCategory);

  // Calculate percentages
  Object.entries(downloadsByType).forEach(([type, count]) => {
    const percentage = ((count / totalAssets) * 100).toFixed(1);
    console.log(`    ${type}: ${count} (${percentage}%)`);
  });
}
```

### Grade Coverage Analysis

```javascript
const response = await fetch('/api/renders/lineage/123?checkIntegrity=true');
const lineage = await response.json();

if (lineage.integrityCheck) {
  const { gradeAnalysis, fixtureAnalysis } = lineage.integrityCheck;

  console.log('Grade Coverage:');
  gradeAnalysis.forEach(grade => {
    const hasResult = fixtureAnalysis.actualGameResults.some(
      r => r.gradeId === grade.gradeId
    );
    const hasUpcoming = fixtureAnalysis.actualUpcomingGames.some(
      u => u.gradeId === grade.gradeId
    );

    const status = hasResult || hasUpcoming ? '✓' : '✗';
    console.log(`  ${status} ${grade.gradeName} (${grade.competition})`);
  });
}
```

### Data Dispute Resolution

```javascript
// User reports: "Why did my game miss its video?"
const renderId = 123;
const response = await fetch(`/api/renders/lineage/${renderId}?checkIntegrity=true`);
const lineage = await response.json();

// Check if game result exists
const gameResult = lineage.gameResults.find(
  gr => gr.gameMetaDatum?.id === expectedGameMetaDatumId
);

if (!gameResult) {
  console.log('Game result not found in render');
  console.log('Expected grades:', lineage.grades.map(g => g.grade.gradeName));
} else {
  // Check if download exists for this game
  const relatedDownload = lineage.downloads.find(
    d => d.grade?.id === gameResult.gameMetaDatum?.grade?.id
  );

  if (!relatedDownload) {
    console.log('Game result exists but no download found');
    console.log('Available downloads:',
      lineage.downloads.map(d => ({
        name: d.name,
        type: d.assetType?.name,
        grade: d.grade?.gradeName
      }))
    );
  } else {
    console.log('Download found:', relatedDownload);
  }
}
```

### Render Status Validation

```javascript
const response = await fetch('/api/renders/lineage/123?checkIntegrity=true');
const lineage = await response.json();

// Validate render state consistency
const issues = [];

if (lineage.render.processing && lineage.render.complete) {
  issues.push('Render is both Processing and Complete (inconsistent state)');
}

if (lineage.render.complete && lineage.downloads.length === 0 &&
    lineage.aiArticles.length === 0) {
  issues.push('Ghost Render: Complete but no assets');
}

if (lineage.render.emailSent && !lineage.render.complete) {
  issues.push('Email sent but render not complete');
}

if (issues.length > 0) {
  console.warn('Render State Issues:', issues);
} else {
  console.log('Render state is consistent');
}
```

---

## Integrity Check Details

### What It Checks

1. **Grade Coverage**: Verifies that all grades in `grades_in_renders` have associated fixtures
2. **Fixture Presence**: Compares expected grades against actual game results and upcoming games
3. **Asset Distribution**: Analyzes downloads by type and category
4. **State Consistency**: Flags inconsistent render states (e.g., Processing + Complete)
5. **Ghost Render Detection**: Identifies renders marked complete but with no assets

### Missing Fixtures Detection

The integrity check identifies grades that should have fixtures but don't:

- **Expected Grades**: All grades from `grades_in_renders`
- **Actual Fixtures**: All game results and upcoming games
- **Missing**: Grades with no matching fixtures in either category

### Warning Types

- **Missing Fixtures**: Grade has no associated game results or upcoming games
- **State Inconsistency**: Render has conflicting status flags
- **Empty Grades**: Grade exists but has no teams or competition data

### Error Types

- **Ghost Render**: Render marked complete but has zero assets
- **Integrity Check Failure**: Error during integrity check execution

---

## Technical Implementation

### Relational Expansion

The endpoint performs complete relational expansion:

```javascript
populate: {
  scheduler: {
    populate: {
      account: {
        populate: {
          account_type: true,
          clubs: true,
          associations: true,
        },
      },
      days_of_the_week: true,
    },
  },
  downloads: {
    populate: {
      asset_type: true,
      asset_category: true,
      grade: true,
    },
  },
  game_results_in_renders: {
    populate: {
      game_meta_datum: {
        populate: {
          grade: { populate: { competition: true, teams: true } },
          teams: { populate: { club: true } },
        },
      },
      game_data_afl: true,
      game_data_basketball: true,
      game_data_hockey: true,
      game_data_netball: true,
    },
  },
  // ... similar for upcoming_games_in_renders and grades_in_renders
}
```

### Integrity Check Algorithm

1. **Extract Grades**: Collect all grades from `grades_in_renders`
2. **Extract Fixtures**: Collect all game results and upcoming games
3. **Match Grades to Fixtures**: For each grade, check if fixtures exist
4. **Identify Missing**: Grades with no matching fixtures
5. **Analyze Assets**: Group downloads by type and category
6. **Validate State**: Check for inconsistent render states
7. **Generate Report**: Compile warnings, errors, and statistics

---

## Performance Considerations

### High-Cost Request

This endpoint is **high-cost** due to:

1. **Complete Relational Expansion**: Fetches all related entities
2. **Deep Nesting**: Multiple levels of population
3. **Large Data Volume**: Can return substantial amounts of data

### Expected Performance

- **Response Time**: 3-10 seconds (depends on render complexity)
- **Database Load**: High - multiple queries with deep population
- **Memory Usage**: High - processes large object graph in memory
- **Payload Size**: Can be 100KB-1MB+ depending on render content

### Optimization Tips

1. **Use Sparingly**: Only call for troubleshooting, not routine monitoring
2. **Cache Results**: Consider caching integrity check results
3. **Pagination**: If needed in future, could paginate large arrays
4. **Selective Population**: Could add query params to control population depth

### When to Use

- ✅ **Troubleshooting**: Investigating data disputes or missing content
- ✅ **Debugging**: Understanding why a render failed or is incomplete
- ✅ **Audit**: Deep inspection of render composition
- ❌ **Routine Monitoring**: Use audit/telemetry endpoints instead
- ❌ **Bulk Operations**: Not suitable for processing multiple renders

---

## Error Handling

The endpoint returns standard HTTP status codes:

- **200 OK**: Success
- **400 Bad Request**: Invalid render ID or missing required parameter
- **404 Not Found**: Render not found
- **500 Internal Server Error**: Server error (check logs)

### Error Response Format

```json
{
  "error": {
    "status": 404,
    "message": "Render not found"
  }
}
```

### Common Errors

- **"Render ID is required"**: Missing `:id` parameter
- **"Render not found"**: Invalid render ID
- **"Failed to fetch render lineage: ..."**: Database or population error

---

## UI Integration

### Render Detail View

```javascript
function RenderLineageView({ renderId }) {
  const [lineage, setLineage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [withIntegrity, setWithIntegrity] = useState(false);

  useEffect(() => {
    const fetchLineage = async () => {
      setLoading(true);
      const url = `/api/renders/lineage/${renderId}${withIntegrity ? '?checkIntegrity=true' : ''}`;
      const response = await fetch(url);
      const data = await response.json();
      setLineage(data);
      setLoading(false);
    };

    fetchLineage();
  }, [renderId, withIntegrity]);

  if (loading) return <LoadingSpinner />;
  if (!lineage) return <ErrorMessage />;

  return (
    <div className="render-lineage">
      <h2>Render Lineage: {lineage.render.name}</h2>

      <label>
        <input
          type="checkbox"
          checked={withIntegrity}
          onChange={(e) => setWithIntegrity(e.target.checked)}
        />
        Include Integrity Check
      </label>

      <RenderDetails render={lineage.render} />
      <SchedulerDetails scheduler={lineage.scheduler} />
      <DownloadsList downloads={lineage.downloads} />
      <GameResultsList results={lineage.gameResults} />
      <UpcomingGamesList games={lineage.upcomingGames} />
      <GradesList grades={lineage.grades} />

      {lineage.integrityCheck && (
        <IntegrityCheckPanel check={lineage.integrityCheck} />
      )}
    </div>
  );
}
```

### Integrity Check Panel

```javascript
function IntegrityCheckPanel({ check }) {
  return (
    <div className="integrity-check">
      <h3>Integrity Check</h3>

      <SummaryStats summary={check.summary} />

      {check.warnings.length > 0 && (
        <Alert type="warning">
          <h4>Warnings ({check.warnings.length})</h4>
          <ul>
            {check.warnings.map((warning, i) => (
              <li key={i}>{warning}</li>
            ))}
          </ul>
        </Alert>
      )}

      {check.errors.length > 0 && (
        <Alert type="error">
          <h4>Errors ({check.errors.length})</h4>
          <ul>
            {check.errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}

      <MissingFixturesList
        missing={check.fixtureAnalysis.missingFixtures}
      />

      <AssetDistributionChart
        analysis={check.assetAnalysis}
      />
    </div>
  );
}
```

### Troubleshooting Tool

```javascript
function TroubleshootingTool({ renderId }) {
  const [issue, setIssue] = useState('');
  const [lineage, setLineage] = useState(null);

  const investigate = async () => {
    const response = await fetch(
      `/api/renders/lineage/${renderId}?checkIntegrity=true`
    );
    const data = await response.json();
    setLineage(data);
  };

  return (
    <div className="troubleshooting-tool">
      <h2>Render Troubleshooting</h2>

      <button onClick={investigate}>
        Run Full Analysis
      </button>

      {lineage?.integrityCheck && (
        <div className="findings">
          <h3>Findings</h3>

          {lineage.integrityCheck.errors.length > 0 && (
            <div className="critical-issues">
              <h4>Critical Issues</h4>
              {lineage.integrityCheck.errors.map((error, i) => (
                <div key={i} className="error">{error}</div>
              ))}
            </div>
          )}

          {lineage.integrityCheck.fixtureAnalysis.missingFixtures.length > 0 && (
            <div className="missing-content">
              <h4>Missing Content</h4>
              {lineage.integrityCheck.fixtureAnalysis.missingFixtures.map(
                (missing, i) => (
                  <div key={i}>
                    <strong>{missing.gradeName}</strong>: {missing.reason}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## Files

- **Handler**: `src/api/render/controllers/lineage/index.js`
- **Controller**: `src/api/render/controllers/render.js` (getRenderDNA method)
- **Route**: `src/api/render/routes/custom-render.js`

---

## Testing

Test the endpoint using:

```bash
# Basic lineage
curl http://localhost:1337/api/renders/lineage/123

# With integrity check
curl http://localhost:1337/api/renders/lineage/123?checkIntegrity=true
```

---

## Integration Notes

This endpoint is designed for the **Individual Render Deep Audit** feature in the Admin Dashboard. It provides:

1. **Complete Visibility**: Full render composition with all relations
2. **Data Integrity**: Verify expected vs actual content
3. **Troubleshooting**: Resolve data disputes and missing content issues
4. **Audit Trail**: Complete record of what went into a render

The endpoint helps administrators:
- Investigate why specific games or content are missing
- Verify render completeness and accuracy
- Debug render failures or inconsistencies
- Understand render composition for support purposes

**Important**: This is a high-cost endpoint. Use sparingly for troubleshooting, not for routine monitoring or bulk operations.
