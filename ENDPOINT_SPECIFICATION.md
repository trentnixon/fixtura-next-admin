# CMS Endpoint Specification: Get Upcoming Fixtures From Render

## Request

**Endpoint:** `GET /render/adminGetUpcomingFixturesFromRender/{renderId}`

**Method:** GET

**Path Parameters:**

- `renderId` (string/number): The ID of the render to fetch upcoming fixtures for

**Example Request:**

```
GET /render/adminGetUpcomingFixturesFromRender/8564
```

**Authentication:**

- Requires Bearer token authentication (same as existing endpoints)
- Uses `APP_API_KEY` from environment variables

---

## Response

**Expected Response Structure:**

```json
{
  "data": {
    "data": {
      "fixtures": [
        {
          "id": 12345,
          "gameId": "game-123",
          "round": "Round 1",
          "date": "2025-11-20",
          "time": "14:00",
          "type": "match",
          "ground": "Main Oval",
          "status": "Scheduled",
          "teamHome": "Team A",
          "teamAway": "Team B",
          "homeScore": "",
          "homeOvers": "",
          "awayScore": "",
          "awayOvers": "",
          "dateRange": "",
          "tossWinner": null,
          "tossResult": null,
          "urlToScoreCard": "/scorecard/123",
          "createdAt": "2025-11-13T00:00:00.000Z",
          "updatedAt": "2025-11-13T00:00:00.000Z"
        }
      ]
    }
  }
}
```

**Response Type:** `{ data: RenderResponse }`

Where `RenderResponse` is:

```typescript
interface RenderResponse {
  render: RenderData;
  fixtures: Fixture[];
}

interface Fixture {
  id: number;
  gameId: string;
  round: string;
  date: string;
  time: string;
  type: string;
  ground: string;
  status: string;
  teamHome: string;
  teamAway: string;
  homeScore: string;
  homeOvers: string;
  awayScore: string;
  awayOvers: string;
  dateRange: string;
  tossWinner: string | null;
  tossResult: string | null;
  urlToScoreCard: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## Implementation Details

### Reference Implementation

This endpoint should mirror the existing endpoint:

- **Existing Endpoint:** `GET /render/adminGetResultFixturesFromRender/{renderId}`
- **New Endpoint:** `GET /render/adminGetUpcomingFixturesFromRender/{renderId}`

### Data Source

The endpoint should:

1. Find the render by `renderId`
2. Query the `upcoming_games_in_renders` relation on the render
3. Transform the `GameMetaData` objects from the relation into `Fixture` objects
4. Return them in the same structure as the result fixtures endpoint

### Transformation Logic

Transform from `GameMetaData` (from `upcoming_games_in_renders` relation) to `Fixture`:

```javascript
// Pseudo-code transformation
GameMetaData -> Fixture:
- id: gameMetaData.id
- gameId: gameMetaData.attributes.gameID
- round: gameMetaData.attributes.round
- date: gameMetaData.attributes.date
- time: gameMetaData.attributes.time
- type: gameMetaData.attributes.type
- ground: gameMetaData.attributes.ground
- status: gameMetaData.attributes.status
- teamHome: gameMetaData.attributes.teamHome
- teamAway: gameMetaData.attributes.teamAway
- homeScore: gameMetaData.attributes.Homescores || ""
- homeOvers: gameMetaData.attributes.HomeOvers || ""
- awayScore: gameMetaData.attributes.Awayscores || ""
- awayOvers: gameMetaData.attributes.AwayOvers || ""
- dateRange: gameMetaData.attributes.dateRange || ""
- tossWinner: gameMetaData.attributes.tossWinner || null
- tossResult: gameMetaData.attributes.tossResult || null
- urlToScoreCard: gameMetaData.attributes.urlToScoreCard
- createdAt: gameMetaData.attributes.createdAt
- updatedAt: gameMetaData.attributes.updatedAt
```

### Error Handling

**404 Not Found:**

- If render with `renderId` doesn't exist
- Response: `{ data: null, error: { status: 404, name: 'NotFoundError', message: 'Not Found' } }`

**400 Bad Request:**

- If `renderId` is missing or invalid
- Response: `{ data: null, error: { status: 400, name: 'BadRequestError', message: 'Invalid renderId' } }`

**500 Internal Server Error:**

- For any unexpected server errors
- Response: `{ data: null, error: { status: 500, name: 'InternalServerError', message: 'Internal Server Error' } }`

---

## Testing

**Test Cases:**

1. **Valid Request:**

   - `GET /render/adminGetUpcomingFixturesFromRender/8564`
   - Should return 200 with fixtures array

2. **Render with No Upcoming Games:**

   - Should return 200 with empty fixtures array: `{ data: { data: { fixtures: [] } } }`

3. **Invalid Render ID:**

   - `GET /render/adminGetUpcomingFixturesFromRender/99999`
   - Should return 404

4. **Missing Render ID:**
   - `GET /render/adminGetUpcomingFixturesFromRender/`
   - Should return 400 or 404

---

## Frontend Integration

**Service File:** `src/lib/services/games/fetchUpcomingGamesCricket.ts`

**Current Implementation:**

```typescript
export async function fetchUpcomingGamesCricket(
  renderId: string
): Promise<Fixture[]> {
  const response = await axiosInstance.get<{ data: RenderResponse }>(
    `/render/adminGetUpcomingFixturesFromRender/${renderId}`
  );
  return response.data.data.fixtures || [];
}
```

**Expected Behavior:**

- Returns array of `Fixture` objects
- Empty array if no upcoming games
- Throws error if endpoint fails

---

## Priority

**High** - This endpoint is needed to display upcoming games in the render detail page. Currently using a workaround that fetches from render relations, but a dedicated endpoint would be more efficient and consistent with the game results implementation.

---

## Notes

- This endpoint should follow the same authentication, error handling, and response structure patterns as `/render/adminGetResultFixturesFromRender/{renderId}`
- The main difference is the data source: `upcoming_games_in_renders` instead of `game_results_in_renders`
- Both endpoints should return the same `Fixture[]` structure for consistency
