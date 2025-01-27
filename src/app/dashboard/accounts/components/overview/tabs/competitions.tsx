"use client";
import { useParams } from "next/navigation";
import { useAccountQuery } from "@/hooks/accounts/useAccountQuery";
import { useCompetitionsQuery } from "@/hooks/competitions/useCompetitionsQuery";

export default function CompetitionsTab() {
  const { accountID } = useParams();

  // Fetch account details
  const {
    data: accountData,
    isLoading: isAccountLoading,
    isError: isAccountError,
    error: accountError,
  } = useAccountQuery(accountID as string);

  // Extract account organization ID
  const organizationId = accountData?.data.accountOrganisationDetails.id;

  // Fetch competitions for the organization
  const {
    data: competitions,
    isLoading: isCompetitionsLoading,
    isError: isCompetitionsError,
    error: competitionsError,
  } = useCompetitionsQuery(organizationId as number);

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
      <h1>Competitions</h1>
      {competitions?.length ? (
        <ul>
          {competitions.map(competition => (
            <li key={competition.competitionId}>
              <h2>{competition.competitionName}</h2>
              <p>Season: {competition.season}</p>
              <p>Status: {competition.status}</p>
              <a
                href={competition.url}
                target="_blank"
                rel="noopener noreferrer">
                View Competition
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No competitions found for this account.</p>
      )}
    </div>
  );
}
