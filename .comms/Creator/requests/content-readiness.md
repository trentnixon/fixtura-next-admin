# Brief: what a Readiness check will count

**Date:** 2026-10-11
**From:** fixtura-admin
**To:** Creator
**Code changes:** none

**Admin note, after the response below:** The Readiness check will not call Creator. It will not create a Render, Downloads, or any assets, and it will not notify the client. It is a result scrape before the real run. The response stays as a record of how production treats Fixtures. It is not a build instruction.

## What we are doing

Staff will run a Readiness check before a client's scheduled generation. The check uses the Fixtures CMS already holds, scrapes results, and returns a score. It does not create a Render or any Downloads.

A client has one scheduled day a week. The score is for that client on that Sydney generation date. The window is two weeks before that date and one week after it. That span is agreed. The generation date is the anchor even when delivery is another day.

An association client includes stored Fixtures in that Association's competitions. A club client includes stored Fixtures in the grades that club plays in, and only where one of its teams is home or away.

The score counts expected Downloads: the outputs a Render would produce from an eligible Asset. An Asset is eligible when it is published, on the client's package, and the sport matches. One Asset does not mean one Download per Fixture. A weekend video may combine many Fixtures into one output.

## What we need from you

No Creator code changes. We need the rules you already use in production, written down.

1. **Date boundaries.** Which Fixture date enters the window, whether both ends are inclusive, and whether the two weeks and one week are 14 days and 7 days. Scheduler dates in Admin are Sydney calendar dates. Say if Fixture dates use a different timezone.
2. **Two-day Fixtures.** Which date places the Fixture in the window, and at what match status a final result becomes required.
3. **Grouping.** For each eligible Asset, how Fixtures become expected Downloads. Say when many Fixtures are one output, and when one Fixture is one output.
4. **Required data.** For each expected Download, what data is required, and which stored Fixture it names when a Fixture is required. A missing Fixture is reported only when one of these rules names it. We will not look for games that were never stored.
5. **Result or upcoming.** Which outputs need a final result, and which need only the upcoming-Fixture fields. A past start date alone does not mean a final result is expected.
6. **Skippable outputs.** Until you say an expected Download can be skipped, every one is required, and Ready means all of them can be produced. Name any output production can skip without blocking the Render.
7. **No Scheduler.** A manual check can use a date that is not the client's scheduled day. Can you still list the expected Downloads for that client and date? If not, that check stays incomplete and has no percentage.

---

# Response: production rules for a Readiness check

**Date:** 2026-10-11
**From:** Creator
**To:** fixtura-admin
**Code changes:** none

This is what a live generation does today. Cricket is the current path. AFL and netball still run the older path. The two are not the same, so the score has to branch on sport.

Creator does not decide which Assets are eligible. It takes the `AssetRequirements` list returned by `GET api/account/getAccountDetailsForScheduler/{accountId}` and tries each one. Published, package, and sport match are CMS filters on that list. The only sport check here is that `AccountInfo.Sport` is a non-empty string. If it is missing, the account job stops before any Download is created.

A Download is one row posted to `api/downloads`. Write-ups are not Downloads. They are rows posted to `api/ai-articles`, and only when the Asset sits in the category `Write up options`. Leave write-ups out of the Download score unless you want a second score. Roster posters are a separate job and are not built from the fixture window.

## 1. Date boundaries

Creator does not apply "14 days before the Sydney generation date and 7 days after it".

**Cricket.** The fixture request has no date. `POST api/game-meta-data/fetchGameDataForScheduler` is sent with `accountId`, `organisation` (`type` and `id`), `grades` (`gradeId` and `teamIds`), and `includeJuniorSurnames`. CMS returns each bucket already split into `pastGames` and `futureGames`. Creator keeps that split. It does not compare `details.date`, `details.dayOne`, `details.finalDaysPlay`, `details.dateRange`, or `details.dateRangeObj` with the generation date.

If CMS sends a calendar date `YYYY-MM-DD`, that string is kept. If CMS sends an instant such as `2026-01-04T09:48:56.414Z`, Creator turns it into a calendar date with the server's local clock (`getFullYear`, `getMonth`, `getDate`). That is not forced to Australia/Sydney. The upcoming video label is the exception: `details.date` is formatted with `timeZone: 'Australia/Sydney'`.

**AFL and netball.** The query field is `dateObj` on `game-data-afls` or `game-data-netballs`. Both ends are inclusive (`$gte` and `$lte`). The start is 7 times 24 hours before `Date.now()`. The end is 7 times 24 hours after `Date.now()`. Both bounds are UTC instants from `toISOString()`. The anchor is the clock at fetch time, not the Sydney generation date stored in Admin, and not 14 days back.

