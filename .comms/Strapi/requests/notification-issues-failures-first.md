# Request: failures-first notification issues list

**Date:** 2026-10-12
**From:** fixtura-admin
**To:** CMS (Strapi)
**Re:** `GET /api/fixtura-scraper/notifications/issues` (see admin-frontend-notification-issues-handoff)

Admin `/dashboard/notifications/issues` is a failure inbox. Staff need ERROR/FATAL rows before WARN rows across the whole filtered window, not only on whatever fits in one page of flattened issues.

## Problem

Pagination is by issue row with no severity or fatal ordering. A page of 50 warnings can hide failures on the next page. The admin UI groups failures on the **loaded page** only until CMS supports filtering and sort.

## Requested query parameters

Apply after flatten, together with existing issue-level filters:

| Param | Values | Effect |
| --- | --- | --- |
| `severity` | Comma-separated or repeated: `FATAL`, `ERROR`, `WARN` (case-insensitive) | Keep only rows whose `issue.severity` normalizes to one of these buckets |
| `fatal` | `true` / `false` | When `true`, keep rows whose parent notification has `fatal === true`. When `false`, exclude those notifications |

Examples:

```http
GET /api/fixtura-scraper/notifications/issues?days=14&fatal=true
GET /api/fixtura-scraper/notifications/issues?days=30&severity=FATAL,ERROR
```

Invalid severity tokens → **400** with a clear message.

## Default sort when severity/fatal filters are absent

Before pagination, sort flattened issue rows so investigation surfaces failures first:

1. Parent `fatal === true`
2. Issue severity `FATAL`, then `ERROR`, then `WARN`, then other
3. `notification.createdAt` descending (newest first)

Existing filters (`step`, `search`, etc.) still apply to the filtered set; sort runs on that set.

## Facets (optional but useful)

Extend `data.facets` on the same route:

| Field | Meaning |
| --- | --- |
| `bySeverity` | Counts by normalized severity (`FATAL`, `ERROR`, `WARN`, `OTHER`) for the full filtered set |
| `fatalIssueCount` | Issue rows where parent notification `fatal === true` |
| `failureSignatureCount` | Issue rows where severity is `FATAL` or `ERROR` |

Admin will wire these after they ship. No admin fetch changes until then.

## Non-goals

- Changing health aggregate (`/notifications/health`) in this request
- Grouping by message on the server (admin groups step + message client-side for now)

## Acceptance

- With no new query params, ERROR/FATAL rows appear before WARN rows in page 1 for a mixed dataset
- `severity=FATAL,ERROR` returns only those rows; pagination totals match
- `fatal=true` returns only issues from fatal notifications
- Facet counts match the filtered set before pagination
