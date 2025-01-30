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
  const organizationId = accountData?.data.accountOrganisationDetails.id;
  const account_type = accountData?.data.account_type;

  // Fetch competitions for the organization
  const {
    data: competitions,
    isLoading: isCompetitionsLoading,
    isError: isCompetitionsError,
    error: competitionsError,
  } = useCompetitionsQuery(organizationId as number, account_type as number);

  if (isAccountLoading || isCompetitionsLoading) {
    return <div>Loading...</div>;
  }

  if (isAccountError) {
    return <div>Error fetching account details: {accountError?.message}</div>;
  }

  if (isCompetitionsError) {
    return <div>Error fetching competitions: {competitionsError?.message}</div>;
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">
        Competitions ({competitions?.length})
      </h1>
      <div className="bg-slate-50 rounded-lg px-4 py-2 shadow-none border ">
        {competitions?.length ? (
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
              {competitions.map(competition => (
                <TableRow key={competition.competitionId}>
                  <TableCell className="text-left">
                    {competition.competitionName}
                  </TableCell>
                  <TableCell className="text-center">
                    {competition.season}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="bg-slate-50">
                      {competition.status === "Active" ? (
                        <CheckIcon size="16" className="text-green-500" />
                      ) : (
                        <XIcon size="16" className="text-red-500" />
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {competition.grades.length}
                  </TableCell>
                  <TableCell className="text-center">
                    {competition.teams.length}
                  </TableCell>
                  <TableCell className="text-center">
                    <Link
                      href={`${strapiLocation.competition}${competition.competitionId}`}
                      target="_blank"
                      rel="noopener noreferrer">
                      <Button variant="outline">
                        <DatabaseIcon size="16" />
                      </Button>
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">
                    <Link href={competition.url} target="_blank">
                      <Button variant="outline">
                        <ExternalLinkIcon size="16" />
                      </Button>
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">
                    <Link
                      href={`/dashboard/competitions/${competition.competitionId}`}>
                      <Button variant="outline">
                        <EyeIcon size="16" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p>No competitions found for this account.</p>
        )}
      </div>
    </div>
  );
}
