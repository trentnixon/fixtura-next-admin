"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import EmptyState from "@/components/ui-library/states/EmptyState";
import type { AdminInvoiceListRow } from "@/types/adminInvoice";
import {
  formatInvoiceAmount,
  formatInvoiceRequestStatusLabel,
  formatInvoiceTimestamp,
  getInvoiceStatusBadgeClassName,
  getInvoiceStatusBadgeVariant,
} from "@/app/dashboard/orders/invoices/utils/invoiceQueueFormatters";
import { cn } from "@/lib/utils";

interface FinancialInvoiceQueueListProps {
  items: AdminInvoiceListRow[];
}

export function FinancialInvoiceQueueList({
  items,
}: FinancialInvoiceQueueListProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        variant="minimal"
        title="Nothing in this queue"
        description="Invoice requests will appear here when they match this filter."
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-slate-200">
      {items.map((item) => (
        <div
          key={item.invoiceRequestId}
          className="grid grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-slate-200 px-3 py-2.5 text-sm last:border-b-0"
        >
          <div className="rounded-md bg-violet-50 p-1.5 text-violet-700">
            <FileText className="h-3.5 w-3.5" />
          </div>

          <div className="min-w-0">
            <Link
              href={`/dashboard/orders/invoices/${item.invoiceRequestId}`}
              className="truncate font-medium text-slate-800 hover:text-primary hover:underline"
            >
              {item.organisationName}
            </Link>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
              <span className="truncate">{item.billingContactName}</span>
              <span className="text-muted-foreground/60">·</span>
              <span>
                {formatInvoiceAmount(item.requestedAmount, item.currency)}
              </span>
              {item.submittedAt ? (
                <>
                  <span className="text-muted-foreground/60">·</span>
                  <span>{formatInvoiceTimestamp(item.submittedAt)}</span>
                </>
              ) : null}
            </div>
          </div>

          <Badge
            variant="outline"
            className={cn(
              "shrink-0",
              getInvoiceStatusBadgeClassName(
                getInvoiceStatusBadgeVariant(item.status)
              )
            )}
          >
            {formatInvoiceRequestStatusLabel(item.status)}
          </Badge>
        </div>
      ))}
    </div>
  );
}
