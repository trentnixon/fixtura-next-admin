"use client";
import { useGetClubEmails } from "@/hooks/accounts/useGetClubEmails";
import { useClubInsights } from "@/hooks/club/useClubInsights";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { LabeledSegmentedControl } from "@/components/ui-library/forms/LabeledSegmentedControl";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { siteNavigationCtaClass } from "@/lib/actions/siteNavigationButtonStyles";
import { buildSubscriptionFilterOptions } from "@/lib/forms/subscriptionFilterOptions";
import { cn } from "@/lib/utils";
import {
  ExternalLink,
  MapPin,
  Download,
  Users,
  CreditCard,
  AlertCircle,
  Search,
  FileCheck,
  Clock,
  UserX,
  CalendarRange,
  Target,
} from "lucide-react";
import {
  getUnsubscribedEmails,
} from "@/lib/utils/unsubscribedEmails";
import { useEffect, useState, useMemo, Fragment } from "react";
import { useAccountsQuery } from "@/hooks/accounts/useAccountsQuery";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import { resolveStrapiMediaUrl } from "@/lib/utils/strapiMediaUrl";
import { OrgContactListingLogo } from "@/app/dashboard/accounts/components/OrgContactListingLogo";
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
import { OrgContactScrapeTableCells } from "@/app/dashboard/accounts/components/OrgContactScrapeTableCells";
import { OrgContactMetricGrid } from "@/app/dashboard/accounts/components/OrgContactMetricGrid";
import {
  buildSendGridContactCsv,
  collectOrgContactExportRows,
  orgContactSearchTokens,
  type SendGridContactRow,
} from "@/lib/utils/orgContactListingDisplay";
import {
  countOrgContactInsights,
  isExportReadyOrgContact,
  matchesOrgContactQualityFilter,
  type OrgContactQualityFilter,
} from "@/lib/utils/orgContactListingFilters";
import { OrgContactListingQualitySelect } from "@/app/dashboard/accounts/components/OrgContactListingQualitySelect";
import { OrgContactListingStatusBadges } from "@/app/dashboard/accounts/components/OrgContactListingStatusBadges";
import {
  OrgContactExpandToggle,
  OrgContactScrapedPeoplePanel,
} from "@/app/dashboard/accounts/components/OrgContactScrapedPeoplePanel";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrgContactTimelineFilterSelect } from "@/app/dashboard/accounts/components/OrgContactTimelineFilterSelect";
import { OrgContactListingsMap } from "@/app/dashboard/accounts/components/OrgContactListingsMap";
import type { OrgContactTimelineFilter } from "@/lib/constants/timelineCampaignPresets";
import {
  scrapeSlugToInsightsSport,
  insightsSportSupportedForTimeline,
} from "@/lib/utils/scrapeSlugToInsightsSport";
import {
  buildClubTimelineIndex,
  clubContactMatchesTimelineFilter,
  getClubTimelineDisplay,
} from "@/lib/utils/orgContactTimelineJoin";
import {
  computeTimelineDiscoveryStats,
  matchesCampaignPreset,
} from "@/app/dashboard/club/components/clubTimelineUtils";
import {
  CLUB_SCRAPE_SPORTS,
  type ClubScrapeSportSlug,
} from "@/constants/clubScrapeSportSlugs";

interface ClubEmailsProps {
  initialFilter?: "all" | "active" | "inactive";
  hideAllFilter?: boolean;
  sportSlug?: ClubScrapeSportSlug;
  showSportFilter?: boolean;
  onSportSlugChange?: (slug: ClubScrapeSportSlug) => void;
  embedded?: boolean;
}

