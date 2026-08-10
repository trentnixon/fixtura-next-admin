import { describe, expect, it } from "vitest";
import {
  getInvoiceLifecycleStepStates,
  INVOICE_HAPPY_PATH_STEPS,
} from "@/lib/services/orders/invoiceLifecycleSteps";

describe("getInvoiceLifecycleStepStates", () => {
  it("uses three happy-path steps", () => {
    expect(INVOICE_HAPPY_PATH_STEPS).toEqual([
      "invoice_received",
      "invoice_created",
      "paid",
    ]);
  });

  it("marks current and upcoming for invoice_received", () => {
    const model = getInvoiceLifecycleStepStates("invoice_received");
    expect(model.terminalOverride).toBeNull();
    expect(model.steps).toHaveLength(3);
    expect(model.steps[0]).toEqual({
      status: "invoice_received",
      state: "current",
    });
    expect(model.steps[1].state).toBe("upcoming");
    expect(model.steps[2].state).toBe("upcoming");
  });

  it("marks prior steps complete for invoice_created", () => {
    const model = getInvoiceLifecycleStepStates("invoice_created");
    expect(model.steps[0].state).toBe("complete");
    expect(model.steps[1].state).toBe("current");
    expect(model.steps[2].state).toBe("upcoming");
  });

  it("abandons happy path for branch terminals", () => {
    const model = getInvoiceLifecycleStepStates("cancelled");
    expect(model.steps.every((step) => step.state === "abandoned")).toBe(true);
    expect(model.terminalOverride).toBe("cancelled");
  });

  it("renders legacy/unknown statuses safely without inventing steps", () => {
    const legacy = getInvoiceLifecycleStepStates("submitted");
    expect(legacy.steps.every((step) => step.state === "abandoned")).toBe(true);
    expect(legacy.terminalOverride).toBe("submitted");

    const unknown = getInvoiceLifecycleStepStates("mystery");
    expect(unknown.terminalOverride).toBe("mystery");
  });
});