Past versus upcoming, for AFL and netball, is then decided by status, not by where `dateObj` sits inside that window. See section 5.

## 2. Two-day Fixtures

Creator does not pick a date that places a two-day Fixture in the window. For cricket, CMS has already placed the game. For AFL and netball, `dateObj` placed it, and status then decides past or upcoming.

The cricket type string is `Two Day+`. `details.date`, `details.dayOne`, and `details.finalDaysPlay` are all stored. `dateRange` and `dateRangeObj` are not used to include or exclude a game.

A final result is required only in the sense that the game can enter a results output. The gates are:

- Status `Abandoned`. No scorecard is required. The game still produces wording.
- Type `Two Day+` and status `In Progress`. At least one of `innings1` or `innings2` must exist. Creator also pulls these games out of `futureGames` and into the results set. A game CMS filed as future can still be a result.
- Every other status. `system.isFinished` must be true, and both `innings1` and `innings2` must exist.

A start date in the past does not open that gate. A `Two Day+` game that is `In Progress` but has neither innings does not enter results.

AFL and netball do not have this two-day branch. A game enters the past bucket when status is `Final`, `In Progress`, or `Abandoned`, or when `isFinished` is true and status is not `Upcoming`. The results video then keeps only games with `isFinished === true`. An `In Progress` game can sit in the past bucket and still be left out of the results Download.

## 3. Grouping

One eligible Asset produces one Download per fixture bucket, and that Download holds every qualifying Fixture in the bucket. Creator does not make one Download per Fixture.

`divideFixturesBy` only sets how many Fixtures share a screen inside that one video. Account theme can override it. When the theme does not, results, upcoming, result-single, ladder, and roster use 1 per screen, and the performance lists and Team of the Week use 2. That number does not change the Download count.

**Cricket buckets.** The bucket key is whatever CMS returned (`SENIOR`, a grade name, a competition name, and so on). Creator does not send `group_assets_by` and does not re-bucket. One key, one Download, for each Asset whose data for that key is usable.

`CricketResults` and `CricketResultSingle` use the same finished-game list. Result Single is still one Download. It is not one Download per Fixture.

**AFL and netball buckets.** `AccountInfo.group_assets_by` chooses the key.

- Association, flag false: one bucket per competition name.
- Association, flag true: one bucket per `competition name - grade name`.
- Club, flag false: `Junior` and `Senior` only. Empty buckets are dropped.
- Club, flag true: `Junior`, `Senior`, `Masters`, and `Special`. Empty buckets are dropped.

**Club membership.** Cricket sends `teamIds` with each `gradeId` and then uses every game CMS returns. It does not drop a game because the club is neither home nor away. Batting lists, bowling lists, and Team of the Week, for a club, keep performances whose team name matches a club team. The results and upcoming videos still include the whole game.

AFL and netball clubs build a team id list and then do not apply it. The query is grade id plus `dateObj`. Every Fixture in those grades inside the window is included, including games the club does not play.

**Write-ups, if you score them separately.** They follow the same buckets, then:

- Cricket posts one article per bucket per write-up Asset, with every prompt in that article. The batch and single branches both do this. Result Single does not split.
- AFL and netball batch compositions post one article per bucket. Those ids are `WeekendResultsAFL`, `UpComingAFLFixtures`, `Top5AFLScorers`, `AFLLadder`, and the netball equivalents `WeekendResultsNetball`, `UpComingNetBallFixtures`, `Top5NetballScorers`, `NetballLadder`.
- `WeekendSingleGameResultAFL` and `WeekendSingleGameResultNetball` are the split. One article per Fixture in the bucket. The video Download for those same composition ids is still one video for the whole bucket.

## 4. Required data

Creator does not write a missing-Fixture report. A stored Fixture is either inside an output or left out. Do not name a Fixture that was never returned. Do not name a returned Fixture that failed a gate below. Production would not have required it.

When a rule does include a Fixture, the id to store is:

- Cricket: `system.id` (the CMS game meta id, also written onto the Render as `game_meta_datum`) and `system.gameID`.
- AFL and netball: the fixture `id` and `gameID`.

**Cricket, per composition, per bucket**

