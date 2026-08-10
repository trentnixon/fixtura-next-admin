# Dashboard Data Section — Tickets

## Completed Tickets Index

* TKT-2026-001

---

## Active Tickets

* (none)

---

## TKT-2026-001

---
ID: TKT-2026-001
Status: Completed
Priority: Medium
Owner: Admin Frontend Team
Created: 2026-03-10
Updated: 2026-03-10
Related: Comms-admin-llm-handoff-association-to-competition-trigger
---

## Overview

Add a "Trigger Association to Competition Scrape" button alongside the existing Clients List trigger. When clicked, the button calls the CMS endpoint to enqueue an `association_to_competition` scrape job.

## What We Need to Do

Implement a second scrape trigger button that POSTs to the association-overview-queues endpoint, shows success/error feedback via toast, and uses a confirmation dialog before triggering.

## Completion Summary

Implemented the association-to-competition scrape trigger: types, server action, and UI in `DataSection`. Both triggers (clients list and association-to-competition) now live on the dedicated Scraping page (`/dashboard/data`), styled as cards in a grid. Verified working.
