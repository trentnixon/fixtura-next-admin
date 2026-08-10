"use client";

import Link from "next/link";
import type {
  AdminInvoiceAccountDto,
  AdminInvoiceOrderDto,
} from "@/types/adminInvoice";
import {
  formatBooleanLabel,
  formatInvoiceOrderStatusLabel,
  formatInvoiceTimestamp,
} from "../../utils/invoiceQueueFormatters";
import { getInvoiceAccountRoute } from "../../utils/invoiceAccountRoute";
import InvoiceUrlActions from "./InvoiceUrlActions";

interface InvoiceEditorSidePanelProps {
  account: AdminInvoiceAccountDto;
  order: AdminInvoiceOrderDto | null;
  hostedInvoiceUrl: string;
  invoicePdfUrl: string;
}

function SidePanelRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-md bg-white px-3 py-2 text-sm">
      <dt className="shrink-0 text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-right font-medium text-slate-900">
        {children}
      </dd>
    </div>
  );
}

function SidePanelSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
      {children}
    </section>
  );
}

/**
 * Supporting side rail for form workspace — account, order ops, URL actions.
 */
export default function InvoiceEditorSidePanel({
  account,
  order,
  hostedInvoiceUrl,
  invoicePdfUrl,
}: InvoiceEditorSidePanelProps) {
  const accountMeta = [
    `#${account.id}`,
    account.type,
    account.email,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="space-y-4" data-testid="invoice-editor-side-panel">
      <SidePanelSection title="Account">
        <div className="space-y-2 rounded-md bg-white px-3 py-2 text-sm">
          <p className="font-medium text-slate-900">{account.name}</p>
          <p className="text-muted-foreground">{accountMeta}</p>
          <Link
            href={getInvoiceAccountRoute(account.id, account.type)}
            className="inline-block font-medium text-primary underline-offset-4 hover:underline"
          >
            View account
          </Link>
        </div>
      </SidePanelSection>

      {order ? (
        <>
          <SidePanelSection title="Order status">
            <dl className="space-y-2">
              <SidePanelRow label="Order">
                <Link
                  href={`/dashboard/orders/${order.id}`}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  #{order.id}
                </Link>
              </SidePanelRow>
              <SidePanelRow label="Checkout status">
                {formatInvoiceOrderStatusLabel(order.checkoutStatus)}
              </SidePanelRow>
              <SidePanelRow label="Payment status">
                {formatInvoiceOrderStatusLabel(order.paymentStatus)}
              </SidePanelRow>
              <SidePanelRow label="Paid">
                {formatBooleanLabel(order.orderPaid)}
              </SidePanelRow>
              <SidePanelRow label="Active">
                {formatBooleanLabel(order.isActive)}
              </SidePanelRow>
              <SidePanelRow label="Payment channel">
                {formatInvoiceOrderStatusLabel(order.paymentChannel)}
              </SidePanelRow>
              <SidePanelRow label="Last updated">
                {formatInvoiceTimestamp(order.updatedAt)}
              </SidePanelRow>
            </dl>
          </SidePanelSection>

          <SidePanelSection title="Invoice links">
            <div className="space-y-3 rounded-md bg-white px-3 py-2">
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground">
                  Hosted invoice URL
                </p>
                <InvoiceUrlActions
                  url={hostedInvoiceUrl}
                  label="Hosted invoice URL"
                />
                {!hostedInvoiceUrl.trim() && (
                  <p className="text-xs text-muted-foreground">No URL set</p>
                )}
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground">
                  Invoice PDF URL
                </p>
                <InvoiceUrlActions
                  url={invoicePdfUrl}
                  label="Invoice PDF URL"
                />
                {!invoicePdfUrl.trim() && (
                  <p className="text-xs text-muted-foreground">No URL set</p>
                )}
              </div>
            </div>
          </SidePanelSection>
        </>
      ) : (
        <SidePanelSection title="Order status">
          <p className="rounded-md bg-white px-3 py-2 text-sm text-amber-800">
            No linked order — issuance actions are unavailable until this
            request is repaired.
          </p>
        </SidePanelSection>
      )}
    </div>
  );
}