export default function ClubEmails({
  initialFilter = "active",
  hideAllFilter = false,
  sportSlug,
  showSportFilter = false,
  onSportSlugChange,
  embedded = false,
}: ClubEmailsProps) {
  const { Domain } = useGlobalContext();
  const insightsSport = scrapeSlugToInsightsSport(sportSlug);
  const timelineInsightsEnabled = insightsSportSupportedForTimeline(sportSlug);
  const { data: clubInsightsData } = useClubInsights(insightsSport);
  const { data, isLoading, error, refetch } = useGetClubEmails(sportSlug);
  const { data: accountsData, isLoading: accountsLoading } = useAccountsQuery();
  const [unsubscribedEmails, setUnsubscribedEmails] = useState<string[]>([]);
  const [unsubscribedLoading, setUnsubscribedLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">(
    initialFilter,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [qualityFilter, setQualityFilter] =
    useState<OrgContactQualityFilter>("all");
  const [timelineFilter, setTimelineFilter] =
    useState<OrgContactTimelineFilter>("none");
  const [expandedRowIds, setExpandedRowIds] = useState<Set<number>>(
    () => new Set(),
  );
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
        [],
    );
  }, [accountsData]);

  const inactiveClubIds = useMemo(() => {
    return new Set(
      accountsData?.clubs.inactive.flatMap((acc) =>
        acc.clubs.map((c) => c.id),
      ) || [],
    );
  }, [accountsData]);

  // Create a map of club ID to account info for email lookups
  interface MappedAccountInfo {
    userEmail: string | null;
    firstName: string | null;
    deliveryEmail: string | null;
    id: number;
    logo?: string | null;
    hasActiveOrder: boolean;
  }

  const clubIdToAccountMap = useMemo(() => {
    const map = new Map<number, MappedAccountInfo>();
    if (!accountsData) return map;

    [...accountsData.clubs.active, ...accountsData.clubs.inactive].forEach(
      (account) => {
        account.clubs.forEach((club) => {
          map.set(club.id, {
            userEmail: account.email,
            firstName: account.FirstName,
            deliveryEmail: account.DeliveryAddress,
            id: account.id,
            logo: resolveStrapiMediaUrl(account.logo?.url, Domain.strapi),
            hasActiveOrder: account.hasActiveOrder,
          });
        });
      },
    );
    return map;
  }, [accountsData, Domain.strapi]);

  const linkedClubAccountIds = useMemo(
    () => new Set(clubIdToAccountMap.keys()),
    [clubIdToAccountMap],
  );

  const timelineIndex = useMemo(() => {
    const clubs = clubInsightsData?.data.clubs ?? [];
    return buildClubTimelineIndex(clubs);
  }, [clubInsightsData]);

  const timelineStats = useMemo(() => {
    const clubs = clubInsightsData?.data.clubs ?? [];
    return computeTimelineDiscoveryStats(clubs, timelineIndex.thresholds);
  }, [clubInsightsData, timelineIndex.thresholds]);

  const filterOptions = useMemo(
    () => buildSubscriptionFilterOptions(hideAllFilter),
    [hideAllFilter],
  );

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

      if (
        !matchesOrgContactQualityFilter(club, qualityFilter, {
          unsubscribedEmails,
          hasLinkedAccount: linkedClubAccountIds.has(club.id),
        })
      ) {
        return false;
      }

      if (
        !clubContactMatchesTimelineFilter(club.id, timelineFilter, timelineIndex)
      ) {
        return false;
      }

      // 2. Filter by search query
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        (club.name ?? "").toLowerCase().includes(searchLower) ||
        (club.email ?? "").toLowerCase().includes(searchLower) ||
        club.id.toString().includes(searchLower) ||
        (club.address && club.address.toLowerCase().includes(searchLower)) ||
        orgContactSearchTokens(club).some((token) =>
          token.includes(searchLower),
        );

      return matchesSearch;
    });
  }, [
    data,
    filter,
    qualityFilter,
    searchQuery,
    activeClubIds,
    inactiveClubIds,
    unsubscribedEmails,
    linkedClubAccountIds,
    timelineFilter,
    timelineIndex,
  ]);

  // Pagination logic
  const totalPages = Math.ceil(filteredClubs.length / itemsPerPage);
  const paginatedClubs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredClubs.slice(start, start + itemsPerPage);
  }, [filteredClubs, currentPage]);

  // Reset to page 1 when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchQuery, qualityFilter, timelineFilter]);

  if (isLoading || unsubscribedLoading || accountsLoading) {
    return (
      <LoadingState variant="default" message="Loading club contacts..." />
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
        title="No Club Contacts Found"
        description="There are no club contact details available at this time."
        variant="card"
      />
    );
  }

  // Calculate statistics
  const totalClubs = data.data.length;
  const activeSubscribedClubs = data.data.filter((club) =>
    activeClubIds.has(club.id),
  ).length;
  const inactiveSubscribedClubs = data.data.filter((club) =>
    inactiveClubIds.has(club.id),
  ).length;

  const insightCounts = countOrgContactInsights(
    data.data,
    unsubscribedEmails,
    linkedClubAccountIds,
  );

  const downloadCSV = () => {
    const validClubs = filteredClubs.filter((club) =>
      isExportReadyOrgContact(club, unsubscribedEmails),
    );

    const contacts: SendGridContactRow[] =
      filter === "all"
        ? validClubs.flatMap((club) => collectOrgContactExportRows(club))
        : validClubs.flatMap((club) => {
            const accountInfo = clubIdToAccountMap.get(club.id);
            return [
              {
                email: accountInfo?.userEmail,
                firstName: accountInfo?.firstName,
                organization: club.name,
                organizationId: club.id,
              },
              {
                email: accountInfo?.deliveryEmail,
                organization: club.name,
                organizationId: club.id,
              },
            ];
          });

    const csvContent = buildSendGridContactCsv({
      contacts,
      unsubscribedEmails,
      organizationHeader: "club_name",
      organizationIdHeader: "club_id",
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `club-contacts-${filter}-${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const contactMetrics = [
    {
      icon: Users,
      label: "Total Clubs",
      value: totalClubs.toLocaleString(),
      detail: "Contacts in the system",
    },
    {
      icon: CreditCard,
      label: "Active",
      value: activeSubscribedClubs.toLocaleString(),
      detail: "Linked to active orders",
    },
    {
      icon: AlertCircle,
      label: "Inactive",
      value: inactiveSubscribedClubs.toLocaleString(),
      detail: "No active order",
    },
    {
      icon: FileCheck,
      label: "Export ready",
      value: insightCounts.exportReady.toLocaleString(),
      detail: "Valid email, not unsubscribed",
    },
    {
      icon: Clock,
      label: "Never scraped",
      value: insightCounts.neverScraped.toLocaleString(),
      detail: "No org contact scrape yet",
    },
    {
      icon: UserX,
      label: "No account",
      value: insightCounts.noAccount.toLocaleString(),
      detail: "Not linked in account lookup",
    },
    {
      icon: Target,
      label: "Marketing picks",
      value: timelineStats.marketingPicks.toLocaleString(),
      detail: "Same rules as Clubs → Timeline tab",
    },
    {
      icon: CalendarRange,
      label: "Starting soon",
      value: timelineStats.startingSoon.toLocaleString(),
      detail: "Season start within 60 days",
    },
  ];

  const tableColSpan = 9;

  const toggleExpanded = (id: number) => {
    setExpandedRowIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className={cn(!embedded && "mt-4", "space-y-4")}>
      <OrgContactMetricGrid metrics={contactMetrics} />

      <SectionContainer
        title="Club Contact Information"
        description="Manage and export contact details for club accounts"
        variant="default"
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-full border border-slate-200 bg-slate-50/60 px-4 py-2 md:flex-row md:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search clubs, emails, IDs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-full border-transparent bg-white pl-9 shadow-none"
              />
            </div>

            {showSportFilter && onSportSlugChange && sportSlug ? (
              <Select
                value={sportSlug}
                onValueChange={(value) =>
                  onSportSlugChange(value as ClubScrapeSportSlug)
                }
              >
                <SelectTrigger
                  id="club-emails-sport"
                  className="w-full shrink-0 rounded-full bg-white md:w-[180px]"
                >
                  <SelectValue placeholder="Sport" />
                </SelectTrigger>
                <SelectContent>
                  {CLUB_SCRAPE_SPORTS.map((row) => (
                    <SelectItem key={row.slug} value={row.slug}>
                      {row.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}

            <OrgContactListingQualitySelect
              value={qualityFilter}
              onValueChange={setQualityFilter}
              id="club-emails-quality"
            />

            <OrgContactTimelineFilterSelect
              value={timelineFilter}
              onValueChange={setTimelineFilter}
              disabled={!timelineInsightsEnabled}
              id="club-emails-timeline"
            />

            <LabeledSegmentedControl
              label="Status"
              value={filter}
              onValueChange={(value) =>
                setFilter(value as "all" | "active" | "inactive")
              }
              options={filterOptions}
              className="shrink-0"
              shellClassName="h-auto shrink-0 rounded-full"
            />

            <Button
              variant="ghost"
              size="sm"
              onClick={downloadCSV}
              className={cn(siteNavigationCtaClass, "w-full shrink-0 md:w-auto")}
            >
              <Download className="h-4 w-4" aria-hidden />
              Download CSV
            </Button>
          </div>

          <div className="px-1 text-sm text-muted-foreground">
          Showing {paginatedClubs.length} of {filteredClubs.length} contacts
          {filteredClubs.length !== totalClubs &&
            ` (filtered from ${totalClubs})`}
          {!timelineInsightsEnabled ? (
            <span className="block text-xs">
              Timeline filters use Clubs insights sport mapping; football/rugby
              slugs are contact-only until insights API supports them.
            </span>
          ) : null}
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="w-[44px]" aria-label="Expand scraped contacts" />
                <TableHead className="w-[60px]">Logo</TableHead>
                <TableHead>Club</TableHead>
                {filter === "all" ? (
                  <>
                    <TableHead>Contact Email</TableHead>
                    <TableHead>Address</TableHead>
                  </>
                ) : (
                  <>
                    <TableHead>User Email</TableHead>
                    <TableHead>Delivery Email</TableHead>
                  </>
                )}
                <TableHead className="hidden xl:table-cell">
                  Last scraped
                </TableHead>
                <TableHead className="hidden lg:table-cell">Teams</TableHead>
                <TableHead className="hidden lg:table-cell">Priority</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedClubs.length > 0 ? (
                paginatedClubs.map((club) => {
                  const accountInfo = clubIdToAccountMap.get(club.id);
                  const isExpanded = expandedRowIds.has(club.id);
                  const scrapedCount = club.contacts?.length ?? 0;
                  const clubInsight = timelineIndex.byId.get(club.id);
                  const timelineDisplay = getClubTimelineDisplay(
                    clubInsight,
                    timelineIndex.thresholds,
                  );
                  const isMarketingPick = clubInsight
                    ? matchesCampaignPreset(
                        clubInsight,
                        "marketing",
                        timelineIndex.thresholds,
                      )
                    : false;

                  return (
                    <Fragment key={club.id}>
                    <TableRow className="hover:bg-muted/30">
                      <TableCell>
                        <OrgContactExpandToggle
                          expanded={isExpanded}
                          onToggle={() => toggleExpanded(club.id)}
                          contactCount={scrapedCount}
                        />
                      </TableCell>
                      <TableCell>
                        <OrgContactListingLogo
                          logoUrl={
                            resolveStrapiMediaUrl(club.logo, Domain.strapi) ??
                            accountInfo?.logo
                          }
                          orgName={club.name}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium text-slate-900">
                          {club.name}
                        </div>
                        <div className="mt-0.5 text-xs text-muted-foreground">
                          ID: {club.id}
                        </div>
                        <OrgContactListingStatusBadges
                          row={club}
                          accountId={accountInfo?.id}
                          isActiveSubscription={activeClubIds.has(club.id)}
                          unsubscribedEmails={unsubscribedEmails}
                          isMarketingPick={isMarketingPick}
                        />
                      </TableCell>

                      {filter === "all" ? (
                        <>
                          <TableCell>
                            <a
                              href={`mailto:${club.email}`}
                              className="text-primary hover:underline flex items-center gap-1 group"
                            >
                              {club.email}
                            </a>
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

                      <OrgContactScrapeTableCells
                        lastOrgContactScrapeAt={club.lastOrgContactScrapeAt}
                      />

                      <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                        {timelineDisplay.sizeMetric}
                      </TableCell>
                      <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                        {timelineDisplay.priorityBand}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex flex-wrap justify-end gap-2">
                          {accountInfo?.id ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              className={siteNavigationCtaClass}
                              asChild
                            >
                              <Link
                                href={`/dashboard/accounts/club/${accountInfo.id}`}
                              >
                                Account
                              </Link>
                            </Button>
                          ) : null}
                          {filter === "all" && (
                            <>
                              {club.address &&
                                club.address !== "No address" && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className={siteNavigationCtaClass}
                                    asChild
                                  >
                                    <a
                                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                        club.address,
                                      )}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <MapPin className="h-3.5 w-3.5" aria-hidden />
                                      Map
                                    </a>
                                  </Button>
                                )}
                              {club.website &&
                                club.website !== "No website" && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className={siteNavigationCtaClass}
                                    asChild
                                  >
                                    <a
                                      href={club.website}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <ExternalLink
                                        className="h-3.5 w-3.5"
                                        aria-hidden
                                      />
                                      Web
                                    </a>
                                  </Button>
                                )}
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                    {isExpanded ? (
                      <OrgContactScrapedPeoplePanel
                        contacts={club.contacts}
                        lastOrgContactScrapeAt={club.lastOrgContactScrapeAt}
                        colSpan={tableColSpan}
                      />
                    ) : null}
                    </Fragment>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={tableColSpan}
                    className="h-32 text-center"
                  >
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Search className="h-8 w-8 mb-2 opacity-20" />
                      <p>No clubs found matching your search</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

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

          <OrgContactListingsMap
            filteredRows={filteredClubs}
            entityLabel="clubs"
          />
        </div>
      </SectionContainer>
    </div>
  );
}
