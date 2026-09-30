# 📁 Tickets.md – Renders UI Migration & Monitoring

## Completed Tickets

- **TKT-2026-001**: Implementation of Global Render Monitoring Suite (Routes A-E)
- **TKT-2025-001**: Align render overview component styling
- **TKT-2025-002**: Migrate renders route to UI library
- **TKT-2025-003**: Enhance render detail page UI/UX

---

## Summaries of Completed Tickets

### TKT-2026-001: Global Render Monitoring Suite
**Status**: Completed (2026-01-02)
**Impact**: Established a comprehensive monitoring system for all platform rendering activity.
**Key Features**:
- **Live Telemetry**: Real-time rollup cards for active renders and 24h health.
- **Analytical Dashboard**: Period-based charts for system throughput and asset production density.
- **Account Leaderboards**: Visual tracking of "Heavy Hitters" and global asset mix.
- **Operational Audit**: Specialized master table with deep population and real-time status mapping.
- **Deep DNA Audit**: Individual render integrity checker that compares scheduler expectations against actual output.

---

### TKT-2025-001: Align Render Overview Styling
**Status**: Completed (2025-01-27)
**Impact**: Unified the render overview visuals with the rest of the admin dashboard.
- Replaced custom CSS with standardized `Card` components.
- Applied consistent accent colors and typography.
- Integrated Lucide icons for metrics.

---

### TKT-2025-002: Renders Route Migration
**Status**: Completed (2025-01-27)
**Impact**: Full migration to the modern UI library.
- Integrated `PageContainer`, `SectionContainer`, and `CreatePageTitle`.
- Standardized `LoadingState`, `ErrorState`, and `EmptyState`.
- Enhanced performance by updating hooks to support efficient refetching.

---

### TKT-2025-003: Render Detail Page Enhancements
**Status**: Completed (2025-01-27)
**Impact**: Improved information density and navigation on the render detail view.
- Added "Back to Account" navigation.
- Consolidated header layout for better visibility.
- Replaced redundant timeline data with high-density `MetricGrid`.

---

## Active Tickets

### TKT-2026-002

---
ID: TKT-2026-002
Status: Draft
Priority: High
Owner: Development Team
Created: 2026-09-28
Updated: 2026-09-28
Related: CMS download-quality-control-cms-response, download-quality-control-admin-decisions, spec download-quality-control-spec-body.md (GitHub issue: create with `ready-for-agent`)
---

## Overview

Implement **download attention** in the Renders workspace: per-render Downloads QC first, then fleet queue when CMS ships Option A. Keep download flags, render integrity, and asset-run failures as three separate signals (no merged queue).

## What We Need to Do

Deliver operator triage for failed or suspect download output rows without conflating Creator flags, integrity audit, or account-asset-run failures.

## Phases & Tasks

### Phase A — Render detail + Overview callout (no new CMS route)

- [x] Extend `fetchDownloadByRenderId` with `publicationState=preview`, `errorHandler`, `UserErrorMessage`, `errorEmailSentToAdmin`, `updatedAt`
- [x] Add download attention bucket helper (`Failed` / `In progress` / `OK` / `Unknown`) per admin decisions doc
- [x] Update `TableDownloads`: filters, error display (`UserErrorMessage` + `errorHandler` Type chips), Unknown badge
- [x] Wire `POST /api/download/ForceAssetRerender` with refetch; document stale `hasError` after rerender
- [x] Add Overview **three-signal** cards (download attention → render detail; integrity → Integrity Audit tab; pipeline → Render activity failed filter)

### Phase B — Fleet queue (blocked on CMS Option A)

- [ ] Types + service for `GET /api/downloads/admin/quality-queue` (path per CMS final contract)
- [ ] New Renders tab **Download attention**: paginated table, default needs-attention window (7d on `updatedAt`)
- [ ] Row actions: open render, open download detail, force rerender
- [ ] Account label via `render → scheduler → account` (`FirstName`), client overview link

### Phase C — Overview summary (blocked on CMS Option B)

- [ ] Sydney day-bucket summary tiles on Overview (do not use render telemetry `failedToday`)

### Phase D — Article QC (later)

- [ ] Separate tab when CMS article queue exists; Pressbox fields as source of truth

## Constraints, Risks, Assumptions

- Fleet-wide Strapi `GET /api/downloads` without Option A is too slow/unindexed for production queue.
- Do not extend `GET /api/renders/audit`, telemetry, or lineage for download QC.
- CMS comms: `.comms/Strapi/response/download-quality-control-cms-response.md`
- Admin decisions: `.comms/Strapi/response/download-quality-control-admin-decisions.md`
