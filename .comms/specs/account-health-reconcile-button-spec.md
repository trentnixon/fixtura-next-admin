# Spec: Account Health Reconcile Button (fixtura-admin)

**Tracker:** GitHub Issues — `trentnixon/fixtura-next-admin`  
**Triage label:** `ready-for-agent`  
**Related handoff:** `.comms/Strapi/handoff/account-health-reconcile-button-handoff.md`  
**Backend ticket reference:** TKT-2026-022 (Backend tracker)  
**Depends on:** Abort run support (already implemented in admin)

---

## Problem Statement

When a client’s **season data refresh** (account health run) reaches workflow `completed` but never **finalizes**, the run sits in **completed limbo** — all steps show done, `finalizedAt` is empty, and the account may remain blocked or appear stuck. Operators currently have no admin UI action to recover except manual Strapi intervention or raw API calls.

Abort (already shipped) solves **active** stuck runs (`pending`, `queued`, `running`) by marking the run failed and clearing the lock. That is the wrong first move when the workflow legitimately finished and only fixture-discovery reconciliation / finalization failed — operators need **Reconcile**, which rechecks ingest rows and may finalize without destroying the run.

## Solution

Add a **Reconcile run** support action on the **run detail page** when a run is in completed limbo. Mirror the abort implementation pattern (server action, React Query mutation, confirm dialog, query invalidation). Keep **Abort** visible only for active runs; **Reconcile** is primary (and exclusive) in completed limbo. Do not add Reconcile to the account Data refresh panel in v1.

## User Stories

1. As a Fixtura support operator, I want to see a **Reconcile run** button on a stuck run detail page when the run is in completed limbo, so that I can attempt finalization without failing the run.
2. As a support operator, I want Reconcile hidden when the run is still active (`pending`, `queued`, `running`), so that I am not offered a recovery action that is meant for post-workflow limbo.
3. As a support operator, I want **Abort run** hidden when the run is in completed limbo, so that I am steered toward the non-destructive reconcile path first.
4. As a support operator, I want a confirmation dialog before Reconcile runs, so that I understand it may requeue fixture-discovery work.
5. As a support operator, I want a success toast after reconcile that summarizes what happened (rows reconciled / requeued), so that I know whether to wait or retry.
6. As a support operator, I want run, account, and global health views to refresh automatically after reconcile, so that I see updated status without a manual page reload.
7. As a support operator, I want clear error messages when reconcile fails (invalid run id, not found, server error), so that I know what to do next.
8. As a support operator, I want to retry reconcile safely when it does not finalize on the first attempt, so that idempotent backend behaviour is usable from the UI.
9. As a support operator viewing run timeline with **Completed** set but **Finalized** empty, I want Reconcile offered in the header actions alongside Back to account and Open in Strapi.
10. As a support operator, I want Reconcile to use the same admin bearer auth as abort and other health mutations, so that staging/production auth stays consistent.
11. As a developer maintaining account health UI, I want reconcile types aligned with the backend response contract, so that the service layer is type-safe.
12. As a developer, I want reconcile error reason codes mapped to human-readable labels, so that toast messages match abort/trigger patterns.
13. As a support operator who reconciled successfully, I want the run detail to show `finalized` (or updated step/fixture progress) after refetch, so that I can confirm recovery.
14. As a support operator whose reconcile requeued work but did not finalize yet, I want the UI to reflect non-terminal fixture rows on subsequent poll/refetch, so that I know the run is progressing again.
15. As a support operator, I want Reconcile **not** shown on finalized runs, so that terminal runs stay read-only.
16. As a support operator, I want Reconcile **not** shown on failed runs, so that failed runs are handled via abort/re-trigger flows instead.
17. As a support operator on the account Data refresh tab, I want abort still available for live runs there, but no reconcile button on that panel in v1, so that scope stays focused on run detail.
18. As a support operator dealing with run #444-style cases (`running` badge but all steps completed), I want to use **Abort** (already available), understanding that Reconcile is intentionally limited to `completed` limbo in this ticket.
19. As a developer, I want completed-limbo detection centralized in display rules next to `isHealthRunActive`, so that gating logic is not duplicated across components.
20. As a developer writing tests, I want pure-function tests for completed-limbo vs active-run gating, so that the highest-value behaviour is covered without brittle page tests.
21. As a developer, I want the reconcile button component tested for confirm/cancel dialog behaviour, so that accidental reconcile calls are prevented.
22. As a support operator, I want the reconcile confirm copy to explain that fixture-discovery rows may be requeued and the run may finalize, so that expectations match backend behaviour.
23. As a support operator, I want the reconcile button to show a loading/disabled state while the mutation is in flight, so that I cannot double-submit.
24. As a developer documenting the feature, I want the abort handoff status table updated to note reconcile UI shipped, so that comms stay aligned.
25. As a developer, I want account-health glossary terms mirrored into fixtura-admin CONTEXT.md (from Backend CONTEXT), so that future specs use consistent vocabulary (`completed` vs `finalized`, completed limbo, active run lock).

