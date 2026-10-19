# A readiness check takes its Fixture set from CMS

A Readiness check is for one Club client or one Association client and a Sydney generation date. Admin used to build that set itself. An Association used the association fixture list. A Club used one list per grade, kept when a team label matched. That label match collided, and the list date was a UTC slice of the start.

The set is `GET /game-meta-data/admin/readiness-fixtures`. The id is `accountOrganisationDetails.id`, the Club or Association row, not the client id in the route. Account type `1` sends `club`. Account type `2` sends `association`. A hand-edited `type=Club` does not change the call.

CMS decides which Fixtures are in. Admin does not cut `fixtures[].date` against the window. That date is the Sydney day the match starts. It can sit before `window.start` or after `window.end`. The group header and the upcoming/results split both use it. A date after Sydney today is upcoming. Every other Fixture in the set is a result and is scored. The last stored day does not move a started match to upcoming.

## Considered options

- Keep the grade lists and the team-name match. Rejected. Two teams with the same label collide, and a team with no Club pulls the grade in.
- Drop a returned row whose `date` falls outside the window. Rejected. A Two Day+ match can start before the span, or after it, and still belong because its other stored day is inside. That either-end rule stays in the CMS repo.
- Split upcoming and results on the last stored day when it is present. Rejected. The score would skip a match that has already started.

## Consequences

- Both scores load this route. The second load must not reuse the first response. `GET /game-meta-data/admin/fixture/{id}` opens a row. It is not how the set is built.
- A row scrape sends the fixture id only. CMS rejects a Fixture with no PlayHQ game-centre link.
- The account Fixtures tab still uses the grade list and the name match.
- The group header is the start day. There is no last-day line on the row.
- Step 0 of the check stays. Step 1 no longer says the two account types load different lists. Step 3 keeps the span and says the group header can sit outside it.
- The query name `organisationId` is not a glossary term.
- When the screen switches, the readiness spec is revised so it no longer says Admin cuts the window.
