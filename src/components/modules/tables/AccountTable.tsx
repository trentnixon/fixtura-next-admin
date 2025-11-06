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
import { AccountLookupItem } from "@/types/adminAccountLookup";
import {
  Search,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ImageIcon,
} from "lucide-react";
import { SubscriptionBadge } from "./SubscriptionBadge";
import Image from "next/image";
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
  accounts: AccountLookupItem[];
  emptyMessage: string;
}

type SortField = "firstName" | "sport" | "email" | "subscription" | null;
type SortDirection = "asc" | "desc" | null;

export function AccountTable({ accounts, emptyMessage }: AccountsTableProps) {
  const router = useRouter();
  const pathname = usePathname();

  // State for search, filters, sorting, and pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [sportFilter, setSportFilter] = useState<string>("all");
  const [clubFilter, setClubFilter] = useState<string>("all");
  const [associationFilter, setAssociationFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get unique sports for filter dropdown
  const uniqueSports = useMemo(() => {
    const sports = new Set<string>();
    accounts.forEach((account) => {
      if (account.Sport) {
        sports.add(account.Sport);
      }
    });
    return Array.from(sports).sort();
  }, [accounts]);

  // Get unique clubs for filter dropdown
  const uniqueClubs = useMemo(() => {
    const clubs = new Set<string>();
    accounts.forEach((account) => {
      account.clubs.forEach((club) => {
        if (club.name) {
          clubs.add(club.name);
        }
      });
    });
    return Array.from(clubs).sort();
  }, [accounts]);

  // Get unique associations for filter dropdown
  const uniqueAssociations = useMemo(() => {
    const associations = new Set<string>();
    accounts.forEach((account) => {
      account.associations.forEach((assoc) => {
        if (assoc.name) {
          associations.add(assoc.name);
        }
      });
    });
    return Array.from(associations).sort();
  }, [accounts]);

  // Filter data
  const filteredData = useMemo(() => {
    return accounts.filter((account) => {
      const id = account.id.toString();
      const firstName = account.FirstName?.toLowerCase() || "";
      const sport = account.Sport?.toLowerCase() || "";
      const email = account.email?.toLowerCase() || "";

      // Get club names
      const clubNames = account.clubs
        .map((club) => club.name?.toLowerCase() || "")
        .join(" ");

      // Get association names
      const associationNames = account.associations
        .map((assoc) => assoc.name?.toLowerCase() || "")
        .join(" ");

      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        id.includes(searchLower) ||
        firstName.includes(searchLower) ||
        sport.includes(searchLower) ||
        email.includes(searchLower) ||
        clubNames.includes(searchLower) ||
        associationNames.includes(searchLower);

      const matchesSport =
        sportFilter === "all" || account.Sport === sportFilter;

      const matchesClub =
        clubFilter === "all" ||
        account.clubs.some((club) => club.name === clubFilter);

      const matchesAssociation =
        associationFilter === "all" ||
        account.associations.some((assoc) => assoc.name === associationFilter);

      return matchesSearch && matchesSport && matchesClub && matchesAssociation;
    });
  }, [accounts, searchQuery, sportFilter, clubFilter, associationFilter]);

  // Sort data
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      if (!sortField || !sortDirection) return 0;

      let aValue: string | number | boolean;
      let bValue: string | number | boolean;

      switch (sortField) {
        case "firstName":
          aValue = (a.FirstName || "").toLowerCase();
          bValue = (b.FirstName || "").toLowerCase();
          break;
        case "sport":
          aValue = (a.Sport || "").toLowerCase();
          bValue = (b.Sport || "").toLowerCase();
          break;
        case "email":
          aValue = (a.email || "").toLowerCase();
          bValue = (b.email || "").toLowerCase();
          break;
        case "subscription":
          // Sort by hasActiveOrder first, then by daysLeftOnSubscription
          if (a.hasActiveOrder !== b.hasActiveOrder) {
            aValue = a.hasActiveOrder ? 1 : 0;
            bValue = b.hasActiveOrder ? 1 : 0;
            // For subscription sorting, we want active subscriptions first
            // So we need to handle this differently in the comparison
            if (sortDirection === "asc") {
              return a.hasActiveOrder ? -1 : 1;
            } else {
              return a.hasActiveOrder ? 1 : -1;
            }
          } else {
            // Both have same active status, sort by days left
            aValue = a.daysLeftOnSubscription ?? -1;
            bValue = b.daysLeftOnSubscription ?? -1;
          }
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
    setClubFilter("all");
    setAssociationFilter("all");
    setSortField(null);
    setSortDirection(null);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery ||
    sportFilter !== "all" ||
    clubFilter !== "all" ||
    associationFilter !== "all" ||
    sortField;

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
            placeholder="Search by ID, Name, Email, Sport, Club, or Association..."
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

        {/* Club Filter */}
        {uniqueClubs.length > 0 && (
          <Select
            value={clubFilter}
            onValueChange={(value) => {
              setClubFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by club" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clubs</SelectItem>
              {uniqueClubs.map((club) => (
                <SelectItem key={club} value={club}>
                  {club}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Association Filter */}
        {uniqueAssociations.length > 0 && (
          <Select
            value={associationFilter}
            onValueChange={(value) => {
              setAssociationFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by association" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Associations</SelectItem>
              {uniqueAssociations.map((association) => (
                <SelectItem key={association} value={association}>
                  {association}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

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
                <TableHead className="w-[60px]">Logo</TableHead>
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
                    onClick={() => handleSort("email")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                  >
                    Email
                    {getSortIcon("email")}
                  </Button>
                </TableHead>
                <TableHead>Club</TableHead>
                <TableHead>Association</TableHead>
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
                    onClick={() => handleSort("subscription")}
                    className="h-auto p-0 font-semibold hover:bg-transparent"
                  >
                    Subscription
                    {getSortIcon("subscription")}
                  </Button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((account) => {
                // Check if account is expiring soon (<30 days)
                const isExpiringSoon =
                  account.hasActiveOrder &&
                  account.daysLeftOnSubscription !== null &&
                  account.daysLeftOnSubscription <= 30;

                return (
                  <TableRow
                    key={account.id}
                    className={
                      isExpiringSoon
                        ? "bg-yellow-50/50 hover:bg-yellow-100/50 border-l-4 border-l-yellow-500"
                        : ""
                    }
                  >
                    <TableCell>
                      {account.logo?.url ? (
                        <div className="flex items-center justify-center">
                          <Image
                            src={account.logo.url}
                            alt={`${account.FirstName || "Account"} logo`}
                            width={40}
                            height={40}
                            className="rounded object-contain"
                            style={{
                              maxWidth: "40px",
                              maxHeight: "40px",
                            }}
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <ImageIcon className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {account.FirstName}
                    </TableCell>
                    <TableCell>
                      {account.email ? (
                        <a
                          href={`mailto:${account.email}`}
                          className="text-primary hover:underline"
                        >
                          {account.email}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {account.clubs.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {account.clubs.map((club) => (
                            <span key={club.id} className="text-sm">
                              {club.name || "—"}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {account.associations.length > 0 ? (
                        <div className="flex flex-col gap-1">
                          {account.associations.map((assoc) => (
                            <span key={assoc.id} className="text-sm">
                              {assoc.name || "—"}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>{account.Sport}</TableCell>
                    <TableCell>
                      <SubscriptionBadge
                        hasActiveOrder={account.hasActiveOrder}
                        daysLeftOnSubscription={account.daysLeftOnSubscription}
                      />
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
                );
              })}
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
            searchQuery ||
            sportFilter !== "all" ||
            clubFilter !== "all" ||
            associationFilter !== "all"
              ? "No results found"
              : "No accounts"
          }
          description={
            searchQuery ||
            sportFilter !== "all" ||
            clubFilter !== "all" ||
            associationFilter !== "all"
              ? "No accounts match your filters. Try adjusting your search or filters."
              : emptyMessage
          }
          variant="card"
        />
      )}
    </div>
  );
}
