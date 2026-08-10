import { describe, expect, it } from "vitest";
import {
  aggregateToFormValues,
  buildAdminInvoicePatch,
  NO_STATUS_CHANGE,
} from "@/lib/services/orders/buildAdminInvoicePatch";
import {
  collectInvoiceEditorDirtyState,
  reapplyDirtyInvoiceEditorFields,
} from "@/lib/services/orders/reapplyDirtyInvoiceEditorFields";
import { makeAggregate, makeOrder } from "@/lib/services/orders/__tests__/fixtures/adminInvoiceFixtures";

describe("stale Keep my changes — dirty-field reapplication", () => {
  it("preserves user-edited X and CMS-updated Y after Keep", () => {
    const baselineA = makeAggregate({
      invoiceRequest: {
        billingContactName: "Jane Smith",
        requestNotes: "Original note",
        updatedAt: "2026-07-22T03:00:00.000Z",
      },
      order: makeOrder({
        invoiceNumber: "INV-0042",
        updatedAt: "2026-07-22T03:00:00.000Z",
      }),
    });

    const userFormAtConflict = {
      ...aggregateToFormValues(baselineA),
      billingContactName: "User Changed Name",
    };

    const dirtyState = collectInvoiceEditorDirtyState(
      baselineA,
      userFormAtConflict,
      NO_STATUS_CHANGE
    );
    expect(dirtyState.dirtyFormKeys).toEqual(["billingContactName"]);

    const baselineB = makeAggregate({
      invoiceRequest: {
        billingContactName: "Jane Smith",
        requestNotes: "CMS changed note",
        updatedAt: "2026-07-22T04:00:00.000Z",
      },
      order: makeOrder({
        invoiceNumber: "INV-0042",
        updatedAt: "2026-07-22T04:00:00.000Z",
      }),
    });

    const reapplied = reapplyDirtyInvoiceEditorFields({
      serverSnapshot: baselineB,
      dirtyState,
      userFormAtConflict,
    });

    expect(reapplied.form.billingContactName).toBe("User Changed Name");
    expect(reapplied.form.requestNotes).toBe("CMS changed note");

    const patch = buildAdminInvoicePatch({
      baseline: baselineB,
      form: reapplied.form,
      nextStatus: reapplied.nextStatus,
    });

    expect(patch.kind).toBe("ready");
    if (patch.kind === "ready") {
      expect(patch.payload.invoiceRequest?.billingContactName).toBe(
        "User Changed Name"
      );
      expect(patch.payload.invoiceRequest?.requestNotes).toBeUndefined();
      expect(patch.payload.expectedInvoiceRequestUpdatedAt).toBe(
        "2026-07-22T04:00:00.000Z"
      );
      expect(patch.payload.expectedOrderUpdatedAt).toBe(
        "2026-07-22T04:00:00.000Z"
      );
    }
  });

  it("does not mark untouched fields dirty after baseline refresh", () => {
    const baselineA = makeAggregate();
    const userForm = {
      ...aggregateToFormValues(baselineA),
      billingEmail: "edited@example.com",
    };
    const dirtyState = collectInvoiceEditorDirtyState(
      baselineA,
      userForm,
      NO_STATUS_CHANGE
    );

    const baselineB = makeAggregate({
      invoiceRequest: {
        billingContactName: "Server Updated Contact",
        updatedAt: "2026-07-22T05:00:00.000Z",
      },
    });

    const reapplied = reapplyDirtyInvoiceEditorFields({
      serverSnapshot: baselineB,
      dirtyState,
      userFormAtConflict: userForm,
    });

    const patch = buildAdminInvoicePatch({
      baseline: baselineB,
      form: reapplied.form,
      nextStatus: NO_STATUS_CHANGE,
    });

    expect(patch.kind).toBe("ready");
    if (patch.kind === "ready") {
      expect(Object.keys(patch.payload.invoiceRequest ?? {})).toEqual([
        "billingEmail",
      ]);
    }
  });
});
