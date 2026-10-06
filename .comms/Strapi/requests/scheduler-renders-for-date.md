# Request: schedulers due on a given date, including ones with no render

**Date:** 2026-10-05
**From:** fixtura-admin
**To:** CMS (Strapi)
**Re:** Asset Creation accuracy on the dashboard

Admin needs to answer, for a chosen calendar day: was a render supposed to run, and if so, how many of those due slots actually finished. We will calculate the percentage in admin. This request is for the row set.

`GET /scheduler/getTodaysRenders` already keeps a scheduler when `render` is null. The gap is the attached render: if the scheduler has any render, the handler uses the last one on the relation, with no date check. A miss this week still looks finished when last week's render is on the row. `GET /scheduler/getYesterdaysRenders` only returns rows that already have a render, so a scheduler that was due and never started is missing there too.

## Endpoint

Admin calls CMS with `Authorization: Bearer <APP_API_KEY>` on every request. The new route must accept that same admin API key. Do not leave it `auth: false`.

```http
GET /scheduler/getRendersForDate?date=2026-10-05
```

`date` is required. It is a calendar date in Australia/Sydney, `YYYY-MM-DD`. A Monday in Sydney stays Monday even when that instant is still Sunday in UTC.

Return the same row shape as `getTodaysRenders`:

```ts
type SchedulerDueOnDate = {
  schedulerId: number;
  schedulerName: string;
  scheduledTime: string;
  dueAt: string;
  isRendering: boolean;
  accountId: number;
  accountName: string;
  accountSport: string;
  accountType: string;
  queued: boolean;
  render: {
    renderId: number;
    renderName: string;
    processing: boolean;
    complete: boolean;
    emailSent: boolean;
    startedAt: string;
    updatedAt: string;
    failureReason: string | null;
    queueWaitTimeSeconds: number | null;
  } | null;
};
```

Response is that array. An empty array means nothing was due that day.

## Answers

1. **Which render belongs to the date.** Attach a render only when its start falls on that Sydney date. When the only renders are from other days, send `render: null`. If several renders start that day, attach the latest by `createdAt`. Apply that same date limit on `getTodaysRenders`. Today's percentage uses that route until the new one exists, and it stays wrong while last week's render can satisfy today.

2. **Timestamp.** Place the render with `createdAt`, read in Australia/Sydney. Use `publishedAt` only when `createdAt` is missing. Do not use the server's local midnight. A Monday-night slot whose render row is created at 00:10 Tuesday counts as Tuesday. That edge is acceptable.

3. **Who was supposed to fire.** Sydney weekday matches, the account exists, `isActive`, `isSetup`, and either a paid active order (`Status`, `isActive`, and `OrderPaid` all true) or an active trial on the account's association or club. `Queued` and `isRendering` do not remove the row. `isUpdating` does not remove the row. A skip because results already exist from the last 24 hours does not remove the row. That skip only stops a second queue. The render from the first queue still belongs to the day under answer 1.

4. **Current schedule for a past date.** Acceptable. We do not need schedule history. A past date means schedulers whose weekday and clock time are that day on the schedule as it stands now. A later day change, a scheduler created after the date, or a deleted scheduler will not match what was actually due. Admin will read a past percentage against the current schedule.

5. **`dueAt`.** Sydney wall time, with that day's Sydney offset. `2026-10-05T09:00:00+11:00` in daylight saving, `+10:00` otherwise. Not a `Z` value. `scheduledTime` stays `HH:mm:ss`. Add the same `dueAt` to `getTodaysRenders` in this change. Until admin moves to the new route, today's percentage uses that payload and has to leave slots that have not come up yet out of the count.

6. **`isRendering` and `queued` on a past date.** Keep sending the live values on every row, including past dates. They mean the scheduler right now. Admin will not use them to score a past date. A past date is scored from `render` only: `null` is a miss, `complete` is processed, `processing` without `complete` is still in flight, anything else with a render is failed.

7. **Bounds.** Invalid `date` is 400. Future dates are allowed. No lookback cap. Omit a scheduler with an empty `Time`, and omit one with no day of the week. Sort by `dueAt`, then `schedulerId`.

8. **Sydney day on the existing routes.** Yes. Move `getTodaysRenders` and `getTomorrowsRenders` onto the Sydney weekday in this same change. `Date#getDay()` on a UTC process makes Monday morning in Sydney still Sunday.

9. **Auth.** Require the admin API key. Admin sends `Authorization: Bearer <APP_API_KEY>`, the same header as the other admin CMS calls. The existing scheduler routes being `auth: false` is not the pattern to copy.

## Follow-up

`isUpdating` stays in the set. An account mid-update was still due. If no render is attached for that Sydney date, admin counts a miss.

The last-24-hours skip stays in the set. It blocks a second queue. It does not mean the slot was not due. A render created earlier that same Sydney day still attaches under answer 1.

`getTodaysRenders` keeps its wider scheduler set and stays `auth: false`. The new route uses the tighter gates and `assertAdminBearerAuth`. Admin will not compare the two percentages. The accuracy tile moves to the new route. The two changes on today's route still stand: the attached render is limited to that Sydney date, and the weekday comes from Australia/Sydney. `dueAt` is the third change on that route, as in answer 5.

## Out of this request

- Admin calculates the percentage.
- No change to `getHealthHistory`. A daily `expected` count can wait.
- No change to `GET /api/render/admin/in-progress`.
- No render abort route.
- No schedule-history table.
