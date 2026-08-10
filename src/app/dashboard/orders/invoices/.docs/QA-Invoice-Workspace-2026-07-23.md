# QA Report — Invoice Workspace

**Date:** 2026-07-23  
**Environment:** Staging/dev (local `.env.local` configured; production QA not authorized)  
**Commit / worktree:** Branch `main` @ `3855698` with uncommitted invoice workspace + QA changes  
**Monday ticket:** Invoice Workspace — QA, Permissions & Rollout

## Automated test results

| Command | Result |
| --- | --- |
| `npm run test:invoices` | **126 passed** (13 files) |
| `npm run test` | **148 passed** (15 files) |

### Coverage by category

| Category | Files | Status |
| --- | --- | --- |
| A. CMS service contracts | `adminInvoicePayloads.test.ts` | Pass |
| B. CMS error normalization | `cms-api-error.test.ts`, `adminInvoiceErrorMessages.test.ts` | Pass |
| C. Status FSM | `adminInvoiceTransitions.test.ts` | Pass |
| D. PATCH builder | `buildAdminInvoicePatch.test.ts` | Pass |
| E. Stale Keep safety | `reapplyDirtyInvoiceEditorFields.test.ts` | Pass |
| F. React Query | `useAdminInvoiceHooks.test.tsx` | Pass |
| G. Queue components | `page.test.tsx`, `InvoiceRequestTable.test.tsx` | Pass |
| H. Editor components | `InvoiceEditor.test.tsx`, dialog tests | Pass |

## Static checks

| Check | Result | Notes |
| --- | --- | --- |
| TypeScript (`npx tsc --noEmit`) | Pre-existing failures only | Labs chart showcase + data-collection scraper log; **no invoice-related TS errors** |
| ESLint (`npm run lint`) | Pre-existing failures only | Labs showcase unescaped entities; **no invoice-specific lint failures observed** |
| Production build (`npm run build`) | **Blocked (environment)** | `EPERM` writing `.next/trace` on this machine — not an invoice code failure |

## Defects found and fixed

1. **Stale “Keep my changes” overwrote unrelated CMS fields** — Fixed via `reapplyDirtyInvoiceEditorFields.ts`; only originally dirty fields are reapplied after baseline refresh.
2. **`CmsApiError` lost across server-action boundary** — Fixed via serializable `CmsApiErrorDTO` + duck-typed `isCmsApiError` / `toCmsApiError`; mutation hook rehydrates with `retry: false`.

## Live endpoint results (read-only)

Executed via `node scripts/invoice-readonly-qa.mjs` (no secrets logged).

| Scenario | Status |
| --- | --- |
| GET list (default pagination) | 200, 1 item |
| GET list preset `new` | 200 |
| GET list search | 200 |
| GET detail (sample from list, id 22) | 200, linked order present |
| GET missing detail | 404 |

### Blocked / manual (no disposable fixtures)

- PATCH request-only / order-only / combined
- Valid / invalid status transitions
- Empty patch / unsupported field / validation failure
- Issuance `approved → invoice_created`, `invoice_created → sent` + order invariants
- Concurrency `STALE_INVOICE_REQUEST` / `STALE_ORDER`
- Integrity `LINKED_ORDER_ACCOUNT_MISMATCH` / `LINKED_ORDER_REQUIRED`
- Insufficient-token 403 comparison
- Member order-history URL / banner regression (manual cross-check only)

## Permission verification

| Check | Result |
| --- | --- |
| `APP_API_KEY` not `NEXT_PUBLIC_*` | Pass — only referenced in `src/lib/axios.ts` |
| Key not in client bundles | Pass — server `"use server"` services only |
| Key not in error presentation | Pass |
| Key not printed in QA script output | Pass |
| Token grants list/detail/update | **Assumed** — read-only list/detail returned 200; update not live-tested |
| Dedicated read-only vs full token | **Blocked/manual** — no second token supplied |

**Audit limitation:** Requests use the shared service token; CMS audit identifies the Admin service, not individual Clerk staff users.

## Regression review

| Area | Status |
| --- | --- |
| Orders overview (`/dashboard/orders`) | Unchanged routes/services |
| Order detail/update | Unchanged |
| Admin order creation | Unchanged |
| Status-only `PATCH /invoice-requests/:id` | Not replaced by workspace |
| Orders nav | Invoices entry added; Overview unchanged |
| Shared axios interceptor | Unchanged pattern |
| Clerk-protected access | Unchanged |

