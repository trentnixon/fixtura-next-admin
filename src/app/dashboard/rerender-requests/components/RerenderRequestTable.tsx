"use client";

import { useState } from "react";
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
  PaginationPrevious,
  PaginationNext,
  PaginationPages,
  PaginationInfo,
} from "@/components/ui/pagination";
import { RerenderRequest } from "@/types/rerender-request";
import { formatDate } from "@/lib/utils";
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ExternalLink,
} from "lucide-react";

interface RerenderRequestTableProps {
  requests: RerenderRequest[];
}

type SortField =
  | "id"
  | "accountName"
  | "renderName"
  | "status"
  | "hasBeenHandled"
  | "createdAt"
  | null;
type SortDirection = "asc" | "desc" | null;

/**
 * Rerender Request Table Component
 *
 * Advanced table with search, filtering, sorting, and pagination.
 * Displays rerender requests in a table format with status badges,
 * indicators for handled status, and formatted timestamps.
 * Includes links to detail page for each request.
 */
export default function RerenderRequestTable({
  requests,
}: RerenderRequestTableProps) {
  // Table state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [handledFilter, setHandledFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const formatDateOnly = (dateString: string | null) => {
    if (!dateString) return "—";
    try {
      return formatDate(dateString);
    } catch {
      return "—";
    }
  };

  const calculateDaysAgo = (dateString: string | null) => {
    if (!dateString) return { text: "—", days: null };
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return { text: "Today", days: 0 };
      if (diffDays === 1) return { text: "1 day ago", days: 1 };
      return { text: `${diffDays} days ago`, days: diffDays };
    } catch {
      return { text: "—", days: null };
    }
  };

  const getStatusBadgeVariant = (
    status: string | null
  ): "default" | "secondary" | "destructive" | "outline" => {
    if (!status) return "outline";

    const normalized = status.toLowerCase();

    if (normalized === "pending") {
      return "default";
    }
    if (normalized === "processing") {
      return "secondary";
    }
    if (normalized === "completed") {
      return "default";
    }
    if (normalized === "rejected") {
      return "destructive";
    }

    return "outline";
  };

  const getStatusBadgeClassName = (status: string | null): string => {
    if (!status) return "";

    const normalized = status.toLowerCase();

    if (normalized === "pending") {
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
    if (normalized === "processing") {
      return "bg-blue-100 text-blue-800 border-blue-200";
    }
    if (normalized === "completed") {
      return "bg-green-100 text-green-800 border-green-200";
    }
    if (normalized === "rejected") {
      return "bg-red-100 text-red-800 border-red-200";
    }

    return "";
  };

  const truncateText = (text: string | null, maxLength: number = 50) => {
    if (!text) return "—";
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  // Filter data
  const filteredData = requests.filter((request) => {
    const matchesSearch =
      searchQuery === "" ||
      (request.accountName &&
        request.accountName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (request.renderName &&
        request.renderName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (request.userEmail &&
        request.userEmail.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "pending" &&
        request.status?.toLowerCase() === "pending") ||
      (statusFilter === "processing" &&
        request.status?.toLowerCase() === "processing") ||
      (statusFilter === "completed" &&
        request.status?.toLowerCase() === "completed") ||
      (statusFilter === "rejected" &&
        request.status?.toLowerCase() === "rejected");

    const matchesHandled =
      handledFilter === "all" ||
      (handledFilter === "handled" && request.hasBeenHandled) ||
      (handledFilter === "unhandled" && !request.hasBeenHandled);

    return matchesSearch && matchesStatus && matchesHandled;
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField || !sortDirection) return 0;

    let aValue: string | number | boolean;
    let bValue: string | number | boolean;

    switch (sortField) {
      case "id":
        aValue = a.id;
        bValue = b.id;
        break;
      case "accountName":
        aValue = (a.accountName || "").toLowerCase();
        bValue = (b.accountName || "").toLowerCase();
        break;
      case "renderName":
        aValue = (a.renderName || "").toLowerCase();
        bValue = (b.renderName || "").toLowerCase();
        break;
      case "status":
        aValue = (a.status || "").toLowerCase();
        bValue = (b.status || "").toLowerCase();
        break;
      case "hasBeenHandled":
        aValue = a.hasBeenHandled ? 1 : 0;
        bValue = b.hasBeenHandled ? 1 : 0;
        break;
      case "createdAt": {
        const aDays = calculateDaysAgo(a.createdAt).days ?? 999;
        const bDays = calculateDaysAgo(b.createdAt).days ?? 999;
        aValue = aDays;
        bValue = bDays;
        break;
      }
      default:
        return 0;
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Paginate sorted data
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  // Handle sorting
  const handleSort = (field: SortField) => {
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
    setCurrentPage(1); // Reset to first page on sort
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 ml-1 text-muted-foreground" />;
    }
    if (sortDirection === "asc") {
      return <ArrowUp className="h-4 w-4 ml-1" />;
    }
    return <ArrowDown className="h-4 w-4 ml-1" />;
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setHandledFilter("all");
    setSortField(null);
    setSortDirection(null);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery ||
    statusFilter !== "all" ||
    handledFilter !== "all" ||
    sortField;

  if (requests.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No rerender requests found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by account, render, or email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10"
            aria-label="Search rerender requests"
          />
        </div>

        {/* Status Filter */}
        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]" aria-label="Filter by status">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        {/* Handled Filter */}
        <Select
          value={handledFilter}
          onValueChange={(value) => {
            setHandledFilter(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]" aria-label="Filter by handled status">
            <SelectValue placeholder="Filter by handled" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Handled Status</SelectItem>
            <SelectItem value="handled">Handled</SelectItem>
            <SelectItem value="unhandled">Unhandled</SelectItem>
          </SelectContent>
        </Select>

        {/* Reset Filters */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={handleResetFilters}
            className="whitespace-nowrap"
            aria-label="Reset all filters"
          >
            Reset Filters
          </Button>
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {paginatedData.length} of {sortedData.length} results
        {filteredData.length !== requests.length &&
          ` (filtered from ${requests.length} total)`}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("id")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  aria-label="Sort by ID"
                >
                  ID
                  {getSortIcon("id")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("accountName")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  aria-label="Sort by account name"
                >
                  Account
                  {getSortIcon("accountName")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("renderName")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  aria-label="Sort by render name"
                >
                  Render
                  {getSortIcon("renderName")}
                </Button>
              </TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>User Email</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("status")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  aria-label="Sort by status"
                >
                  Status
                  {getSortIcon("status")}
                </Button>
              </TableHead>
              <TableHead className="w-[120px] text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("hasBeenHandled")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  aria-label="Sort by handled status"
                >
                  Handled
                  {getSortIcon("hasBeenHandled")}
                </Button>
              </TableHead>
              <TableHead className="w-[120px]">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("createdAt")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  aria-label="Sort by created date"
                >
                  Created
                  {getSortIcon("createdAt")}
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center text-muted-foreground py-8"
                >
                  No results found. Try adjusting your filters.
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {request.accountName || "—"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ID: {request.accountId}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {request.renderName || "—"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ID: {request.renderId}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {truncateText(request.reason, 40)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{request.userEmail || "—"}</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getStatusBadgeVariant(request.status)}
                      className={getStatusBadgeClassName(request.status)}
                    >
                      {request.status || "Unknown"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={request.hasBeenHandled ? "default" : "outline"}
                      className={
                        request.hasBeenHandled
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-gray-100 text-gray-800 border-gray-200"
                      }
                    >
                      {request.hasBeenHandled ? "Handled" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDateOnly(request.createdAt)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="accent"
                      size="sm"
                      asChild
                    >
                      <Link
                        href={`/dashboard/rerender-requests/${request.id}`}
                        aria-label={`View details for request ${request.id}`}
                      >
                        View
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
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
              totalItems={sortedData.length}
              itemsPerPage={itemsPerPage}
              className="mr-auto"
            />
            <div className="flex items-center gap-1 ml-auto">
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
