# Single Fixture Details Endpoint - Frontend Integration Guide

## Overview

A new comprehensive endpoint has been created to retrieve detailed information about a single cricket fixture, including all related entities, validation scoring, and administrative metadata.

## API Details

### Endpoint

```
GET /api/game-meta-data/admin/fixture/{id}
```

### Parameters

- `id` (required): Fixture ID (number) - from URL path

### Authentication

- Currently: No authentication required (`auth: false`)
- Future: Will require admin authentication

### Example Request

```bash
curl -X GET "http://localhost:1337/api/game-meta-data/admin/fixture/63731"
```

## Response Structure

### Complete Response Schema

```typescript
{
  // Core fixture data from database schema
  fixture: {
    id: number;
    gameID: string;
    round: string | null;
    status: string;
    type: string;
    isFinished: boolean;

    // Parsed date information
    dates: {
      dayOne: string | null; // ISO datetime
      finalDaysPlay: string | null; // ISO date only
      date: string | null; // Display format
      time: string | null;
      dateRange: string | null;
      dateRangeObj: any | null; // Parsed JSON
    };

    // Venue information
    venue: {
      ground: string | null;
    };

    // Team scores and information
    teams: {
      home: {
        name: string | null;
        scores: {
          total: string | null;
          overs: string | null;
          firstInnings: string | null;
        };
      };
      away: {
        name: string | null;
        scores: {
          total: string | null;
          overs: string | null;
          firstInnings: string | null;
        };
      };
    };

    // Match details
    matchDetails: {
      tossWinner: string | null;
      tossResult: string | null;
      urlToScoreCard: string | null;
      scorecards: any | null; // Parsed JSON with detailed scoring
      resultStatement: string | null;
    };

    // Content and prompts
    content: {
      gameContext: string | null;
      basePromptInformation: string | null;
      hasBasePrompt: boolean;
      upcomingFixturePrompt: string | null;
      hasUpcomingFixturePrompt: boolean;
      lastPromptUpdate: string | null;
    };

    // Team roster (if available)
    teamRoster: any | null; // JSON data
  };

  // Grade information with association
  grade: {
    id: number;
    gradeName: string;
    logoUrl: string | null;
    association: {
      id: number;
      name: string;
      logoUrl: string | null;
    } | null;
  } | null;

  // Teams data array
  teamsData: Array<{
    id: number;
    name: string;
    logoUrl: string | null;
  }>;

  // Downloads/media associated with fixture
  downloads: Array<{
    id: number;
    name: string | null;
    url: string | null;
    type: string | null;
  }>;

  // Render processing status
  renderStatus: {
    upcomingGamesRenders: Array<{
      id: number;
      status: string | null;
      processedAt: string | null;
    }>;
    gameResultsRenders: Array<{
      id: number;
      status: string | null;
      processedAt: string | null;
    }>;
  };

  // Club data (top-level access)
  club: Array<{
    id: number;
    name: string;
    logoUrl: string | null;
  }>;

  // Administrative context
  context: {
    admin: {
      createdAt: string | null;
      updatedAt: string | null;
      publishedAt: string | null;
      lastPromptUpdate: string | null;
    };
  };

  // Validation and performance metadata
  meta: {
    generatedAt: string;
    fixtureId: number;
    validation: {
      overallScore: number; // 0-100
      status: "excellent" | "good" | "fair" | "poor" | "critical";
      statusBased: boolean;
      breakdown: {
        basicInfo: number;
        scheduling: number;
        matchDetails: number;
        content: number;
        relations: number;
        results: number;
      };
      missingFields: string[];
      recommendations: string[];
    };
    performance: {
      fetchTimeMs: number;
      processingTimeMs: number;
      totalTimeMs: number;
    };
  };
}
```

## Key Response Sections

### 1. Fixture Data (`fixture`)

Contains all core fixture information parsed from the database schema:

- Basic info (ID, gameID, round, status, type)
- Dates (multiple formats for different use cases)
- Venue (ground name)
- Team scores (home/away with totals, overs, first innings)
- Match details (toss, scorecard URL, result statement)
- Content (prompts, context, updates)
- Team roster (JSON data if available)

### 2. Related Entities (`grade`, `teamsData`, `downloads`, `renderStatus`)

- **Grade**: Competition level with association details and logos
- **Teams**: Participating teams with logos
- **Downloads**: Associated media files
- **Render Status**: Processing state information

### 3. Top-Level Access (`club`)

- Direct access to club/team data for easy frontend consumption
- Includes logos for visual display

### 4. Validation (`meta.validation`)

- **Overall Score**: 0-100 completeness rating
- **Status**: Quality level (excellent/good/fair/poor/critical)
- **Breakdown**: Scores by category (basic info, scheduling, etc.)
- **Missing Fields**: What data is incomplete
- **Recommendations**: Actionable improvement suggestions

## Frontend Integration Examples

### React Hook Example

