# Request: fixtures in a readiness window for one organisation

**Date:** 2026-10-19
**From:** fixtura-admin
**To:** CMS (Strapi)
**Re:** Readiness check fixture set

Staff open `/dashboard/readiness?date=2026-10-19&step=3&type=Club&account=705` and Admin builds the fixture set itself.

For a club that is many calls: `GET /competition/admin/{clubOrgId}/clubs`, then `GET /game-meta-data/admin/fixtures?grade={gradeId}` once per grade, then a browser filter that keeps a fixture only when the home or away label matches a team name for that club in that grade.

For an association it is one call: `GET /game-meta-data/admin/fixtures?association={orgId}`, then the same date cut in the browser.

Neither call receives the readiness date. After the set is known, Admin loads `GET /game-meta-data/admin/fixture/{id}` once per fixture to score it.

`account=705` is the CMS account id. The calls above use `account.accountOrganisationDetails.id`, the scraped organisation id.

## Endpoint

Admin calls CMS with `Authorization: Bearer <APP_API_KEY>` on every request. The new route must accept that same admin API key. Do not leave it `auth: false`.

```http
GET /game-meta-data/admin/readiness-fixtures?organisationId=123&organisationType=club&date=2026-10-19
```

| Query | Required | Values |
| --- | --- | --- |
| `organisationId` | yes | Scraped organisation id (`accountOrganisationDetails.id`). Not the account id. |
| `organisationType` | yes | `club` or `association` |
| `date` | yes | Sydney calendar date, `YYYY-MM-DD`. The anchor. Not an instant. |

Invalid `date`, unknown `organisationType`, or a missing param is 400. Unknown organisation is 404. An organisation with no stored fixtures in the window is 200 and `fixtures: []`.

## Who is in the set

Return stored fixtures only. Do not invent a fixture that has never been saved.

**Association.** Every stored fixture for that association, the same population as `GET /game-meta-data/admin/fixtures?association={organisationId}`, then cut by the window below.

**Club.** A fixture is in when one of that club’s teams is home or away. Use the team-to-club relation. The same grades are the ones `GET /competition/admin/{clubOrgId}/clubs` already returns for that club.

Do not match on display name. Admin does that today because the grade list has no club id on the fixture, and it is wrong when two teams share a label. A team row with a null club id must not pull every name in that grade into this club.

Other clubs’ games in the same grade stay out.

## Window

Inclusive calendar dates. Compare the same date the existing list returns as `fixture.date` (`YYYY-MM-DD`, or the first 10 characters if a datetime is stored). Do not use `dates.dayOne` or `dates.finalDaysPlay` to decide membership. Admin still uses those after load to label the play day and to split upcoming from results.

For anchor `2026-10-19`:

- Include a fixture whose date is **2026-10-12 through 2026-10-26** (7 days before the anchor through 7 days after, both ends).
- Also include a fixture whose date is **2026-10-05 through 2026-10-11**, only when its type is Two Day+.
- Drop anything before 2026-10-05 or after 2026-10-26.

Two Day+ means the display type with all whitespace removed, compared case-insensitively, equals `twoday+`. `Two Day +` and `Two Day+` match. `Two Day` does not. The type may be stored as a string or as `{ text }`.

General form: `[anchor − 7, anchor + 7]` for every fixture, plus `[anchor − 14, anchor − 8]` for Two Day+ only.

## Response

One object. Admin will keep scoring. Do not return a percentage, findings, or a stored report.

```ts
type ReadinessFixturesResponse = {
  data: {
    organisationId: number;
    organisationType: "club" | "association";
    anchor: string; // YYYY-MM-DD
    window: {
      start: string; // anchor − 14
      standardStart: string; // anchor − 7
      end: string; // anchor + 7
    };
    fixtures: ReadinessFixture[];
    meta: { total: number };
  };
};

type ReadinessFixture = {
  id: number;
  date: string | null; // list date, YYYY-MM-DD
  round: string | null;
  status: string | null;
  type: string | null;
  teams: { home: string | null; away: string | null };
  grade: { id: number; name: string } | null;
  competition: { id: number; name: string } | null;
  association: { id: number; name: string } | null;
  playDay: {
    dayOne: string | null; // as stored
    finalDaysPlay: string | null;
  };
  location: string | null; // ground text
  scores: {
    homeTotal: string | null;
    homeFirstInnings: string | null;
    awayTotal: string | null;
    awayFirstInnings: string | null;
  };
  tossResult: string | null;
  tossWinner: string | null;
  hasPlayerData: boolean;
};
```

Send plain strings. The current list route sometimes sends `{ text }` for round, status, type, and team names. Admin already unwraps `text`. This route should send the string.

`hasPlayerData` is true when any scorecard on the fixture has a named player:

- a `battingRows` or `bowlingRows` entry whose first cell is a non-empty string other than `"-"`; or
- a legacy `batting` or `bowling` entry whose `name` or `player` is a non-empty string.

No scorecards, or cards with no such name, is `false`.

Sort is not required. Admin groups by grade, then date, then type.

## Out of this request

- The completeness percentage and the per-fixture reasons. Admin keeps `scoreFixtureCompleteness`.
- Any scrape, including the single-fixture result scrape and the grade batch result scrape.
- Creator, a Render, Downloads, or a client notification.
- A saved readiness report.
- Changing `GET /game-meta-data/admin/fixtures` or `GET /game-meta-data/admin/fixture/{id}`. Admin will keep those until this route is in use. The per-fixture route stays, because a row on the check still opens the full fixture.

## Why these fields

The table needs id, date, round, status, type, both teams, grade, competition. The score needs status, a date, both team names, location, a recorded score (`total`, else `firstInnings`, either side), toss, toss winner, and whether a scorecard names a player. `dayOne` and `finalDaysPlay` stay on the row so Admin can still show the Sydney day the match starts after the set has been cut on the list date.
