# Admin integration handoff — fixture discovery (grade trigger)

This document is for the Admin/CMS app team to wire **fixture discovery** for a single grade. The CMS only needs the **Strapi grade document id**; the backend resolves sport and URL and enqueues a Bull job on the `fixture_discovery` queue.

**Source:** [`src/api/grade/controllers/handlers/admin/TriggerFixtureDiscoveryGrade.js`](../../controllers/handlers/admin/TriggerFixtureDiscoveryGrade.js)  
**Related request spec:** [../request/fixture-discovery-grade-trigger.md](../request/fixture-discovery-grade-trigger.md)

---

## What it does

- **POST** with `{ "id": <gradeId> }` queues **one** `fixture_discovery` job.
- Backend fills the worker payload from Strapi: `sport` from `grade → competition → association → Sport`, `ID` = grade id, `URL` from `grade.url` (normalized to an absolute PlayHQ URL when stored as a relative path).

---

## Endpoints

Strapi REST prefix is `/api` (see `config/api.js`). Use your deployed API base (e.g. `https://<cms-api-host>`).

| Method | Path (relative to `/api`) | Handler |
|--------|---------------------------|---------|
| `POST` | `/grade/trigger-fixture-discovery` | `grade.triggerFixtureDiscovery` |
| `POST` | `/grades/trigger-fixture-discovery` | same (alias for REST-style plural) |

**Full URL examples**

- `POST https://<api-host>/api/grade/trigger-fixture-discovery`
- `POST https://<api-host>/api/grades/trigger-fixture-discovery`

Both paths behave identically.

---

## Authentication

- Route is configured with **`auth: false`** (same pattern as other CMS scrape/trigger endpoints in this codebase).
- Treat as **internal / trusted Admin traffic** only (network, gateway, or VPN as applicable). If the Admin app is not on a trusted path, coordinate with Backend on adding JWT or policy gating later.

---

## Request

**Headers**

- `Content-Type: application/json`

**Body**

```json
{
  "id": 1234
}
```

| Field | Type | Required | Rule |
|-------|------|----------|------|
| `id` | number (integer) | Yes | Strapi `api::grade.grade` document id; must be a **positive integer**. |

The id is the primary key of the grade entity the user is acting on in the Admin UI (e.g. from a row action or detail screen).

---

## Success response

**HTTP `200`**

```json
{
  "success": true,
  "jobId": "fixture-discovery:1234:cms-fixture-discovery-grade-1712345678901",
  "runId": "cms-fixture-discovery-grade-1712345678901",
  "message": "Fixture discovery grade job queued successfully",
  "queueName": "fixture_discovery",
  "gradeId": 1234
}
```

| Field | Notes |
|-------|--------|
| `jobId` | Bull job id (string). |
| `runId` | Correlation id for logs; includes timestamp. |
| `queueName` | Always `"fixture_discovery"`. |
| `gradeId` | Echo of the grade id enqueued. |

**Semantics:** Success means the job was **accepted and queued**, not that fixture discovery completed. The worker consumes `fixture_discovery` asynchronously.

---

## Error responses

Validation and missing-data cases return **`400 Bad Request`** with the error **message string in the body** (Strapi `badRequest` shape may wrap this; align with how other trigger endpoints are parsed in Admin).

Typical validation messages from the backend (exact text useful for support):

| Condition | Message (representative) |
|-----------|----------------------------|
| Missing `id` | `id is required` |
| Invalid `id` | `id must be a positive integer` |
| Grade does not exist | `Grade not found: <id>` |
| No PlayHQ URL on grade | `Grade has no url` |
| No linked competition | `Grade has no competition` |
| No linked association | `Competition has no association` |
| No sport on association | `Association has no Sport` |
| Sport is enum `Unknown` | `Association Sport must not be Unknown` |

**HTTP `500`**: Unexpected server/queue errors. Message may include `Error queueing fixture discovery grade job: ...`.

---

## UI integration checklist

- [ ] Call **POST** with JSON body `{ "id": gradeId }` when the user triggers “fixture discovery” for that grade.
- [ ] Prefer **either** `/api/grade/trigger-fixture-discovery` **or** `/api/grades/trigger-fixture-discovery` and keep it consistent in the Admin client.
- [ ] On **200**, show a short success state (job queued); optionally display `jobId` or `runId` for support.
- [ ] On **400**, surface the error message to the user where safe (or map known messages to friendlier copy).
- [ ] Do not assume synchronous completion; polling or notifications for worker outcome are out of scope for this endpoint unless Backend provides a separate status API later.

---

## Data prerequisites (why 400 can happen)

For the job to queue, the grade must have:

- Non-empty **`url`**
- Linked **`competition`**
- Competition linked to **`association`**
- Association **`Sport`** set to a value **other than** `Unknown` (enum includes Cricket, AFL, Netball, etc.)

If Admin cannot fix data in-app, users may need to correct relations or association sport in CMS before retrying.

---

## Date

- Document reflects implementation as of backend addition of `TriggerFixtureDiscoveryGrade` and `grade.triggerFixtureDiscovery` routes.
