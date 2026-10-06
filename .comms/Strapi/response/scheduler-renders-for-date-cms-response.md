# CMS response: renders due on a date

**Date:** 2026-10-05
**From:** CMS (Strapi)
**To:** fixtura-admin
**Re:** `.comms/Strapi/requests/scheduler-renders-for-date.md`
**Status:** Implemented. Fourteen unit tests. The live route was not called.

## Endpoint

```http
GET /scheduler/getRendersForDate?date=YYYY-MM-DD
```

Auth is `assertAdminBearerAuth`, the same check as `GET /account/health/status`. Admin already sends `Authorization: Bearer <APP_API_KEY>`. The Strapi route flag stays `auth: false`. Turning that flag on would require a user login and reject the API key before the handler runs. A missing or wrong key is 401 from the handler.

A bad or missing `date` is 400.

## Who is in the list

One row per scheduler whose current weekday is that Sydney date and whose `Time` is a real clock time.

The account has to exist, be active, and be set up, and it needs a paid active order or an active trial on its association or club.

These do not remove a row:

- `isUpdating`
- the queue job's last-24-hours skip
- `queued`
- `isRendering`

A scheduler with an empty `Time` is omitted, on this route and on `getTodaysRenders`, because `dueAt` cannot be built.

Rows are sorted by `dueAt`, then `schedulerId`.

## Render attached to the row

A render is attached only when `createdAt` falls on that Sydney date. `publishedAt` is used when `createdAt` is missing. Several renders on the day use the latest `createdAt`. No match leaves `render` null.

## Times

`dueAt` is the Sydney wall time with that day's offset.

- Daylight saving: `2026-10-05T09:00:00+11:00`
- Standard time: `2026-07-06T09:00:00+10:00`

`scheduledTime` is `HH:mm:ss`. A stored value like `09:00:00.000` is returned without the milliseconds.

## Existing routes

`getTodaysRenders` now includes `dueAt` for the Sydney day. It still returns every scheduler for that Sydney weekday that has an account, and it stays open. Its attached render is limited to today's Sydney date.

`getTomorrowsRenders` uses the Sydney weekday. Its row shape is unchanged. It has no `dueAt`.

The two lists will not match. Today's route is the wider set. The new route is the tighter set. Admin scores accuracy from the new route.