## Implementation Decisions

### Scope and placement

- **In scope:** Run detail page header actions only (`/dashboard/accounts/health/runs/[runId]`).
- **Out of scope for this ticket:** Account panel Reconcile button; backend reconcile changes; abort hardening (worker guards, Bull cancel); stalled-run notifications; reconcile for `running` runs with all steps done.

### Completed limbo definition

Add a display-rule helper:

```ts
function isHealthRunCompletedLimbo(run: { status: AccountHealthRunStatus; finalizedAt: string | null }): boolean {
  return run.status === "completed" && run.finalizedAt == null;
}
```

- **Reconcile** renders when `isHealthRunCompletedLimbo(run)` is true.
- **Abort** renders when `isHealthRunActive(run.status)` is true (existing behaviour).
- These conditions are **mutually exclusive** by status enum; both buttons must never appear together.

### API integration

- Call existing backend endpoint: `POST /api/account/health/runs/:runId/reconcile` with **empty body**.
- Same auth path as abort: admin bearer via existing axios server instance.
- Success response shape (not the same as abort):

```ts
type AccountHealthReconcileResponse = {
  data: {
    status: "reconciled";
    runId: number;
    reconciled: number;
    requeued: number;
    itemSummaries: Array<{
      itemId: number;
      itemRunId: string | null;
      itemStatus: AccountHealthItemStatus;
      expectedTerminalCount: number;
      terminalCount: number;
      nonTerminalCount: number;
      nonTerminalRows: Array<{
        id: number;
        processingStatus: "pending" | "processing";
        gradeId: number | null;
      }>;
    }>;
  };
};
```

- On success, **invalidate** the same query keys as abort: run status, account health status, global health status.
- Do **not** assume the mutation response includes full run status; refetch via invalidation drives UI update.

### Error handling

- Map known Strapi `error.message` reason codes to operator-facing strings (at minimum: `invalid_run_id`, `not_found`, generic reconcile failure).
- Reuse shared axios error extraction used by other account-health mutations.
- Client-side guard: reject non-positive run ids before network call.

### UI component behaviour

- New **ReconcileAccountHealthRunButton** with confirm dialog (non-destructive styling — primary/warning, not destructive red used by abort).
- Dialog copy should state: rechecks fixture-discovery ingest rows; may requeue stale processing rows; may finalize the run if all expected rows are terminal; safe to retry.
- Success toast example: `Run #${runId} reconciled — ${requeued} requeued, ${reconciled} finalized` (tweak wording for clarity if counts are zero).
- Fixed v1 behaviour: no free-text reason field; single confirm action.

### Layering (mirror abort pattern)

