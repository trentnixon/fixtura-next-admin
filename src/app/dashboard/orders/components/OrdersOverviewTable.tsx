"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationInfo,
  PaginationNext,
  PaginationPages,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ArrowDown, ArrowUp, ArrowUpDown, Search, X } from "lucide-react";
import { OrderOverviewRow } from "@/types/orderOverview";
import {
  formatCurrency,
  formatDate,
  formatNumber,
} from "@/utils/chart-formatters";

interface OrdersOverviewTableProps {
  orders: OrderOverviewRow[];
  currency?: string | null;
}

type SortField =
  | "account"
  | "orderLength"
  | "createdAt"
  | "updatedAt"
  | "paidUpIn"
  | "total"
  | null;
type SortDirection = "asc" | "desc" | null;

const DEFAULT_CURRENCY = "AUD";

import {
  formatStatusBadgeVariant,
  getStatusBadgeClassName,
  getActiveBadgeClassName,
  getEndingSoonBadgeClassName,
  getPaymentChannelBadgeClassName,
} from "../utils/badgeHelpers";
import {
  calculateOrderLengthDays,
  calculateElapsedMs,
  formatElapsedTime,
  formatOrderLength,
} from "../utils/dateHelpers";
import { toTitleCase } from "../utils/textHelpers";
import { centsToUnits } from "../utils/currencyHelpers";

