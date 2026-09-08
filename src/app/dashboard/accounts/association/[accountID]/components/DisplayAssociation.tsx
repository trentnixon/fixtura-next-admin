"use client";

import { useAccountQuery } from "@/hooks/accounts/useAccountQuery";
import AccountTitle from "../../../components/ui/AccountTitle";
import AccountDetailWorkspace from "../../../components/overview/AccountDetailWorkspace";
import AccountSnapshotActions from "../../../components/overview/AccountSnapshotActions";
import AccountsBreadcrumbHeader from "../../../components/AccountsBreadcrumbHeader";
import { useParams } from "next/navigation";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import LoadingState from "@/components/ui-library/states/LoadingState";
import ErrorState from "@/components/ui-library/states/ErrorState";

export default function DisplayAssociation() {
  const { accountID } = useParams();
  const { data, isLoading, isError, error, refetch } = useAccountQuery(
    accountID as string,
  );

  if (isLoading) {
    return (
      <LoadingState variant="default" message="Loading account details…" />
    );
  }

  if (isError) {
    return (
      <ErrorState
        error={
          error instanceof Error
            ? error
            : new Error("Failed to load association account")
        }
        title="Could not load account"
        onRetry={refetch}
        variant="default"
      />
    );
  }

  const accountData = data?.data;

  if (!accountData) {
    return null;
  }

  const accountName =
    accountData.accountOrganisationDetails?.Name ?? "Association account";

  return (
    <>
      {accountData.accountOrganisationDetails && (
        <AccountTitle titleProps={accountData} />
      )}
      <PageContainer padding="xs" spacing="lg">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <AccountsBreadcrumbHeader
            currentPage={accountName}
            parent={{
              label: "Association accounts",
              href: "/dashboard/accounts/association",
            }}
          />
          <AccountSnapshotActions
            accountData={accountData}
            accountType="association"
            syncAccountType="ASSOCIATION"
            className="shrink-0 self-end sm:self-auto"
          />
        </div>
        <AccountDetailWorkspace
          accountData={accountData}
          accountID={accountID as string}
        />
      </PageContainer>
    </>
  );
}
