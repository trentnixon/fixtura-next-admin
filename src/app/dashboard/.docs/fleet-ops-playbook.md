# Fleet operations playbook (admin)

Quick actions for items on **Dashboard Overview**, **Data Collection**, **Asset Creation**, and **`/dashboard/accounts`**.

---

## Stuck rendering (scheduler / render pipeline)

**Symptoms:** `processing: true`, long elapsed (30m+), scheduler shows rendering.

**Steps:**

1. Open **Render** from the attention row → `/dashboard/renders/[id]`.
2. Open **Scheduler** → `/dashboard/schedulers/[id]` — check queue, `isRendering`, last error.
3. Confirm whether work is legitimately slow vs stale flags (multi-day elapsed = likely stale).
4. If CMS exposes render abort (see `.comms/cms-fleet-operations-handoff.md`), use support abort; otherwise fix in Strapi/worker and clear scheduler flags manually.

**Not the same as account sync** — data refresh health runs live under account **Data refresh** tab.

---

## Account sync (season data refresh)

**Symptoms:** Health run `running`/`queued` 20m+, stuck 2h+, or `completed` without `finalized`.

**Steps:**

1. Open run from attention list → account health run detail.
2. **Completed, not finalized:** use **Reconcile** (fixture-discovery / finalize).
3. **Stuck active run:** review blocking item; **Abort** if operator must unblock (see `.comms/account-health-run-abort-handoff.md`).
4. **Resume** only for documented first-step correlation misses.

---

## When lists look empty but counts are wrong

Until CMS ships `activeRuns` and fleet in-progress renders, admin may show **hidden active** banners. Use Strapi account-health runs and render content manager for full fleet audit.
