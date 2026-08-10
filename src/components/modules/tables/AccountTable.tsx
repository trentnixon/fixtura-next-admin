"use client";

import { useMemo, useState } from "react";
import SafeImage from "@/components/ui-library/media/SafeImage";
import { isUsableImageSrc } from "@/lib/utils/imageSrc";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpDown,
  ImageIcon,
  Search,
  X,
} from "lucide-react";
import { AccountLookupItem } from "@/types/adminAccountLookup";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationInfo,
  PaginationNext,
  PaginationPages,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EmptyState from "@/components/ui-library/states/EmptyState";
import { SubscriptionBadge } from "./SubscriptionBadge";

interface AccountsTableProps {
  accounts: AccountLookupItem[];
  emptyMessage: string;
}

type SortField = "firstName" | "sport" | "subscription" | null;
type SortDirection = "asc" | "desc" | null;

export function AccountTable({ accounts, emptyMessage }: AccountsTableProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState("");
  const [sportFilter, setSportFilter] = useState<string>("all");
  const [clubFilter, setClubFilter] = useState<string>("all");
  const [associationFilter, setAssociationFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const isAssociationRoute = pathname.split("/").pop() === "association";
  const accountType = isAssociationRoute ? "association" : "club";

  const uniqueSports = useMemo(() => {
    const sports = new Set<string>();
    accounts.forEach((account) => {
      if (account.Sport) sports.add(account.Sport);
    });
    return Array.from(sports).sort();
  }, [accounts]);

  const uniqueClubs = useMemo(() => {
    const clubs = new Set<string>();
    accounts.forEach((account) => {
      account.clubs.forEach((club) => {
        if (club.name) clubs.add(club.name);
      });
    });
    return Array.from(clubs).sort();
  }, [accounts]);

  const uniqueAssociations = useMemo(() => {
    const associations = new Set<string>();
    accounts.forEach((account) => {
      account.associations.forEach((association) => {
        if (association.name) associations.add(association.name);
      });
    });
    return Array.from(associations).sort();
  }, [accounts]);

  const filteredData = useMemo(() => {
    return accounts.filter((account) => {
      const id = account.id.toString();
      const firstName = account.FirstName?.toLowerCase() || "";
      const sport = account.Sport?.toLowerCase() || "";
      const email = account.email?.toLowerCase() || "";
      const clubNames = account.clubs
        .map((club) => club.name?.toLowerCase() || "")
        .join(" ");
      const associationNames = account.associations
        .map((association) => association.name?.toLowerCase() || "")
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
        account.associations.some(
          (association) => association.name === associationFilter,
        );

      return matchesSearch && matchesSport && matchesClub && matchesAssociation;
    });
  }, [accounts, associationFilter, clubFilter, searchQuery, sportFilter]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      if (!sortField || !sortDirection) return 0;

      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case "firstName":
          aValue = (a.FirstName || "").toLowerCase();
          bValue = (b.FirstName || "").toLowerCase();
          break;
        case "sport":
          aValue = (a.Sport || "").toLowerCase();
          bValue = (b.Sport || "").toLowerCase();
          break;
        case "subscription":
          if (a.hasActiveOrder !== b.hasActiveOrder) {
            return sortDirection === "asc"
              ? a.hasActiveOrder
                ? -1
                : 1
              : a.hasActiveOrder
                ? 1
                : -1;
          }
          aValue = a.daysLeftOnSubscription ?? -1;
          bValue = b.daysLeftOnSubscription ?? -1;
          break;
        default:
          return 0;
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });
  }, [filteredData, sortDirection, sortField]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

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
    setCurrentPage(1);
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-1 h-4 w-4 text-muted-foreground" />;
    }
    if (sortDirection === "asc") {
      return <ArrowUp className="ml-1 h-4 w-4" />;
    }
    return <ArrowDown className="ml-1 h-4 w-4" />;
  };

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

  const handleNavigate = (accountId: number) => {
    router.push(`/dashboard/accounts/${accountType}/${accountId}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-md border border-slate-200 bg-slate-50/60 p-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search accounts, email, sport, or organisation..."
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value);
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
              className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {uniqueSports.length > 0 && (
          <Select
            value={sportFilter}
            onValueChange={(value) => {
              setSportFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full lg:w-[180px]">
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

        {!isAssociationRoute && uniqueClubs.length > 0 && (
          <Select
            value={clubFilter}
            onValueChange={(value) => {
              setClubFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full lg:w-[180px]">
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

        {isAssociationRoute && uniqueAssociations.length > 0 && (
          <Select
            value={associationFilter}
            onValueChange={(value) => {
              setAssociationFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full lg:w-[220px]">
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

      <div className="px-1 text-sm text-muted-foreground">
        Showing {paginatedData.length} of {sortedData.length} results
        {filteredData.length !== accounts.length &&
          ` (filtered from ${accounts.length} total)`}
      </div>

      {paginatedData.length > 0 ? (
        <>
          <div className="overflow-hidden rounded-md border border-slate-200 bg-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="w-[56px]">Logo</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("firstName")}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Account
                      {getSortIcon("firstName")}
                    </Button>
                  </TableHead>
                  <TableHead>
                    {isAssociationRoute ? "Association" : "Club"}
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
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
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort("subscription")}
                      className="ml-auto h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Subscription
                      {getSortIcon("subscription")}
                    </Button>
                  </TableHead>
                  <TableHead className="w-[110px] text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((account) => {
                  const isExpiringSoon =
                    account.hasActiveOrder &&
                    account.daysLeftOnSubscription !== null &&
                    account.daysLeftOnSubscription <= 30;
                  const organisations = isAssociationRoute
                    ? account.associations
                    : account.clubs;

                  return (
                    <TableRow
                      key={account.id}
                      className={
                        isExpiringSoon
                          ? "border-l-4 border-l-amber-500 bg-amber-50/50 hover:bg-amber-100/50"
                          : ""
                      }
                    >
                      <TableCell>
                        {isUsableImageSrc(account.logo?.url) ? (
                          <div className="flex items-center justify-center">
                            <SafeImage
                              src={account.logo?.url}
                              alt={`${account.FirstName || "Account"} logo`}
                              width={36}
                              height={36}
                              className="rounded object-contain"
                              style={{
                                maxHeight: "36px",
                                maxWidth: "36px",
                              }}
                            />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-900">
                            {account.FirstName || "Unnamed account"}
                          </p>
                          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                            <span>Account ID {account.id}</span>
                            {account.email && (
                              <a
                                href={`mailto:${account.email}`}
                                className="hover:text-slate-900 hover:underline"
                              >
                                {account.email}
                              </a>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {organisations.length > 0 ? (
                          <div className="flex flex-col gap-1">
                            {organisations.map((organisation) => (
                              <span
                                key={organisation.id}
                                className="text-sm text-slate-700"
                              >
                                {organisation.name || "Not provided"}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Not provided
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {account.Sport ? (
                          <Badge variant="outline" className="font-medium">
                            {account.Sport}
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Not provided
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <SubscriptionBadge
                          hasActiveOrder={account.hasActiveOrder}
                          daysLeftOnSubscription={
                            account.daysLeftOnSubscription
                          }
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleNavigate(account.id)}
                        >
                          View
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

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
                <div className="ml-auto flex items-center gap-1">
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
          title={hasActiveFilters ? "No results found" : "No accounts"}
          description={
            hasActiveFilters
              ? "No accounts match your filters. Try adjusting your search or filters."
              : emptyMessage
          }
          variant="card"
        />
      )}
    </div>
  );
}
