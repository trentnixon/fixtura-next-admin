import { describe, expect, it } from "vitest";
import {
  canCancelInvoice,
  canCreateSendInvoice,
  canDeclineInvoice,
  canMarkInvoicePaid,
  getAllowedNextStatuses,
  getAllowedNextStatusesForAggregate,
  isIssuanceTransition,
  isTerminalInvoiceStatus,
  isValidTransition,
} from "@/lib/services/orders/adminInvoiceTransitions";
import type { InvoiceRequestStatus } from "@/types/adminInvoice";

const ALLOWED: Array<[InvoiceRequestStatus, InvoiceRequestStatus]> = [
  ["invoice_received", "invoice_created"],
  ["invoice_received", "declined"],
  ["invoice_received", "cancelled"],
  ["invoice_created", "paid"],
  ["invoice_created", "cancelled"],
];

describe("allowed transitions", () => {
  it.each(ALLOWED)("allows %s -> %s", (from, to) => {
    expect(isValidTransition(from, to)).toBe(true);
    expect(getAllowedNextStatuses(from)).toContain(to);
  });
});

describe("rejected transitions", () => {
  it("rejects resubmitting current status", () => {
    expect(isValidTransition("invoice_received", "invoice_received")).toBe(
      false
    );
  });

  it("rejects backward and skipped transitions", () => {
    expect(isValidTransition("invoice_created", "invoice_received")).toBe(
      false
    );
    expect(isValidTransition("invoice_received", "paid")).toBe(false);
  });

  it("rejects transitions from terminal statuses", () => {
    for (const status of ["paid", "declined", "cancelled"] as const) {
      expect(getAllowedNextStatuses(status)).toEqual([]);
      expect(isTerminalInvoiceStatus(status)).toBe(true);
      expect(isValidTransition(status, "invoice_received")).toBe(false);
    }
  });

  it("returns no transitions for unknown or legacy statuses", () => {
    expect(getAllowedNextStatuses("submitted")).toEqual([]);
    expect(getAllowedNextStatuses("weird_status")).toEqual([]);
    expect(isValidTransition("submitted", "invoice_created")).toBe(false);
  });
});

describe("aggregate-aware action gating", () => {
  it("excludes create/paid when no linked order", () => {
    const allowed = getAllowedNextStatusesForAggregate(
      "invoice_received",
      false
    );
    expect(allowed).not.toContain("invoice_created");
    expect(allowed).toContain("declined");
    expect(canCreateSendInvoice("invoice_received", false)).toBe(false);
    expect(canMarkInvoicePaid("invoice_created", false)).toBe(false);
  });

  it("includes create when linked order exists", () => {
    expect(canCreateSendInvoice("invoice_received", true)).toBe(true);
    expect(canMarkInvoicePaid("invoice_created", true)).toBe(true);
    expect(canDeclineInvoice("invoice_received")).toBe(true);
    expect(canCancelInvoice("invoice_created")).toBe(true);
  });

  it("identifies issuance transitions", () => {
    expect(isIssuanceTransition("invoice_created")).toBe(true);
    expect(isIssuanceTransition("paid")).toBe(false);
    expect(isIssuanceTransition("sent")).toBe(false);
  });
});
