# State — 2026-04-21

## Current Focus

Grade detail (`/dashboard/grades/[gradeID]`): **Discover Fixtures** queues CMS `POST /grade/trigger-fixture-discovery` (`fixture_discovery` queue). Association detail still has grades batch scrape and related triggers per prior work.

## Next Actions

- [ ] Manual QA fixture discovery button (success toast + dialog; 400 keeps dialog open).
- [ ] **CMS (if still applicable):** Fix 405 on `POST /api/competition/trigger-grades-batch-scrape` if not yet deployed.
- [ ] Smoke-test grades batch after any CMS route fix.
- [ ] Optional: artifact viewer / payload expander for data jobs when prioritized.

## Blockers / Risks

- **Strapi:** Grades batch POST may still return **405** until route is registered correctly (historical item — confirm env).
