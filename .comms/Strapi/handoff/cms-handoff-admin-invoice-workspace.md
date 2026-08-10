# CMS handoff — Admin Invoice Management Workspace

## Purpose

Staff-only invoice-centric workspace APIs. The **invoice request** is the aggregate root; linked **order** and **account** data are nested. These endpoints are separate from the existing order overview/detail routes and from `PATCH /orders/admin/invoice-requests/:id` (status-only transition).

**Lifecycle (authoritative):**

`invoice_received` → `invoice_created` → `paid`, with terminal exits `declined` | `cancelled`.

The legacy six-step path (`submitted` → `under_review` → `approved` → `invoice_created` → `sent` → `paid`) is **superseded**. Use `scripts/migrate-invoice-lifecycle-v2.js` to remap any leftover legacy rows in this environment.

## Endpoints

| Method | Path | Scope |
| --- | --- | --- |
| GET | `/api/orders/admin/invoices` | `api::order.order.adminInvoicesList` |
| GET | `/api/orders/admin/invoices/:invoiceRequestId` | `api::order.order.adminInvoicesDetail` |
| PATCH | `/api/orders/admin/invoices/:invoiceRequestId` | `api::order.order.adminInvoicesUpdate` |

All require JWT + Fixtura staff role with the matching Users & Permissions scope.

## Unchanged endpoints

- `GET /api/orders/admin/overview`
- `GET /api/orders/admin/:orderId`
- `POST /api/orders/admin/:orderId`
- `PATCH /api/orders/admin/invoice-requests/:invoiceRequestId` (same simplified FSM)

## Status sets

| Group | Statuses |
| --- | --- |
| New (preset) | `invoice_received` |
| Outstanding | `invoice_received`, `invoice_created` |
| Closed / terminal | `paid`, `declined`, `cancelled` |

### Transition table

| From | Allowed to |
| --- | --- |
| `invoice_received` | `invoice_created`, `declined`, `cancelled` |
| `invoice_created` | `paid`, `cancelled` |
| `paid` / `declined` / `cancelled` | _(none)_ |

Explicitly rejected: `invoice_received→paid`, `invoice_created→invoice_received`, any transition from a terminal status, `invoice_created` without linked order + valid billing email + at least one invoice URL, `paid` without an account-matched linked order.

## Order-state matrix

| IR status | Order `checkoutStatus` | `paymentStatus` | `orderPaid` | `isActive` | Notes |
| --- | --- | --- | --- | --- | --- |
| `invoice_received` | _(no issuance)_ | — | — | — | Linked order may be absent |
| `invoice_created` | `invoice_issued` | `unpaid` | `false` | `false` | Requires linked order + URL(s) + billing email; queues exactly one invoice email |
| `paid` | `active` | `paid` | `true` | `true` | Admin must not send these flags |
| `cancelled` / `declined` (with unpaid invoice order) | `incomplete_expired` | `canceled` | `false` | `false` | URLs retained; Member must not show awaiting-payment |

Cancellation uses the same soft-expire fields as member withdraw (`expireAbandonedCheckoutOrder`).

## Email delivery

- On transition **into** `invoice_created`, CMS writes one outbox row in the same DB transaction (`idempotencyKey`: `invoice-request:{id}:lifecycle:invoice_created`).
- Async worker delivers via `emailService.user.invoiceCreated` (prefer hosted URL; include PDF when present).
- Re-PATCH while already `invoice_created`, retry of the same transition, and migration **do not** enqueue duplicates.
- Provider send is **not** part of the DB transaction. Status commits even if later delivery fails.
- PATCH `emailStatus`: `queued` | `not_applicable` (MVP; failed delivery is visible on outbox rows for ops). Staff resend endpoint is out of MVP.

## Core aggregate (detail / PATCH response)

```json
{
  "invoiceRequest": {
    "id": 89,
    "status": "invoice_created",
    "billingOrganisationName": "Example Football Club",
    "billingContactName": "Jane Smith",
    "billingEmail": "accounts@example.com",
    "requestNotes": "Invoice created",
    "requestedStartDate": "2026-08-01",
    "requestedEndDate": "2027-08-01",
    "requestedAmount": 650,
    "currency": "AUD",
    "submittedAt": "2026-07-22T01:00:00.000Z",
    "updatedAt": "2026-07-22T03:00:00.000Z",
    "selectedPlanName": "Club Pass",
    "selectedPlanId": 3
  },
  "account": {
    "id": 123,
    "name": "Example Football Club",
    "type": "Club",
    "email": "accounts@example.com"
  },
  "order": {
    "id": 457,
    "checkoutStatus": "invoice_issued",
    "paymentStatus": "unpaid",
    "orderPaid": false,
    "isActive": false,
    "paymentChannel": "invoice",
    "invoiceNumber": "INV-0042",
    "invoiceDueDate": "2026-08-22",
    "invoicePdfUrl": "https://example.com/invoices/INV-0042.pdf",
    "hostedInvoiceUrl": "https://example.com/invoices/INV-0042",
    "total": 650,
    "currency": "AUD",
    "startAt": "2026-08-01",
    "endAt": "2027-08-01",
    "updatedAt": "2026-07-22T03:00:00.000Z"
  }
}
```

