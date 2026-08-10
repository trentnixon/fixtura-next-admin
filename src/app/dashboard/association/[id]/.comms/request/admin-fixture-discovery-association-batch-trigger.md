# Admin integration handoff — fixture discovery (association batch trigger)

This document is for the Admin/CMS app team to run **fixture discovery for every grade** under an association in one action. The CMS sends the **Strapi association document id**; the backend walks `association → competitions → grades`, then enqueues **one** Bull job on the `fixture_discovery` queue **per grade** that has a usable `url` (same worker payload contract as the single-grade trigger).

**Source:** [`src/api/association/controllers/handlers/admin/TriggerFixtureDiscoveryAssociationBatch.js`](../../controllers/handlers/admin/TriggerFixtureDiscoveryAssociationBatch.js)
**Related request spec:** [../request/fixture-discovery-association-trigger.md](../request/fixture-discovery-association-trigger.md)
**Single-grade variant (one grade):** [../../../grade/.comms/handoff/admin-fixture-discovery-grade-trigger.md](../../../grade/.comms/handoff/admin-fixture-discovery-grade-trigger.md)

---

## What it does

- **POST** with `{ "associationId": <id> }` loads the association, all linked competitions, and all grades under those competitions.
- For each grade with a non-empty **`url`**, the backend enqueues **one** `fixture_discovery` job with:
  - `sport` from **`association.Sport`** (same value for every job in the batch)
  - `ID` = Strapi grade id
  - `URL` from `grade.url`, normalized to an absolute PlayHQ URL when stored as a relative path (same rules as the single-grade endpoint)
- Grades **without** a usable `url`, or with a missing `id`, are **skipped** (not errors); see `skipped` in the success response.

---

## Endpoint

Strapi REST prefix is `/api` (see `config/api.js`). Use your deployed API base (e.g. `https://<cms-api-host>`).

| Method | Path (relative to `/api`)                      | Handler                                    |
| ------ | ---------------------------------------------- | ------------------------------------------ |
| `POST` | `/association/trigger-fixture-discovery-batch` | `association.triggerFixtureDiscoveryBatch` |

**Full URL example**

- `POST https://<api-host>/api/association/trigger-fixture-discovery-batch`

---

## Authentication

- Route is configured with **`auth: false`** (same pattern as other CMS scrape/trigger endpoints in this codebase).
- Treat as **internal / trusted Admin traffic** only (network, gateway, or VPN as applicable). Coordinate with Backend on JWT or policy gating if the Admin app is not on a trusted path.

---

## Request

**Headers**

- `Content-Type: application/json`

**Body**

```json
{
  "associationId": 567
}
```

| Field           | Type             | Required | Rule                                                                               |
| --------------- | ---------------- | -------- | ---------------------------------------------------------------------------------- |
| `associationId` | number (integer) | Yes      | Strapi `api::association.association` document id; must be a **positive integer**. |

Use the association id the user is acting on in Admin (e.g. association detail, settings, or a row action).

---

## Success response

**HTTP `200`**

```json
{
  "success": true,
  "associationId": 567,
  "sport": "AFL",
  "competitionsScanned": 6,
  "gradesFound": 42,
  "queued": 39,
  "skipped": 3,
  "queueName": "fixture_discovery",
  "runId": "cms-fixture-discovery-association-1712345678901"
}
```

| Field                 | Type      | Notes                                                                                                                    |
| --------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------ |
| `success`             | `boolean` | Always `true` for HTTP 200.                                                                                              |
| `associationId`       | `number`  | Echo of the association id processed.                                                                                    |
| `sport`               | `string`  | Value from `association.Sport`; shared by every queued job in this batch.                                                |
| `competitionsScanned` | `number`  | Count of competitions linked to the association.                                                                         |
| `gradesFound`         | `number`  | Total grades discovered across all competitions (including those skipped).                                               |
| `queued`              | `number`  | Number of `fixture_discovery` jobs actually enqueued.                                                                    |
| `skipped`             | `number`  | Grades not queued (missing `id` or empty/missing `url`).                                                                 |
| `queueName`           | `string`  | Always `"fixture_discovery"`.                                                                                            |
| `runId`               | `string`  | Correlation id for logs; includes timestamp; all jobs in this batch share the same `runId` in their Bull `jobId` suffix. |

**Semantics:** Success means jobs were **accepted and queued**, not that fixture discovery finished. Workers process `fixture_discovery` asynchronously.

**Counts:** For the flattened grade list, **`gradesFound === queued + skipped`** (each row is either enqueued or skipped).

---

## TypeScript (reference)

Useful shapes for Admin clients (adjust `strictNullChecks` as needed):

```ts
export interface FixtureDiscoveryAssociationBatchRequest {
  associationId: number;
}

export interface FixtureDiscoveryAssociationBatchResponse {
  success: true;
  associationId: number;
  sport: string;
  competitionsScanned: number;
  gradesFound: number;
  queued: number;
  skipped: number;
  queueName: "fixture_discovery";
  runId: string;
}
```

---

## Error responses

Validation and missing-data cases return **`400 Bad Request`** with the error **message string** in the body (same parsing pattern as other Strapi trigger endpoints in Admin).

Typical messages (exact text useful for support):

| Condition                  | Message (representative)                   |
| -------------------------- | ------------------------------------------ |
| Missing `associationId`    | `associationId is required`                |
| Invalid `associationId`    | `associationId must be a positive integer` |
| Association does not exist | `Association not found: <id>`              |
| No sport on association    | `Association has no Sport`                 |
| Sport is enum `Unknown`    | `Association Sport must not be Unknown`    |

**HTTP `500`**: Unexpected server or queue errors. Message may include `Error queueing fixture discovery association batch: ...`.

---

## Relationship to the single-grade trigger

| Action                          | Endpoint                                                | Body                                   |
| ------------------------------- | ------------------------------------------------------- | -------------------------------------- |
| One grade                       | `POST /api/grade/trigger-fixture-discovery`             | `{ "id": <gradeId> }`                  |
| All grades under an association | `POST /api/association/trigger-fixture-discovery-batch` | `{ "associationId": <associationId> }` |

Both enqueue to **`fixture_discovery`** with the same payload shape (`sport`, `ID`, `URL`). Prefer the **batch** endpoint when the user wants to refresh discovery for every grade in the association without individual grade actions.

---

## UI integration checklist

- [ ] Call **POST** `/api/association/trigger-fixture-discovery-batch` with JSON `{ "associationId": associationId }` when the user runs “fixture discovery for all grades” (or equivalent).
- [ ] On **200**, show success with summary: e.g. “Queued **{queued}** jobs (**{skipped}** skipped).” Optionally show `runId` for support.
- [ ] On **400**, surface the backend message or map known messages to friendlier copy.
- [ ] Do not assume synchronous completion; individual fixture discovery still happens in workers.
- [ ] If `queued === 0` and `gradesFound > 0`, explain that grades may be missing URLs in CMS; if `gradesFound === 0`, the association may have no competitions or no grades.

---

## Data prerequisites (why 400 or skips happen)

**Batch fails up front (400) if:**

- Association **`Sport`** is missing or **`Unknown`** (same rule as single-grade).

**Per-grade skips (200 with `skipped` > 0):**

- Grade has no **`url`**, or url is blank after trim.
- Grade has no **`id`** (unexpected; counted in `skipped`).

Competitions with **zero** grades do not fail the request; they only affect counts.

---

## Date

- Document reflects implementation of `TriggerFixtureDiscoveryAssociationBatch` and `POST /api/association/trigger-fixture-discovery-batch`.
