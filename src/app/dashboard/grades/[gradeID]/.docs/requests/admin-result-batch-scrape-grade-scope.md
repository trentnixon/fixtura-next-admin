# Grade detail: batch result scrape

The **Scrape results** action on `/dashboard/grades/[gradeID]` calls `POST /api/game-meta-data/trigger-result-batch-scrape` with `sourceType: "grade"` and `sourceId` equal to this grade’s Strapi id. See implementation ticket **TKT-2026-053** and integration doc [`../../../../competitions/.comms/admin-frontend-trigger-result-batch-scrape-integration.md`](../../../../competitions/.comms/admin-frontend-trigger-result-batch-scrape-integration.md).
