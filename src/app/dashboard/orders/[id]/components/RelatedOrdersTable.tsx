"use client";

import Link from "next/link";
import { RelatedOrderSummary } from "@/types/orderDetail";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/utils/chart-formatters";
import EmptyState from "@/components/ui-library/states/EmptyState";
import {
  formatStatusBadgeVariant,
  getStatusBadgeClassName,
  getCheckoutBadgeClassName,
  getActiveBadgeClassName,
} from "../../utils/badgeHelpers";
import { formatMoney } from "../../utils/currencyHelpers";
import { toTitleCase } from "../../utils/textHelpers";

interface RelatedOrdersTableProps {
  relatedOrders: RelatedOrderSummary[];
}

export default function RelatedOrdersTable({
  relatedOrders,
}: RelatedOrdersTableProps) {
  if (relatedOrders.length === 0) {
    return (
      <EmptyState
        variant="card"
        title="No related orders"
        description="This account does not have other orders yet."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead className="text-center">Payment Status</TableHead>
            <TableHead className="text-center">Checkout Status</TableHead>
            <TableHead className="text-center">Order Status</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Created</TableHead>
            <TableHead className="text-right">Start</TableHead>
            <TableHead className="text-right">End</TableHead>
            <TableHead className="text-center">View</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {relatedOrders.map((related) => (
            <TableRow key={related.id}>
              <TableCell className="font-medium">
                {related.name ?? `Order #${related.id}`}
              </TableCell>
              <TableCell className="text-center">
                {related.paymentStatus ? (
                  <Badge
                    variant={formatStatusBadgeVariant(related.paymentStatus)}
                    className={getStatusBadgeClassName(related.paymentStatus)}
                  >
                    Payment: {toTitleCase(related.paymentStatus)}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-center">
                {related.checkoutStatus ? (
                  <Badge
                    variant="outline"
                    className={getCheckoutBadgeClassName(
                      related.checkoutStatus
                    )}
                  >
                    Checkout: {toTitleCase(related.checkoutStatus)}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant={related.isActive ? "primary" : "outline"}
                  className={getActiveBadgeClassName(related.isActive)}
                >
                  Order: {related.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatMoney(related.totals.amount, related.totals.currency)}
              </TableCell>
              <TableCell className="text-right text-sm text-muted-foreground">
                {formatDate(related.createdAt)}
              </TableCell>
              <TableCell className="text-right text-sm text-muted-foreground">
                {formatDate(related.startDate)}
              </TableCell>
              <TableCell className="text-right text-sm text-muted-foreground">
                {formatDate(related.endDate)}
              </TableCell>
              <TableCell className="text-center">
                <Button variant="accent" size="sm" asChild>
                  <Link href={`/dashboard/orders/${related.id}`}>View</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
