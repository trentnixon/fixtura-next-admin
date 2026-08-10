# Completed Tickets

### TKT-2026-054

Implemented remove-fixtures enqueue from grade and competition admin UIs: flat `triggerRemoveFixturesScrape`, `useTriggerRemoveFixturesScrape`, shared `TriggerRemoveFixturesScrapeButton` with multi-account picker, association account mapping on competition drilldown and `GradeRemoveFixturesTrigger` via association admin API on grades; enqueue-only UX copy.

### TKT-2026-053

Implemented batch PlayHQ result scrape from the admin UI: `triggerResultBatchScrape`, `useTriggerResultBatchScrape`, and shared `TriggerResultBatchScrapeButton` on grade detail and competition snapshot, calling `POST /api/game-meta-data/trigger-result-batch-scrape` (`scrape:result-batch`) with toasts, cache invalidation, and scraper log refresh.
