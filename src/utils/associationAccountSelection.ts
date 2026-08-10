import type { AccountDetail } from "@/types/associationDetail";
import type { CompetitionAccount } from "@/types/competitionAdminDetail";

export type AssociationAccountOption = {
  id: number;
  label: string;
  isActive?: boolean;
};

/**
 * Builds a readable label from person/name fields used on association-linked accounts.
 */
export function formatAssociationAccountLabel(input: {
  id: number;
  firstName: string | null;
  lastName: string | null;
  name?: string | null;
}): string {
  const fromNameParts = [input.firstName, input.lastName].filter(Boolean).join(" ").trim();

  const display =
    input.name?.trim() ||
    (fromNameParts.length > 0 ? fromNameParts : null) ||
    `Account #${input.id}`;

  return display;
}

export function toAssociationAccountOptionFromCompetition(
  account: CompetitionAccount
): AssociationAccountOption {
  const base = formatAssociationAccountLabel(account);
  return {
    id: account.id,
    label: base,
  };
}

export function toAssociationAccountOptionFromDetail(
  account: AccountDetail
): AssociationAccountOption {
  const label = formatAssociationAccountLabel(account);
  const suffix = account.isActive === false ? " (inactive)" : "";
  return {
    id: account.id,
    label: `${label}${suffix}`,
    isActive: account.isActive,
  };
}

export function getAccountSelectionState(
  accounts: AssociationAccountOption[]
): "none" | "single" | "multiple" {
  const n = accounts.length;
  if (n <= 0) return "none";
  if (n === 1) return "single";
  return "multiple";
}
