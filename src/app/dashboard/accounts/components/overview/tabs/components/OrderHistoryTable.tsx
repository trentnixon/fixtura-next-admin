"use client";

import { AccountAnalytics, OrderSummary } from "@/types/analytics";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import ElementContainer from "@/components/scaffolding/containers/ElementContainer";
import { LoadingState, EmptyState } from "@/components/ui-library";
import { Label, H4 } from "@/components/type/titles";
import { Edit } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

/**
 * OrderHistoryTable Component
 *
 * Displays order history in a sortable, filterable table with comprehensive order details.
 *
 * @param analytics - Account analytics data
 */
export default function OrderHistoryTable({
  analytics,
}: {
  analytics?: AccountAnalytics;
}) {
  const [sortField, setSortField] = useState<keyof OrderSummary | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  if (!analytics?.orderHistory) {
    return (
      <LoadingState variant="skeleton" message="Loading order history...">
        <SectionContainer title="Order History" variant="compact">
          <div className="h-32" />
        </SectionContainer>
      </LoadingState>
    );
  }

  const { orders, totalOrders, totalSpent, averageOrderValue } =
    analytics.orderHistory;
  const paymentStatus = analytics?.paymentStatus;

  // Ensure orders is an array
  const safeOrders = Array.isArray(orders) ? orders : [];

  // No filtering needed - just use all orders
  const filteredOrders = safeOrders;

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField];
    const bVal = b[sortField];

    // Handle null/undefined values
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return 1; // null values go to the end
    if (bVal == null) return -1; // null values go to the end

    if (sortDirection === "asc") {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const handleSort = (field: keyof OrderSummary) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Helper function to get badge styling for payment method
  const getPaymentMethodBadgeClassName = (
    paymentMethod: string | null | undefined
  ): string => {
    if (!paymentMethod) {
      return "rounded-full bg-slate-500 text-white border-0";
    }

    const normalized = paymentMethod.toLowerCase();

    if (normalized === "stripe") {
      return "rounded-full bg-purple-500 text-white border-0";
    }

    if (normalized === "invoice") {
      return "rounded-full bg-blue-500 text-white border-0";
    }

    return "rounded-full bg-slate-500 text-white border-0";
  };

  return (
    <SectionContainer
      title="Order History"
      description={`${totalOrders || 0} total orders • $${(
        (totalSpent || 0) / 100
      ).toLocaleString("en-AU", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} total spent`}
      variant="compact"
    >
      {sortedOrders.length === 0 ? (
        <EmptyState title="No orders found" variant="minimal" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer hover:bg-gray-100 text-center"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center gap-2">
                  Date
                  {sortField === "date" && (
                    <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-100 text-left"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center gap-2">
                  Amount
                  {sortField === "amount" && (
                    <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </TableHead>
              <TableHead className="text-left">Invoice ID</TableHead>
              <TableHead className="text-right">Tier</TableHead>
              <TableHead className="text-right">Payment Method</TableHead>
              <TableHead className="text-center">Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedOrders.map((order, index) => (
              <TableRow key={order.id || `order-${index}`}>
                <TableCell className="font-medium">
                  {formatDate(order.date)}
                </TableCell>
                <TableCell className="font-semibold text-left">
                  $
                  {(order.amount / 100).toLocaleString("en-AU", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell className="text-left font-mono text-sm">
                  {order.invoiceId ?? "—"}
                </TableCell>
                <TableCell className="text-right">
                  {order.subscriptionTier}
                </TableCell>
                <TableCell className="text-right">
                  {order.paymentMethod ? (
                    <Badge
                      className={getPaymentMethodBadgeClassName(
                        order.paymentMethod
                      )}
                    >
                      {order.paymentMethod}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <Button variant="accent" className="h-auto p-1" asChild>
                    <Link href={`/dashboard/orders/${order.id}`}>
                      <Edit className="w-4 h-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Summary Footer */}
      <ElementContainer variant="dark" border padding="md" className="mt-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
          <div className="space-y-1">
            <Label className="text-sm m-0">Filtered Orders</Label>
            <H4 className="text-lg font-semibold m-0">{sortedOrders.length}</H4>
          </div>
          <div className="space-y-1">
            <Label className="text-sm m-0">Avg Order Value</Label>
            <H4 className="text-lg font-semibold m-0">
              $
              {((averageOrderValue || 0) / 100).toLocaleString("en-AU", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </H4>
          </div>
          <div className="space-y-1">
            <Label className="text-sm m-0">Total Displayed</Label>
            <H4 className="text-lg font-semibold m-0">
              $
              {(
                sortedOrders.reduce(
                  (sum, order) => sum + (order.amount || 0),
                  0
                ) / 100 || 0
              ).toLocaleString("en-AU", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </H4>
          </div>
          <div className="space-y-1">
            <Label className="text-sm m-0">Success Rate</Label>
            <H4 className="text-lg font-semibold m-0">
              {paymentStatus?.successRate?.toFixed(1) || 0}%
            </H4>
          </div>
          <div className="space-y-1">
            <Label className="text-sm m-0">Successful</Label>
            <H4 className="text-lg font-semibold m-0 text-success-600">
              {paymentStatus?.successfulPayments || 0}
            </H4>
          </div>
          <div className="space-y-1">
            <Label className="text-sm m-0">Failed</Label>
            <H4 className="text-lg font-semibold m-0 text-error-600">
              {paymentStatus?.failedPayments || 0}
            </H4>
          </div>
        </div>
      </ElementContainer>
    </SectionContainer>
  );
}
