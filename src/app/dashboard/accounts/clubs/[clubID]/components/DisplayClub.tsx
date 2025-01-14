"use client";

import { useAccountQuery } from "@/hooks/accounts/useAccountQuery";

import { Account, Sponsor, SubscriptionTier, TrialInstance } from "@/types";
import DisplayTrialInstance from "../../../components/overview/TrialInstance";
import AccountBasics from "../../../components/overview/AccountBasics";
import SchedulerDetails from "../../../components/overview/Scheduler";
import DisplaySubscriptionTier from "../../../components/overview/SubscriptionTier";
import DisplaySponsors from "../../../components/overview/Sponsors";
import TemplateAndTheme from "../../../components/overview/TemplateandTheme";
import AccountTitle from "../../../components/ui/AccountTitle";
export default function DisplayClub({ accountId }: { accountId: string }) {
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
    Name: account?.attributes.clubs?.data[0].attributes.Name || "",
    Sport: account?.attributes.clubs?.data[0].attributes.Sport || "",
    id: account?.attributes.clubs?.data[0].id?.toString() || "",
    account: account as Account,
  };

  console.log(
    "account?.attributes.scheduler",
    account?.attributes.scheduler.data.id
  );
  return (
    <div className="p-2">
      <AccountTitle titleProps={titleProps} />

      <AccountBasics account={account as Account} />

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
      <SchedulerDetails
        schedulerId={account?.attributes.scheduler.data.id}
        accountId={accountId}
        sport={account?.attributes.clubs?.data[0].attributes.Sport || ""}
      />
      {/* Template and Theme */}
      {/* Template and Theme */}
      {account?.attributes.theme?.data &&
        account?.attributes.template?.data && (
          <TemplateAndTheme
            theme={account.attributes.theme.data}
            template={account.attributes.template.data}
          />
        )}

      {/* Sponsors */}
      <DisplaySponsors
        sponsors={account?.attributes?.sponsors?.data as Sponsor[] | undefined}
      />
    </div>
  );
}
