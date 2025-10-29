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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";

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

  // Get CMS base URL from environment
  const cmsBaseUrl =
    typeof process !== "undefined" &&
    process.env?.NEXT_APP_API_BASE_URL?.replace("/api", "")
      ? process.env.NEXT_APP_API_BASE_URL.replace("/api", "")
      : "http://localhost:1337";

  if (!analytics?.orderHistory) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
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
          (order) => order.status.toLowerCase() === statusFilter.toLowerCase()
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
      ? Array.from(new Set(safeOrders.map((order) => order.status)))
      : [];

  return (
    <Card className="shadow-none bg-slate-50 border-b-4 border-b-slate-500 rounded-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-500" />
              Order History
            </CardTitle>
            <CardDescription>
              {totalOrders || 0} total orders • $
              {((totalSpent || 0) / 100).toLocaleString()} total spent
            </CardDescription>
          </div>
          {uniqueStatuses.length > 0 && (
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Filter:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-slate-300 rounded-md px-3 py-1 text-sm bg-white"
              >
                <option value="all">All Orders</option>
                {uniqueStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {sortedOrders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No orders found
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer hover:bg-gray-100"
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
                  className="cursor-pointer hover:bg-gray-100"
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
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center gap-2">
                    Status
                    {sortField === "status" && (
                      <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>View in Strapi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    {formatDate(order.date)}
                  </TableCell>
                  <TableCell className="font-semibold">
                    ${(order.amount / 100).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status.toLowerCase() === "paid"
                          ? "bg-green-100 text-green-800"
                          : order.status.toLowerCase() === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status.toLowerCase() === "failed"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell>{order.subscriptionTier}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {order.paymentMethod}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="font-mono text-xs h-auto p-1"
                      onClick={() =>
                        window.open(
                          `${cmsBaseUrl}/admin/content-manager/collection-types/api::order.order/${order.id}`,
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
                    >
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {/* Summary Footer */}
        <div className="mt-4 p-4 bg-slate-100 rounded-lg border border-slate-300">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Filtered Orders</p>
              <p className="text-lg font-semibold">{sortedOrders.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Order Value</p>
              <p className="text-lg font-semibold">
                ${((averageOrderValue || 0) / 100).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Displayed</p>
              <p className="text-lg font-semibold">
                $
                {(
                  sortedOrders.reduce(
                    (sum, order) => sum + (order.amount || 0),
                    0
                  ) / 100 || 0
                ).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