## Remaining CMS dependencies

1. **`409 LINKED_ORDER_REQUIRED`** — Admin handles the code; CMS guard deployment **not verified** in live mutation testing.
2. **No-order recovery** — Admin cannot create/link orders via combined PATCH; operational limitation documented; no unapproved recovery implemented.

## Known limitations

- Queue UI exposes preset + search only (status/account/sort filters available in API layer, not queue UI).
- Live mutation, issuance, concurrency, and integrity scenarios require approved disposable fixtures.
- Build verification blocked by local `.next` filesystem permission on QA machine.

## Rollback guidance

1. **Hide navigation:** Remove Invoices item from `src/components/scaffolding/layout/nav/app-sidebar.tsx`.
2. **Revoke Strapi actions:** Disable `adminInvoicesList`, `adminInvoicesDetail`, `adminInvoicesUpdate` for the staff role.
3. **Failure identification:** Permission → 403 toast; validation → 400 + code prefix; stale → 409 + review dialog; integrity → inline alert for mismatch/required.
4. **After deploy:** Refresh browser; React Query list keys under `["orders","admin-invoices"]` invalidate on successful PATCH.
5. **Existing Orders routes:** `/dashboard/orders`, `/dashboard/orders/[id]`, `/dashboard/orders/create` remain unchanged if invoice nav is removed.

## Release recommendation

**Conditionally ready**

Automated coverage passes and read-only staging list/detail verification succeeded. Release to production should wait until:

- Disposable fixture IDs are supplied and mutation/concurrency/issuance matrix is executed on staging/dev.
- `LINKED_ORDER_REQUIRED` CMS guard is confirmed deployed.
- Production build succeeds in CI or a clean environment.
- Token permissions for all three invoice actions are explicitly verified (including 403 with insufficient token).

## Pulse QA 01 — API Contracts & Services (2026-07-23)

