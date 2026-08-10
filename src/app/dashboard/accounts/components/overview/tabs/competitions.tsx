"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  CheckIcon,
  DatabaseIcon,
  XIcon,
} from "lucide-react";

import { useAccountQuery } from "@/hooks/accounts/useAccountQuery";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui-library";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCompetitionAssociationDrilldown } from "@/hooks/competitions/useCompetitionAssociationDrilldown";
import { useCompetitionClubDrilldown } from "@/hooks/competitions/useCompetitionClubDrilldown";
import { CompetitionAssociationCompetition } from "@/types/competitionAssociationDrilldown";
import { CompetitionClubCompetition } from "@/types/competitionClubDrilldown";

type CompetitionRow =
  | CompetitionAssociationCompetition
  | CompetitionClubCompetition;

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
  }).format(date);
}

export default function CompetitionsTab() {
  const { accountID } = useParams();
  const { strapiLocation } = useGlobalContext();

  const {
    data: accountData,
    isLoading: isAccountLoading,
    isError: isAccountError,
    error: accountError,
  } = useAccountQuery(accountID as string);

  const organizationId = accountData?.data?.accountOrganisationDetails?.id;
  const accountType = accountData?.data?.account_type;
  const isClubAccount = accountType === 1;
  const isAssociationAccount = accountType !== 1;

  const {
    data: associationDrilldown,
    isLoading: isAssociationLoading,
    isError: isAssociationError,
    error: associationError,
  } = useCompetitionAssociationDrilldown(
    isAssociationAccount ? organizationId : undefined,
  );

  const {
    data: clubDrilldown,
    isLoading: isClubLoading,
    isError: isClubError,
    error: clubError,
  } = useCompetitionClubDrilldown(isClubAccount ? organizationId : undefined);

  const isLoading =
    isAccountLoading ||
    (isAssociationAccount && isAssociationLoading) ||
    (isClubAccount && isClubLoading);

  if (isLoading) {
    return <LoadingState variant="skeleton" />;
  }

  if (isAccountError) {
    return (
      <ErrorState
        variant="card"
        error={accountError}
        title="Error fetching account details"
      />
    );
  }

  if (!organizationId || accountType === undefined) {
    return (
      <SectionContainer title="Competitions" variant="compact">
        <EmptyState
          variant="minimal"
          description="Account organization details are missing. Cannot load competitions."
        />
      </SectionContainer>
    );
  }

  if (isAssociationAccount) {
    if (isAssociationError) {
      return (
        <SectionContainer title="Competitions" variant="compact">
          <ErrorState
            variant="card"
            error={associationError}
            title="Error fetching association competitions"
          />
        </SectionContainer>
      );
    }

    if (!associationDrilldown) {
      return (
        <SectionContainer title="Competitions" variant="compact">
          <EmptyState
            variant="minimal"
            description="No association data found."
          />
        </SectionContainer>
      );
    }

    const {
      association,
      summary: associationSummary,
      competitions: associationCompetitions,
    } = associationDrilldown;

    return (
      <SectionContainer
        title={`Association Competitions (${associationSummary.competitionCount})`}
        variant="compact"
      >
        <div className="space-y-4">
          <CompetitionSummaryStrip
            total={associationSummary.competitionCount}
            active={associationSummary.activeCompetitions}
            inactive={associationSummary.inactiveCompetitions}
            label={association.name}
            sport={association.sport}
            playHqId={association.playHqId}
            hasFixturaAccount={association.hasFixturaAccount}
          />

          {associationCompetitions.length ? (
            <ScrollArea className="h-[600px]">
              <CompetitionsTable
                competitions={associationCompetitions}
                strapiCompetitionBase={strapiLocation?.competition}
              />
            </ScrollArea>
          ) : (
            <EmptyState
              variant="minimal"
              description="No competitions found for this association."
            />
          )}
        </div>
      </SectionContainer>
    );
  }

  if (isClubError) {
    return (
      <SectionContainer title="Competitions" variant="compact">
        <ErrorState
          variant="card"
          error={clubError}
          title="Error fetching club competitions"
        />
      </SectionContainer>
    );
  }

  if (!clubDrilldown) {
    return (
      <SectionContainer title="Competitions" variant="compact">
        <EmptyState
          variant="minimal"
          description="No club competition data found."
        />
      </SectionContainer>
    );
  }

  const {
    club,
    summary: clubSummary,
    competitions: clubCompetitions,
  } = clubDrilldown;

  return (
    <SectionContainer
      title={`Club Competitions (${clubSummary.competitionCount})`}
      variant="compact"
    >
      <div className="space-y-4">
        <CompetitionSummaryStrip
          total={clubSummary.competitionCount}
          active={clubSummary.activeCompetitions}
          inactive={clubSummary.inactiveCompetitions}
          label={club.name}
          sport={club.sport}
          playHqId={club.playHqId}
          hasFixturaAccount={club.hasFixturaAccount}
          associationName={club.association?.name ?? null}
        />

        {clubCompetitions.length ? (
          <ScrollArea className="h-[600px]">
            <CompetitionsTable
              competitions={clubCompetitions}
              strapiCompetitionBase={strapiLocation?.competition}
            />
          </ScrollArea>
        ) : (
          <EmptyState
            variant="minimal"
            description="No competitions found for this club."
          />
        )}
      </div>
    </SectionContainer>
  );
}

