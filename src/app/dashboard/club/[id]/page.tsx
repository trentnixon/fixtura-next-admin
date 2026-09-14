"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useClubAdminDetail } from "@/hooks/club/useClubAdminDetail";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  sectionTabListClass,
  sectionTabTriggerClass,
} from "@/lib/actions/siteNavigationButtonStyles";
import {
  BarChart3,
  Building2,
  Gauge,
  Trophy,
  Users,
} from "lucide-react";
import ClubHeader from "./components/ClubHeader";
import StatisticsOverview from "./components/StatisticsOverview";
import AssociationsList from "./components/AssociationsList";
import TeamsList from "./components/TeamsList";
import CompetitionsList from "./components/CompetitionsList";
import AccountsList from "./components/AccountsList";
import InsightsSection from "./components/InsightsSection";

const clubDetailTabs = [
  { value: "snapshot", label: "Snapshot", icon: Gauge },
  { value: "competitions", label: "Competitions", icon: Trophy },
  { value: "teams", label: "Teams", icon: Users },
  { value: "associations", label: "Associations", icon: Building2 },
  { value: "accounts", label: "Accounts", icon: Users },
  { value: "insights", label: "Insights", icon: BarChart3 },
] as const;

export default function ClubAdminDetailPage() {
  const params = useParams<{ id: string }>();

  const clubId = useMemo(() => {
    if (!params?.id) return null;
    const parsed = parseInt(params.id, 10);
    return Number.isNaN(parsed) ? null : parsed;
  }, [params?.id]);

  const { data, isLoading, error, refetch, isFetching } =
    useClubAdminDetail(clubId);

  if (!clubId) {
    return (
      <>
        <CreatePageTitle
          title="Club Detail"
          byLine="Invalid Club ID"
          byLineBottom="Please provide a valid numeric club ID in the URL."
        />
        <PageContainer padding="md" spacing="lg">
          <ErrorState
            error={
              new Error(
                "Invalid club ID. The route expects a numeric ID parameter.",
              )
            }
            onRetry={() => window.location.reload()}
          />
        </PageContainer>
      </>
    );
  }

  if (isLoading && !data) {
    return (
      <>
        <CreatePageTitle
          title="Club Detail"
          byLine={`Club ID: ${clubId}`}
          byLineBottom="Loading club data..."
        />
        <PageContainer padding="md" spacing="lg">
          <LoadingState message="Loading club admin detail..." />
        </PageContainer>
      </>
    );
  }

  if (error) {
    return (
      <>
        <CreatePageTitle
          title="Club Detail"
          byLine={`Club ID: ${clubId}`}
          byLineBottom="Error loading club data"
        />
        <PageContainer padding="md" spacing="lg">
          <ErrorState
            error={
              error instanceof Error
                ? error
                : new Error("Failed to load club admin detail")
            }
            onRetry={() => refetch()}
          />
        </PageContainer>
      </>
    );
  }

  if (!data?.data) {
    return (
      <>
        <CreatePageTitle
          title="Club Detail"
          byLine={`Club ID: ${clubId}`}
          byLineBottom="Loading club data..."
        />
        <PageContainer padding="md" spacing="lg">
          <LoadingState message="Loading club admin detail..." />
        </PageContainer>
      </>
    );
  }

  const {
    club,
    statistics,
    associations,
    teams,
    competitions,
    accounts,
    insights,
  } = data.data;

  return (
    <>
      <CreatePageTitle
        title={club.name}
        byLine={`${club.sport} • Club ID: ${clubId}`}
        byLineBottom={isFetching ? "Refreshing..." : "Club Admin Detail"}
      />
      <PageContainer padding="xs" spacing="lg">
        <Tabs defaultValue="snapshot" className="w-full min-w-0 max-w-full">
          <div className="pb-8">
            <TabsList variant="primary" className={sectionTabListClass}>
              {clubDetailTabs.map(({ value, label, icon: Icon }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  variant="section"
                  className={sectionTabTriggerClass}
                >
                  <Icon className="h-4 w-4 shrink-0 text-current" aria-hidden />
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="snapshot" className="mt-0 space-y-6">
            <ClubHeader club={club} statistics={statistics} />
            <StatisticsOverview statistics={statistics} />
          </TabsContent>

          <TabsContent value="competitions" className="mt-0">
            <SectionContainer
              title="Competitions"
              description={`${competitions.length} competition(s) this club is involved in, including timeline and participation.`}
            >
              <CompetitionsList competitions={competitions} />
            </SectionContainer>
          </TabsContent>

          <TabsContent value="teams" className="mt-0">
            <SectionContainer
              title="Teams"
              description={`${teams.length} team(s) for this club with competition and grade context.`}
            >
              <TeamsList teams={teams} />
            </SectionContainer>
          </TabsContent>

          <TabsContent value="associations" className="mt-0">
            <SectionContainer
              title="Associations"
              description={`${associations.length} association(s) this club participates in.`}
            >
              <AssociationsList associations={associations} />
            </SectionContainer>
          </TabsContent>

          <TabsContent value="accounts" className="mt-0">
            <SectionContainer
              title="Accounts"
              description={`${accounts.length} account(s) linked to this club and their subscription status.`}
            >
              <AccountsList accounts={accounts} />
            </SectionContainer>
          </TabsContent>

          <TabsContent value="insights" className="mt-0">
            <SectionContainer
              title="Insights"
              description="Analytics and insights for this club."
            >
              <InsightsSection insights={insights} />
            </SectionContainer>
          </TabsContent>
        </Tabs>
      </PageContainer>
    </>
  );
}
