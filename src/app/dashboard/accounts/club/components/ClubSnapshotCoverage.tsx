"use client";

import { useQuery, useQueries } from "@tanstack/react-query";
import type { ReactNode } from "react";
import AccountStats from "@/app/dashboard/accounts/components/AccountStats";
import {
  countAccountSnapshotOperations,
  countAccountSnapshotSummary,
} from "@/app/dashboard/accounts/components/accountSnapshotCounts";
import { OrgContactMetricGrid } from "@/app/dashboard/accounts/components/OrgContactMetricGrid";
import ErrorState from "@/components/ui-library/states/ErrorState";
import LoadingState from "@/components/ui-library/states/LoadingState";
import { useGetClubEmails } from "@/hooks/accounts/useGetClubEmails";
import { fetchClubInsights } from "@/lib/services/club/fetchClubInsights";
import { getUnsubscribedEmails } from "@/lib/utils/unsubscribedEmails";
import type { AccountLookupItem } from "@/types/adminAccountLookup";
import type { ClubSportFilter } from "@/types/clubInsights";
import {
  AlertTriangle,
  Calendar,
  CalendarRange,
  CheckCircle2,
  Clock,
  CreditCard,
  FileCheck,
  ListChecks,
  Radio,
  Trophy,
  UserX,
} from "lucide-react";
import {
  countClubDirectoryCoverage,
  linkedClubIds,
} from "./clubSnapshotCoverage";

const CLUB_INSIGHT_SPORTS = [
  "Cricket",
  "AFL",
  "Hockey",
  "Netball",
  "Basketball",
] as const satisfies readonly ClubSportFilter[];

type ClubSnapshotCoverageProps = {
  accounts: AccountLookupItem[];
};

export default function ClubSnapshotCoverage({
  accounts,
}: ClubSnapshotCoverageProps) {
  const contactsQuery = useGetClubEmails();
  const unsubscribedQuery = useQuery({
    queryKey: ["unsubscribed-emails"],
    queryFn: getUnsubscribedEmails,
    staleTime: 5 * 60 * 1000,
  });
  const insightQueries = useQueries({
    queries: CLUB_INSIGHT_SPORTS.map((sport) => ({
      queryKey: ["club-insights", sport],
      queryFn: () => fetchClubInsights(sport),
      staleTime: 5 * 60 * 1000,
      retry: 3,
    })),
  });

  const insightsLoading = insightQueries.some((query) => query.isLoading);
  const insightsError = insightQueries.some((query) => query.isError);
  const directoryClubs =
    insightsLoading || insightsError
      ? null
      : insightQueries.flatMap((query) => query.data?.data.clubs ?? []);

  const summary = countAccountSnapshotSummary(accounts);
  const operations = countAccountSnapshotOperations(accounts);
  const contactCounts =
    contactsQuery.data?.data === undefined
      ? null
      : countClubDirectoryCoverage({
          contacts: contactsQuery.data.data,
          unsubscribedEmails: unsubscribedQuery.data ?? [],
          linkedClubIds: linkedClubIds(accounts),
          clubs: directoryClubs,
        });

  return (
    <div className="space-y-8">
      <CoverageGroup
        title="Fixtura accounts"
        description="Subscription, setup, and live work for these accounts."
      >
        <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
          <OrgContactMetricGrid
            className="mb-0 rounded-none border-0"
            metrics={[
              {
                icon: CreditCard,
                label: "Total accounts",
                value: summary.total.toLocaleString(),
                detail: `${summary.active.toLocaleString()} active / ${summary.inactive.toLocaleString()} inactive`,
              },
              {
                icon: Calendar,
                label: "Expiring soon",
                value: summary.expiring30.toLocaleString(),
                detail: `${summary.expiring60.toLocaleString()} in 31-60 days`,
              },
              {
                icon: CheckCircle2,
                label: "Setup complete",
                value: `${summary.setupPercentage}%`,
                detail: `${summary.setupComplete.toLocaleString()} complete / ${summary.setupPending.toLocaleString()} pending`,
              },
              {
                icon: Trophy,
                label: "Sports",
                value: summary.sportCount.toLocaleString(),
                detail: summary.sportDetail,
              },
            ]}
          />
          <div className="border-t border-slate-200">
            <OrgContactMetricGrid
              className="mb-0 rounded-none border-0"
              metrics={[
                {
                  icon: ListChecks,
                  label: "Start sequence open",
                  value: operations.startSequenceOpen.toLocaleString(),
                  detail: `${operations.startSequenceComplete.toLocaleString()} finished`,
                },
                {
                  icon: AlertTriangle,
                  label: "Refresh failed",
                  value: operations.refreshFailed.toLocaleString(),
                  detail: `${operations.refreshInProgress.toLocaleString()} queued or running`,
                },
                {
                  icon: Clock,
                  label: "Never refreshed",
                  value: operations.refreshNotStarted.toLocaleString(),
                  detail: "Season data refresh has not run",
                },
                {
                  icon: Radio,
                  label: "Rendering now",
                  value: operations.renderingNow.toLocaleString(),
                  detail: "Scheduler flag or a render in progress",
                },
              ]}
            />
          </div>
        </div>
        <AccountStats accounts={accounts} part="charts" />
      </CoverageGroup>

      <CoverageGroup
        title="Club directory"
        description="PlayHQ clubs, including ones without a Fixtura account."
      >
        {contactsQuery.isLoading || unsubscribedQuery.isLoading ? (
          <LoadingState variant="minimal" message="Loading club directory..." />
        ) : contactsQuery.isError ? (
          <ErrorState
            error={
              contactsQuery.error instanceof Error
                ? contactsQuery.error
                : new Error("Failed to load club contacts")
            }
            onRetry={() => {
              void contactsQuery.refetch();
            }}
          />
        ) : contactCounts ? (
          <OrgContactMetricGrid
            className="mb-0"
            metrics={[
              {
                icon: FileCheck,
                label: "Export ready",
                value: contactCounts.exportReady.toLocaleString(),
                detail: "Valid email, not unsubscribed",
              },
              {
                icon: Clock,
                label: "Never scraped",
                value: contactCounts.neverScraped.toLocaleString(),
                detail: `${contactCounts.staleScrape.toLocaleString()} stale past 30 days`,
              },
              {
                icon: UserX,
                label: "No Fixtura account",
                value: contactCounts.noAccount.toLocaleString(),
                detail: "Not linked to an account above",
              },
              {
                icon: CalendarRange,
                label: "Starting soon",
                value: startingSoonValue(
                  insightsLoading,
                  contactCounts.startingSoon,
                ),
                detail: seasonDetail(
                  insightsLoading,
                  insightsError,
                  contactCounts.marketingPicks,
                ),
              },
            ]}
          />
        ) : null}
      </CoverageGroup>
    </div>
  );
}

function startingSoonValue(
  isLoading: boolean,
  startingSoon: number | null,
): string {
  if (isLoading) return "…";
  if (startingSoon === null) return "—";
  return startingSoon.toLocaleString();
}

function seasonDetail(
  isLoading: boolean,
  isError: boolean,
  marketingPicks: number | null,
): string {
  if (isLoading) return "Loading season timeline";
  if (isError || marketingPicks === null) return "Season timeline unavailable";
  return `${marketingPicks.toLocaleString()} marketing picks`;
}

function CoverageGroup({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-sm font-medium text-slate-900">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
}
