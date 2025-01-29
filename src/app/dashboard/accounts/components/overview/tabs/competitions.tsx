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
import { CheckIcon, EyeIcon, XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CompetitionsTab() {
  const { accountID } = useParams();

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
      <h1 className="text-xl font-bold mb-4">Competitions</h1>
      <div className="bg-slate-50 rounded-lg px-4 py-2 shadow-none border ">
        {competitions?.length ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Competition Name</TableHead>
                <TableHead>Season</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Grades</TableHead>
                <TableHead>Teams</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {competitions.map(competition => (
                <TableRow key={competition.competitionId}>
                  <TableCell>{competition.competitionName}</TableCell>
                  <TableCell>{competition.season}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-slate-50">
                      {competition.status === "Active" ? (
                        <CheckIcon size="16" className="text-green-500" />
                      ) : (
                        <XIcon size="16" className="text-red-500" />
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>{competition.grades.length}</TableCell>
                  <TableCell>{competition.teams.length}</TableCell>
                  <TableCell>
                    <Link href={competition.url}>
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
