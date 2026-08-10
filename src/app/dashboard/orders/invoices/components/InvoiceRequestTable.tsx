"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AdminInvoiceListRow } from "@/types/adminInvoice";
import {
  formatInvoiceAmount,
  formatInvoiceAvailabilityLabel,
  formatInvoiceRequestStatusLabel,
  formatInvoiceTimestamp,
  getInvoiceStatusBadgeClassName,
  getInvoiceStatusBadgeVariant,
} from "../utils/invoiceQueueFormatters";
import {
  formatStatusBadgeVariant,
  getCheckoutBadgeClassName,
  getStatusBadgeClassName,
} from "../../utils/badgeHelpers";
import { toTitleCase } from "../../utils/textHelpers";

interface InvoiceRequestTableProps {
  items: AdminInvoiceListRow[];
}

function formatOrderStatusLabel(value: string | null | undefined): string {
  if (!value) {
    return "—";
  }

  return toTitleCase(value.replace(/_/g, " "));
}

export default function InvoiceRequestTable({ items }: InvoiceRequestTableProps) {
  return (
    <ScrollArea className="min-w-full">
      <Table className="min-w-[1200px]">
        <TableHeader className="sticky top-0 z-10 bg-slate-50">
          <TableRow>
            <TableHead className="min-w-[72px]">ID</TableHead>
            <TableHead className="min-w-[220px]">Organisation</TableHead>
            <TableHead className="min-w-[120px]">Status</TableHead>
            <TableHead className="min-w-[180px]">Linked order</TableHead>
            <TableHead className="min-w-[120px]">Amount</TableHead>
            <TableHead className="hidden lg:table-cell min-w-[120px]">
              Plan
            </TableHead>
            <TableHead className="hidden md:table-cell min-w-[100px]">
              Invoice #
            </TableHead>
            <TableHead className="hidden md:table-cell min-w-[140px]">
              Submitted
            </TableHead>
            <TableHead className="hidden lg:table-cell min-w-[160px]">
              Invoice links
            </TableHead>
            <TableHead className="sticky right-0 bg-slate-50 text-right min-w-[110px]">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((row) => {
            const statusVariant = getInvoiceStatusBadgeVariant(row.status);
            const statusLabel = formatInvoiceRequestStatusLabel(row.status);
            const availabilityLabel = formatInvoiceAvailabilityLabel(
              row.hasHostedInvoiceUrl,
              row.hasInvoicePdfUrl
            );

            return (
              <TableRow key={row.invoiceRequestId} className="hover:bg-muted/30">
                <TableCell className="font-medium">
                  {row.invoiceRequestId}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{row.organisationName}</div>
                  <div className="text-xs text-muted-foreground">
                    {row.billingContactName}
                  </div>
                  <div className="hidden sm:block text-xs text-muted-foreground">
                    {row.billingEmail || "—"}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getInvoiceStatusBadgeClassName(statusVariant)}
                    title={row.status}
                    aria-label={`Status: ${statusLabel} (${row.status})`}
                  >
                    {statusLabel}
                  </Badge>
                </TableCell>
                <TableCell>
                  {row.linkedOrderId ? (
                    <div className="flex flex-wrap gap-1">
                      {row.orderCheckoutStatus ? (
                        <Badge
                          variant="outline"
                          className={getCheckoutBadgeClassName(
                            row.orderCheckoutStatus
                          )}
                        >
                          {formatOrderStatusLabel(row.orderCheckoutStatus)}
                        </Badge>
                      ) : null}
                      {row.orderPaymentStatus ? (
                        <Badge
                          variant={formatStatusBadgeVariant(
                            row.orderPaymentStatus
                          )}
                          className={getStatusBadgeClassName(
                            row.orderPaymentStatus
                          )}
                        >
                          {formatOrderStatusLabel(row.orderPaymentStatus)}
                        </Badge>
                      ) : null}
                      {!row.orderCheckoutStatus && !row.orderPaymentStatus
                        ? "—"
                        : null}
                    </div>
                  ) : (
                    <Badge
                      variant="outline"
                      className="rounded-full bg-amber-100 text-amber-900 border-amber-300"
                    >
                      Requires repair.
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {formatInvoiceAmount(row.requestedAmount, row.currency)}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  {row.selectedPlanName ?? "—"}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {row.linkedOrderId ? (
                    <div className="space-y-0.5">
                      <Link
                        href={`/dashboard/orders/${row.linkedOrderId}`}
                        className="text-sm font-medium text-slate-950 hover:text-primary"
                      >
                        Order #{row.linkedOrderId}
                      </Link>
                      {row.invoiceNumber ? (
                        <div className="text-xs text-muted-foreground">
                          {row.invoiceNumber}
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    row.invoiceNumber ?? "—"
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {formatInvoiceTimestamp(row.submittedAt)}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <span className="text-xs">{availabilityLabel}</span>
                </TableCell>
                <TableCell className="sticky right-0 bg-background text-right">
                  <Button variant="accent" size="sm" asChild>
                    <Link
                      href={`/dashboard/orders/invoices/${row.invoiceRequestId}`}
                    >
                      View / Edit
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