`order` may be `null` when no linked order exists.

## List query parameters

| Param | Type | Notes |
| --- | --- | --- |
| `page` | number | default `1` |
| `pageSize` | number | default `25`, max `100` |
| `search` | string | org name, contact, email, invoice-request id, order id |
| `status` | string | single status filter |
| `accountId` | number | filter by account |
| `preset` | string | `new` \| `outstanding` \| `closed` |
| `outstanding` | boolean | alias for outstanding status set |
| `sort` | string | `submittedAt` (default), `updatedAt`, `requestedAmount`, `status` |
| `sortDir` | string | `asc` \| `desc` (default `desc`) |

## PATCH body

```json
{
  "invoiceRequest": {
    "status": "invoice_created",
    "billingContactName": "Jane Smith",
    "billingEmail": "accounts@example.com",
    "billingOrganisationName": "Example Football Club",
    "requestNotes": "Invoice created",
    "requestedStartDate": "2026-08-01",
    "requestedEndDate": "2027-08-01",
    "requestedAmount": 650,
    "currency": "AUD"
  },
  "order": {
    "invoiceNumber": "INV-0042",
    "invoiceDueDate": "2026-08-22",
    "invoicePdfUrl": "https://example.com/invoices/INV-0042.pdf",
    "hostedInvoiceUrl": "https://example.com/invoices/INV-0042",
    "total": 650,
    "currency": "AUD",
    "startAt": "2026-08-01",
    "endAt": "2027-08-01"
  },
  "expectedInvoiceRequestUpdatedAt": "2026-07-22T03:00:00.000Z",
  "expectedOrderUpdatedAt": "2026-07-22T03:00:00.000Z"
}
```

PATCH response:

```json
{
  "aggregate": { "...full aggregate..." },
  "changedFields": ["invoiceRequest.status", "order.checkoutStatus"],
  "emailStatus": "queued"
}
```

`emailStatus` is `queued` when an outbox row was inserted for this transition, otherwise `not_applicable`.

## Field mapping (camelCase API → Strapi)

| API (invoiceRequest) | Strapi |
| --- | --- |
| `status` | `status` |
| `billingContactName` | `billingContactName` |
| `billingEmail` | `billingEmail` |
| `billingOrganisationName` | `billingOrganisationName` |
| `requestNotes` | `requestNotes` |
| `requestedStartDate` | `requestedStartDate` |
| `requestedEndDate` | `requestedEndDate` |
| `requestedAmount` | `requestedAmount` |
| `currency` | `currency` |

| API (order) | Strapi |
| --- | --- |
| `invoiceNumber` | `invoice_number` |
| `invoiceDueDate` | `invoice_due_date` |
| `invoicePdfUrl` | `invoice_pdf` |
| `hostedInvoiceUrl` | `hosted_invoice_url` |
| `total` | `total` |
| `currency` | `currency` |
| `startAt` | `startOrderAt` |
| `endAt` | `endOrderAt` |

## Errors

Machine-readable `code` is returned separately from the user-facing `message`:

```json
{ "code": "EMPTY_PATCH", "message": "Request body must include invoiceRequest and/or order fields." }
```

| HTTP | Code | When |
| --- | --- | --- |
| 400 | `EMPTY_PATCH` | No invoiceRequest or order keys |
| 400 | `UNSUPPORTED_FIELD:*` | Field not on allowlist |
| 400 | `INVOICE_URL_REQUIRED` | Entering `invoice_created` without a valid hosted or PDF URL (merged resulting state) |
| 400 | `INVALID_INVOICEPDFURL` / `INVALID_HOSTEDINVOICEURL` | URL present but not absolute http(s) |
| 400 | `BILLING_EMAIL_REQUIRED` / `INVALID_BILLING_EMAIL` | Missing or invalid billing email on create |
| 400 | `LINKED_ORDER_REQUIRED` | Create/paid requires a linked order |
| 400 | `INVALID_*` | Other validation (date, amount, currency, status) |
| 400 | `INVALID_INVOICE_REQUEST_TRANSITION:<from>-><to>` | FSM violation |
| 403 | — | Missing staff scope |
| 404 | — | Invoice request not found |
| 409 | `STALE_INVOICE_REQUEST` / `STALE_ORDER` | Optimistic concurrency mismatch |
| 409 | `LINKED_ORDER_ACCOUNT_MISMATCH` | Order belongs to different account |
| 500 | — | Unexpected server error |

## Organisation name resolution

1. `invoiceRequest.billingOrganisationName`
2. `account.onboardingOrganisationName`
3. Account/person display name fallbacks

## Member FE compatibility

Order history (`GET /api/orders/account/:accountId`) exposes `hostedInvoiceUrl`, `invoicePdfUrl`, `checkoutStatus`, `paymentStatus`, `isPaid` (`orderPaid`), and `isActive`. Member apps should **not** depend on invoice-request status strings.

Observable states:

