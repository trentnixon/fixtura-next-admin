"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  Building,
  Calendar,
  ChevronDown,
  ClipboardList,
  ExternalLink,
  Gauge,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Users,
} from "lucide-react";

import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTriggerGradesCompsSingleScrape } from "@/hooks/competitions/useTriggerGradesCompsSingleScrape";
import { useTriggerGradesLookupTeamsSingleScrape } from "@/hooks/competitions/useTriggerGradesLookupTeamsSingleScrape";
import { useTriggerRemoveFixturesScrape } from "@/hooks/data-collection/useTriggerRemoveFixturesScrape";
import { useTriggerResultBatchScrape } from "@/hooks/data-collection/useTriggerResultBatchScrape";
import { CompetitionAdminDetailResponse } from "@/types/competitionAdminDetail";
import {
  getAccountSelectionState,
  type AssociationAccountOption,
} from "@/utils/associationAccountSelection";

const NO_ACCOUNTS_TITLE = "No Fixtura account linked to this association";

function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined) return "-";
  return value.toLocaleString();
}

function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined) return "-";
  return `${value.toFixed(0)}%`;
}

function formatDate(value: string | null): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Australia/Sydney",
  }).format(date);
}

interface SnapshotSectionProps {
  meta: CompetitionAdminDetailResponse["meta"];
  counts: CompetitionAdminDetailResponse["counts"];
  accountCoverage: CompetitionAdminDetailResponse["analytics"]["summary"]["accountCoverage"];
  timeline: CompetitionAdminDetailResponse["analytics"]["summary"]["timeline"];
  strapiLocation: { competition?: string } | null;
  isFetching: boolean;
  associationAccounts?: AssociationAccountOption[];
  actionChildren?: ReactNode;
  associationId?: number | null;
}

export function SnapshotSection({
  meta,
  counts,
  accountCoverage,
  timeline,
  strapiLocation,
  isFetching,
  associationAccounts = [],
  actionChildren,
  associationId,
}: SnapshotSectionProps) {
  return (
    <SectionContainer
      title="Competition Snapshot"
      description="Key stats for the selected competition."
      action={
        <SnapshotActions
          meta={meta}
          strapiLocation={strapiLocation}
          isFetching={isFetching}
          associationAccounts={associationAccounts}
          actionChildren={actionChildren}
          associationId={associationId}
        />
      }
    >
      <div className="grid overflow-hidden rounded-md border border-slate-200 bg-white sm:grid-cols-2 lg:grid-cols-4">
        <SnapshotMetric
          title="Teams"
          value={formatNumber(counts.teamCount)}
          detail={`Grades ${formatNumber(
            counts.gradeCount,
          )} - Clubs ${formatNumber(counts.clubCount)}`}
          icon={<Activity className="h-4 w-4" />}
        />
        <SnapshotMetric
          title="Linked Accounts"
          value={formatNumber(accountCoverage.association.accountCount)}
          detail={
            accountCoverage.association.hasAccount
              ? "Fixtura accounts connected"
              : "No linked accounts yet"
          }
          icon={<Building className="h-4 w-4" />}
        />
        <SnapshotMetric
          title="Club Coverage"
          value={formatPercent(accountCoverage.clubs.coveragePercent)}
          detail={`${formatNumber(
            accountCoverage.clubs.withAccount,
          )} with account - ${formatNumber(
            accountCoverage.clubs.withoutAccount,
          )} without`}
          icon={<Gauge className="h-4 w-4" />}
        />
        <SnapshotMetric
          title="Timeline"
          value={formatPercent(timeline.progressPercent)}
          detail={`${formatDate(timeline.startDate)} to ${formatDate(
            timeline.endDate,
          )}`}
          icon={<Calendar className="h-4 w-4" />}
        />
      </div>
    </SectionContainer>
  );
}

interface SnapshotMetricProps {
  title: string;
  value: string;
  detail: string;
  icon: ReactNode;
}

function SnapshotMetric({ title, value, detail, icon }: SnapshotMetricProps) {
  return (
    <div className="flex min-w-0 items-center gap-3 border-b border-slate-200 px-4 py-3 last:border-b-0 sm:[&:nth-child(odd)]:border-r lg:border-b-0 lg:border-r lg:last:border-r-0">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-slate-50 text-slate-500">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <p className="text-lg font-semibold leading-none text-slate-900">
            {value}
          </p>
          <p className="truncate text-xs font-medium uppercase text-slate-500">
            {title}
          </p>
        </div>
        <p className="mt-1 truncate text-xs text-slate-500">{detail}</p>
      </div>
    </div>
  );
}

interface SnapshotActionsProps {
  meta: CompetitionAdminDetailResponse["meta"];
  strapiLocation: { competition?: string } | null;
  isFetching: boolean;
  associationAccounts: AssociationAccountOption[];
  actionChildren?: ReactNode;
  associationId?: number | null;
}

