"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  ClipboardCheck,
  ExternalLink,
  FileDown,
  Gauge,
  Layers,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";
import { OverviewRecordPanel } from "@/app/dashboard/components/live-snapshot/OverviewRecordPanel";
import { useRendersQuery } from "@/hooks/renders/useRendersQuery";
import { useGetAccountDetailsFromRenderId } from "@/hooks/renders/useGetAccountDetailsFromRenderId";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import { getAccountPagePath } from "@/lib/account-health/accountRoutes";
import {
  sectionTabListClass,
  sectionTabTriggerClass,
  siteNavigationGroupDividerClass,
  siteNavigationGroupItemClass,
  siteNavigationGroupShellClass,
} from "@/lib/actions/siteNavigationButtonStyles";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import RenderCostBreakdown from "@/app/dashboard/budget/components/RenderCostBreakdown";
import RenderIntegrityAudit from "./RenderIntegrityAudit";
import TableDownloads from "./TableDownloads";
import TableGamesResults from "./TableGameResults";
import TableGrades from "./TableGradesInRender";
import TableUpcomingGames from "./TableUpcomingGames";
import RenderHeader from "./renderHeader";
import RenderOverview from "./renderOverview";
import DeleteRenderButton from "@/app/dashboard/accounts/components/actions/button_delete_Render";

const renderTabs = [
  { value: "snapshot", label: "Snapshot", icon: Gauge },
  { value: "cost", label: "Cost", icon: CircleDollarSign },
  { value: "downloads", label: "Downloads", icon: FileDown },
  { value: "gameResults", label: "Game results", icon: Trophy },
  { value: "upcomingGames", label: "Upcoming games", icon: CalendarDays },
  { value: "grades", label: "Grades", icon: Layers },
  { value: "audit", label: "Integrity audit", icon: ClipboardCheck },
] as const;

function groupedItemClass(withDivider: boolean) {
  return cn(
    siteNavigationGroupItemClass,
    withDivider && siteNavigationGroupDividerClass,
  );
}

function resolveAccountTypeFromCode(
  accountType: number | undefined,
): "club" | "association" | null {
  if (accountType === 1) return "club";
  if (accountType === 2) return "association";
  return null;
}

