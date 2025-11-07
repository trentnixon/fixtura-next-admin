"use client";

import { useParams } from "next/navigation";
import { useAccountQuery } from "@/hooks/accounts/useAccountQuery";
import { useCompetitionsQuery } from "@/hooks/competitions/useCompetitionsQuery";
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
import {
  CheckIcon,
  DatabaseIcon,
  ExternalLinkIcon,
  EyeIcon,
  XIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { LoadingState, ErrorState, EmptyState } from "@/components/ui-library";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CompetitionsTab() {
  const { accountID } = useParams();
  const { strapiLocation } = useGlobalContext();
  // Fetch account details
  const {
    data: accountData,
    isLoading: isAccountLoading,
    isError: isAccountError,
    error: accountError,
  } = useAccountQuery(accountID as string);

  // Extract account organization ID and account type
  const organizationId = accountData?.data?.accountOrganisationDetails?.id;
  const account_type = accountData?.data?.account_type;

  // Fetch competitions for the organization
  const {
    data: competitions,
    isLoading: isCompetitionsLoading,
    isError: isCompetitionsError,
    error: competitionsError,
  } = useCompetitionsQuery(organizationId, account_type);

  if (isAccountLoading || isCompetitionsLoading) {
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

  // Show message if organization details are missing
  if (!organizationId || account_type === undefined) {
    return (
      <SectionContainer title="Competitions" variant="compact">
        <EmptyState
          variant="minimal"
          description="Account organization details are missing. Cannot load competitions."
        />
      </SectionContainer>
    );
  }

  if (isCompetitionsError) {
    return (
      <ErrorState
        variant="card"
        error={competitionsError}
        title="Error fetching competitions"
      />
    );
  }

  return (
    <SectionContainer
      title={`Competitions (${competitions?.length || 0})`}
      variant="compact"
    >
      {competitions?.length ? (
        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Competition Name</TableHead>
                <TableHead className="text-center">Season</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Grades</TableHead>
                <TableHead className="text-center">Teams</TableHead>
                <TableHead className="text-center"></TableHead>
                <TableHead className="text-center"></TableHead>
                <TableHead className="text-center"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {competitions.map((competition) => (
                <TableRow key={competition.competitionId}>
                  <TableCell className="text-left font-medium">
                    {competition.competitionName}
                  </TableCell>
                  <TableCell className="text-center">
                    {competition.season}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Badge
                        className={`${
                          competition.status === "Active"
                            ? "bg-success-500"
                            : "bg-slate-500"
                        } text-white border-0 rounded-full w-6 h-6 p-0 flex items-center justify-center`}
                      >
                        {competition.status === "Active" ? (
                          <CheckIcon size="12" />
                        ) : (
                          <XIcon size="12" />
                        )}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-semibold">
                    {competition.grades.length}
                  </TableCell>
                  <TableCell className="text-center font-semibold">
                    {competition.teams.length}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="primary" asChild>
                      <Link
                        href={`${strapiLocation.competition}${competition.competitionId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <DatabaseIcon size="16" />
                      </Link>
                    </Button>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="primary" asChild>
                      <Link href={competition.url} target="_blank">
                        <ExternalLinkIcon size="16" />
                      </Link>
                    </Button>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="primary" asChild>
                      <Link
                        href={`/dashboard/competitions/${competition.competitionId}`}
                      >
                        <EyeIcon size="16" />
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
          description="No competitions found for this account."
        />
      )}
    </SectionContainer>
  );
}
