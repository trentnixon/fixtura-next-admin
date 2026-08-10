"use client";

import type { AdminInvoiceAggregate } from "@/types/adminInvoice";
import InvoiceInlineAlert from "./InvoiceInlineAlert";

interface InvoiceNoLinkedOrderBannerProps {
  aggregate: AdminInvoiceAggregate;
}

export default function InvoiceNoLinkedOrderBanner({
  aggregate,
}: InvoiceNoLinkedOrderBannerProps) {
  return (
    <InvoiceInlineAlert
      severity="warning"
      title="Requires repair — no linked order"
    >
      Invoice request #{aggregate.invoiceRequest.id} has no linked order.
      Invoice issuance actions are disabled. Safe invoice-request corrections
      are still allowed. An order must be recovered or linked through a future
      approved workflow before this request can be created or marked paid.
    </InvoiceInlineAlert>
  );
}