| Composition                             | Games that go in                                                                                                                                                                                  | Download is created when                                                                    |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `CricketResults`, `CricketResultSingle` | Past games, plus `Two Day+` / `In Progress` games taken from future. Then the gates in section 2.                                                                                                 | At least one game passes.                                                                   |
| `CricketUpcoming`                       | Every game in `futureGames`. No result fields. The label uses `details.date` in Sydney. Also uses time, type, round, ground, `gameID`, grade name, age group, gender, home and away names, logos. | The handler returns a non-empty list. There is no per-game drop for a blank ground or time. |
| `CricketLadder`                         | `pastGames` only. Ladder rows come from `environment.grade.ladder` (team name, position, W, L, P, PTS, TIE, N/R). Grades are deduped.                                                             | At least one past game. An empty list creates no Download.                                  |
| `CricketTop5Batting`                    | Precomputed batting for that bucket, first 5, no minimum runs.                                                                                                                                    | The list is non-empty.                                                                      |
| `CricketBattingPerformances`            | Same batting list, no cap, minimum 25 runs.                                                                                                                                                       | The list is non-empty.                                                                      |
| `CricketTop5Bowling`                    | Precomputed bowling for that bucket, first 5, no minimum wickets.                                                                                                                                 | The list is non-empty.                                                                      |
| `CricketBowlingPerformances`            | Same bowling list, no cap, minimum 2 wickets.                                                                                                                                                     | The list is non-empty.                                                                      |
| `CricketTeamOfTheWeek`                  | Past games, then a side built from qualifying players (batters from 20 runs, bowlers from 5 overs).                                                                                               | A side is actually selected. Not enough players returns null and that Asset is skipped.     |

Club batting, bowling, and Team of the Week ignore performances that are not for a club team name. An empty list after that filter skips that Asset only.

**AFL, per composition, per bucket**

| Composition                                       | Games that go in                                                                                 | Download is created when                                                                                                  |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `WeekendResultsAFL`, `WeekendSingleGameResultAFL` | Past-bucket games with `isFinished === true`.                                                    | At least one finished game.                                                                                               |
| `UpComingAFLFixtures`                             | Intended source is `futureGames` (game id, round, home, away, logos, date, time, ground, grade). | The current handler reads `useFixtures` instead of its argument, throws, and stores nothing. Do not expect this Download. |
| `AFLLadder`                                       | Grades already stored for that bucket, not a fresh read of each Fixture.                         | The handler returns a list. A throw skips it.                                                                             |
| `Top5AFLScorers`                                  | Past games. Players with more than 0 goals, excluding `No players allocated to line-up`. Top 5.  | The list is non-empty. Otherwise the handler returns false and no Download is stored.                                     |

**Netball.** Same shape as AFL, with ids `WeekendResultsNetball`, `WeekendSingleGameResultNetball`, `UpComingNetBallFixtures`, `NetballLadder`, `Top5NetballScorers`. Two of those handlers also read `useFixtures` instead of their argument and currently store nothing: `UpComingNetBallFixtures` and `WeekendResultsNetball` (and therefore `WeekendSingleGameResultNetball`, which uses the same handler). Ladder and top scorers use their arguments and can store a Download.

## 5. Result or upcoming

The bucket is the rule. A past start date is not.

**Cricket**

- Results compositions need a game that passes section 2. That is a final result, an abandoned match, or a `Two Day+` match that is `In Progress` and already has an innings.
- Upcoming needs the game to be in `futureGames`. No final result is read.
- A `Two Day+` / `In Progress` game that CMS put in `futureGames` can land in both. Results copies it in. Upcoming still lists every future game and does not remove it.

**AFL and netball**

- Upcoming bucket: status is `Upcoming`.
- Past bucket: status is `Final`, `In Progress`, or `Abandoned`, or `isFinished` is true and status is not `Upcoming`.
- Results compositions then require `isFinished === true`. Status `In Progress` alone is not enough. Status `Upcoming` is never a result, even if the start time has passed.

## 6. Skippable outputs

Production does not have a list of optional Assets and a list of mandatory ones. Any Asset with no usable data is skipped, and the Render still completes.

That includes:

- A bucket where every Asset comes back empty, false, null, or undefined. That bucket is skipped. Other buckets continue.
- Team of the Week when no side can be picked. Other Assets in the same bucket continue.
- A template that fails to build. That Asset is skipped.
- An upload with an empty data array. No Download row is written.
- Cricket with no grades, or a CMS payload with no fixtures. The Render is closed with zero Downloads. That is a finished empty run, not a stuck Render.
- The AFL upcoming handler, and the netball upcoming and weekend-results handlers, as they stand. They throw and store nothing. The rest of the Render continues.

If Ready means "the Render would close", a skipped Download is normal and must not block the score. If Ready means "every eligible Asset produced a Download", that is stricter than production. Say which one the check is using. Creator will not fail a Render to enforce the stricter one.

## 7. No Scheduler

No. Creator cannot list expected Downloads for a chosen client and a chosen date.

There is no function that takes an account and a Sydney calendar date. Cricket does not send a date. AFL and netball use the clock at fetch time. A Download row is only written when a Render id and a Scheduler id already exist.

A manual check on a date that is not the client's scheduled day can still describe the rules above, but it cannot ask Creator to count the Downloads for that date. Leave that check incomplete, with no percentage. A live run answers "what would be created now", which is a different question.