| Stage | Order signals |
| --- | --- |
| Invoice created | `invoice_issued`, unpaid, `orderPaid` false, `isActive` false, URL available |
| Paid | `active`, paid, `orderPaid` true, `isActive` true |
| Cancelled | `incomplete_expired` (+ canceled payment); **must not** match awaiting-payment (`invoice_issued` + unpaid/inactive) |

Billing summary maps `invoice_received` → `invoice_requested` and `invoice_created` → `invoice_sent`.

## Data migration

Script: `scripts/migrate-invoice-lifecycle-v2.js`

| From | To |
| --- | --- |
| `submitted`, `under_review`, `approved` | `invoice_received` |
| `invoice_created`, `sent` | `invoice_created` |
| `paid` / `declined` / `cancelled` | same |
| `expired` | `cancelled` |

Requires `--dry-run` or `--apply`. No email side effects. Reconciles linked-order flags; reports missing/mismatched orders.

## Implementation modules

- Flag / FSM / orchestration helpers: `src/api/order/controllers/services/adminInvoices/invoiceLifecycleV2.js`
- Constants/types: `src/api/order/controllers/services/adminInvoices/invoiceAggregate.constants.js`
- Mapper: `src/api/order/controllers/services/adminInvoices/invoiceAggregateMapper.js`
- Loaders: `loadInvoiceAggregate.js`, `loadInvoiceAggregatesList.js`
- PATCH: `patchInvoiceAggregate.js`
- Status-only FSM: `src/api/order/controllers/services/adminInvoiceRequest/transitionAdminInvoiceRequest.js`
- Email outbox: `api::invoice-email-outbox.invoice-email-outbox` + `invoiceEmailOutbox.js`

## Related

- Monday: [Simplify CMS invoice lifecycle](https://trentnixons-team-company.monday.com/boards/5029957868/pulses/2801881904)
- Cutover checklist: `.comms/accounts/handoff/cms-handoff-invoice-lifecycle-v2-cutover.md`
- Member order history handoff: `.comms/accounts/handoff/frontend-handoff-orders-by-account-endpoint.md`
- OpenAPI: not published in-repo for these routes; this handoff is the contract.

## Admin app integration (Fixtura Admin)

| Layer | Path |
| --- | --- |
| Types | `Admin/fixtura-admin/src/types/adminInvoice.ts` |
| List service | `Admin/fixtura-admin/src/lib/services/orders/fetchAdminInvoices.ts` |
| Detail service | `Admin/fixtura-admin/src/lib/services/orders/fetchAdminInvoiceDetail.ts` |
| PATCH service | `Admin/fixtura-admin/src/lib/services/orders/updateAdminInvoice.ts` (uses HTTP PATCH) |
| Hooks | `Admin/fixtura-admin/src/hooks/orders/useAdminInvoices.ts`, `useAdminInvoiceDetail.ts`, `useAdminInvoiceUpdate.ts` |
| Routes | `/dashboard/orders/invoices`, `/dashboard/orders/invoices/[invoiceRequestId]` |

Admin should use `invoice_received` and the simplified transitions for the invoice workspace.

### Staff permissions (Strapi Admin)

Enable for the Fixtura staff role under **Order**:

| Scope | Handler |
| --- | --- |
| `api::order.order.adminInvoicesList` | GET list |
| `api::order.order.adminInvoicesDetail` | GET detail |
| `api::order.order.adminInvoicesUpdate` | PATCH combined update |

Restart Strapi after deploy if new scopes do not appear.

### Optimistic concurrency (Admin editor)

Before save, send the latest `invoiceRequest.updatedAt` as `expectedInvoiceRequestUpdatedAt`. When a linked order exists, also send `order.updatedAt` as `expectedOrderUpdatedAt`. On **409**, refetch detail and prompt the user to review stale changes.

### Cache / refetch

After a successful PATCH, replace local editor state with `response.aggregate`. Invalidate list queries keyed `["orders", "admin-invoices"]`.

### Representative QA fixtures

- **New request, no order**: list preset `new` (`invoice_received`), detail opens with `order: null`.
- **Issue invoice**: PATCH status `invoice_created` with invoice URL(s) → order returns `checkoutStatus: invoice_issued`, unpaid/inactive; `emailStatus: queued`.
- **Mark paid**: PATCH `paid` → order `active` / paid / active flags.
- **Cancel after create**: order leaves `invoice_issued` (→ `incomplete_expired`); Member awaiting-payment banner clears.
- **Member history**: `GET /orders/account/:id` row includes `hostedInvoiceUrl` / `invoicePdfUrl` for invoice-channel orders.

### Automated tests (Backend)

- `src/api/order/controllers/services/adminInvoices/*.test.js`
- `src/api/order/controllers/services/adminInvoiceRequest/transitionAdminInvoiceRequest.test.js`
- `src/api/order/controllers/services/ordersByAccountMapper.test.js`
- `src/api/order/__tests__/custom-routes.test.js`
- `scripts/migrate-invoice-lifecycle-v2.test.js`

### Automated tests (Member app)

- `application/src/app/(members)/o/[accountId]/billing/_utils/orders/orderInvoiceLinks.test.ts`
