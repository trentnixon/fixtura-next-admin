# API lock — Download quality queue (CMS v1)

**Date:** 2026-09-29  
**Status:** Superseded for implemented behaviour — use [.comms/Strapi/handoff/cms-handoff-download-quality-queue.md](../handoff/cms-handoff-download-quality-queue.md) (`attention` field, failed-then-in-progress sort). This file remains historical lock context.  
**Admin RFI:** [.comms/Admin/handoff/cms-rfi-download-quality-queue.md](../../Admin/handoff/cms-rfi-download-quality-queue.md)  
**Product decisions:** [download-quality-control-admin-decisions.md](./download-quality-control-admin-decisions.md)

---

## Route

`GET /api/downloads/admin/quality-queue`

- **Auth:** Bearer API token (same as `GET /api/renders/audit`). Not public.
- **Permission**
  - Handler: `download.qualityQueue`
  - Scope: `api::download.download.qualityQueue`
  - Role: Settings → Users & Permissions → Roles → API token role → **Download** → **`qualityQueue`**
  - Full-access token: no checkbox. Missing permission → **403**. Missing route → **404**.

---

## Query params (v1)

| Param | Behaviour |
|--------|-----------|
| `from`, `to` | Inclusive ISO on download `updatedAt`. If omitted, CMS default last **48 hours**. |
| `page` | Default `1` |
| `pageSize` | Default **25**, cap **100** |
| `needsAttention` | Fleet sends `true`. See membership rules below. |
| Sort | `updatedAt` **desc** (fixed in v1) |

Admin fleet page always sends `from`, `to`, `page`, `pageSize`, `needsAttention=true`.

---

## `needsAttention=true` membership

Include a row when **either**:

1. **Failed:** `hasError === true`, or `errorHandler` is a **non-empty** array.
2. **In progress:** not Failed, and `hasBeenProcessed === false`.

**Failed wins** (e.g. `hasError: true` + `hasBeenProcessed: false` → Failed).

**Excluded:** processed and not Failed; all other cases (including ambiguous legacy).

**CMS coercion:** `hasBeenProcessed` **null → false**. `hasError` **null is not coerced**.

**Drafts:** included; query must not use published-only entity default.

**Account:** `render → scheduler → account`. No scheduler account → `account: null`. `type` = `account_type.Name`.

**Indexing (CMS):** filter `updatedAt` window first, then attention rules.

---

## JSON

- **CamelCase** on the wire (same pattern as `GET /api/account-asset-runs/render-activity`).
- Strapi schema names are mapped in the handler, not exposed on the wire.

### Envelope

```ts
{
  data: DownloadQualityQueueRow[];
  meta: {
    from: string;
    to: string;
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
    returned: number;
  };
}
```

No `queueAvailable` in CMS JSON. Admin may set `queueAvailable: false` only when synthesizing a local empty response after **404/501** before deploy.

### Row

```ts
type DownloadQualityQueueRow = {
  downloadId: number;
  name: string | null;
  hasError: boolean | null;
  hasBeenProcessed: boolean;
  userErrorMessage: string | null;
  errorHandler: Array<{ Message?: string; Type?: string }> | null;
  errorEmailSentToAdmin: boolean;
  forceRerender: boolean;
  groupingCategory: string | null;
  assetCategoryIdentifier: string | null;
  assetCategoryName: string | null;
  assetName: string | null;
  assetLinkId: string | null;
  gameId: string | null;
  url: string | null;
  updatedAt: string;
  render: {
    id: number;
    name: string | null;
    complete: boolean;
    processing: boolean;
    publishedAt: string | null;
  } | null;
  account: {
    id: number;
    firstName: string | null;
    lastName: string | null;
    sport: "Cricket" | "AFL" | "Hockey" | "Netball" | "Basketball" | null;
    type: string | null;
  } | null;
};
```

`errorHandler`: empty array, null, or non-array does **not** count as Failed. `[]` is written after force rerender.

---

## Out of scope (v1)

- Read/write QC review fields, bulk force rerender.
- Force rerender: `POST /api/download/ForceAssetRerender` (unchanged).
- Article QC, integrity audit, render-activity failures, Option B summary tiles.

---

## Admin implementation notes

- Types: `src/types/downloadQualityControl.ts`
- Fetch: `src/lib/services/downloads/fetchDownloadQualityQueue.ts`
- Primary error text: `userErrorMessage`, else first non-empty `errorHandler[].Message` — `resolveDownloadPrimaryErrorMessage` in `src/lib/downloads/downloadAttention.ts`
