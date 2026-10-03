"use client";

import { ByLine, Title } from "@/components/type/titles";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import { useAccountsQuery } from "@/hooks/accounts/useAccountsQuery";
import { fixturaContentHubAccountDetails } from "@/types/fixturaContentHubAccountDetails";
import {
  buildAccountTitleIdentity,
  loginEmailForAccount,
  type AccountTitleIdentity,
} from "./accountTitleLines";

type AccountTitleProps = {
  titleProps: fixturaContentHubAccountDetails;
};

export default function AccountTitle({ titleProps }: AccountTitleProps) {
  const lookup = useAccountsQuery();

  if (!titleProps?.accountOrganisationDetails) {
    return null;
  }

  const { Name, Sport, ParentLogo } = titleProps.accountOrganisationDetails;
  const loginEmail = lookup.isSuccess
    ? loginEmailForAccount(listedAccounts(lookup.data), titleProps.id)
    : null;
  const identity = buildAccountTitleIdentity({
    sport: Sport,
    accountType: titleProps.account_type,
    organisationName: Name,
    deliveryEmail: titleProps.DeliveryAddress,
    firstName: titleProps.FirstName,
    lastName: titleProps.LastName,
    loginEmail,
  });

  return (
    <CreatePageTitle
      title={identity.name}
      byLine=""
      image={ParentLogo}
      details={<AccountTitleDetails identity={identity} />}
    />
  );
}

function listedAccounts(
  data: NonNullable<ReturnType<typeof useAccountsQuery>["data"]>,
): { id: number; email: string | null }[] {
  return [
    ...data.clubs.active,
    ...data.clubs.inactive,
    ...data.associations.active,
    ...data.associations.inactive,
    ...data.undefined.active,
    ...data.undefined.inactive,
  ];
}

function AccountTitleDetails({ identity }: { identity: AccountTitleIdentity }) {
  const showLoggedInBy = Boolean(identity.loggedInByName || identity.loginEmail);

  return (
    <div className="flex min-w-0 flex-col">
      <ByLine>{identity.org}</ByLine>
      <Title>{identity.name}</Title>
      {showLoggedInBy ? (
        <ByLine>
          <LoggedInBy name={identity.loggedInByName} email={identity.loginEmail} />
        </ByLine>
      ) : null}
      {identity.emailTo ? (
        <ByLine>
          <MailLink email={identity.emailTo} />
        </ByLine>
      ) : null}
    </div>
  );
}

function MailLink({ email }: { email: string }) {
  return (
    <a className="underline-offset-2 hover:underline" href={`mailto:${email}`}>
      {email}
    </a>
  );
}

function LoggedInBy({
  name,
  email,
}: {
  name: string | null;
  email: string | null;
}) {
  return (
    <span>
      {name}
      {name && email ? " · " : null}
      {email ? <MailLink email={email} /> : null}
    </span>
  );
}
