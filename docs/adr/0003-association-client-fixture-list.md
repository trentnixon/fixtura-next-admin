# The account fixtures tab lists one organisation

An association client's Fixtures tab lists fixtures for its Association. The id is `accountOrganisationDetails.id`, the scraped organisation, not the client id in the route. The list is `GET /game-meta-data/admin/fixtures?association={id}`.

A club client gets the same tab. That endpoint has no club filter, and fixture rows carry team names, not a Club id. The club list starts from the club drilldown, requests fixtures for each grade that club plays in, and keeps a row only when home or away is a team of this club in that grade.

## Considered options

- Hide the tab on a club client. Rejected after the association list shipped. Staff need the same tab on the club route.
- Pass the club id as the association filter. Rejected. That id is a Club, and the fixtures endpoint would not return this club's matches.
- Needs-result buckets like the grade page. Rejected. That triage already lives on the grade. This tab answers which fixtures belong to the organisation.
- Reuse the fixtures directory table, including Back to associations. Rejected. That button returns to the scraped Association picker. This page's parent is the client.

## Consequences

- Both client types get the Fixtures tab. Do not leave a coming-soon placeholder.
- Match the directory list. Grade groups use the grade name, so two grades with the same name share a group. Filters are team search, grade, and when, and when defaults to all. Columns are date, teams, competition, round, type, and status. View goes to `/dashboard/fixtures/[id]`.
- No back button.
- The section description shows the CMS date window and the count. For an association that count is `meta.total`. For a club it is the number of rows kept for this club. Admin does not send a date range.
- The table opens sorted by date, earliest first. Date, Round, and Status headers still sort. Fixtures with no date stay last.
- One table for the whole window. No pager.
- A missing organisation id uses the same empty state as Grades.
- The list loads when the tab is opened. The default tab stays Financial.
