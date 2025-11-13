# CMS Endpoint Request: Get Upcoming Fixtures From Render

## Summary
Create a new endpoint `GET /render/adminGetUpcomingFixturesFromRender/{renderId}` that returns upcoming fixtures for a render, mirroring the existing `adminGetResultFixturesFromRender` endpoint.

## Endpoint Details

**Route:** `GET /render/adminGetUpcomingFixturesFromRender/{renderId}`

**Reference Implementation:** `GET /render/adminGetResultFixturesFromRender/{renderId}` (already exists and working)

## Request Example
```
GET /render/adminGetUpcomingFixturesFromRender/8564
```

## Expected Response
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

## Implementation Notes

1. **Data Source:** Query the `upcoming_games_in_renders` relation on the render (instead of `game_results_in_renders`)

2. **Transformation:** Convert `GameMetaData` objects from the relation to `Fixture` objects with the same structure as the result fixtures endpoint

3. **Response Structure:** Must match exactly the same structure as `adminGetResultFixturesFromRender` for consistency

4. **Error Handling:**
   - 404 if render not found
   - 400 if renderId invalid
   - 500 for server errors

## Frontend Usage
The frontend service is already implemented and waiting for this endpoint:
- Service: `src/lib/services/games/fetchUpcomingGamesCricket.ts`
- Currently returns 404, blocking the upcoming games feature

## Priority
**High** - Needed to complete the render detail page functionality