function SnapshotActions({
  meta,
  strapiLocation,
  isFetching,
  associationAccounts,
  actionChildren,
  associationId,
}: SnapshotActionsProps) {
  const [gradesDialogOpen, setGradesDialogOpen] = useState(false);
  const [teamsDialogOpen, setTeamsDialogOpen] = useState(false);
  const [resultsDialogOpen, setResultsDialogOpen] = useState(false);
  const [removeFixturesDialogOpen, setRemoveFixturesDialogOpen] =
    useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState("");

  const triggerGradesScrape = useTriggerGradesCompsSingleScrape();
  const triggerTeamsScrape = useTriggerGradesLookupTeamsSingleScrape();
  const triggerResultsScrape = useTriggerResultBatchScrape();
  const triggerRemoveFixturesScrape = useTriggerRemoveFixturesScrape();

  const cmsUrl = strapiLocation?.competition
    ? `${strapiLocation.competition}${meta.id}`
    : null;
  const selectionState = getAccountSelectionState(associationAccounts);
  const singleAccount =
    selectionState === "single" ? associationAccounts[0] : null;

  const openDialogAfterMenuCloses = (openDialog: () => void) => {
    window.setTimeout(openDialog, 0);
  };

  useEffect(() => {
    if (!removeFixturesDialogOpen) return;

    if (selectionState === "multiple") {
      setSelectedAccountId("");
    }
  }, [removeFixturesDialogOpen, selectionState]);

  const handleScrapeGrades = async () => {
    try {
      await triggerGradesScrape.mutateAsync({ competitionId: meta.id });
      setGradesDialogOpen(false);
    } catch (error) {
      console.error("Error triggering grades scrape:", error);
    }
  };

  const handleScrapeTeams = async () => {
    try {
      await triggerTeamsScrape.mutateAsync({ competitionId: meta.id });
      setTeamsDialogOpen(false);
    } catch (error) {
      console.error("Error triggering grades lookup teams scrape:", error);
    }
  };

  const handleScrapeResults = async () => {
    try {
      await triggerResultsScrape.mutateAsync({
        sourceType: "competition",
        sourceId: meta.id,
      });
      setResultsDialogOpen(false);
    } catch {
      // Toasts handled in hook.
    }
  };

  const handleRemoveFixturesCheck = async () => {
    if (selectionState === "none") return;

    let accountId: number;
    if (selectionState === "single") {
      accountId = associationAccounts[0].id;
    } else {
      const parsed = Number.parseInt(selectedAccountId, 10);
      if (Number.isNaN(parsed)) return;
      accountId = parsed;
    }

    try {
      await triggerRemoveFixturesScrape.mutateAsync({
        accountId,
        sourceType: "competition",
        sourceId: meta.id,
      });
      setRemoveFixturesDialogOpen(false);
    } catch {
      // Toasts handled in hook.
    }
  };

  const noAccountsBlocked = selectionState === "none";
  const removeFixturesConfirmDisabled =
    triggerRemoveFixturesScrape.isPending ||
    selectionState === "none" ||
    (selectionState === "multiple" && selectedAccountId === "");

  return (
    <>
      <div className="flex flex-wrap items-center justify-end gap-2">
        {associationId !== undefined && associationId !== null && (
          <Button asChild variant="accent" size="sm">
            <Link href={`/dashboard/association/${associationId}`}>
              <Building className="h-4 w-4" />
              View Association
            </Link>
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="primary" size="sm">
              <ExternalLink className="h-4 w-4" />
              Open
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Destinations</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {meta.url ? (
              <DropdownMenuItem asChild>
                <Link href={meta.url} target="_blank" rel="noopener noreferrer">
                  <Calendar className="h-4 w-4" />
                  View on PlayHQ
                </Link>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem disabled>
                <Calendar className="h-4 w-4" />
                View on PlayHQ
              </DropdownMenuItem>
            )}
            {cmsUrl ? (
              <DropdownMenuItem asChild>
                <Link href={cmsUrl} target="_blank" rel="noopener noreferrer">
                  <ShieldCheck className="h-4 w-4" />
                  Open in CMS
                </Link>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem disabled>
                <ShieldCheck className="h-4 w-4" />
                Open in CMS
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="accent" size="sm">
              <RefreshCw className="h-4 w-4" />
              Data actions
              <ChevronDown className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Queue background jobs</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              disabled={!meta.url || triggerGradesScrape.isPending}
              onSelect={() =>
                openDialogAfterMenuCloses(() => setGradesDialogOpen(true))
              }
            >
              <RefreshCw className="h-4 w-4" />
              Scrape grades
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={triggerTeamsScrape.isPending}
              onSelect={() =>
                openDialogAfterMenuCloses(() => setTeamsDialogOpen(true))
              }
            >
              <Users className="h-4 w-4" />
              Scrape teams
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={triggerResultsScrape.isPending || meta.id <= 0}
              onSelect={() =>
                openDialogAfterMenuCloses(() => setResultsDialogOpen(true))
              }
            >
              <RefreshCw className="h-4 w-4" />
              Scrape results
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={
                triggerRemoveFixturesScrape.isPending ||
                meta.id <= 0 ||
                noAccountsBlocked
              }
              title={noAccountsBlocked ? NO_ACCOUNTS_TITLE : undefined}
              onSelect={() =>
                openDialogAfterMenuCloses(() =>
                  setRemoveFixturesDialogOpen(true)
                )
              }
            >
              <ClipboardList className="h-4 w-4" />
              Queue remove-fixtures check
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {isFetching && <Badge variant="outline">Refreshing...</Badge>}
        {actionChildren}
      </div>

      <Dialog open={gradesDialogOpen} onOpenChange={setGradesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-brandAccent-600" />
              Confirm Grades Scrape
            </DialogTitle>
            <DialogDescription>
              This will queue a background job to scrape this competition&apos;s
              PlayHQ grades page and ingest grades. The CMS looks up the
              competition, resolves the PlayHQ URL from competition.url, and
              enqueues to the Redis queue scrape:grades-comps-single. The job
              runs asynchronously.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium">Competition ID:</span> {meta.id}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setGradesDialogOpen(false)}
              disabled={triggerGradesScrape.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="accent"
              onClick={handleScrapeGrades}
              disabled={triggerGradesScrape.isPending}
            >
              {triggerGradesScrape.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Queuing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Confirm Scrape
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={teamsDialogOpen} onOpenChange={setTeamsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-brandAccent-600" />
              Confirm Teams Scrape
            </DialogTitle>
            <DialogDescription>
              This will queue a background job to scrape teams for each grade in
              this competition. The CMS fetches grades via GET
              /api/grade-teams/by-competition, then Python scrapes each
              grade&apos;s ladder page for teams and POSTs to
              /api/grade-teams/response. The job runs asynchronously.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium">Competition ID:</span> {meta.id}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setTeamsDialogOpen(false)}
              disabled={triggerTeamsScrape.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="accent"
              onClick={handleScrapeTeams}
              disabled={triggerTeamsScrape.isPending}
            >
              {triggerTeamsScrape.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Queuing...
                </>
              ) : (
                <>
                  <Users className="h-4 w-4 mr-2" />
                  Confirm Scrape
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={resultsDialogOpen} onOpenChange={setResultsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-brandAccent-600" />
              Confirm result batch scrape
            </DialogTitle>
            <DialogDescription>
              Queue background jobs to scrape results from PlayHQ for fixtures
              in this competition.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                The CMS selects resultable fixtures in the configured date
                window, validates PlayHQ game-centre URLs, and enqueues the
                Redis queue{" "}
                <span className="font-medium">scrape:result-batch</span> with up
                to five fixtures per job.
              </p>
              <p>
                Jobs run asynchronously. Track progress on{" "}
                <span className="font-medium">/dashboard/data</span> scraper
                logs.
              </p>
            </div>
            <div className="text-sm space-y-1 mt-4">
              <p>
                <span className="font-medium">Source:</span> Competition ID{" "}
                {meta.id}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setResultsDialogOpen(false)}
              disabled={triggerResultsScrape.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="accent"
              onClick={handleScrapeResults}
              disabled={triggerResultsScrape.isPending}
            >
              {triggerResultsScrape.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Queuing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Confirm scrape
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={removeFixturesDialogOpen}
        onOpenChange={setRemoveFixturesDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-brandAccent-600" />
              Confirm remove-fixtures check (enqueue-only)
            </DialogTitle>
            <DialogDescription>
              Queue background jobs to validate PlayHQ scorecard URLs for
              fixtures in this competition. CMS does{" "}
              <span className="font-medium">not</span> delete fixtures from this
              endpoint.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                The CMS loads all fixtures for the scoped grades, keeps rows
                with valid <span className="font-medium">https</span> PlayHQ
                URLs, and enqueues the Redis queue{" "}
                <span className="font-medium">scrape:remove-fixtures</span> in
                chunks.
              </p>
              <p>
                Jobs run asynchronously. Track runs on{" "}
                <span className="font-medium">/dashboard/data</span> scraper
                logs.
              </p>
            </div>
            <div className="text-sm space-y-3 mt-4">
              <p>
                <span className="font-medium">Source:</span> Competition ID{" "}
                {meta.id}
              </p>

              {selectionState === "single" && singleAccount && (
                <p>
                  <span className="font-medium">Fixtura account:</span>{" "}
                  {singleAccount.label} (ID {singleAccount.id})
                </p>
              )}

              {selectionState === "multiple" && (
                <div className="space-y-2">
                  <Label htmlFor="remove-fixtures-account-select">
                    Fixtura account <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={selectedAccountId || undefined}
                    onValueChange={setSelectedAccountId}
                  >
                    <SelectTrigger id="remove-fixtures-account-select">
                      <SelectValue placeholder="Choose an account" />
                    </SelectTrigger>
                    <SelectContent>
                      {associationAccounts.map((account) => (
                        <SelectItem key={account.id} value={String(account.id)}>
                          {account.label} (#{account.id})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Multiple Fixtura accounts are linked to this association.
                    Pick the correct one for correlation and auditing.
                  </p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setRemoveFixturesDialogOpen(false)}
              disabled={triggerRemoveFixturesScrape.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="accent"
              onClick={handleRemoveFixturesCheck}
              disabled={removeFixturesConfirmDisabled}
            >
              {triggerRemoveFixturesScrape.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Queuing...
                </>
              ) : (
                <>
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Confirm enqueue
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
