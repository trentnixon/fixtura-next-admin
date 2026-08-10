"use client";
import { useGetAssociationEmails } from "@/hooks/accounts/useGetAssociationEmails";
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
  MapPin,
  Download,
  Users,
  CreditCard,
  AlertCircle,
  Search,
  ImageIcon,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import {
  getUnsubscribedEmails,
  isEmailUnsubscribed,
} from "@/lib/utils/unsubscribedEmails";
import { useEffect, useState, useMemo } from "react";
import { useAccountsQuery } from "@/hooks/accounts/useAccountsQuery";
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

interface AssociationEmailsProps {
  initialFilter?: "all" | "active" | "inactive";
  hideAllFilter?: boolean;
}

function ContactMetric({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-200 p-4 last:border-b-0 md:border-b-0 md:border-l md:first:border-l-0">
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-100 text-slate-600">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="text-lg font-semibold text-slate-900">{value}</p>
        <p className="truncate text-xs text-muted-foreground">{detail}</p>
      </div>
    </div>
  );
}

export default function AssociationEmails({
  initialFilter = "active",
  hideAllFilter = false,
}: AssociationEmailsProps) {
  const { data, isLoading, error, refetch } = useGetAssociationEmails();
  const { data: accountsData, isLoading: accountsLoading } = useAccountsQuery();
  const [unsubscribedEmails, setUnsubscribedEmails] = useState<string[]>([]);
  const [unsubscribedLoading, setUnsubscribedLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">(
    initialFilter,
  );
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

  // Create sets of association IDs for efficient lookup
  const activeAssociationIds = useMemo(() => {
    return new Set(
      accountsData?.associations.active.flatMap((acc) =>
        acc.associations.map((a) => a.id),
      ) || [],
    );
  }, [accountsData]);

  const inactiveAssociationIds = useMemo(() => {
    return new Set(
      accountsData?.associations.inactive.flatMap((acc) =>
        acc.associations.map((a) => a.id),
      ) || [],
    );
  }, [accountsData]);

  // Create a map of association ID to account info for email lookups
  interface MappedAccountInfo {
    userEmail: string | null;
    deliveryEmail: string | null;
    id: number;
    logo?: string | null;
  }

  const associationIdToAccountMap = useMemo(() => {
    const map = new Map<number, MappedAccountInfo>();
    if (!accountsData) return map;

    [
      ...accountsData.associations.active,
      ...accountsData.associations.inactive,
    ].forEach((account) => {
      account.associations.forEach((assoc) => {
        map.set(assoc.id, {
          userEmail: account.email,
          deliveryEmail: account.DeliveryAddress,
          id: account.id,
          logo: account.logo?.url,
        });
      });
    });
    return map;
  }, [accountsData]);

  // Combined filtering logic
  const filteredAssociations = useMemo(() => {
    if (!data?.data) return [];

    return data.data.filter((association) => {
      // 1. Filter by subscription status
      const matchesSubscription =
        filter === "all" ||
        (filter === "active" && activeAssociationIds.has(association.id)) ||
        (filter === "inactive" && inactiveAssociationIds.has(association.id));

      if (!matchesSubscription) return false;

      // 2. Filter by search query
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        association.name.toLowerCase().includes(searchLower) ||
        association.email.toLowerCase().includes(searchLower) ||
        association.id.toString().includes(searchLower) ||
        (association.address &&
          association.address.toLowerCase().includes(searchLower));

      return matchesSearch;
    });
  }, [data, filter, searchQuery, activeAssociationIds, inactiveAssociationIds]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAssociations.length / itemsPerPage);
  const paginatedAssociations = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAssociations.slice(start, start + itemsPerPage);
  }, [filteredAssociations, currentPage]);

  // Reset to page 1 when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchQuery]);

  if (isLoading || unsubscribedLoading || accountsLoading) {
    return (
      <LoadingState
        variant="default"
        message="Loading association contacts..."
      />
    );
  }

  if (error) {
    return (
      <ErrorState
        error={
          error instanceof Error ? error : new Error("Failed to load data")
        }
        onRetry={refetch}
      />
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <EmptyState
        title="No Association Contacts Found"
        description="There are no association contact details available at this time."
        variant="card"
      />
    );
  }

  // Calculate statistics
  const totalAssociations = data.data.length;
  const activeSubscribedAssociations = data.data.filter((association) =>
    activeAssociationIds.has(association.id),
  ).length;
  const inactiveSubscribedAssociations = data.data.filter((association) =>
    inactiveAssociationIds.has(association.id),
  ).length;

  // Function to download CSV for SendGrid
  const downloadCSV = () => {
    const isValidEmail = (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    const validAssociations = filteredAssociations.filter(
      (association) =>
        association.email &&
        association.email.trim() !== "" &&
        isValidEmail(association.email.trim()) &&
        !isEmailUnsubscribed(association.email, unsubscribedEmails),
    );

    const isAccountView = filter !== "all";

    const csvHeader = isAccountView
      ? "Association Name,Association ID,User Email,Delivery Email"
      : "Association Name,Association ID,Contact Email";

    const csvRows = validAssociations.map((association) => {
      if (isAccountView) {
        const accountInfo = associationIdToAccountMap.get(association.id);
        return `"${association.name}","${association.id}","${
          accountInfo?.userEmail || ""
        }","${accountInfo?.deliveryEmail || ""}"`;
      }
      return `"${association.name}","${association.id}","${association.email}"`;
    });

    const csvContent = [csvHeader, ...csvRows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `association-contacts-${filter}-${
        new Date().toISOString().split("T")[0]
      }.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-4 space-y-4">
      <SectionContainer
        title="Association Contact Information"
        description="Manage and export contact details for association accounts"
        variant="default"
      >
        <div className="mb-4 grid overflow-hidden rounded-md border bg-white md:grid-cols-3">
          <ContactMetric
            icon={Users}
            label="Total Associations"
            value={totalAssociations.toLocaleString()}
            detail="Contacts available"
          />
          <ContactMetric
            icon={CreditCard}
            label="Active Subscriptions"
            value={activeSubscribedAssociations.toLocaleString()}
            detail="Linked to active accounts"
          />
          <ContactMetric
            icon={AlertCircle}
            label="Inactive Subscriptions"
            value={inactiveSubscribedAssociations.toLocaleString()}
            detail="No active account order"
          />
        </div>
        <div className="space-y-4">
          {/* Controls: Search, Filters, Download */}
          <div className="flex flex-col items-center justify-between gap-3 rounded-md border bg-slate-50/60 p-3 md:flex-row">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto flex-1">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search associations, emails, IDs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                {!hideAllFilter && (
                  <Button
                    variant={filter === "all" ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => setFilter("all")}
                  >
                    All
                  </Button>
                )}
                <Button
                  variant={filter === "active" ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setFilter("active")}
                >
                  Active
                </Button>
                <Button
                  variant={filter === "inactive" ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setFilter("inactive")}
                >
                  Inactive
                </Button>
              </div>
            </div>

            <Button
              variant="accent"
              size="sm"
              onClick={downloadCSV}
              className="w-full md:w-auto flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download CSV
            </Button>
          </div>

          {/* Results Summary */}
          <div className="px-1 text-sm text-muted-foreground">
            Showing {paginatedAssociations.length} of{" "}
            {filteredAssociations.length} contacts
            {filteredAssociations.length !== totalAssociations &&
              ` (filtered from ${totalAssociations})`}
          </div>

          {/* Table */}
          <div className="rounded-md border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="w-[60px]">Logo</TableHead>
                  <TableHead>Association Name</TableHead>
                  {filter === "all" ? (
                    <>
                      <TableHead>Contact Email</TableHead>
                      <TableHead className="hidden lg:table-cell">
                        Phone
                      </TableHead>
                      <TableHead>Address</TableHead>
                    </>
                  ) : (
                    <>
                      <TableHead>User Email</TableHead>
                      <TableHead>Delivery Email</TableHead>
                    </>
                  )}
                  <TableHead className="w-[100px] text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAssociations.length > 0 ? (
                  paginatedAssociations.map((association) => {
                    const accountInfo = associationIdToAccountMap.get(
                      association.id,
                    );
                    return (
                      <TableRow
                        key={association.id}
                        className="hover:bg-muted/30"
                      >
                        <TableCell>
                          {accountInfo?.logo ? (
                            <div className="flex items-center justify-center">
                              <Image
                                src={accountInfo.logo}
                                alt={`${association.name} logo`}
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
                        <TableCell>
                          <p className="text-sm font-medium text-slate-900">
                            {association.name}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            Association ID {association.id}
                          </p>
                        </TableCell>

                        {filter === "all" ? (
                          <>
                            <TableCell>
                              <a
                                href={`mailto:${association.email}`}
                                className="text-primary hover:underline flex items-center gap-1 group"
                              >
                                {association.email}
                              </a>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell text-muted-foreground">
                              {association.phone || "-"}
                            </TableCell>
                            <TableCell>
                              {association.address &&
                              association.address !== "No address" ? (
                                <div className="flex items-center gap-2 max-w-[200px] truncate">
                                  <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                                  <span className="text-sm truncate">
                                    {association.address}
                                  </span>
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-sm">
                                  -
                                </span>
                              )}
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell>
                              {accountInfo?.userEmail ? (
                                <a
                                  href={`mailto:${accountInfo.userEmail}`}
                                  className="text-primary hover:underline"
                                >
                                  {accountInfo.userEmail}
                                </a>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {accountInfo?.deliveryEmail ? (
                                <a
                                  href={`mailto:${accountInfo.deliveryEmail}`}
                                  className="text-primary hover:underline"
                                >
                                  {accountInfo.deliveryEmail}
                                </a>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                          </>
                        )}

                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {filter === "all" && (
                              <>
                                {association.address &&
                                  association.address !== "No address" && (
                                    <Button
                                      variant="secondary"
                                      size="sm"
                                      asChild
                                    >
                                      <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                          association.address,
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
                                {association.website &&
                                  association.website !== "No website" && (
                                    <Button variant="accent" size="sm" asChild>
                                      <a
                                        href={association.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1"
                                      >
                                        <ExternalLink className="h-3.5 w-3.5" />
                                        <span>Web</span>
                                      </a>
                                    </Button>
                                  )}
                              </>
                            )}
                            <Button variant="primary" size="sm" asChild>
                              <a
                                href={`http://localhost:1337/admin/content-manager/collection-types/api::association.association/${association.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Manage
                              </a>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={filter === "all" ? 6 : 5}
                      className="h-32 text-center"
                    >
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Search className="h-8 w-8 mb-2 opacity-20" />
                        <p>No associations found matching your search</p>
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
                  totalItems={filteredAssociations.length}
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
