"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Account } from "@/types";
import {
  CheckIcon,
  XIcon,
  Search,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
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
import EmptyState from "@/components/ui-library/states/EmptyState";

interface AccountsTableProps {
  accounts: Account[];
  emptyMessage: string;
}

type SortField = "firstName" | "deliveryAddress" | "sport" | "isSetup" | null;
type SortDirection = "asc" | "desc" | null;

export function AccountTable({ accounts, emptyMessage }: AccountsTableProps) {
  const router = useRouter();
  const pathname = usePathname();

  // State for search, filters, sorting, and pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [sportFilter, setSportFilter] = useState<string>("all");
  const [setupFilter, setSetupFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get unique sports for filter dropdown
  const uniqueSports = useMemo(() => {
    const sports = new Set<string>();
    accounts.forEach((account) => {
      if (account.attributes.Sport) {
        sports.add(account.attributes.Sport);
      }
    });
    return Array.from(sports).sort();
  }, [accounts]);

  // Filter data
  const filteredData = useMemo(() => {
    return accounts.filter((account) => {
      const id = account.id.toString();
      const firstName = account.attributes.FirstName?.toLowerCase() || "";
      const deliveryAddress =
        account.attributes.DeliveryAddress?.toLowerCase() || "";
      const sport = account.attributes.Sport?.toLowerCase() || "";

      const matchesSearch =
        searchQuery === "" ||
        id.includes(searchQuery.toLowerCase()) ||
        firstName.includes(searchQuery.toLowerCase()) ||
        deliveryAddress.includes(searchQuery.toLowerCase()) ||
        sport.includes(searchQuery.toLowerCase());

      const matchesSport =
        sportFilter === "all" || account.attributes.Sport === sportFilter;

      const matchesSetup =
        setupFilter === "all" ||
        (setupFilter === "setup" && account.attributes.isSetup === true) ||
        (setupFilter === "not-setup" && account.attributes.isSetup === false);

      return matchesSearch && matchesSport && matchesSetup;
    });
  }, [accounts, searchQuery, sportFilter, setupFilter]);

  // Sort data
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      if (!sortField || !sortDirection) return 0;

      let aValue: string | number | boolean;
      let bValue: string | number | boolean;

      switch (sortField) {
        case "firstName":
          aValue = (a.attributes.FirstName || "").toLowerCase();
          bValue = (b.attributes.FirstName || "").toLowerCase();
          break;
        case "deliveryAddress":
          aValue = (a.attributes.DeliveryAddress || "").toLowerCase();
          bValue = (b.attributes.DeliveryAddress || "").toLowerCase();
          break;
        case "sport":
          aValue = (a.attributes.Sport || "").toLowerCase();
          bValue = (b.attributes.Sport || "").toLowerCase();
          break;
        case "isSetup":
          aValue = a.attributes.isSetup ? 1 : 0;
          bValue = b.attributes.isSetup ? 1 : 0;
          break;
        default:
          return 0;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        if (sortDirection === "asc") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      } else {
        if (sortDirection === "asc") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      }
    });
  }, [filteredData, sortField, sortDirection]);

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
    setSportFilter("all");
    setSetupFilter("all");
    setSortField(null);
    setSortDirection(null);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery || sportFilter !== "all" || setupFilter !== "all" || sortField;

  const handleNavigate = (accountId: number, type: string) => {
    router.push(`/dashboard/accounts/${type}/${accountId}`);
  };

  const lastItemInPathname = pathname.split("/").pop();

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by ID, Name, Address, or Sport..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setCurrentPage(1);
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Sport Filter */}
        {uniqueSports.length > 0 && (
          <Select
            value={sportFilter}
            onValueChange={(value) => {
              setSportFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by sport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sports</SelectItem>
              {uniqueSports.map((sport) => (
                <SelectItem key={sport} value={sport}>
                  {sport}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Setup Status Filter */}
        <Select
          value={setupFilter}
          onValueChange={(value) => {
            setSetupFilter(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by setup" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="setup">Setup Complete</SelectItem>
            <SelectItem value="not-setup">Not Setup</SelectItem>
          </SelectContent>
        </Select>

        {/* Reset Filters */}
        {hasActiveFilters && (
          <Button
            variant="accent"
            onClick={handleResetFilters}
            className="whitespace-nowrap"
          >
            Reset Filters
          </Button>
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {paginatedData.length} of {sortedData.length} results
        {filteredData.length !== accounts.length &&
          ` (filtered from ${accounts.length} total)`}
      </div>

      {/* Table */}
      {paginatedData.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("firstName")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                  >
                    First Name
                    {getSortIcon("firstName")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("deliveryAddress")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                  >
                    Delivery Address
                    {getSortIcon("deliveryAddress")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("sport")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                  >
                    Sport
                    {getSortIcon("sport")}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("isSetup")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                  >
                    Is Setup
                    {getSortIcon("isSetup")}
                  </Button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">
                    {account.attributes.FirstName}
                  </TableCell>
                  <TableCell>{account.attributes.DeliveryAddress}</TableCell>
                  <TableCell>{account.attributes.Sport}</TableCell>
                  <TableCell>
                    <div className="flex justify-center items-center">
                      {account.attributes.isSetup ? (
                        <CheckIcon className="w-4 h-4 text-success-500" />
                      ) : (
                        <XIcon className="w-4 h-4 text-error-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="primary"
                      onClick={() =>
                        handleNavigate(
                          account.id,
                          lastItemInPathname || "clubs"
                        )
                      }
                    >
                      View Account
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

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
        </>
      ) : (
        <EmptyState
          title={
            searchQuery || sportFilter !== "all" || setupFilter !== "all"
              ? "No results found"
              : "No accounts"
          }
          description={
            searchQuery || sportFilter !== "all" || setupFilter !== "all"
              ? "No accounts match your filters. Try adjusting your search or filters."
              : emptyMessage
          }
          variant="card"
        />
      )}
    </div>
  );
}
