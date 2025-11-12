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
import { Badge } from "@/components/ui/badge";
import { Label, H4 } from "@/components/type/titles";
import { Edit } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
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
  const [statusFilter, setStatusFilter] = useState<string>("all");

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

  // Ensure orders is an array
  const safeOrders = Array.isArray(orders) ? orders : [];

  // Filter orders by status
  const filteredOrders =
    statusFilter === "all"
      ? safeOrders
      : safeOrders.filter(
          (order) =>
            order.status &&
            order.status.toLowerCase() === statusFilter.toLowerCase()
        );

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField];
    const bVal = b[sortField];

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

  // Get unique statuses for filter
  const uniqueStatuses =
    Array.isArray(safeOrders) && safeOrders.length > 0
      ? Array.from(
          new Set(
            safeOrders
              .map((order) => order.status)
              .filter((status): status is string => Boolean(status))
          )
        )
      : [];

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
      action={
        uniqueStatuses.length > 0 ? (
          <div className="flex items-center gap-2">
            <Label className="text-sm m-0">Filter:</Label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-300 rounded-md px-3 py-1 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="all">All Orders</option>
              {uniqueStatuses.map((status, index) => (
                <option key={status || `status-${index}`} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        ) : undefined
      }
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
                className="cursor-pointer hover:bg-gray-100 text-center"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center gap-2">
                  Amount
                  {sortField === "amount" && (
                    <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-100 text-center"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center gap-2">
                  Status
                  {sortField === "status" && (
                    <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                  )}
                </div>
              </TableHead>
              <TableHead className="text-center">Tier</TableHead>
              <TableHead className="text-center">Payment Method</TableHead>
              <TableHead className="text-center">Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedOrders.map((order, index) => (
              <TableRow key={order.id || `order-${index}`}>
                <TableCell className="font-medium">
                  {formatDate(order.date)}
                </TableCell>
                <TableCell className="font-semibold text-center">
                  $
                  {(order.amount / 100).toLocaleString("en-AU", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    className={`${
                      !order.status
                        ? "bg-slate-500"
                        : order.status.toLowerCase() === "active" ||
                          order.status.toLowerCase() === "complete"
                        ? "bg-success-500"
                        : order.status.toLowerCase() === "incomplete" ||
                          order.status.toLowerCase() === "trialing"
                        ? "bg-warning-500"
                        : order.status.toLowerCase() === "canceled" ||
                          order.status.toLowerCase() === "past_due" ||
                          order.status.toLowerCase() === "incomplete_expired" ||
                          order.status.toLowerCase() === "unpaid"
                        ? "bg-error-500"
                        : "bg-slate-500"
                    } text-white border-0 rounded-full text-xs`}
                  >
                    {order.status || "Unknown"}
                  </Badge>
                </TableCell>
                <TableCell>{order.subscriptionTier}</TableCell>
                <TableCell className="text-muted-foreground text-center">
                  {order.paymentMethod}
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
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
        </div>
      </ElementContainer>
    </SectionContainer>
  );
}
