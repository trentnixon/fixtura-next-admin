# A readiness check scrapes results before the scheduled run

A client account has one scheduled day a week. A Readiness check for that client runs on that Sydney generation date, before the real generation. It scrapes Fixture results and reports which Fixtures are a problem, so staff can fix them first.

The check does not call Creator. It does not create a Render, Downloads, or any other assets. It does not notify the client.

## Considered options

- Score the Downloads a Render would produce. Rejected. That needs Creator, and this check does not render.
- One Download per Fixture, or one Download per Asset. Rejected for the same reason. There is no output count.

## Consequences

- On a generation date the board has one row per client who is due that day.
- The result of the check is Fixture-level: what scraped, what failed, and what is still missing a result.
- A manual check on a date that is not the scheduled day can still scrape. It is not a Creator preview of that date.
