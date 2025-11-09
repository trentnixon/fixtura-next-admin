"use client";

import { useParams } from "next/navigation";
import { useAccountQuery } from "@/hooks/accounts/useAccountQuery";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckIcon, DatabaseIcon, EyeIcon, XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui-library";
import { ScrollArea } from "@/components/ui/scroll-area";
import MetricGrid from "@/components/ui-library/metrics/MetricGrid";
import StatCard from "@/components/ui-library/metrics/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCompetitionAssociationDrilldown } from "@/hooks/competitions/useCompetitionAssociationDrilldown";
import { useCompetitionClubDrilldown } from "@/hooks/competitions/useCompetitionClubDrilldown";

function formatDate(value: string | null) {
  if (!value) {
    return "—";
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
    isAssociationAccount ? organizationId : undefined
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
        <div className="space-y-6">
          <MetricGrid columns={3} gap="lg">
            <StatCard
              title="Total Competitions"
              value={associationSummary.competitionCount}
              description="All competitions for this association"
              icon={<EyeIcon className="h-5 w-5" />}
              variant="primary"
            />
            <StatCard
              title="Active Competitions"
              value={associationSummary.activeCompetitions}
              description="Currently active competitions"
              icon={<CheckIcon className="h-5 w-5" />}
              variant="accent"
            />
            <StatCard
              title="Inactive Competitions"
              value={associationSummary.inactiveCompetitions}
              description="Historical competitions"
              icon={<XIcon className="h-5 w-5" />}
              variant="secondary"
            />
          </MetricGrid>

          <Card>
            <CardHeader>
              <CardTitle>{association.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span>Sport: {association.sport ?? "—"}</span>
              <span>PlayHQ ID: {association.playHqId ?? "—"}</span>
              <Badge
                variant={association.hasFixturaAccount ? "default" : "outline"}
              >
                {association.hasFixturaAccount
                  ? "Fixtura Account Linked"
                  : "Fixtura Account Missing"}
              </Badge>
              {association.accounts.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {association.accounts.map((account) => {
                    const fallbackName = [account.firstName, account.lastName]
                      .filter(Boolean)
                      .join(" ");
                    const accountLabel =
                      account.name ??
                      (fallbackName ? fallbackName : `Account #${account.id}`);

                    return (
                      <Badge key={account.id} variant="secondary">
                        {accountLabel}
                      </Badge>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {associationCompetitions.length ? (
            <ScrollArea className="h-[600px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left">Competition</TableHead>
                    <TableHead className="text-center">Season</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Grades</TableHead>
                    <TableHead className="text-center">Teams</TableHead>
                    <TableHead className="text-center">Clubs</TableHead>
                    <TableHead className="text-center">Start</TableHead>
                    <TableHead className="text-center">End</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {associationCompetitions.map((competition) => (
                    <TableRow key={competition.id}>
                      <TableCell className="text-left font-medium">
                        {competition.name}
                      </TableCell>
                      <TableCell className="text-center">
                        {competition.season ?? "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <Badge
                            className={`${
                              competition.isActive
                                ? "bg-success-500"
                                : "bg-slate-500"
                            } text-white border-0 rounded-full w-6 h-6 p-0 flex items-center justify-center`}
                          >
                            {competition.isActive ? (
                              <CheckIcon size="12" />
                            ) : (
                              <XIcon size="12" />
                            )}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        {competition.counts.gradeCount}
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        {competition.counts.teamCount}
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        {competition.counts.clubCount}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDate(competition.timeframe.start)}
                      </TableCell>
                      <TableCell className="text-center">
                        {formatDate(competition.timeframe.end)}
                      </TableCell>
                      <TableCell className="text-center space-x-2">
                        <Button variant="primary" size="sm" asChild>
                          <Link
                            href={`/dashboard/competitions/${competition.id}`}
                          >
                            <EyeIcon size="16" />
                          </Link>
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          asChild
                          disabled={!strapiLocation?.competition}
                        >
                          <Link
                            href={
                              strapiLocation?.competition
                                ? `${strapiLocation.competition}${competition.id}`
                                : "#"
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <DatabaseIcon size="16" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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

  // Club drilldown
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
      <div className="space-y-6">
        <MetricGrid columns={3} gap="lg">
          <StatCard
            title="Total Competitions"
            value={clubSummary.competitionCount}
            description="All competitions this club participates in"
            icon={<EyeIcon className="h-5 w-5" />}
            variant="primary"
          />
          <StatCard
            title="Active Competitions"
            value={clubSummary.activeCompetitions}
            description="Currently active competitions"
            icon={<CheckIcon className="h-5 w-5" />}
            variant="accent"
          />
          <StatCard
            title="Inactive Competitions"
            value={clubSummary.inactiveCompetitions}
            description="Historical competitions"
            icon={<XIcon className="h-5 w-5" />}
            variant="secondary"
          />
        </MetricGrid>

        <Card>
          <CardHeader>
            <CardTitle>{club.name}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span>Sport: {club.sport ?? "—"}</span>
            <span>PlayHQ ID: {club.playHqId ?? "—"}</span>
            <Badge variant={club.hasFixturaAccount ? "default" : "outline"}>
              {club.hasFixturaAccount
                ? "Fixtura Account Linked"
                : "Fixtura Account Missing"}
            </Badge>
            {club.association && club.association.name && (
              <Badge variant="secondary">
                Association: {club.association.name}
              </Badge>
            )}
            {club.accounts.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {club.accounts.map((account) => {
                  const fallbackName = [account.firstName, account.lastName]
                    .filter(Boolean)
                    .join(" ");
                  const accountLabel =
                    account.name ??
                    (fallbackName ? fallbackName : `Account #${account.id}`);

                  return (
                    <Badge key={account.id} variant="secondary">
                      {accountLabel}
                    </Badge>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {clubCompetitions.length ? (
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">Competition</TableHead>
                  <TableHead className="text-center">Season</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Grades</TableHead>
                  <TableHead className="text-center">Teams</TableHead>
                  <TableHead className="text-center">Clubs</TableHead>
                  <TableHead className="text-center">Start</TableHead>
                  <TableHead className="text-center">End</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clubCompetitions.map((competition) => (
                  <TableRow key={competition.id}>
                    <TableCell className="text-left font-medium">
                      {competition.name}
                    </TableCell>
                    <TableCell className="text-center">
                      {competition.season ?? "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Badge
                          className={`${
                            competition.isActive
                              ? "bg-success-500"
                              : "bg-slate-500"
                          } text-white border-0 rounded-full w-6 h-6 p-0 flex items-center justify-center`}
                        >
                          {competition.isActive ? (
                            <CheckIcon size="12" />
                          ) : (
                            <XIcon size="12" />
                          )}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {competition.counts.gradeCount}
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {competition.counts.teamCount}
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {competition.counts.clubCount}
                    </TableCell>
                    <TableCell className="text-center">
                      {formatDate(competition.timeframe.start)}
                    </TableCell>
                    <TableCell className="text-center">
                      {formatDate(competition.timeframe.end)}
                    </TableCell>
                    <TableCell className="text-center space-x-2">
                      <Button variant="primary" size="sm" asChild>
                        <Link
                          href={`/dashboard/competitions/${competition.id}`}
                        >
                          <EyeIcon size="16" />
                        </Link>
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        asChild
                        disabled={!strapiLocation?.competition}
                      >
                        <Link
                          href={
                            strapiLocation?.competition
                              ? `${strapiLocation.competition}${competition.id}`
                              : "#"
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <DatabaseIcon size="16" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
