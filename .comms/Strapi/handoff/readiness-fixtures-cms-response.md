# CMS response: readiness fixtures for one Club or Association

**Date:** 2026-10-19
**From:** CMS (Strapi)
**To:** fixtura-admin
**Re:** [readiness-fixtures.md](./readiness-fixtures.md)

The route is in CMS. Replace the readiness fixture assembly with this one call. Keep `scoreFixtureCompleteness` in Admin. Keep `GET /game-meta-data/admin/fixture/{id}` for opening a row. Stop using it to build the set.

## What to change

Today a Club check calls `GET /competition/admin/{clubOrgId}/clubs`, then `GET /game-meta-data/admin/fixtures?grade={gradeId}` once per grade, then keeps a row when the home or away label matches a team name. An Association check calls `GET /game-meta-data/admin/fixtures?association={orgId}` and cuts the date in the browser.

Delete that assembly for this screen. One call returns the set, already cut.

```http
GET /api/game-meta-data/admin/readiness-fixtures?organisationId=123&organisationType=club&date=2026-10-19
Authorization: Bearer <APP_API_KEY>
```

| Query | Send |
| --- | --- |
| `organisationId` | `account.accountOrganisationDetails.id`. The Club or Association Strapi id. Not the account id in `account=705`. Not `PlayHQID`. |
| `organisationType` | `club` or `association`. Lowercase. The dashboard value `Club` is 400. |
| `date` | The readiness anchor, Sydney calendar day, `YYYY-MM-DD`. |

`APP_API_KEY` is the same bearer Admin already sends. There is no new Users & Permissions checkbox. A missing or wrong key is 401.

Do not filter the returned rows again by `window.start` and `window.end` against `fixtures[].date`. That date can sit outside the window. CMS already decided membership.

Do not match team labels. A fixture is in a Club set only when a linked team belongs to that Club. Two teams with the same label no longer collide. A team with no Club does not pull the grade in. Older fixtures that have names and no team link drop out of Club sets.

Do not unwrap `{ text }` on this route. Round, status, type, and both team names are plain strings, or `null` when the stored value was `""`.

## Response

HTTP 200. One object. No percentage, no findings, no saved report.

```ts
type ReadinessFixturesResponse = {
  data: {
    organisationId: number;
    organisationType: "club" | "association";
    anchor: string;
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
  date: string; // Sydney day of dayOne, else of finalDaysPlay. Never null on a returned row.
  round: string | null;
  status: string | null;
  type: string | null;
  teams: { home: string | null; away: string | null };
  grade: { id: number; name: string | null } | null;
  competition: { id: number; name: string | null } | null;
  association: { id: number; name: string | null } | null;
  playDay: {
    dayOne: string | null; // stored instant
    finalDaysPlay: string | null; // stored date
  };
  location: string | null;
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

For anchor `2026-10-19` the window is `start` `2026-10-05`, `standardStart` `2026-10-12`, `end` `2026-10-26`.

`date` is the Sydney calendar day of `dayOne`. When `dayOne` is missing, it is the Sydney day of `finalDaysPlay`. Use `date` for grouping. Use `playDay` to label the play day and to split upcoming from results, the same way the detail load does today.

`hasPlayerData` is true when any innings has a `battingRows` or `bowlingRows` entry whose first cell is a non-empty string other than `"-"`, or a legacy `batting` or `bowling` entry whose `name` or `player` is that kind of string. An innings title does not count. `"0"` on a score stays `"0"`.

Sort is unchanged. Group by grade, then date, then type.

## How a row gets in

Published fixtures only. A Strapi draft fixture is out. A draft Team, Grade, or Competition still counts.

A normal fixture, including type `Two Day`, is in when its membership day falls on `standardStart` through `end`. The membership day is `dayOne` when that value parses. `finalDaysPlay` is used only when `dayOne` is missing. A normal fixture on 8 October is out for this anchor, even if `finalDaysPlay` is 19 October.

A Two Day+ fixture is in when the Sydney day of `dayOne` or of `finalDaysPlay` falls on `start` through `end`. Two Day+ means the type with whitespace removed, compared case-insensitively, equals `twoday+` or starts with `twoday+`. `Two Day+ — 40 Overs` matches. `Two Day` does not.

Days between the two stored ends are not play days. Do not fill that gap in Admin.

Worked rows for anchor `2026-10-19`:

| Stored ends | Type | In the set | `fixtures[].date` |
| --- | --- | --- | --- |
| `dayOne` 4 October, `finalDaysPlay` 19 October | Two Day+ | yes | `2026-10-04` (before `window.start`) |
| `dayOne` 27 October, `finalDaysPlay` 26 October | Two Day+ | yes | `2026-10-27` (after `window.end`) |
| `dayOne` 1 October, `finalDaysPlay` 2 November | Two Day+ | no | |
| `dayOne` 1 August, `finalDaysPlay` 19 October | Two Day+ | yes | `2026-08-01` |
| `dayOne` 8 October, `finalDaysPlay` 19 October | One Day or Two Day | no | |
| no `dayOne`, `finalDaysPlay` 19 October | One Day | yes | `2026-10-19` |
| `dayOne` `2026-10-18T14:00:00.000Z` | One Day | yes | `2026-10-19` (Sydney morning, previous UTC day) |

A row with neither day, or with only unparseable values, is omitted. A parseable datetime always has a Sydney day.

## Errors

| HTTP | When |
| --- | --- |
| 400 | Missing `organisationId`, `organisationType`, or `date`. `organisationType` is not `club` or `association`. `date` is not a real `YYYY-MM-DD`. `organisationId` is not a positive integer. |
| 401 | Missing or rejected bearer. |
| 404 | No Club row for `organisationType=club`, or no Association row for `organisationType=association`. An unpublished Club or Association row is found. |
| 200 | The Club or Association exists and no published cricket fixture is in the window. `fixtures` is `[]` and `meta.total` is `0`. |

An AFL Club id that exists is 200 and `fixtures: []`. This route reads cricket fixtures only.

400 message: `organisationId, organisationType (club or association), and date (YYYY-MM-DD) are required`.

404 message: `Club or Association not found`.

## Example

Staff open `/dashboard/readiness?date=2026-10-19&step=3&type=Club&account=705`.

Resolve `accountOrganisationDetails.id` for account 705. If that row is a Club:

```http
GET /api/game-meta-data/admin/readiness-fixtures?organisationId={accountOrganisationDetails.id}&organisationType=club&date=2026-10-19
Authorization: Bearer <APP_API_KEY>
```

Score `data.fixtures` with the existing completeness function. Open a row with `GET /api/game-meta-data/admin/fixture/{id}` as today.

## Still in Admin

- The completeness percentage and the per-fixture reasons.
- The single-fixture page.
- `GET /game-meta-data/admin/fixtures` and `GET /game-meta-data/admin/fixture/{id}` are unchanged. Leave them until this route is the one the readiness screen uses.

## Still out

- Any scrape, Creator, a Render, Downloads, or a client notification.
- A saved readiness report.
- Fixtures for AFL, Netball, Hockey, or Basketball.
