# CMS handoff: fleet operations visibility

**Date:** 2026-10-01
**From:** CMS (Strapi) Backend
**To:** fixtura-admin
**Re:** `.comms/Admin/requests/cms-fleet-operations-handoff.md`
**Status:** Requests B and C are implemented. Request A was already live. Request D is not in this change.

Restart Strapi after pulling this. No new permission checkbox. Both routes below are open the same way as the existing account lookup (`auth: false`).

---

## What to change in admin

1. Keep fleet attention on `activeRuns` and `activeCount` from `GET /api/account/health/status`. Keep the banner when `activeRunsTruncated` is true. Do not drive those lists from global `runCounts`.
2. On `GET /api/account/admin/lookup`, read the seven new fields on each account row. Stop deriving health and render flags from the global health payload and today's scheduler rollup.
3. Use `accountHealthLastCompletedAt` as the last season data sync on the Active and Inactive tabs.
4. Use `lastRenderCompletedAt` as the last render date. `renderProcessingSince` stays blank once the render is no longer processing.
5. Point the stuck-rendering list at `GET /api/render/admin/in-progress`. Today's scheduler rollup does not see a render that is still processing on an older slot.
6. Do not add a render abort button. That stays phase 2 until the worker contract is settled.

---

## Account lookup

```http
GET /api/account/admin/lookup
```

Same path and envelope as today: `{ data: AccountRow[], meta: { total } }`.

Each row now also has:

| Field | Meaning |
| --- | --- |
| `accountHealthStatus` | `not_started`, `queued`, `running`, `completed`, or `failed`. Missing values come back as `not_started`. |
| `accountHealthLastStartedAt` | ISO time, or `null`. |
| `accountHealthLastCompletedAt` | Last season data sync. ISO time, or `null`. |
| `accountHealthFailureReason` | String, or `null`. |
| `isSchedulerRendering` | The account scheduler's `isRendering` flag. `false` when the account has no scheduler. |
| `renderProcessingSince` | Set only while a render has `Processing === true`. Otherwise `null`. |
| `lastRenderCompletedAt` | Newest render for that account with `Complete === true`. `null` if none. |

`renderProcessingSince` and `lastRenderCompletedAt` use `createdAt`, then `publishedAt`. The render type has no start time and no completion time, so both columns are that proxy until a real completion field exists. A processing render with neither timestamp still appears on the in-progress list with `startedAt: null`, and `renderProcessingSince` stays `null` because there is no time to show. Strapi sets `createdAt` on insert, so that row should not appear in normal data.

An association that finished yesterday looks like this:

```json
{
  "isSchedulerRendering": false,
  "renderProcessingSince": null,
  "lastRenderCompletedAt": "2026-09-30T08:00:00.000Z"
}
```

`isSchedulerRendering` and `renderProcessingSince` are not the same fact. A stuck scheduler flag with no processing render is `isSchedulerRendering: true` and `renderProcessingSince: null`. A processing render whose scheduler flag is already clear is the reverse.

The lookup still returns every account. Health values are read off those account rows. The three render fields come from one scheduler query and one render query for the whole list, then attached in memory. There is no per-account health or render call.

---

## In-progress renders

```http
GET /api/render/admin/in-progress
```

Admin axios path, if `NEXT_APP_API_BASE_URL` already includes `/api`: `/render/admin/in-progress`.

```ts
type RenderInProgressRow = {
  renderId: number;
  renderName: string | null;
  processing: boolean;
  complete: boolean;
  startedAt: string | null;
  schedulerId: number | null;
  schedulerName: string | null;
  accountId: number | null;
  accountName: string | null;
  accountType: string | null;
  scheduledTime: string | null;
};

type RenderInProgressResponse = {
  data: {
    activeCount: number;
    rows: RenderInProgressRow[];
  };
};
```

Rules:

- A row is included when `Processing === true`. A render that is also `Complete === true` is still included. Finished renders (`Processing === false`) are not.
- `activeCount` is `rows.length`.
- Sort is oldest `startedAt` first. Rows with no `createdAt` and no `publishedAt` sort last.
- `startedAt` is `createdAt`, else `publishedAt`, else `null`.
- `accountName` is the account `FirstName`, the same value today's scheduler payload uses.
- `accountType` is `account_type.Name` as stored (`Club` or `Association`).
- `scheduledTime` is the scheduler `Time` value (time of day), not a datetime.
- A processing render with no scheduler is still returned. Scheduler and account fields are `null`.
- No page cap.

This list is in-progress renders only. It does not supply `lastRenderCompletedAt`.

---

## Left unchanged

Request A. `GET /api/account/health/status` still returns `activeRuns`, `activeCount`, and `activeRunsTruncated`.

Request D. There is no `POST /api/render/:renderId/abort`.