1. **Types** — reconcile response and error types in account health types module.
2. **Error labels** — reconcile-specific label map + getter.
3. **Server service** — POST reconcile, validate response envelope (`data.status === "reconciled"`).
4. **Hook** — React Query mutation with toast + invalidation.
5. **Button component** — dialog + loading state.
6. **Run detail client** — wire button when completed limbo; keep abort wiring unchanged for active runs.

### Polling interaction

- Existing run detail polling stops when status is not active (`completed` is terminal for poll purposes). After reconcile requeues work, run may transition back to `running` — operator may need manual refetch or navigate away and back until status updates; acceptable for v1. Optional: trigger explicit `refetch()` on reconcile success (in addition to invalidation).

### Documentation follow-ups (same PR or immediate sibling)

- Update abort handoff status / related-endpoints table to note reconcile UI.
- Mirror Backend account-health glossary block into fixtura-admin CONTEXT.md (terms: season data refresh, account health run, completed vs finalized, completed limbo, active run lock).

## Testing Decisions

### What makes a good test here

- Test **observable behaviour** and **operator-visible gating**, not implementation details (exact toast string wording is fine; mock axios internals in hook tests only when following existing hook-test prior art).
- Prefer **pure functions** and **focused component tests** over full run-detail page integration tests.

### Proposed test seam (single primary seam)

**Primary seam: `displayRules` completed-limbo gating**

- Unit-test `isHealthRunCompletedLimbo` (and mutual exclusivity with `isHealthRunActive`) across representative statuses: `completed`+null finalized, `completed`+timestamp, `running`, `finalized`, `failed`.
- This is the highest stable seam: all button visibility flows from these predicates.

**Secondary (recommended, not blocking): `ReconcileAccountHealthRunButton` component**

- Confirm opens dialog; confirm calls mutation handler once; cancel does not call.
- Prior art: `InvoiceIssuanceConfirmDialog.test.tsx` (dialog confirm/cancel pattern).

**Optional: hook test**

- Prior art: `useAdminInvoiceHooks.test.tsx` — mock service, assert invalidation query keys on success.
- Lower priority because abort shipped without hook tests; displayRules + component cover the novel UX contract.

### Modules under test

- Display rules (primary)
- Reconcile button component (secondary)
- Reconcile error label mapper (if non-trivial branching)

### Not testing in v1

- Live Strapi integration / E2E
- Run detail page full render tree
- Backend reconcile service behaviour (owned by Backend repo)

## Out of Scope

- Backend changes to reconcile endpoint (already exists).
- Showing Reconcile on account Data refresh panel.
- Reconcile when status is `running` but all steps are completed (e.g. prod run #444) — use Abort; expanding reconcile gating is a separate decision.
- Abort hardening: worker terminal guards, Bull job cancellation, account summary guard on fail.
- Backend `suggest: "reconcile"` hint on abort 400 responses.
- Admin notification system for stalled runs.
- Reconcile / Resume on global dashboard tables.
- E2E smoke automation in CI (manual staging smoke remains the gate).

## Further Notes

### Operator decision order (document in UI copy / internal docs)

1. **Completed limbo** → Reconcile first (this ticket).
2. **Active stuck run** → Abort (shipped).
3. Reconcile failed / still stuck after retries → consider Abort if run returns to active state, or escalate via Strapi.

### Manual smoke test (staging)

1. Find or seed a run with `status: "completed"`, `finalizedAt: null`, fixture-discovery step present.
2. Open run detail — confirm **Reconcile** visible, **Abort** absent.
3. Confirm reconcile — toast shows counts; refetch shows progress or `finalized`.
4. Confirm account on-demand trigger is not blocked (`existing_active` should not appear once finalized/failed appropriately).
5. On an active `running` run — confirm **Abort** visible, **Reconcile** absent.

### Publish instructions

When `gh` is available:

```bash
gh issue create --repo trentnixon/fixtura-next-admin \
  --title "Account health: wire Reconcile button on run detail (completed limbo)" \
  --label "ready-for-agent" \
  --body-file .comms/specs/account-health-reconcile-button-spec.md
```