export default function RenderDetailClient() {
  const { renderID } = useParams();
  const renderId = renderID as string;
  const { Domain, strapiLocation } = useGlobalContext();
  const { contentHub } = Domain;

  const {
    data: render,
    isLoading: renderLoading,
    isError: renderError,
    error: renderQueryError,
    refetch: refetchRender,
  } = useRendersQuery(renderId);

  const { data: accountDetails } = useGetAccountDetailsFromRenderId(renderId);

  const renderIdNumber = useMemo(() => {
    const id = parseInt(renderId, 10);
    return Number.isFinite(id) ? id : null;
  }, [renderId]);

  const accountId = accountDetails?.account?.id;
  const accountTypeCode =
    accountDetails?.account && "account_type" in accountDetails.account
      ? (accountDetails.account as { account_type?: number }).account_type
      : undefined;
  const accountType = resolveAccountTypeFromCode(accountTypeCode);
  const accountHref =
    accountId && accountType ? getAccountPagePath(accountId, accountType) : null;

  const accountName =
    accountDetails?.account?.FirstName && accountDetails?.account?.LastName
      ? `${accountDetails.account.FirstName} ${accountDetails.account.LastName}`
      : accountDetails?.account?.FirstName || null;

  const pageTitle = accountName
    ? render?.Name
      ? `${accountName} · ${render.Name}`
      : `${accountName} · Render`
    : render?.Name
      ? render.Name
      : "Render details";

  const byLine = useMemo(() => {
    const parts = [`Render ID: ${renderId}`];
    if (accountDetails?.account?.Sport) {
      parts.push(accountDetails.account.Sport);
    }
    if (accountType) {
      parts.push(accountType === "club" ? "Club" : "Association");
    }
    return parts.join(" · ");
  }, [accountDetails?.account?.Sport, accountType, renderId]);

  const byLineBottom = render?.updatedAt
    ? `Last updated ${formatDate(render.updatedAt)}`
    : "View render output, cost, fixtures, and integrity checks";

  const contentHubHref =
    accountDetails?.account?.id && accountDetails?.account?.Sport
      ? `${contentHub}/${accountDetails.account.id}/${accountDetails.account.Sport.toLowerCase()}/${renderId}`
      : null;

  if (renderLoading && !render) {
    return (
      <>
        <CreatePageTitle
          title="Render"
          byLine={`Render ID: ${renderId}`}
          byLineBottom="Loading render details…"
        />
        <PageContainer padding="xs" spacing="lg">
          <LoadingState variant="default" message="Loading render…" />
        </PageContainer>
      </>
    );
  }

  if (renderError) {
    return (
      <>
        <CreatePageTitle
          title="Render"
          byLine={`Render ID: ${renderId}`}
          byLineBottom="Could not load render"
        />
        <PageContainer padding="xs" spacing="lg">
          <ErrorState
            variant="default"
            title="Could not load render"
            error={
              renderQueryError instanceof Error
                ? renderQueryError
                : new Error("Render details unavailable")
            }
            onRetry={() => refetchRender()}
          />
        </PageContainer>
      </>
    );
  }

  return (
    <>
      <CreatePageTitle title={pageTitle} byLine={byLine} byLineBottom={byLineBottom}>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <div className={siteNavigationGroupShellClass}>
            <Button
              variant="ghost"
              size="sm"
              className={groupedItemClass(true)}
              asChild
            >
              <Link href="/dashboard/renders">
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Renders
              </Link>
            </Button>
            {accountHref ? (
              <Button
                variant="ghost"
                size="sm"
                className={groupedItemClass(true)}
                asChild
              >
                <Link href={accountHref}>Account</Link>
              </Button>
            ) : null}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={groupedItemClass(false)}
                >
                  Open
                  <ChevronDown className="h-3.5 w-3.5" aria-hidden />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Destinations</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {contentHubHref ? (
                  <DropdownMenuItem asChild>
                    <a
                      href={contentHubHref}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Content Hub
                    </a>
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuItem asChild>
                  <a
                    href={`${strapiLocation.render}${renderId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    CMS render
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <DeleteRenderButton />
        </div>
      </CreatePageTitle>

      <PageContainer padding="xs" spacing="lg">
        <RenderHeader render={render} />

        <Tabs defaultValue="snapshot" className="w-full">
          <div className="pb-8 pt-4">
            <TabsList variant="primary" className={sectionTabListClass}>
              {renderTabs.map(({ value, label, icon: Icon }) => (
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

          <TabsContent value="snapshot" className="mt-0">
            <RenderOverview />
          </TabsContent>

          <TabsContent value="cost" className="mt-0">
            {renderIdNumber ? (
              <RenderCostBreakdown renderId={renderIdNumber} />
            ) : null}
          </TabsContent>

          <TabsContent value="downloads" className="mt-0">
            <OverviewRecordPanel
              title="Downloads"
              description="Generated assets and downloadable files for this render"
            >
              <TableDownloads />
            </OverviewRecordPanel>
          </TabsContent>

          <TabsContent value="gameResults" className="mt-0">
            <OverviewRecordPanel
              title="Game results"
              description="Result fixtures included in this render"
            >
              <TableGamesResults />
            </OverviewRecordPanel>
          </TabsContent>

          <TabsContent value="upcomingGames" className="mt-0">
            <OverviewRecordPanel
              title="Upcoming games"
              description="Scheduled fixtures included in this render"
            >
              <TableUpcomingGames />
            </OverviewRecordPanel>
          </TabsContent>

          <TabsContent value="grades" className="mt-0">
            <OverviewRecordPanel
              title="Grades"
              description="Grades associated with this render"
            >
              <TableGrades />
            </OverviewRecordPanel>
          </TabsContent>

          <TabsContent value="audit" className="mt-0">
            <OverviewRecordPanel
              title="Integrity audit"
              description="Operational checks for render completeness and related data"
            >
              <RenderIntegrityAudit />
            </OverviewRecordPanel>
          </TabsContent>
        </Tabs>
      </PageContainer>
    </>
  );
}
