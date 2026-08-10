"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getInvoiceAccountRoute } from "../../utils/invoiceAccountRoute";

interface InvoiceDetailToolbarProps {
  accountId?: number;
  accountType?: string | null;
  orderId?: number | null;
}

export default function InvoiceDetailToolbar({
  accountId,
  accountType = null,
  orderId = null,
}: InvoiceDetailToolbarProps) {
  return (
    <div className="flex justify-end gap-2 pb-0">
      {accountId != null && (
        <Button variant="secondary" asChild>
          <Link href={getInvoiceAccountRoute(accountId, accountType ?? null)}>
            View account
          </Link>
        </Button>
      )}
      {typeof orderId === "number" && (
        <Button variant="secondary" asChild>
          <Link href={`/dashboard/orders/${orderId}`}>View order</Link>
        </Button>
      )}
      <Button variant="outline" asChild>
        <Link href="/dashboard/orders/invoices">Back to queue</Link>
      </Button>
    </div>
  );
}