function CompetitionSummaryStrip({
  total,
  active,
  inactive,
  label,
  sport,
  playHqId,
  hasFixturaAccount,
  associationName,
}: {
  total: number;
  active: number;
  inactive: number;
  label: string;
  sport: string | null;
  playHqId: string | null;
  hasFixturaAccount: boolean;
  associationName?: string | null;
}) {
  return (
    <div className="grid overflow-hidden rounded-md border border-slate-200 bg-white lg:grid-cols-[1.4fr_repeat(3,minmax(120px,0.5fr))]">
      <div className="border-b border-slate-200 px-4 py-3 lg:border-b-0 lg:border-r">
        <p className="truncate text-sm font-medium text-slate-900">{label}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>{sport ?? "Sport unknown"}</span>
          <span>PlayHQ ID: {playHqId ?? "-"}</span>
          {associationName && <span>Association: {associationName}</span>}
          <Badge
            variant="outline"
            className="rounded-full border-slate-200 bg-slate-50 text-slate-700"
          >
            {hasFixturaAccount ? "Fixtura linked" : "Fixtura missing"}
          </Badge>
        </div>
      </div>
      <SummaryMetric label="Total" value={total} />
      <SummaryMetric label="Active" value={active} />
      <SummaryMetric label="Inactive" value={inactive} />
    </div>
  );
}

function SummaryMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-b border-slate-200 px-4 py-3 last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0">
      <p className="text-xs font-medium uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold leading-none text-slate-900">
        {value}
      </p>
    </div>
  );
}

function CompetitionsTable({
  competitions,
  strapiCompetitionBase,
}: {
  competitions: CompetitionRow[];
  strapiCompetitionBase?: string;
}) {
  return (
    <Table className="min-w-[860px]">
      <TableHeader>
        <TableRow className="bg-slate-50 hover:bg-slate-50">
          <TableHead className="min-w-[280px]">Competition</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="min-w-[150px]">Dates</TableHead>
          <TableHead className="text-right">Grades</TableHead>
          <TableHead className="text-right">Teams</TableHead>
          <TableHead className="text-right">Clubs</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {competitions.map((competition) => (
          <TableRow key={competition.id}>
            <TableCell>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900">
                  {competition.name}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {competition.season ?? `Competition #${competition.id}`}
                </p>
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={`rounded-full ${
                  competition.isActive
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 bg-slate-50 text-slate-600"
                }`}
              >
                {competition.isActive ? (
                  <CheckIcon className="h-3.5 w-3.5" />
                ) : (
                  <XIcon className="h-3.5 w-3.5" />
                )}
                {competition.isActive ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formatDate(competition.timeframe.start)}</span>
                </div>
                <div className="pl-5">
                  {formatDate(competition.timeframe.end)}
                </div>
              </div>
            </TableCell>
            <TableCell className="text-right font-medium text-slate-900">
              {competition.counts.gradeCount}
            </TableCell>
            <TableCell className="text-right font-medium text-slate-900">
              {competition.counts.teamCount}
            </TableCell>
            <TableCell className="text-right font-medium text-slate-900">
              {competition.counts.clubCount}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Button variant="primary" size="sm" asChild>
                  <Link href={`/dashboard/competitions/${competition.id}`}>
                    View
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                {strapiCompetitionBase && (
                  <Button variant="secondary" size="sm" asChild>
                    <a
                      href={`${strapiCompetitionBase}${competition.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      CMS
                      <DatabaseIcon className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
