# Admin Frontend Handoff — Club competition refresh & org link repair

**From:** CMS (Strapi) Backend Team  
**To:** Admin Frontend Team  
**Date:** 2026-08-16  
**Purpose:** Update admin buttons and copy so on-demand actions match the new full-catalogue club scrape and org-link sync paths.

---

## Summary

The CMS now routes **bulk club competition scrapes** through the **Global Data Workflow** (`club-competition-refresh`), which processes **all active clubs** (~7,600) in batches of 25 — not the old capped path (~225 clubs).

Legacy endpoints still exist for backward compatibility but **delegate to the same workflow**. Admin should prefer the global workflow URLs for new UI and update labels so operators are not misled.

---

## 1. Bulk “Scrape all clubs” / “Refresh club competitions”

### Use this (recommended)

| Property | Value |
|----------|--------|
| **Method** | POST |
| **Path** | `/api/global-data-workflows/club-competition-refresh/trigger` |
| **Full URL** | `{CMS_BASE_URL}/api/global-data-workflows/club-competition-refresh/trigger` |
| **Auth** | Same as other admin CMS calls (Bearer if your app already sends it) |
| **Body** | `{}` or `{ "idempotencyKey": "optional-operator-key" }` |
| **Header (optional)** | `Idempotency-Key: <same key>` for safe retries |

### Success response (typical)

```typescript
interface ClubCompetitionRefreshResponse {
  success: boolean;
  status: "queued" | "queued-with-warnings" | "failed";
  queueName: "scrape:club-to-competition";
  runId: string;
  runKey: string;
  jobId: string | null;
  queuedCount: number;   // number of batch jobs enqueued (~ clubs / 25)
  itemCount: number;     // same as batch count
  rejectedCount: number;
  warnings: Array<{ batchIndex: number; code: string; message: string }>;
  jobs: Array<{ jobId: string; batchIndex: number; targetCount: number }>;
}
```

### Legacy endpoint (still works — same backend path)

| Property | Value |
|----------|--------|
| **Path** | `/api/club/trigger-club-to-competition-scrape` |
| **Body** | `{}` |

CMS now delegates this to `club-competition-refresh`. Response shape matches the global workflow (includes `itemCount`, `runKey`, `jobs`). **Prefer migrating UI to the global workflow URL** for clarity and parity with association refresh.

### UI copy

- **Do:** “Refresh all club competitions (full catalogue)”  
- **Don’t:** Imply instant completion — full run takes **many hours** (~10h for ~7,600 clubs historically).  
- **Do:** Show `runId` / `runKey` and link to run status if you have a global-data runs view.

---

## 2. Sync club ↔ association links (after scrape)

Scrape creates `club_to_competition` rows; sync copies them into `club.associations` / `association.clubs`. **Run after a club scrape completes** (or on schedule — weekly Monday 1:00 / 1:15 PM Sydney).

### Club → association (all clubs)

| Property | Value |
|----------|--------|
| **Method** | POST |
| **Path** | `/api/global-data-workflows/weekly-club-association-integrity/trigger` |
| **Body** | `{}` or `{ "idempotencyKey": "..." }` |

### Association → club (all associations)

| Property | Value |
|----------|--------|
| **Method** | POST |
| **Path** | `/api/global-data-workflows/weekly-association-club-integrity/trigger` |
| **Body** | `{}` or `{ "idempotencyKey": "..." }` |

### Legacy sync endpoints (still work)

- `POST /api/club/trigger-sync-club-association-links`  
- `POST /api/association/trigger-sync-association-club-links`  

Prefer global workflow triggers for durable runs and retry via `POST /api/global-data-workflows/runs/:runKey/retry`.

---

## 3. Single club scrape (club detail page)

For one club (e.g. repair Nightcliff without full catalogue run):

| Property | Value |
|----------|--------|
| **Method** | POST |
| **Path** | `/api/club/trigger-club-single-scrape` |
| **Body** | `{ "clubId": <number> }` |

Existing integration doc: `src/api/club/.comms/admin-frontend-trigger-club-single-integration.md`

**Suggested UI:** “Scrape this club’s competitions” on club detail/admin view.

After ~1–3 minutes, optionally run club or association sync (§2) or wait for Monday weekly cron.

---

## 4. Do NOT use for org link repair

| Action | Endpoint | Why |
|--------|----------|-----|
| **Process Direct (club)** | `POST /api/club/process-direct` | Legacy account sync worker — not CTC ingest |
| **Process Direct (association)** | `POST /api/association/process-direct` | Same — not club membership scrape |
| **Sync only** | Sync endpoints without prior scrape | Cannot create links without `club_to_competition` data |
| **Association bulk scrape alone** | `association-competition-refresh` | Refreshes competitions only, not which clubs belong |

Update or hide **Process Direct** on association/club admin screens if operators use it expecting link repair.

---

## 5. Batch repair playbook (operator)

For a full org-link repair after data cleanup:

1. **POST** `club-competition-refresh/trigger` — wait for run to complete  
2. **POST** `weekly-club-association-integrity/trigger` and/or `weekly-association-club-integrity/trigger`  
3. Refresh association/club in admin — `clubs` / `associations` / `club_to_competitions` should reflect PlayHQ

---

## 6. Admin implementation checklist

- [ ] Change bulk club scrape button to `POST /api/global-data-workflows/club-competition-refresh/trigger` (or keep legacy URL knowing it now full-catalogue)  
- [ ] Update button label + help text (full catalogue, long runtime)  
- [ ] Add optional “Sync org links” action calling `weekly-club-association-integrity/trigger` (with warning: run after scrape)  
- [ ] Add **single-club scrape** on club detail if not present (`trigger-club-single-scrape`)  
- [ ] Relabel or remove **Process Direct** for link-repair flows  
- [ ] Display `runId` / `runKey` from trigger responses for support  
- [ ] (Optional) Surface global-data run status / retry using `runs/:runKey/retry`

---

## 7. TypeScript helper (example)

```typescript
const CMS_BASE = process.env.NEXT_PUBLIC_CMS_URL!;

export async function triggerClubCompetitionRefresh(idempotencyKey?: string) {
  const res = await fetch(
    `${CMS_BASE}/api/global-data-workflows/club-competition-refresh/trigger`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
      },
      body: JSON.stringify(idempotencyKey ? { idempotencyKey } : {}),
    }
  );
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function triggerClubAssociationIntegrity(idempotencyKey?: string) {
  const res = await fetch(
    `${CMS_BASE}/api/global-data-workflows/weekly-club-association-integrity/trigger`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
      },
      body: JSON.stringify(idempotencyKey ? { idempotencyKey } : {}),
    }
  );
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
```

---

## 8. CMS backend references

| Topic | Path |
|-------|------|
| Club trigger handler | `src/api/club/controllers/handlers/admin/TriggerClubToCompetitionScrape.js` |
| Global workflow | `src/api/global-data-workflow/services/globalDataWorkflow.js` |
| Monthly club cron | `config/cron-tasks/registry/scraperRefresh.js` (3rd of month, 11:30 AM Sydney) |
| Weekly link sync crons | `config/cron-tasks/registry/organisationRelationships.js` (Mon 1:00 / 1:15 PM Sydney) |
| Single-club scrape doc | `src/api/club/.comms/admin-frontend-trigger-club-single-integration.md` |

---

## Questions

Contact backend if global workflow triggers return `deferred` (capacity guard) or `queued-with-warnings` (partial Redis enqueue) — retry endpoint available on `runKey`.
