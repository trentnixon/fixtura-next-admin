# Admin Frontend: Trigger Club Active Check Scrape — Button Integration

**From:** CMS (Strapi) Backend Team  
**To:** Admin Frontend Team  
**Date:** 2026-03-22  
**Purpose:** Call **`POST /api/club/trigger-club-active-check-scrape`** to enqueue a **club_active_check** job (PlayHQ inactive-org detection → `inactive-ingest` when needed).

---

## 1. Overview

Empty body **`{}`** queues a **full run**: Python loads clubs from **`GET /api/club/recon`** + **`GET /api/club/data`** (clubs with `isActive: false` are already omitted), checks each PlayHQ URL, and POSTs to **`/api/club/inactive-ingest`** only when the inactive sentence matches.

**Use case:** e.g. “Run club active check” or “Scan clubs for inactive PlayHQ org” on an admin tools page.

---

## 2. Endpoint

| Property | Value |
|----------|--------|
| **Method** | `POST` |
| **Path** | `/api/club/trigger-club-active-check-scrape` |
| **Full URL** | `{CMS_BASE_URL}/api/club/trigger-club-active-check-scrape` |
| **Auth** | None required (`auth: false`) |
| **Content-Type** | `application/json` |

---

## 3. Request

All fields optional. Empty **`{}`** is valid.

| Field | Type | Notes |
|-------|------|--------|
| `jobId` | string | Bull job id; default `club-active:<timestamp>` |
| `runId` | string | Default `cms-club-active-<YYYY-MM-DD>` |
| `kind` | string | Must be `"fixture"` if sent |
| `scope` | string | Must be `"club_active_check"` if sent |
| `targets` | array | Usually `[]` for full run |
| `options` | object | e.g. `skipAccountSlot`, `jobMaxConcurrency` |

---

## 4. Success response (200)

```typescript
interface TriggerClubActiveCheckSuccessResponse {
  success: boolean;
  jobId: number;
  runId: string;
  message: string;
  queueName: "scrape:club-active-check";
}
```

---

## 5. Errors

| HTTP | When |
|------|------|
| `400` | Wrong `scope` or `kind` |
| `500` | Queue / server error |

---

## 6. Example

```typescript
await fetch(`${CMS_BASE_URL}/api/club/trigger-club-active-check-scrape`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({}),
});
```

---

## 7. References

- [cms-trigger-club-active-check.md](./cms-trigger-club-active-check.md)  
- [cms-handover-club-active-check-scope.md](./cms-handover-club-active-check-scope.md)  
