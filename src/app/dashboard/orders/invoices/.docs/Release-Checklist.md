# Release Checklist — Invoice Workspace

## Automated gates

- [x] `npm run test:invoices` — 126 tests pass (13 files)
- [x] `npm run test` — 148 tests pass (15 files)
- [x] No new invoice-related TypeScript errors
- [x] ESLint on invoice-related paths — no invoice failures observed
- [x] Stale Keep reapplies dirty fields only (regression test)
- [x] Duck-typed CMS errors survive server actions

## Live gates

- [x] Read-only GET list (staging/dev)
- [x] Read-only GET detail (staging/dev sample)
- [x] GET missing invoice returns 404
- [x] Read-only GET orders overview + order detail (QA 21)
- [ ] PATCH mutation matrix (blocked — no fixtures)
- [ ] Issuance invariants (blocked — no fixtures)
- [ ] Concurrency STALE_* (blocked — no fixtures)
- [ ] Integrity LINKED_ORDER_* (blocked — no fixtures)
- [ ] Insufficient-token 403 (blocked — no second token)

## Permissions

- [x] `APP_API_KEY` server-only (not `NEXT_PUBLIC_*`)
- [ ] Explicit verification of `adminInvoicesList`, `adminInvoicesDetail`, `adminInvoicesUpdate` on intended token

## CMS dependencies

- [ ] Confirm `LINKED_ORDER_REQUIRED` guard deployed
- [x] Document no-order recovery limitation (no Admin create/link workflow)

## Build / deploy

- [ ] Production build passes in CI (local build blocked: `.next/trace` EPERM)
- [x] Rollback steps documented in QA report

## UI / accessibility (QA 22 — outstanding)

- [ ] Queue responsive desktop / tablet / mobile
- [ ] Editor grids + long URL layout
- [ ] Labels, aria-invalid / aria-describedby, aria-pressed, dialog a11y, keyboard

## Recommendation

**Conditionally ready** — ship to staging for staff UAT; hold production until blocked live mutation gates complete and QA 22 UI/a11y pass is signed off.
