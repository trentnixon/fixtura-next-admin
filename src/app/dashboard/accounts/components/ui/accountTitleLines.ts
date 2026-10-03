type AccountTitleSource = {
  sport: string | null | undefined;
  accountType: number;
  organisationName: string | null | undefined;
  deliveryEmail: string | null | undefined;
  firstName: string | null | undefined;
  lastName: string | null | undefined;
  loginEmail: string | null | undefined;
};

export type AccountTitleIdentity = {
  org: string;
  name: string;
  emailTo: string | null;
  loggedInByName: string | null;
  loginEmail: string | null;
};

function trimmedOrNull(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export function buildAccountTitleIdentity(
  source: AccountTitleSource,
): AccountTitleIdentity {
  const sport = trimmedOrNull(source.sport) ?? "Unknown";
  const accountKind = source.accountType === 1 ? "Club" : "Association";
  const loggedInByName = [source.firstName, source.lastName]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(" ");

  return {
    org: `${sport} · ${accountKind}`,
    name: trimmedOrNull(source.organisationName) ?? "Account",
    emailTo: trimmedOrNull(source.deliveryEmail),
    loggedInByName: loggedInByName || null,
    loginEmail: trimmedOrNull(source.loginEmail),
  };
}

export function loginEmailForAccount(
  accounts: readonly { id: number; email: string | null }[],
  accountId: number,
): string | null {
  const email = accounts.find((account) => account.id === accountId)?.email;
  return trimmedOrNull(email);
}
