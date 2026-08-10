# Admin Frontend LLM Handoff — Association to Competition Scrape Trigger

**Purpose:** Add a button in the admin UI that triggers an `association_to_competition` scrape. When clicked, the button calls the CMS endpoint; the job is queued and processed asynchronously by the scraper worker.

**Date:** 2026-03-10

---

## What to Implement

1. **A button** (e.g. "Trigger Association to Competition Scrape" or "Run Association Overview Scrape")
2. **On click:** `POST` to the CMS endpoint with an empty or minimal JSON body
3. **On success:** Show success message (e.g. toast) with jobId and queueName
4. **On error:** Show error message to the user

---

## Endpoint

| Property | Value |
|----------|-------|
| **Method** | POST |
| **URL** | `{CMS_BASE_URL}/api/association-overview-queues/trigger-association-to-competition-scrape` |
| **Auth** | None required |
| **Content-Type** | `application/json` |

---

## Request

**Minimal (recommended):** Send empty object `{}`. CMS applies all defaults.

```json
{}
```

**Optional fields** (all optional; omit for defaults):

| Field | Type | Default |
|-------|------|---------|
| `accountId` | number | — (omit for full run) |
| `jobId` | string | `strapi:${Date.now()}` |
| `runId` | string | `run-YYYY-MM-DD` |
| `options.dryRun` | boolean | false |
| `options.skipAccountSlot` | boolean | true |
| `options.jobMaxConcurrency` | number | 3 |

---

## Response

**Success (200):**
```json
{
  "success": true,
  "jobId": 123,
  "runId": "run-2026-03-10",
  "message": "Association to competition scrape job queued successfully",
  "queueName": "scrape:association-to-competition"
}
```

**Error (400/500):** Strapi error shape with `error.message`.

---

## Minimal Implementation

```typescript
const CMS_BASE_URL = process.env.NEXT_PUBLIC_CMS_URL ?? "http://localhost:1337";

async function triggerAssociationToCompetitionScrape() {
  const res = await fetch(
    `${CMS_BASE_URL}/api/association-overview-queues/trigger-association-to-competition-scrape`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message ?? data?.message ?? `Request failed: ${res.status}`);
  return data;
}

// Button handler
const handleClick = async () => {
  setLoading(true);
  try {
    const result = await triggerAssociationToCompetitionScrape();
    toast.success(`Job ${result.jobId} queued to ${result.queueName}`);
  } catch (e) {
    toast.error(e instanceof Error ? e.message : "Failed to trigger scrape");
  } finally {
    setLoading(false);
  }
};
```

---

## Placement Suggestion

- Add the button near existing scrape/queue triggers (e.g. "Trigger Clients List Scrape" if present)
- Or in an Association / Data Collection / Scraper admin section

---

## Full Reference

For complete TypeScript types, validation rules, and React examples, see:
`admin-frontend-trigger-association-to-competition-integration.md`
