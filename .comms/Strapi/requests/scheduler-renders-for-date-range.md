# Request: date range on renders due

**Date:** 2026-10-05
**From:** fixtura-admin
**To:** CMS (Strapi)
**Re:** `.comms/Strapi/requests/scheduler-renders-for-date.md`
**Status of that route:** `GET /scheduler/getRendersForDate?date=YYYY-MM-DD` is in place. This request adds a range to it.

Admin now scores accuracy across a span, not one day. The default is the last 7 Sydney days. Staff also pick an older window, for example five weeks ago through three weeks ago. The route only accepts one `date`, so admin calls it once per day. Please accept the whole span in one call.

## Endpoint

Same route. Same auth: `assertAdminBearerAuth`, Strapi route flag stays `auth: false`. Admin sends `Authorization: Bearer <APP_API_KEY>`.

```http
GET /scheduler/getRendersForDate?from=2026-09-29&to=2026-10-05
```

`from` and `to` are Sydney calendar dates, `YYYY-MM-DD`, inclusive. A single `date` with no `from` or `to` keeps today's one-day behaviour.

| Query | Result |
| --- | --- |
| `date` only | That one Sydney day, as now |
| `from` and `to` | Every Sydney day from `from` through `to` |
| `date` together with `from` or `to` | 400 |
| `from` or `to` alone | 400 |
| `from` after `to` | 400 |
| Bad or missing dates | 400 |
| Span longer than 90 Sydney days | 400 |

90 days is enough. The dashboard will not ask for more.

## Rows

Same row shape as the one-day route, including `dueAt`.

One row per scheduler per Sydney date in the span whose weekday matches that date. A Monday scheduler inside a span that contains two Mondays is two rows. Each row has that date's `dueAt`. Do not collapse to one row per scheduler.

The render on a row is attached only when `createdAt` falls on that row's Sydney date, or `publishedAt` when `createdAt` is missing. Several renders on that day use the latest `createdAt`. No match leaves `render` null. A render from another day in the span does not satisfy this row.

Same gates as the one-day route: account exists, `isActive`, `isSetup`, and a paid active order or an active trial. `isUpdating`, the last-24-hours skip, `queued`, and `isRendering` do not remove a row. Empty `Time` and no day of the week stay omitted.

Sort by `dueAt`, then `schedulerId`.

Response stays a flat array. An empty array means nothing was due in the span.

## Out of this request

- Admin still calculates the percentage.
- No change to `getTodaysRenders`, `getTomorrowsRenders`, or `getHealthHistory`.
- No schedule-history table. A past date is still the schedule as it stands now.
