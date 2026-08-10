"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { AdminInvoiceAggregate } from "@/types/adminInvoice";
import {
  formatInvoiceOrderStatusLabel,
  formatInvoiceRequestStatusLabel,
  formatInvoiceTimestamp,
  getInvoiceStatusBadgeClassName,
  getInvoiceStatusBadgeVariant,
} from "../../utils/invoiceQueueFormatters";

interface InvoiceAggregateSummaryProps {
  aggregate: AdminInvoiceAggregate;
}

function SummaryItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-slate-200 px-3 py-2 space-y-1">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm">{children}</dd>
    </div>
  );
}

/**
 * Invoice request record panel — container.pattern.record-panel
 */
export default function InvoiceAggregateSummary({
  aggregate,
}: InvoiceAggregateSummaryProps) {
  const { invoiceRequest, account, order } = aggregate;
  const statusLabel = formatInvoiceRequestStatusLabel(invoiceRequest.status);
  const badgeVariant = getInvoiceStatusBadgeVariant(invoiceRequest.status);
  const badgeClassName = getInvoiceStatusBadgeClassName(badgeVariant);

  return (
    <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-2 border-b border-slate-200 px-4 py-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Request overview
          </h3>
          <p className="text-sm text-muted-foreground">
            Identity and linked context for this request.
          </p>
        </div>
        <Badge
          variant="outline"
          className={badgeClassName}
          title={invoiceRequest.status}
        >
          {statusLabel}
        </Badge>
      </div>

      <dl className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
        <SummaryItem label="Invoice request ID">
          #{invoiceRequest.id}
        </SummaryItem>

        <SummaryItem label="Account">
          <span className="block">{account.name}</span>
          <span className="text-muted-foreground">
            #{account.id}
            {account.type ? ` · ${account.type}` : ""}
            {account.email ? ` · ${account.email}` : ""}
          </span>
        </SummaryItem>

        <SummaryItem label="Selected plan">
          {invoiceRequest.selectedPlanName ?? "—"}
          {invoiceRequest.selectedPlanId != null && (
            <span className="text-muted-foreground">
              {" "}
              (ID {invoiceRequest.selectedPlanId})
            </span>
          )}
        </SummaryItem>

        <SummaryItem label="Submitted">
          {formatInvoiceTimestamp(invoiceRequest.submittedAt)}
        </SummaryItem>

        <SummaryItem label="Last updated">
          {formatInvoiceTimestamp(invoiceRequest.updatedAt)}
        </SummaryItem>

        <SummaryItem label="Linked order">
          {order ? (
            <>
              <Link
                href={`/dashboard/orders/${order.id}`}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Order #{order.id}
              </Link>
              <span className="block text-muted-foreground">
                {formatInvoiceOrderStatusLabel(order.checkoutStatus)} ·{" "}
                {formatInvoiceOrderStatusLabel(order.paymentStatus)}
              </span>
            </>
          ) : (
            <span className="font-medium text-amber-800">
              Requires repair — no linked order
            </span>
          )}
        </SummaryItem>
      </dl>
    </div>
  );
}
