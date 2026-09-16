import { format, isValid, parseISO } from "date-fns";
import type {
  OrgContactListingRow,
  OrgContactPerson,
} from "@/types/orgContactListing";

export function formatOrgContactScrapeDate(
  iso: string | null | undefined,
): string {
  if (!iso) return "—";
  const parsed = parseISO(iso);
  if (!isValid(parsed)) return "—";
  return format(parsed, "dd MMM yyyy, HH:mm");
}

function formatPersonLabel(person: OrgContactPerson): string {
  const name = person.name?.trim();
  const role = person.role?.trim();
  const email = person.email?.trim();

  if (name && role) return `${name} (${role})`;
  if (name) return name;
  if (email) return email;
  if (role) return role;
  if (person.phone?.trim()) return person.phone.trim();
  return "Contact";
}

/** One-line table summary for scraped PlayHQ footer contacts. */
export function summarizeOrgContacts(contacts: OrgContactPerson[] | undefined): {
  summary: string;
  detail: string;
} {
  const list = contacts?.filter(Boolean) ?? [];
  if (list.length === 0) {
    return { summary: "—", detail: "No scraped contacts" };
  }

  const detail = list
    .map((person) => formatPersonLabel(person))
    .join("\n");

  if (list.length === 1) {
    return { summary: formatPersonLabel(list[0]), detail };
  }

  const first = formatPersonLabel(list[0]);
  return {
    summary: `${first} +${list.length - 1} more`,
    detail,
  };
}

/** Semicolon-separated labels for CSV export. */
export function formatOrgContactsForCsv(
  contacts: OrgContactPerson[] | undefined,
): string {
  const list = contacts?.filter(Boolean) ?? [];
  if (list.length === 0) return "";
  return list.map((person) => formatPersonLabel(person)).join("; ");
}

/** Lowercase strings used for client-side search across scraped people. */
export function orgContactSearchTokens(
  row: Pick<OrgContactListingRow, "contacts">,
): string[] {
  const tokens: string[] = [];
  for (const person of row.contacts ?? []) {
    for (const value of [
      person.name,
      person.role,
      person.email,
      person.phone,
    ]) {
      if (value?.trim()) tokens.push(value.trim().toLowerCase());
    }
  }
  return tokens;
}
