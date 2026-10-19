## Problem Statement

Staff only see Fixture result problems when the real generation runs. They need to pick an organisation and a date, see how complete those Fixtures are, refresh every one of them from PlayHQ, and see the score again before that run.

## Solution

A Readiness check asks CMS for the Fixtures of one Club or one Association on a Sydney generation date. CMS decides which Fixtures are in. Admin scores the ones whose start day is today or earlier, then sends the existing single-Fixture result scrape for those results. When staff load the Fixtures again, the same score runs a second time. The score stays on the screen. Nothing is stored. Creator is not called. No Render, Downloads, or other assets are created. The client is not notified.

## User Stories

1. As a staff member, I want to choose an association client and a date, so that I can check the Fixtures for that Association from two weeks before that date through one week after it.
2. As a staff member, I want to choose a club client and a date, so that I can check the Fixtures that club plays in that same span.
3. As a staff member, I want the club list to include only Fixtures CMS linked to that club, so that other clubs' games in the same grade are not scored.
4. As a staff member, I want the association list to be the Fixtures CMS returns for that Association, so that the check is not the account Fixtures tab.
5. As a staff member, I want a Fixture kept when CMS returned it, even if its start day sits outside the span, so that a Two Day+ match still being played is scored.
6. As a staff member, I want a clear empty state when that window has no Fixtures, so that I do not read an empty window as a perfect score.
7. As a staff member, I want a percentage of Fixtures that meet the completeness schema, so that I can see how ready the day is before generation.
8. As a staff member, I want each Fixture that fails the schema listed with a reason, so that I know what is wrong.
9. As a staff member, I want a finished Fixture with no scorecards called out, so that a result that looks done but has no card is visible.
10. As a staff member, I want a Fixture with no scorecard link called out, so that I know the scrape cannot reach PlayHQ.
11. As a staff member, I want a Fixture that is not finished to pass without scorecards, so that a future game is not failed for having no result yet.
12. As a staff member, I want every Fixture in the set scraped, including ones that already look complete, so that a stale or updated PlayHQ result is refreshed.
13. As a staff member, I want the scrape to use the existing single-Fixture result scrape, so that CMS behaviour does not change.
14. As a staff member, I want to see which scrape requests were accepted and which were rejected, so that a failed enqueue is not mistaken for a complete Fixture.
15. As a staff member, I want one rejected scrape to leave the other Fixtures in the set still requested, so that one bad Fixture does not stop the rest.
16. As a staff member, I want to load the Fixtures again from the same route after the scrapes have run, so that the second score uses the results CMS wrote back.
17. As a staff member, I want the second score to use the same schema as the first, so that the before and after numbers mean the same thing.
18. As a staff member, I want the before and after percentages both visible, so that I can see whether the scrape improved the day.
19. As a staff member, I want the score to disappear when I leave the screen, so that an old check is not treated as a saved report.
20. As a staff member, I want a date that is not the client's scheduled day to still run, so that I can inspect a day I choose.
21. As a staff member, I want the client's one scheduled day called out when I am checking that day, so that I know this is the pre-run for generation.
22. As a staff member, I want no Render created by this check, so that generation does not start early.
23. As a staff member, I want no Download and no other asset created, so that the check cannot produce client content.
24. As a staff member, I want the client not notified, so that a pre-run stays internal.
25. As a staff member, I want Creator not called, so that the check cannot build videos or articles.
26. As a staff member, I want the account asset-run action left unused, so that a full scrape-and-render is not started by mistake.
27. As a staff member, I want the grade batch result scrape left unused, so that a grade's last 14 days are not scraped in place of this date's Fixtures.
28. As a staff member, I want a Fixture the list route did not return to be absent, so that games never stored are not invented as missing.
29. As a staff member, I want an empty Fixture list to be an empty window, so that I do not read a missing list as zero Fixtures that are complete.
30. As a staff member, I want the screen to keep working if I run the check twice, so that a second pass just loads and scores again.

## Implementation Decisions

- The Fixture set is `GET /game-meta-data/admin/readiness-fixtures`. The id is the Club or Association row on the account, not the client id in the route. Account type `1` sends `club`. Account type `2` sends `association`. The page query `type` does not change the call.
- CMS decides membership. Admin does not cut `fixtures[].date` against the window. That date is the Sydney start day. The group header and the upcoming/results split both use it. A date after Sydney today is upcoming. Every other Fixture is a result and is scored. The last stored day does not move a started match to upcoming.
- Completeness is one pure function. It receives the result rows already chosen and returns a percentage plus one finding per Fixture that fails. The screen calls it on the first load and again after a reload of the same route. It does not scrape and it does not store.
- Results fixtures are scored on their own. A results fixture is included in the form only when its status is Final and a score is recorded. Each included fixture then has a metadata percentage across date, teams, location, toss, toss winner, and player data. A fixture that fails the Final or score check scores 0. The headline percentage is the average of every results fixture. An empty results set has no percentage. Upcoming has its own scope and is not in this score yet. Player data is the boolean CMS sends. The recorded score is the total, or the first innings when the total is blank.
- Every result Fixture id is sent to the existing single-Fixture result scrape, including Fixtures the score marked complete. The row scrape sends the fixture id only. The grade batch result scrape is not used. The account asset-run trigger is not used. Opening a row still loads the single Fixture.
- The scrape call only confirms that the job was accepted. The second score is a new load of this route, run when staff ask again after the scrapes have had time to write. It must not reuse the first response. A rejected enqueue is shown and does not remove that Fixture from the score.
- The before score and the after score are both shown. Leaving the screen drops them. There is no saved Readiness report.
- A client has one scheduled day a week. The screen can name that day. Choosing another date still loads, scores, and scrapes.
- The account Fixtures tab still uses the grade list and the team-name match.

## Testing Decisions

- A good test asserts the prepared set and the score for fixture-shaped inputs. It does not assert how the screen is built, and it does not call CMS.
- Test the preparation function: a past start day is a result even when the last day is later, a future start day is upcoming and unscored, and a missing total uses the first innings.
- Test the completeness function. Cover an empty set, a complete set, a finished Fixture with no scorecards, a missing team, and an unfinished Fixture with no scorecards.
- Prior art is the due-render accuracy tests and the Content production summary tests: pure functions, fixture-shaped inputs, no network.

## Out of Scope

- Changing the account Fixtures tab.
- Calling Creator, creating a Render, creating Downloads or other assets, or notifying the client.
- The account asset-run trigger and the grade or competition batch result scrape.
- Scoring expected Downloads, write-ups, or roster posters.
- A saved history, a fleet sweep, alerts, or an automatic run.
- Discovering Fixtures that CMS has not already stored.

## Further Notes

- The recorded decision is ADR 0004: the check scrapes results before the scheduled run and does not render.
- ADR 0005: the Fixture set comes from CMS. Admin does not cut the start day against the window. The either-end rule stays in the CMS repo.
- The Creator reply in the content-readiness note describes how production groups Fixtures. This check does not use that path.
- Glossary: Client, Club client, Association client, Club, Association, Fixture, Scheduler, Render, Download, Readiness check. The score on the screen is not a stored Readiness report.
