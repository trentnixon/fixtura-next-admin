"use client";
import { useGetClubEmails } from "@/hooks/accounts/useGetClubEmails";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  Check,
  X,
  MapPin,
  Download,
  Users,
  CreditCard,
  AlertCircle,
  Search,
} from "lucide-react";
import {
  getUnsubscribedEmails,
  isEmailUnsubscribed,
} from "@/lib/utils/unsubscribedEmails";
import { useEffect, useState, useMemo } from "react";
import { useAccountsQuery } from "@/hooks/accounts/useAccountsQuery";
import MetricGrid from "@/components/ui-library/metrics/MetricGrid";
import StatCard from "@/components/ui-library/metrics/StatCard";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationPrevious,
  PaginationNext,
  PaginationPages,
  PaginationInfo,
} from "@/components/ui/pagination";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import EmptyState from "@/components/ui-library/states/EmptyState";

export default function ClubEmails() {
  const { data, isLoading, error, refetch } = useGetClubEmails();
  const { data: accountsData, isLoading: accountsLoading } = useAccountsQuery();
  const [unsubscribedEmails, setUnsubscribedEmails] = useState<string[]>([]);
  const [unsubscribedLoading, setUnsubscribedLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch unsubscribed emails on component mount
  useEffect(() => {
    const fetchUnsubscribedEmails = async () => {
      try {
        const emails = await getUnsubscribedEmails();
        setUnsubscribedEmails(emails);
      } catch (error) {
        console.error("Failed to load unsubscribed emails:", error);
      } finally {
        setUnsubscribedLoading(false);
      }
    };

    fetchUnsubscribedEmails();
  }, []);

  // Create sets of club IDs for efficient lookup
  const activeClubIds = useMemo(() => {
    return new Set(
      accountsData?.clubs.active.flatMap((acc) => acc.clubs.map((c) => c.id)) ||
      []
    );
  }, [accountsData]);

  const inactiveClubIds = useMemo(() => {
    return new Set(
      accountsData?.clubs.inactive.flatMap((acc) =>
        acc.clubs.map((c) => c.id)
      ) || []
    );
  }, [accountsData]);

  // Combined filtering logic
  const filteredClubs = useMemo(() => {
    if (!data?.data) return [];

    return data.data.filter((club) => {
      // 1. Filter by subscription status
      const matchesSubscription =
        filter === "all" ||
        (filter === "active" && activeClubIds.has(club.id)) ||
        (filter === "inactive" && inactiveClubIds.has(club.id));

      if (!matchesSubscription) return false;

      // 2. Filter by search query
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        club.name.toLowerCase().includes(searchLower) ||
        club.email.toLowerCase().includes(searchLower) ||
        club.id.toString().includes(searchLower) ||
        (club.address && club.address.toLowerCase().includes(searchLower));

      return matchesSearch;
    });
  }, [data, filter, searchQuery, activeClubIds, inactiveClubIds]);

  // Pagination logic
  const totalPages = Math.ceil(filteredClubs.length / itemsPerPage);
  const paginatedClubs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredClubs.slice(start, start + itemsPerPage);
  }, [filteredClubs, currentPage]);

  // Reset to page 1 when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchQuery]);

  if (isLoading || unsubscribedLoading || accountsLoading) {
    return <LoadingState variant="default" message="Loading club contacts..." />;
  }

  if (error) {
    return (
      <ErrorState
        error={error instanceof Error ? error : new Error("Failed to load data")}
        onRetry={refetch}
      />
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <EmptyState
        title="No Club Contacts Found"
        description="There are no club contact details available at this time."
        variant="card"
      />
    );
  }

  // Calculate statistics
  const totalClubs = data.data.length;
  const activeSubscribedClubs = data.data.filter((club) =>
    activeClubIds.has(club.id)
  ).length;
  const inactiveSubscribedClubs = data.data.filter((club) =>
    inactiveClubIds.has(club.id)
  ).length;

  // Function to download CSV for SendGrid
  const downloadCSV = () => {
    const isValidEmail = (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    const validClubs = filteredClubs.filter(
      (club) =>
        club.email &&
        club.email.trim() !== "" &&
        isValidEmail(club.email.trim()) &&
        !isEmailUnsubscribed(club.email, unsubscribedEmails)
    );

    const csvContent = [
      "name,email",
      ...validClubs.map((club) => `"${club.name}","${club.email}"`),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `club-contacts-${filter}-${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 mt-4">
      {/* Statistics Cards */}
      <MetricGrid columns={3} gap="md">
        <StatCard
          title="Total Clubs"
          value={totalClubs}
          icon={<Users className="h-5 w-5" />}
          variant="light"
          description="Total clubs in the system"
        />
        <StatCard
          title="Active Subscriptions"
          value={activeSubscribedClubs}
          icon={<CreditCard className="h-5 w-5" />}
          variant="primary"
          description="Clubs with active orders"
        />
        <StatCard
          title="Inactive Subscriptions"
          value={inactiveSubscribedClubs}
          icon={<AlertCircle className="h-5 w-5" />}
          variant="accent"
          description="Clubs with no active orders"
        />
      </MetricGrid>

      {/* Main Table Section */}
      <SectionContainer
        title="Club Contact Information"
        description="Manage and export contact details for club accounts"
        variant="default"
      >
        <div className="space-y-4">
          {/* Controls: Search, Filters, Download */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-muted/30 p-4 rounded-lg">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto flex-1">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clubs, emails, IDs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filter === "all" ? "secondary" : "primary"}
                  size="sm"
                  onClick={() => setFilter("all")}
                >
                  All
                </Button>
                <Button
                  variant={filter === "active" ? "secondary" : "primary"}
                  size="sm"
                  onClick={() => setFilter("active")}
                >
                  Active
                </Button>
                <Button
                  variant={filter === "inactive" ? "secondary" : "primary"}
                  size="sm"
                  onClick={() => setFilter("inactive")}
                >
                  Inactive
                </Button>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={downloadCSV}
              className="w-full md:w-auto flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download CSV
            </Button>
          </div>

          {/* Results Summary */}
          <div className="text-sm text-muted-foreground px-2">
            Showing {paginatedClubs.length} of {filteredClubs.length} contacts
            {filteredClubs.length !== totalClubs &&
              ` (filtered from ${totalClubs})`}
          </div>

          {/* Table */}
          <div className="rounded-md border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Club Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Phone</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="w-[100px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedClubs.length > 0 ? (
                  paginatedClubs.map((club) => (
                    <TableRow key={club.id} className="hover:bg-muted/30">
                      <TableCell className="font-semibold">
                        {club.name}
                        <div className="text-[10px] text-muted-foreground font-mono mt-0.5">
                          ID: {club.id}
                        </div>
                      </TableCell>
                      <TableCell>
                        <a
                          href={`mailto:${club.email}`}
                          className="text-primary hover:underline flex items-center gap-1 group"
                        >
                          {club.email}
                        </a>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground">
                        {club.phone || "-"}
                      </TableCell>
                      <TableCell>
                        {club.address && club.address !== "No address" ? (
                          <div className="flex items-center gap-2 max-w-[200px] truncate">
                            <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                            <span className="text-sm truncate">
                              {club.address}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            -
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {club.address && club.address !== "No address" && (
                            <Button
                              variant="secondary"
                              size="sm"
                              asChild
                            >
                              <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                  club.address
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1"
                              >
                                <MapPin className="h-3.5 w-3.5" />
                                <span>Map</span>
                              </a>
                            </Button>
                          )}
                          {club.website && club.website !== "No website" && (
                            <Button
                              variant="accent"
                              size="sm"
                              asChild
                            >
                              <a
                                href={club.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                                <span>Web</span>
                              </a>
                            </Button>
                          )}
                          <Button
                            variant="primary"
                            size="sm"
                            asChild
                          >
                            <a
                              href={`http://localhost:1337/admin/content-manager/collection-types/api::club.club/${club.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Manage
                            </a>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Search className="h-8 w-8 mb-2 opacity-20" />
                        <p>No clubs found matching your search</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t pt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                variant="primary"
                className="w-full"
              >
                <PaginationInfo
                  format="long"
                  totalItems={filteredClubs.length}
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
      </SectionContainer>
    </div>
  );
}
