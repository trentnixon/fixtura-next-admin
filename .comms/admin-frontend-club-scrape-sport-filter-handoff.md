# Admin Frontend: Club scrape triggers — optional per-sport filter (`options.sport`)

**From:** CMS (Strapi) Backend Team  
**To:** Admin Frontend Team  
**Date:** 2026-03-25  
**Purpose:** Document **`options.sport`** on club queue jobs so the admin can run **club_to_competition** and **club_active_check** for **one sport** instead of all sports. CMS recon/data endpoints and trigger payloads are aligned with the Python scraper contract.

---

## 1. What changed

| Layer | Change |
|-------|--------|
| **CMS APIs** | `GET /api/club/recon` and `GET /api/club/data` accept optional `filters[sport][$eq]=<slug>`. Same slug values as each club’s `sport` field in `/api/club/data`. |
| **Queue jobs** | For **`club_to_competition`** and **`club_active_check`**, Python reads **`options.sport`** (non-empty string). When set, it calls recon/data **with** that filter so only clubs for that sport are processed. |
| **Admin triggers** | **`POST /api/club/trigger-club-to-competition-scrape`** and **`POST /api/club/trigger-club-active-check-scrape`** forward the request body to Redis. Include **`options.sport`** when you want a sport-scoped run. |

**Backend detail:** Trigger handlers **merge** your `options` with the same defaults as before (`dryRun`, `skipAccountSlot`, `jobMaxConcurrency`, and for club-to-competition `playhqMaxPages`). You can send only `{ "options": { "sport": "cricket-australia" } }` without losing defaults.

---

## 2. When to use

| Goal | Request body |
|------|----------------|
| **Full run (all sports)** | `{}` — unchanged. |
| **One sport only** | `{ "options": { "sport": "<slug>" } }` with `targets: []` (or omit `targets`). |

Use a **sport-scoped** run when ops want “refresh Cricket clubs only” or “active-check Netball only” without queuing work for every sport.

---

## 3. Sport values (must match CMS / Python)

Use the **slug** form (same as `sport` on club rows from `/api/club/data`):

| `options.sport` | Typical label |
|-----------------|---------------|
| `unknown` | Unknown |
| `cricket-australia` | Cricket |
| `afl` | AFL |
| `hockey` | Hockey |
| `netball` | Netball |
| `basketball` | Basketball |
| `football` | Football |
| `rugby` | Rugby |

Values are **case-sensitive**. An unknown slug yields **no clubs** from recon (Python still runs; job completes quickly with nothing to scrape).

---

## 4. Endpoints and payloads

### 4.1 Club → competition (full list from CMS)

| Property | Value |
|----------|--------|
| **Method** | `POST` |
| **Path** | `/api/club/trigger-club-to-competition-scrape` |
| **Auth** | None required (`auth: false`) |

**Sport-scoped example:**

```json
{
  "targets": [],
  "options": {
    "sport": "cricket-australia"
  }
}
```

**Full run (unchanged):**

```json
{}
```

---

### 4.2 Club active check (recon + data + PlayHQ inactive detection)

| Property | Value |
|----------|--------|
| **Method** | `POST` |
| **Path** | `/api/club/trigger-club-active-check-scrape` |
| **Auth** | None required (`auth: false`) |

**Sport-scoped example:**

```json
{
  "targets": [],
  "options": {
    "sport": "netball"
  }
}
```

**Full run:**

```json
{}
```

---

## 5. UI suggestions (non-binding)

- **Optional sport selector** (dropdown or autocomplete) above “Run” for each trigger, default **empty** = all sports.
- When a sport is selected, POST with `options.sport` set to the slug; when empty, POST `{}`.
- **Labels** can show friendly names (“Cricket”) while values sent to the API use the slug (`cricket-australia`).

---

## 6. References

| Document | Purpose |
|----------|---------|
| [cms-response-club-recon-data-sport-filter.md](./cms-response-club-recon-data-sport-filter.md) | CMS → Python: recon/data filter behaviour |
| [cms-club-recon-data-sport-filter-request.md](./cms-club-recon-data-sport-filter-request.md) | Original contract |
| [admin-frontend-trigger-club-to-competition-integration.md](./admin-frontend-trigger-club-to-competition-integration.md) | Club → competition button integration |
| [admin-frontend-trigger-club-active-check-integration.md](./admin-frontend-trigger-club-active-check-integration.md) | Active check button integration |