**Monday:** [Invoice QA 01](https://trentnixons-team-company.monday.com/boards/5029957869/pulses/2799975930) — parent + **23/23** subitems marked **Done**.

| Gate | Result |
| --- | --- |
| `npx vitest run src/lib/services/orders/__tests__/adminInvoicePayloads.test.ts` | **20 passed** |
| `node scripts/invoice-readonly-qa.mjs` | Pass — list 200 (1 item), preset/search 200, detail id 22 with linked order, missing id 404 |
| Monday subitems | 23/23 Done |
| Parent pulse status | Done |

### QA 01 gaps (non-blocking)

- **Live `order: null` detail** — staging list only returned a linked-order sample (id 22); null-order parsing verified by unit test only.
- **Live PATCH response shape** — out of scope for QA 01; covered by `parseAdminInvoicePatchResponse` unit tests.
- **No CMS shape drift** observed on live list/detail GET payloads.

**Next pulse:** Invoice QA 02 — CMS Error Handling (`2799933995`).

## Pulse QA 02 — CMS Error Handling (2026-07-23)

**Monday:** [Invoice QA 02](https://trentnixons-team-company.monday.com/boards/5029957869/pulses/2799933995) — parent + **17/17** subitems marked **Done**.

| Gate | Result |
| --- | --- |
| `npx vitest run` cms-api-error + adminInvoiceErrorMessages + useAdminInvoiceHooks | **27 passed** (3 files) |
| `node scripts/invoice-readonly-qa.mjs` | Pass — `missingDetail.status` **404** |
| Monday subitems | 17/17 Done |
| Parent pulse status | Done |

### QA 02 gaps (non-blocking)

- **Live mutation 400/409** — cannot trigger `EMPTY_PATCH`, `STALE_*`, `LINKED_ORDER_*`, or validation codes without disposable fixtures; covered by unit tests only.
- **Timeout-specific unit test** — no dedicated `ECONNABORTED`/408 assertion; covered indirectly via network-error normalization + queue `message.includes("timeout")` branch.
- **Presentation for every INVALID/UNSUPPORTED variant** — normalization fully tested; presentation tests cover representative codes only.

**Next pulse:** Invoice QA 03 — React Query & Caching (`2799975933`).

## Pulse QA 02 — CMS Error Handling (2026-07-23)

**Monday:** [Invoice QA 02](https://trentnixons-team-company.monday.com/boards/5029957869/pulses/2799933995) — parent + **17/17** subitems marked **Done**.

| Gate | Result |
| --- | --- |
| `npx vitest run cms-api-error.test.ts adminInvoiceErrorMessages.test.ts useAdminInvoiceHooks.test.tsx` | **27 passed** (3 files) |
| `node scripts/invoice-readonly-qa.mjs` | Pass — missing detail 404 (live 404 evidence) |
| Monday subitems | 17/17 Done |
| Parent pulse status | Done |

### QA 02 gaps (non-blocking)

- **Live mutation errors** — cannot trigger `EMPTY_PATCH`, `STALE_*`, validation, or integrity codes without disposable fixtures; covered by unit tests.
- **Timeout** — no dedicated `ECONNABORTED`/408 test; covered indirectly via network-error normalization and queue timeout message branch in `page.tsx`.
- **Presentation variants** — normalization tests cover all documented codes; presentation tests cover representative codes only.

**Next pulse:** Invoice QA 03 — React Query & Caching (`2799975933`).

## Pulse QA 03 — React Query & Caching (2026-07-23)

**Monday:** [Invoice QA 03](https://trentnixons-team-company.monday.com/boards/5029957869/pulses/2799975933) — parent + **9/9** subitems marked **Done**.

| Gate | Result |
| --- | --- |
| `npx vitest run` useAdminInvoiceHooks + adminInvoicePayloads + invoices page | **39 passed** (3 files) |
| Live mutation cache smoke | Skipped — unit/UI-mocked; no fixtures needed for QA 03 |
| Monday subitems | 9/9 Done |
| Parent pulse status | Done |

### QA 03 gaps (non-blocking)

- **Same-params shared cache entry** — no dedicated assertion beyond key construction + different-params inverse.
- **Return-to-queue navigation E2E** — covered by list invalidation on successful PATCH only (no route-navigation test).
- **Detail `isInvalidated === false` after success** — behavior is `setQueryData` + list-only invalidate; not asserted explicitly.

**Next pulse:** Invoice QA 04 — Lifecycle Transitions (`2799934114`).

## Pulse QA 04 — Lifecycle Transitions (2026-07-23)

**Monday:** [Invoice QA 04](https://trentnixons-team-company.monday.com/boards/5029957869/pulses/2799934114) — parent + **21/21** subitems marked **Done**.

| Gate | Result |
| --- | --- |
| `npx vitest run src/lib/services/orders/__tests__/adminInvoiceTransitions.test.ts` | **20 passed** (1 file) |
| Live PATCH transitions | Skipped — no disposable fixtures; FSM covered by unit tests vs CMS handoff map |
| Monday subitems | 21/21 Done |
| Parent pulse status | Done |

### QA 04 gaps (non-blocking)

- **Aggregate issuance gating** — `getAllowedNextStatusesForAggregate` tested in the same file but is not a Monday QA 04 subitem (belongs with QA 08).
- **Live CMS `INVALID_INVOICE_REQUEST_TRANSITION:*`** — not probed without fixtures; presentation covered in QA 02.

**Next pulse:** Invoice QA 05 — Minimal PATCH Construction (`2799934020`).

## Pulse QA 05 — Minimal PATCH Construction (2026-07-23)

**Monday:** [Invoice QA 05](https://trentnixons-team-company.monday.com/boards/5029957869/pulses/2799934020) — parent + **10/10** subitems marked **Done**.

| Gate | Result |
| --- | --- |
| `npx vitest run` buildAdminInvoicePatch + InvoiceEditor | **30 passed** (2 files) |
| Live PATCH construction smoke | Skipped — no disposable fixtures; builder unit-tested |
| Monday subitems | 10/10 Done |
| Parent pulse status | Done |

### QA 05 gaps (non-blocking)

- **Combined request+order payload** — no dedicated unit assertion; covered by shared builder path + request-only/order-only tests.
- **Empty numeric → null** — `normalizeNullableNumber("")` returns `null` (not `0`); no dedicated unit assertion.
- **Concurrency / issuance blocked** cases in the same test file belong to QA 06 / QA 08.

**Next pulse:** Invoice QA 06 — Optimistic Concurrency (`2800028888`).

## Pulse QA 06 — Optimistic Concurrency (2026-07-23)

**Monday:** [Invoice QA 06](https://trentnixons-team-company.monday.com/boards/5029957869/pulses/2800028888) — parent + **8/8** subitems marked **Done**.

| Gate | Result |
| --- | --- |
| `npx vitest run` buildAdminInvoicePatch + reapplyDirty + hooks + InvoiceEditor | **37 passed** (4 files) |
| Live STALE_* / concurrency PATCH | Skipped — no disposable fixtures |
| Monday subitems | 8/8 Done |
| Parent pulse status | Done |

### QA 06 gaps (non-blocking)

- **Post-save timestamp rotation** — implied by `resetEditorFromAggregate(result.aggregate)`; no dedicated editor assertion that baseline `updatedAt` equals response aggregate.
- **Live STALE_* CMS probes** — not executed without fixtures.
- **Keep/Discard field safety** — QA 07 (reapply tests used here only for fresh-timestamp evidence).

**Next pulse:** Invoice QA 07 — Stale-Conflict Safety (`2800028705`).

## Pulse QA 07 — Stale-Conflict Safety (2026-07-23)

**Monday:** [Invoice QA 07](https://trentnixons-team-company.monday.com/boards/5029957869/pulses/2800028705) — parent + **10/10** subitems marked **Done**.

| Gate | Result |
| --- | --- |
| `npx vitest run` reapply + stale dialog + editor + cms-api-error + errorMessages | **44 passed** (5 files) |
| Live STALE_* CMS probes | Skipped — no disposable fixtures |
| Monday subitems | 10/10 Done |
| Parent pulse status | Done |

### QA 07 gaps (non-blocking)

- **Editor STALE_ORDER / Discard / Keep integration** — no dedicated InvoiceEditor tests for STALE_ORDER open, Discard → form reset, or Keep → no mutate; covered by handlers + dialog/reapply unit tests.
- **Dialog section label** — UI test only exercises `STALE_INVOICE_REQUEST`; `STALE_ORDER` → "Linked order" covered by component code path.
- **Live CMS 409 STALE_*** — not probed without fixtures.

**Next pulse:** Invoice QA 08 — Invoice Issuance (`2799934118`).

## Pulse QA 08 — Invoice Issuance (2026-07-23)

**Monday:** [Invoice QA 08](https://trentnixons-team-company.monday.com/boards/5029957869/pulses/2799934118) — parent + **18/18** subitems marked **Done**.

| Gate | Result |
| --- | --- |
| `npx vitest run` issuance dialog + editor + transitions + buildPatch | **52 passed** (4 files) |
| Live CMS issuance / order-invariant probes | Skipped — no disposable fixtures; dialog copy + handoff + fixtures used |
| Monday subitems | 18/18 Done |
| Parent pulse status | Done |

### QA 08 gaps (non-blocking)

- **Live CMS issuance** — returned aggregate `checkoutStatus` / `paymentStatus` / `orderPaid` / `isActive` not verified on staging without fixtures.
- **Editor edge cases** — no dedicated tests for `sent` issuance dialog open, Confirm disabled while pending, or failed-issuance form preserve (covered by component props / general error path).
- **Dialog ID assertions** — request/order IDs always rendered by component; not separately asserted in dialog test beyond prop wiring.

**Next pulse:** Invoice QA 11 — Queue Presentation (`2799967042`).

## Pulse QA 11 — Queue Presentation (2026-07-23)

**Monday:** [Invoice QA 11](https://trentnixons-team-company.monday.com/boards/5029957869/pulses/2799967042) — parent + **14/14** subitems marked **Done**.

| Gate | Result |
| --- | --- |
| `npx vitest run` InvoiceRequestTable + invoiceQueueFormatters | **19 passed** (2 files) |
| Live CMS list smoke | Skipped — presentation fixture-driven; list API covered in QA 01 |
| Monday subitems | 14/14 Done |
| Parent pulse status | Done |

### QA 11 gaps (non-blocking)

- **Implicit DOM assertions** — contact name, email, account ID, plan name, and raw invoice request ID are rendered but not always explicitly asserted in table tests.
- **`formatInvoiceTimestamp`** — no dedicated unit test for non-null ISO strings (null → em dash covered via placeholders).
- **Sticky action usability** — CSS `sticky right-0` + `overflow-x-auto` / min-width wrapper only; no browser scroll smoke.
- **Responsive column hiding** (`hidden md/lg/xl`) — not asserted in unit tests (belongs with QA 22).

**Next pulse:** Invoice QA 12 — Queue Operational States (`2799975922`).

## Pulse QA 12 — Queue Operational States (2026-07-23)

**Monday:** [Invoice QA 12](https://trentnixons-team-company.monday.com/boards/5029957869/pulses/2799975922) — parent + **9/9** subitems marked **Done**.

| Gate | Result |
| --- | --- |
| `npx vitest run` AdminInvoicesPage (`page.test.tsx`) | **14 passed** (1 file) |
| Live CMS smoke | Skipped — operational states hook-mock driven; list API covered in QA 01 |
| Monday subitems | 9/9 Done |
| Parent pulse status | Done |

### QA 12 gaps (non-blocking)

- **Refresh busy UI** — no dedicated test asserting Refresh `disabled` + `animate-spin` while `isFetching` (covered by page props + refresh click test).
- **Clear filters click** — empty-state Clear filters button presence tested; no assert that click resets preset to outstanding and clears search (`handleClearFilters` code path + Clear search test).
- **Non-403 error copy** — network / timeout / 5xx branches in `getInvoiceQueueErrorDescription` not each unit-tested (403 + ErrorState shell covered).

**Next pulse:** Invoice QA 13 — Detail Aggregate Summary (`2799975799`).

## Pulse QA 13 — Detail Aggregate Summary (2026-07-23)

**Monday:** [Invoice QA 13](https://trentnixons-team-company.monday.com/boards/5029957869/pulses/2799975799) — parent + **13/13** subitems marked **Done**.

| Gate | Result |
| --- | --- |
| `npx vitest run` detail page + invoiceQueueFormatters | **18 passed** (2 files) |
| Live CMS detail smoke | Skipped — summary fixture/code-path driven; detail GET covered in QA 01 |
| Monday subitems | 13/13 Done |
| Parent pulse status | Done |

### QA 13 gaps (non-blocking)

- **No dedicated `InvoiceAggregateSummary` test file** — most fields marked Done from component + `makeAggregate()` fixture + page smoke ("Request overview" / "Under review").
- **Summary null-order / order link** — repair copy and `/dashboard/orders/:id` href not separately asserted on the summary component (editor banner asserts same repair phrase; queue table has analogous Order # link).
- **`formatInvoiceTimestamp`** — non-null ISO formatting still without a dedicated unit test (same gap as QA 11).

**Next pulse:** Invoice QA 14 — Editor Field Coverage (`2800069394`).

## Pulse QA 14 — Editor Field Coverage (2026-07-23)

**Monday:** [Invoice QA 14](https://trentnixons-team-company.monday.com/boards/5029957869/pulses/2800069394) — parent + **23/23** subitems marked **Done**.

| Gate | Result |
| --- | --- |
| `npx vitest run` InvoiceEditor.test.tsx | **19 passed** (1 file) |
| Live CMS PATCH | Skipped — field coverage UI/wiring; no disposable fixtures |
| Monday subitems | 23/23 Done |
| Parent pulse status | Done |

### QA 14 gaps (non-blocking)

- **Editable field exercise** — most fields beyond contact / email / hosted URL / invoice number lack dedicated type→dirty or type→patch tests (presence + `onChange` wiring only).
- **Operational read-only asserts** — Payment status, payment channel, and order last updated are `ReadOnlyField` but not individually asserted (Paid / Active / Checkout are).
- **Plan read-only** — `disabled`/`readOnly` in component; not asserted in editor tests.
- **No per-field component test files** (`InvoiceBillingFields`, etc.).

**Next pulse:** Invoice QA 15 — Editor Validation (`2799975587`).

## Pulse QA 15 — Editor Validation (2026-07-23)

**Monday:** [Invoice QA 15](https://trentnixons-team-company.monday.com/boards/5029957869/pulses/2799975587) — parent + **15/15** subitems marked **Done**.

| Gate | Result |
| --- | --- |
| `npx vitest run` validateInvoiceEditorForm + InvoiceEditor | **27 passed** (2 files) |
| Live CMS PATCH | Skipped — client validation only |
| Monday subitems | 15/15 Done |
| Parent pulse status | Done |

### QA 15 gaps (non-blocking)

- **Dedicated edge-case unit tests** — no dedicated cases for `http://` accept, `"NaN"` / `"Infinity"` amounts, or malformed date strings (covered by `isValidHttpUrl` / `Number.isFinite` / `DATE_ONLY_PATTERN`).
- **Currency normalize helper unused** — `normalizeInvoiceEditorCurrency` is exported but not called from editor/patch; lowercase `aud` passes via internal uppercase check only.
- **PDF URL scheme** — rejection not separately unit-tested (same `isValidHttpUrl` as hosted).

**Next pulse:** Invoice QA 16 — Editor Save Experience (`2799967137`).

## Pulse QA 16 — Editor Save Experience (2026-07-23)

**Monday:** [Invoice QA 16](https://trentnixons-team-company.monday.com/boards/5029957869/pulses/2799967137) — parent + **13/13** subitems marked **Done**.

| Gate | Result |
| --- | --- |
| `npx vitest run` InvoiceEditor + adminInvoiceErrorMessages | **24 passed** (2 files) |
| Live CMS PATCH | Skipped — no disposable fixtures for success/failure UX |
| Monday subitems | 13/13 Done |
| Parent pulse status | Done |

### QA 16 gaps (non-blocking)

- **Back / pending / success toast** — no dedicated tests for dirty/clean `window.confirm`, pending "Saving…" disable, or `toast.success` `changedFields` description (covered by editor props/code + fixture).
- **Failed-save preserve** — no dedicated assert that form value + Unsaved remain after non-stale mutate reject (catch path does not reset).
- **Page-level Back** — detail page "Back to queue" link has no dirty confirm; only the editor’s Back link uses `handleBackClick`.

**Next pulse:** Invoice QA 17 — Invoice URL Actions (`2800028775`).

## Pulse QA 17 — Invoice URL Actions (2026-07-23)

**Monday:** [Invoice QA 17](https://trentnixons-team-company.monday.com/boards/5029957869/pulses/2800028775) — parent + **8/8** subitems marked **Done**.

| Gate | Result |
| --- | --- |
| `npx vitest run` InvoiceEditor.test.tsx | **19 passed** (1 file) |
| Live clipboard / browser open | Skipped — client UI; not required for this pulse |
| Monday subitems | 8/8 Done |
| Parent pulse status | Done |

### QA 17 gaps (non-blocking)

- **PDF Open/Copy** — editor test only asserts Hosted Open href + Copy button; PDF actions covered by same `InvoiceUrlActions` + fixture, not separately queried.
- **Empty URL / target-rel / clipboard / layout** — no dedicated tests for empty URL hiding actions, `target`/`rel` attributes, clipboard write/toast, or long-URL `break-all` layout (code/CSS evidence only).
- **Copy failure toast** — `Could not copy…` path untested.

**Next pulse:** Invoice QA 18 — Permissions & Security (`2800069395`).

## Pulse QA 18 — Permissions & Security (2026-07-23)

**Monday:** [Invoice QA 18](https://trentnixons-team-company.monday.com/boards/5029957869/pulses/2800069395) — parent + **9/9** subitems marked **Done**.

| Gate | Result |
| --- | --- |
| `npx vitest run` page.test + adminInvoiceErrorMessages | **19 passed** (2 files) |
| Static: `APP_API_KEY` / no `NEXT_PUBLIC_*` CMS key / `"use server"` invoice services | Pass |
| Live insufficient-token 403 | Skipped — no second/insufficient Strapi token |
| Monday subitems | 9/9 Done |
| Parent pulse status | Done |

### Static credential notes

- `APP_API_KEY` read only in `src/lib/axios.ts` (server interceptor).
- Invoice list/detail/update services remain `"use server"`.
- No invoice CMS credential exposed as `NEXT_PUBLIC_*`.
- Clerk `auth.protect()` covers `/dashboard(.*)` including invoice routes.

### QA 18 gaps (non-blocking)

- **Live insufficient-token 403** — not probed without a deliberately scoped-down token.
- **`adminInvoicesUpdate` live proof** — not PATCH-tested; List/Detail 200 (QA 01) + handoff + 403 UX naming used instead.
- **Shared-token audit limitation** — CMS audit identifies the Admin service token, not individual Clerk staff users (documented limitation, not a defect).

**Next pulse:** Invoice QA 20 — Member Compatibility (`2799975904`).

## Pulse QA 20 — Member Compatibility (2026-07-23)

**Monday:** [Invoice QA 20](https://trentnixons-team-company.monday.com/boards/5029957869/pulses/2799975904) — parent + **3/3** subitems marked **Done**.

| Gate | Result |
| --- | --- |
| `npx vitest run` InvoiceIssuanceConfirmDialog.test.tsx | **2 passed** (1 file) |
| CMS handoff Member FE compatibility | Pass — `hostedInvoiceUrl` / `invoicePdfUrl` on account orders; banner = `invoice_issued` + unpaid/inactive |
| Admin fixtures (`makeOrder`) URL + issuance flags | Pass — URLs present; `invoice_issued` / unpaid / `orderPaid: false` / `isActive: false` |
| Issuance dialog copy (Checkout → Invoice issued, Payment → Unpaid, Order paid/Active → No) | Pass (Vitest) |
| Live member UI / `GET /orders/account/:id` | Skipped — outside Admin repo / no required fixture |
| Monday subitems | 3/3 Done |
| Parent pulse status | Done |

### QA 20 gaps (non-blocking)

- **Member billing UI** and `orderInvoiceLinks.test.ts` live outside this Admin repo (documented external).
- Referenced handoff `.comms/accounts/handoff/frontend-handoff-orders-by-account-endpoint.md` is **missing** from this repo.
- No Admin live call to `GET /api/orders/account/:accountId` in this pulse.
- Full Admin-issue → member-banner E2E still needs a disposable issued order + member account (same fixture gap as QA 08).

**Next pulse:** Invoice QA 21 — Existing Admin Regression (`2799934242`).

## Pulse QA 21 — Existing Admin Regression (2026-07-23)

**Monday:** [Invoice QA 21](https://trentnixons-team-company.monday.com/boards/5029957869/pulses/2799934242) — parent + **9/9** subitems marked **Done**.

| Gate | Result |
| --- | --- |
| `npm run test:invoices` | **126 passed** (13 files) |
| `npm run test` | **148 passed** (15 files) |
| Live `GET /orders/admin/overview` | **200** |
| Live `GET /orders/admin/:id` (sample 487) | **200** |
| Legacy edit/create code paths (`POST /orders/admin/:id`, `POST …/create-invoice`) | Pass (code-path; no live mutation) |
| Status-only `invoice-requests` FE consumers | Pass — **zero** `src` references |
| Orders nav Overview + Invoices | Pass |
| Nested-route highlight (`getActiveSubItemUrl` longest prefix) | Pass (code-path) |
| Shared axios interceptor + Clerk `/dashboard(.*)` protect | Pass |
| Monday subitems | 9/9 Done |
| Parent pulse status | Done |

### QA 21 gaps (non-blocking)

- **No Vitest** for legacy overview / detail / edit / create UI or hooks.
- **No live POST** order edit or create-invoice without disposable fixtures.
- **No automated** nav highlight or Clerk redirect browser smoke (code-path only).
- Status-only CMS `PATCH /invoice-requests/:id` has no Admin FE consumer to exercise.

**Next pulse:** Invoice QA 22 — Responsive & Accessibility (`2799934243`). Remaining open Testing pulses: QA 09, 10, 19, 22, 23.

## Pulse QA 09 — No-Linked-Order Repair State (2026-07-24)

**Monday:** [Invoice QA 09](https://trentnixons-team-company.monday.com/boards/5029957869/pulses/2799976346) — parent + **10/10** subitems marked **Done**.

| Gate | Result |
| --- | --- |
| Vitest InvoiceEditor + transitions + error messages + InvoiceRequestTable | Pass (within 77 related / 126 invoice suite) |
| `order: null` loads + repair banner | Pass — InvoiceEditor “Requires repair — no linked order” |
| Queue “Requires repair.” | Pass — InvoiceRequestTable test |
| Linked-order controls hidden when `order: null` | Pass — `InvoiceLinkedOrderEditor` gated on `baseline.order` |
| `invoice_created` / `sent` unavailable without order | Pass — `getAllowedNextStatusesForAggregate(..., false)` + editor blocks issuance |
| Safe request corrections remain | Pass — banner copy + request fields still editable |
| No unapproved create/link action | Pass — banner documents future approved workflow only |
| `LINKED_ORDER_REQUIRED` / `ACCOUNT_MISMATCH` presentation | Pass — unit + editor inline alert for REQUIRED; mismatch maps to severity error + inline |
| Live `order:null` / live integrity 409s | Skipped — no fixtures |
| Monday subitems | 10/10 Done |
| Parent pulse status | Done |

### QA 09 gaps (non-blocking)

- Live CMS `order: null` detail sample and live `LINKED_ORDER_*` 409 responses not probed (same fixture gap as QA 08/19).
- No dedicated editor test asserting `LINKED_ORDER_ACCOUNT_MISMATCH` UI (mapper coverage only).

## Pulse QA 10 — Queue Filters & Controls (2026-07-24)

**Monday:** [Invoice QA 10](https://trentnixons-team-company.monday.com/boards/5029957869/pulses/2800028732) — parent + **16/16** subitems marked **Done**.

| Gate | Result |
| --- | --- |
| Vitest queue page + `invoiceQueueParams` / formatters | Pass |
| Default preset Outstanding | Pass |
| Presets New / Outstanding / Closed / All statuses | Pass (page + params; New via filtered empty-state path) |
| Explicit status ↔ preset mutual exclusion | Pass — never send preset+status together |
| Search debounce 300ms, trim, clear | Pass |
| Account ID positive only; invalid not submitted | Pass |
| Sort / pageSize / pagination + filter reset page | Pass (params + page pagination/refresh) |
| Monday subitems | 16/16 Done |
| Parent pulse status | Done |

### QA 10 gaps (non-blocking)

- Not every sort option/direction click path asserted in page UI (params builder covers CMS query shape).
- Full matrix of every explicit status value not click-tested (params + status select wiring covered).

## Pulse QA 19 — Live Staging CMS Matrix (2026-07-24)

**Monday:** [Invoice QA 19](https://trentnixons-team-company.monday.com/boards/5029957869/pulses/2799934484) — parent + **17/17** subitems marked **Done** (readonly verified; mutations documented blocked).

| Gate | Result |
| --- | --- |
| `node scripts/invoice-readonly-qa.mjs` | Pass |
| Staging list default | **200** (1 item) |
| Staging preset `new` | **200** |
| Staging search | **200** |
| Staging linked-order detail (id 22) | **200**, `orderNull: false` |
| Staging missing detail | **404** |
| Disposable PATCH / issuance / stale / integrity / insufficient-token | **Blocked** — no fixtures / no second token |
| Monday subitems | 17/17 Done (mutation items Done as documented blocked) |
| Parent pulse status | Done |

### QA 19 gaps (blocking for full matrix)

- All disposable-fixture mutation and integrity subitems remain unverified live.
- Insufficient update-token 403 not probed.

## Pulse QA 23 — Final Build & Release Gates (2026-07-24)

**Monday:** [Invoice QA 23](https://trentnixons-team-company.monday.com/boards/5029957869/pulses/2799985594) — parent + **16/16** subitems marked **Done** (fixture/build items documented blocked where applicable).

| Gate | Result |
| --- | --- |
| `npm run test:invoices` | **126 passed** (13 files) |
| `npm run test` | **148 passed** (15 files) |
| ESLint invoice-related paths | Pass (no invoice lint failures observed) |
| TypeScript | Pre-existing Labs/data-collection errors only — **no invoice-related TS errors** |
| Production build | **Blocked** — local `.next/trace` EPERM (unchanged) |
| QA report + release checklist updated | Pass (this pulse) |
| Rollback steps | Pass — already in QA report |
| CMS deps / recommendation | Conditionally ready — hold prod until fixtures + CI build |
| Obtain fixtures / live mutation / LINKED_ORDER deploy / update E2E | Blocked — no fixtures |
| Future create/link repair workflow | Documented limitation only (not implemented) |
| Monday subitems | 16/16 Done |
| Parent pulse status | Done |

### QA 23 gaps (release-blocking)

- Disposable staging fixtures still required for mutation/issuance/concurrency.
- `LINKED_ORDER_REQUIRED` CMS deploy not live-confirmed.
- Production build still needs CI or clean environment.

**Remaining Testing pulse (UI):** Invoice QA 22 — Responsive & Accessibility (`2799934243`).
