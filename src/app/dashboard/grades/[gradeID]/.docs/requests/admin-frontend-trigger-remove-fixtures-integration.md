# Admin Frontend: Remove-fixtures enqueue — grade page

**Purpose:** Tracks how the grade detail route consumes the CMS remove-fixtures enqueue endpoint.

## Contract

- Root comms doc: [`.comms/admin-frontend-trigger-remove-fixtures-scrape-integration.md`](../../../../../../../.comms/admin-frontend-trigger-remove-fixtures-scrape-integration.md)

## Implementation

- **Container:** [`../../components/GradeRemoveFixturesTrigger.tsx`](../../components/GradeRemoveFixturesTrigger.tsx) — loads owning association Fixtura accounts via [`useAssociationDetail`](../../../../../../../hooks/association/useAssociationDetail.ts) (`GET /association/admin/:id`).
- **Shared UI:** [`../../../../competitions/components/TriggerRemoveFixturesScrapeButton.tsx`](../../../../competitions/components/TriggerRemoveFixturesScrapeButton.tsx) — confirm dialog, mandatory account picker when multiple accounts linked.
