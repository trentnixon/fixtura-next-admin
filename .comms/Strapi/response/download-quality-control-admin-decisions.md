# Admin decisions — Download QC (Renders workspace)

**Date:** 2026-09-28  
**Status:** Agreed (grill session; all recommended options)  
**CMS source:** [download-quality-control-cms-response.md](./download-quality-control-cms-response.md)

---

## Round 1

| # | Decision |
|---|----------|
| Q1 V1 slice | **Render-detail QC first** (Downloads tab). Overview shows **three-signal** callout (download attention, integrity, pipeline). No temporary global `GET /api/downloads` fleet scan. |
| Q2 Fleet placement | New top-level Renders tab **Download attention** once CMS Option A exists. Until then, Overview strip + callout only (no fake fleet table). |
| Q3 Naming | Fleet tab: **Download attention**. Render detail tab stays **Downloads** with filters: All \| Needs attention \| In progress \| Failed. |
| Q4 Buckets | **Failed:** `hasError === true` OR non-empty `errorHandler`. **In progress:** not Failed and `hasBeenProcessed === false`. **OK:** `hasBeenProcessed === true` and not Failed. **Unknown:** else — neutral badge, never silent green. |
| Q5 Account label | Join `render → scheduler → account`; display `FirstName` (audit parity); link to club/association client overview. |
| Q6 Three signals | Overview: three cards linking to Download attention (when live), render Integrity Audit, Render activity (failed). No merged API or table. |
| Q7 Force rerender | Render detail in v1; fleet queue row action when Option A ships. Route: `POST /api/download/ForceAssetRerender`. |
| Q8 AI articles | Separate **Article QC** tab later; do not block download work. |
| Q9 Docs | CMS response archived; ticket TKT-2026-002; `CONTEXT.md` glossary updated. |

---

## Round 2 (recommended, same session)

| # | Decision |
|---|----------|
| Q10 Default fleet window | **7 days** rolling on `updatedAt`; presets 24h / 48h / 7d / custom ISO range. |
| Q11 Timezones | Fleet filters: **UTC ISO** instants on `updatedAt`. Display timestamps in **Australia/Sydney**. Option B summary rollups use **Sydney** calendar days. Do not reuse render telemetry `failedToday`. |
| Q12 Error display | Primary: `UserErrorMessage`. Secondary: chips from `errorHandler[].Type` (free text). Show `errorEmailSentToAdmin` when true. |
| Q13 Unknown in fleet | Fleet queue **excludes Unknown** by default (Failed + optional In progress filter). Unknown rows only on render-detail Downloads. |
| Q14 Fleet default filter | Queue default: **needs attention** (`hasError === true` OR non-empty `errorHandler`) within window. |

---

## Implementation phases

1. **Phase A (admin-only, CMS ready):** Extend render-detail fetch (`publicationState=preview`, `errorHandler`, attention buckets, error UI, force rerender). Overview three-signal cards.
2. **Phase B (CMS Option A):** `GET` fleet quality-queue route + Download attention tab; row actions for force rerender.
3. **Phase C (CMS Option B):** Overview summary tiles (Sydney buckets).
4. **Phase D:** Article QC tab when CMS article queue exists.

---

## Out of scope v1

- Extend `GET /api/renders/audit`, telemetry, or lineage for download QC.
- Merge asset-run failures into download queue.
- `isAccurate` filters; mark-reviewed / `qcReviewedAt`.
- Bulk force rerender by filter.