```typescript
// hooks/useFixtureDetails.ts
import { useQuery } from "@tanstack/react-query";

interface FixtureDetailsResponse {
  fixture: {
    id: number;
    gameID: string;
    status: string;
    isFinished: boolean;
    dates: {
      dayOne: string | null;
      finalDaysPlay: string | null;
      time: string | null;
    };
    venue: { ground: string | null };
    teams: {
      home: { name: string | null; scores: { total: string | null } };
      away: { name: string | null; scores: { total: string | null } };
    };
    matchDetails: {
      resultStatement: string | null;
      urlToScoreCard: string | null;
    };
  };
  grade: {
    gradeName: string;
    logoUrl: string | null;
    association: { name: string; logoUrl: string | null } | null;
  } | null;
  club: Array<{
    id: number;
    name: string;
    logoUrl: string | null;
  }>;
  meta: {
    validation: {
      overallScore: number;
      status: string;
      missingFields: string[];
      recommendations: string[];
    };
  };
}

export const useFixtureDetails = (fixtureId: number) => {
  return useQuery({
    queryKey: ["fixture", fixtureId],
    queryFn: async (): Promise<FixtureDetailsResponse> => {
      const response = await fetch(
        `/api/game-meta-data/admin/fixture/${fixtureId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch fixture details");
      }
      return response.json();
    },
    enabled: !!fixtureId,
  });
};
```

### Component Usage Example

```tsx
// components/FixtureDetails.tsx
import { useFixtureDetails } from "../hooks/useFixtureDetails";

interface FixtureDetailsProps {
  fixtureId: number;
}

export const FixtureDetails: React.FC<FixtureDetailsProps> = ({
  fixtureId,
}) => {
  const { data, isLoading, error } = useFixtureDetails(fixtureId);

  if (isLoading) return <div>Loading fixture details...</div>;
  if (error) return <div>Error loading fixture</div>;
  if (!data) return <div>No fixture data found</div>;

  const { fixture, grade, club, meta } = data;

  return (
    <div className="fixture-details">
      {/* Header with grade and association logos */}
      <div className="fixture-header">
        <h1>
          {fixture.round} - {fixture.type}
        </h1>
        {grade?.logoUrl && (
          <img
            src={grade.logoUrl}
            alt={grade.gradeName}
            className="grade-logo"
          />
        )}
        {grade?.association?.logoUrl && (
          <img
            src={grade.association.logoUrl}
            alt={grade.association.name}
            className="association-logo"
          />
        )}
      </div>

      {/* Teams with logos */}
      <div className="teams-section">
        {club.map((team, index) => (
          <div
            key={team.id}
            className={`team ${index === 0 ? "home" : "away"}`}
          >
            {team.logoUrl && (
              <img src={team.logoUrl} alt={team.name} className="team-logo" />
            )}
            <span className="team-name">{team.name}</span>
          </div>
        ))}
      </div>

      {/* Scores */}
      <div className="scores-section">
        <div className="score">
          <span>{fixture.teams.home.name}</span>
          <span>{fixture.teams.home.scores.total}</span>
        </div>
        <div className="score">
          <span>{fixture.teams.away.name}</span>
          <span>{fixture.teams.away.scores.total}</span>
        </div>
        {fixture.matchDetails.resultStatement && (
          <div className="result">{fixture.matchDetails.resultStatement}</div>
        )}
      </div>

      {/* Validation status */}
      <div className={`validation-status status-${meta.validation.status}`}>
        <span>Data Quality: {meta.validation.overallScore}%</span>
        <span>({meta.validation.status})</span>
        {meta.validation.missingFields.length > 0 && (
          <div className="missing-fields">
            <strong>Missing:</strong> {meta.validation.missingFields.join(", ")}
          </div>
        )}
      </div>
    </div>
  );
};
```

## Error Handling

### 404 Not Found

```json
{
  "error": {
    "status": 404,
    "message": "Fixture with ID 63731 not found"
  }
}
```

### 400 Bad Request

```json
{
  "error": {
    "status": 400,
    "message": "Invalid fixture ID. Must be a number"
  }
}
```

### 500 Internal Server Error

```json
{
  "error": {
    "status": 500,
    "message": "Failed to fetch fixture details"
  }
}
```

## Data Quality Features

### Validation Categories

- **Basic Info (35%)**: gameID, team names, dates
- **Scheduling (25%)**: time, ground, round
- **Match Details (10%)**: toss, scorecard URL
- **Content (15%)**: prompts, context
- **Relations (10%)**: grade, teams populated
- **Results (5%)**: scores (only for finished fixtures)

### Status-Based Validation

- **Excellent (90-100%)**: All expected fields present
- **Good (75-89%)**: Most fields complete
- **Fair (50-74%)**: Significant data present
- **Poor (25-49%)**: Major gaps
- **Critical (0-24%)**: Severe data gaps

## Performance Considerations

- **Response Size**: Can be large due to scorecards JSON
- **Processing Time**: Includes validation calculations
- **Caching**: Consider caching for frequently accessed fixtures
- **Image Loading**: Logo URLs may require lazy loading

## Future Enhancements

- **Authentication**: Admin-only access
- **Filtering**: Optional query parameters for data depth
- **Pagination**: For large related data sets
- **Real-time Updates**: WebSocket integration for live fixtures

## Testing

### Test Cases

1. **Valid fixture ID** - Returns complete fixture data
2. **Invalid fixture ID** - Returns 400 error
3. **Non-existent fixture** - Returns 404 error
4. **Fixture with missing data** - Shows validation warnings
5. **Fixture with logos** - Displays club/association images

### Sample Test Data

- Fixture ID: `63731` (completed fixture with scores)
- Expected response size: ~5-10KB depending on scorecards data
- Validation score: Should be high (90%+) for well-populated fixtures</content>
  </xai:function_call: write>
  <parameter name="file_path">src/api/game-meta-data/docs/single-fixture-endpoint.md
