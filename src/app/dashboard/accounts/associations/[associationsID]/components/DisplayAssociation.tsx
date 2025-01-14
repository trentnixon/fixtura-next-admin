"use client";

import { useAccountQuery } from "@/hooks/accounts/useAccountQuery";
import { Account, Sponsor, SubscriptionTier, TrialInstance } from "@/types";
import AssociationBasics from "../../../components/overview/AccountBasics";
import DisplayTrialInstance from "../../../components/overview/TrialInstance";
import SchedulerDetails from "../../../components/overview/Scheduler";
import DisplaySubscriptionTier from "../../../components/overview/SubscriptionTier";
import DisplaySponsors from "../../../components/overview/Sponsors";
import TemplateAndTheme from "../../../components/overview/TemplateandTheme";
import AccountTitle from "../../../components/ui/AccountTitle";

export default function DisplayAssociation({
  accountId,
}: {
  accountId: string;
}) {
  const { data, isLoading, isError, error, refetch } =
    useAccountQuery(accountId);

  if (isLoading) return <p>Loading account details...</p>;

  if (isError) {
    return (
      <div>
        <p>Error loading account: {error?.message}</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Retry
        </button>
      </div>
    );
  }

  const account = data?.data;

  const titleProps = {
    Name: account?.attributes.associations?.data[0].attributes.Name || "",
    Sport: account?.attributes.associations?.data[0].attributes.Sport || "",
    id: account?.attributes.associations?.data[0].id?.toString() || "",
    account: account as Account,
    accountType: account?.attributes.account_type?.data?.attributes?.Name || "",
  };

  return (
    <>
      <AccountTitle titleProps={titleProps} />
      <div className="p-0">
        <div className="p-2">
          <AssociationBasics account={account as Account} />

          <SchedulerDetails
            schedulerId={account?.attributes.scheduler.data.id}
            accountId={accountId}
            sport={
              account?.attributes.associations?.data[0].attributes.Sport || ""
            }
          />
          {/* Subscription Tier */}
          <DisplaySubscriptionTier
            subscriptionTier={
              account?.attributes.subscription_tier?.data as SubscriptionTier
            }
          />
          {/* Trial Instance */}
          <DisplayTrialInstance
            trialInstance={
              account?.attributes?.trial_instance?.data as TrialInstance
            }
          />
          {/* Sponsors */}
          {/* Sponsors */}
          <DisplaySponsors
            sponsors={
              account?.attributes?.sponsors?.data as Sponsor[] | undefined
            }
          />

          {/* Template and Theme */}
          {account?.attributes.theme?.data &&
            account?.attributes.template?.data && (
              <TemplateAndTheme
                theme={account.attributes.theme.data}
                template={account.attributes.template.data}
              />
            )}
        </div>
      </div>
    </>
  );
}
