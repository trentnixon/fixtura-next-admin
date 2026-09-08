# Account Health Reconcile Button — fixtura-admin handoff

**Ticket:** TKT-2026-022 (Backend tracker; implement in fixtura-admin repo)

**Status:** Shipped in fixtura-admin (run detail only).

## What to build

Wire **Reconcile** on admin run detail when an account health run is in **completed limbo** (`status === "completed"` && `finalizedAt == null`). **Abort** stays visible only for active runs (`pending`, `queued`, `running`).

## Backend endpoint (already exists)

```http
POST /api/account/health/runs/:runId/reconcile
```

Same auth as abort: admin bearer (`assertAdminBearerAuth` / APP_API_KEY).

## Admin tasks

- [x] `reconcileAccountHealthRun.ts` service + hook (mirror abort pattern)
- [x] Reconcile button on run detail when completed-limbo
- [x] Hide Abort in completed-limbo; Reconcile is primary
- [x] Invalidate run / account / global health queries after reconcile
- [x] Refresh `.comms/account-health-run-abort-handoff.md` status table
- [x] Mirror account health glossary in fixtura-admin `CONTEXT.md` (see Backend `CONTEXT.md`)

## Related

- Canonical abort handoff: fixtura-admin `.comms/account-health-run-abort-handoff.md`
- Spec: fixtura-admin `.comms/specs/account-health-reconcile-button-spec.md`
- Backend admin API doc: `src/api/account/.docs/admin/account-health-status-admin-handoff.md`