export function OrdersOverviewTable({
  orders,
  currency,
}: OrdersOverviewTableProps) {
  const currencyCode = currency ?? DEFAULT_CURRENCY;
  const [searchQuery, setSearchQuery] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [endingSoonFilter, setEndingSoonFilter] = useState<
    "all" | "yes" | "no"
  >("all");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const paymentStatusOptions = useMemo(() => {
    const statuses = new Set<string>();
    orders.forEach((order) => {
      if (order.paymentStatus) {
        statuses.add(order.paymentStatus.toLowerCase());
      }
    });
    return Array.from(statuses).sort();
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return orders.filter((order) => {
      const accountName = order.account.name ?? "";
      const paymentStatus = order.paymentStatus ?? "";
      const orderName = order.name ?? "";

      const matchesSearch =
        query.length === 0 ||
        [order.id.toString(), accountName, orderName, paymentStatus]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query));

      const matchesPaymentStatus =
        paymentStatusFilter === "all" ||
        (paymentStatus
          ? paymentStatus.toLowerCase() === paymentStatusFilter
          : false);

      const matchesActive =
        activeFilter === "all" ||
        (activeFilter === "active" ? order.isActive : !order.isActive);

      const matchesEndingSoon =
        endingSoonFilter === "all" ||
        (endingSoonFilter === "yes" ? order.isExpiringSoon : !order.isExpiringSoon);

      return (
        matchesSearch &&
        matchesPaymentStatus &&
        matchesActive &&
        matchesEndingSoon
      );
    });
  }, [
    orders,
    searchQuery,
    paymentStatusFilter,
    activeFilter,
    endingSoonFilter,
  ]);

  const sortedOrders = useMemo(() => {
    const data = [...filteredOrders];

    if (!sortField || !sortDirection) {
      return data;
    }

    data.sort((a, b) => {
      let compareValue = 0;

      switch (sortField) {
        case "account": {
          const aValue = a.account.name ?? "";
          const bValue = b.account.name ?? "";
          compareValue = aValue.localeCompare(bValue, undefined, {
            sensitivity: "base",
          });
          break;
        }
        case "orderLength": {
          const aValue = calculateOrderLengthDays(a.startDate, a.endDate) ?? -1;
          const bValue = calculateOrderLengthDays(b.startDate, b.endDate) ?? -1;
          compareValue = aValue - bValue;
          break;
        }
        case "createdAt": {
          const aValue = new Date(a.createdAt).getTime();
          const bValue = new Date(b.createdAt).getTime();
          compareValue = aValue - bValue;
          break;
        }
        case "updatedAt": {
          const aValue = new Date(a.updatedAt).getTime();
          const bValue = new Date(b.updatedAt).getTime();
          compareValue = aValue - bValue;
          break;
        }
        case "paidUpIn": {
          const aValue = calculateElapsedMs(a.createdAt, a.updatedAt) ?? -1;
          const bValue = calculateElapsedMs(b.createdAt, b.updatedAt) ?? -1;
          compareValue = aValue - bValue;
          break;
        }
        case "total": {
          const aValue = a.totals?.amount ?? 0;
          const bValue = b.totals?.amount ?? 0;
          compareValue = aValue - bValue;
          break;
        }
        default:
          break;
      }

      return sortDirection === "asc" ? compareValue : -compareValue;
    });

    return data;
  }, [filteredOrders, sortField, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sortedOrders.length / itemsPerPage));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedOrders.slice(start, start + itemsPerPage);
  }, [sortedOrders, currentPage, itemsPerPage]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    paymentStatusFilter !== "all" ||
    activeFilter !== "all" ||
    endingSoonFilter !== "all" ||
    sortField !== null;

  const handleSort = (field: Exclude<SortField, null>) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortField(null);
        setSortDirection(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const getSortIcon = (field: Exclude<SortField, null>) => {
    if (sortField !== field || !sortDirection) {
      return <ArrowUpDown className="h-4 w-4 ml-1 text-muted-foreground" />;
    }

    if (sortDirection === "asc") {
      return <ArrowUp className="h-4 w-4 ml-1" />;
    }

    return <ArrowDown className="h-4 w-4 ml-1" />;
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setPaymentStatusFilter("all");
    setActiveFilter("all");
    setEndingSoonFilter("all");
    setSortField(null);
    setSortDirection(null);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold">Orders</h3>
          <p className="text-sm text-muted-foreground">
            Showing {formatNumber(paginatedOrders.length)} of{" "}
            {formatNumber(sortedOrders.length)} results
            {sortedOrders.length !== orders.length &&
              ` (filtered from ${formatNumber(orders.length)} total)`}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by account or payment status…"
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 pr-9"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setCurrentPage(1);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <Select
            value={paymentStatusFilter}
            onValueChange={(value) => {
              setPaymentStatusFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All payment statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All payment statuses</SelectItem>
              {paymentStatusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {toTitleCase(status)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={activeFilter}
            onValueChange={(value: "all" | "active" | "inactive") => {
              setActiveFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All orders" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All orders</SelectItem>
              <SelectItem value="active">Active orders</SelectItem>
              <SelectItem value="inactive">Inactive orders</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={endingSoonFilter}
            onValueChange={(value: "all" | "yes" | "no") => {
              setEndingSoonFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Ending soon" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="ghost" onClick={handleResetFilters}>
              Reset
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("account")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Account
                  {getSortIcon("account")}
                </Button>
              </TableHead>
              <TableHead className="text-center">Payment Status</TableHead>
              <TableHead className="text-center">Payment Channel</TableHead>
              <TableHead className="text-center">Active</TableHead>
              <TableHead className="text-center">Ending Soon</TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("orderLength")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Order length
                  {getSortIcon("orderLength")}
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("createdAt")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Created
                  {getSortIcon("createdAt")}
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("updatedAt")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  Updated
                  {getSortIcon("updatedAt")}
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("paidUpIn")}
                  className="h-auto w-full justify-end p-0 font-semibold hover:bg-transparent"
                >
                  Paid up in
                  {getSortIcon("paidUpIn")}
                </Button>
              </TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("total")}
                  className="h-auto w-full justify-end p-0 font-semibold hover:bg-transparent"
                >
                  Total
                  {getSortIcon("total")}
                </Button>
              </TableHead>
              <TableHead className="text-center">View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  No orders match your criteria. Try adjusting filters or
                  search.
                </TableCell>
              </TableRow>
            ) : (
              paginatedOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.account.name ?? "—"}</TableCell>
                  <TableCell className="text-center">
                    {order.paymentStatus ? (
                      <Badge
                        variant={formatStatusBadgeVariant(order.paymentStatus)}
                        className={getStatusBadgeClassName(order.paymentStatus)}
                      >
                        {toTitleCase(order.paymentStatus)}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {order.paymentChannel ? (
                      <Badge
                        variant="outline"
                        className={getPaymentChannelBadgeClassName(
                          order.paymentChannel
                        )}
                      >
                        {toTitleCase(order.paymentChannel)}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={order.isActive ? "primary" : "outline"}
                      className={getActiveBadgeClassName(order.isActive)}
                    >
                      {order.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={order.isExpiringSoon ? "default" : "primary"}
                      className={getEndingSoonBadgeClassName(
                        order.isExpiringSoon
                      )}
                    >
                      {order.isExpiringSoon ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {formatOrderLength(order.startDate, order.endDate)}
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {formatDate(order.updatedAt)}
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {formatElapsedTime(order.createdAt, order.updatedAt)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(
                      centsToUnits(order.totals.amount),
                      order.totals.currency ?? currencyCode
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="accent" size="sm" asChild>
                      <Link href={`/dashboard/orders/${order.id}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {sortedOrders.length > itemsPerPage && (
        <div className="flex items-center justify-between">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            variant="primary"
            className="w-full"
          >
            <PaginationInfo
              format="long"
              totalItems={sortedOrders.length}
              itemsPerPage={itemsPerPage}
              className="mr-auto"
            />
            <div className="ml-auto flex items-center gap-1">
              <PaginationPrevious />
              <PaginationPages />
              <PaginationNext />
            </div>
          </Pagination>
        </div>
      )}
    </div>
  );
}
