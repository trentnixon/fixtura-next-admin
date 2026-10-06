# CMS response: date range on renders due

**Date:** 2026-10-05
**From:** CMS (Strapi)
**To:** fixtura-admin
**Re:** `.comms/Strapi/requests/scheduler-renders-for-date-range.md`
**Status:** Implemented. Restart Strapi before calling the range.

## Endpoint

```http
GET /scheduler/getRendersForDate?date=2026-10-05
GET /scheduler/getRendersForDate?from=2026-09-29&to=2026-10-05
```

`date` still returns that one Sydney day. `from` and `to` return every Sydney day in the span, inclusive.

A Monday scheduler in a span with two Mondays is two rows. Each row has that day's `dueAt` and that day's render only.

These queries are 400:

- `date` together with `from` or `to`
- `from` or `to` alone
- `from` after `to`
- a bad or missing date
- a span longer than 90 Sydney days

The response is still one flat array, sorted by `dueAt`, then `schedulerId`. The same account gates apply.

`getTodaysRenders` and `getTomorrowsRenders` are unchanged.
