import { format, isValid, parseISO } from "date-fns";
import type {
  OrgContactListingRow,
  OrgContactPerson,
} from "@/types/orgContactListing";
import { isValidContactEmail } from "@/lib/utils/orgContactListingFilters";
import { isEmailUnsubscribed } from "@/lib/utils/unsubscribedEmails";

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

export interface SendGridContactRow {
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  organization?: string | null;
  organizationId?: string | number | null;
  role?: string | null;
}

/** Split a display name into SendGrid first_name and last_name. */
export function splitContactName(name: string | null | undefined): {
  firstName: string;
  lastName: string;
} {
  const parts = name?.trim().split(/\s+/).filter(Boolean) ?? [];
  if (parts.length === 0) return { firstName: "", lastName: "" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

/**
 * One SendGrid row per address: the org inbox, then each person who has an address.
 * A person with the same address as the org inbox replaces the nameless org row.
 */
export function collectOrgContactExportRows(
  row: Pick<OrgContactListingRow, "id" | "name" | "email" | "phone" | "contacts">,
): SendGridContactRow[] {
  const organization = row.name;
  const organizationId = row.id;
  const people = (row.contacts ?? []).filter((person) => person.email?.trim());
  const orgEmail = row.email?.trim().toLowerCase() ?? "";
  const orgEmailCoveredByPerson = people.some(
    (person) => person.email?.trim().toLowerCase() === orgEmail,
  );

  const rows: SendGridContactRow[] = [];
  if (row.email?.trim() && !orgEmailCoveredByPerson) {
    rows.push({
      email: row.email,
      phone: row.phone,
      organization,
      organizationId,
    });
  }

  for (const person of people) {
    const { firstName, lastName } = splitContactName(person.name);
    rows.push({
      email: person.email,
      firstName,
      lastName,
      phone: person.phone?.trim() || row.phone,
      organization,
      organizationId,
      role: person.role,
    });
  }

  return rows;
}

function csvCell(value: string | number | null | undefined): string {
  const text = value == null ? "" : String(value).trim();
  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

/**
 * SendGrid contact import. Header `email`, one address per row, plus name and org.
 * Drops invalid and unsubscribed addresses and repeats.
 */
export function buildSendGridContactCsv(input: {
  contacts: SendGridContactRow[];
  unsubscribedEmails?: string[];
  organizationHeader: "club_name" | "association_name";
  organizationIdHeader: "club_id" | "association_id";
}): string {
  const unsubscribedEmails = input.unsubscribedEmails ?? [];
  const seen = new Set<string>();
  const lines = [
    [
      "email",
      "first_name",
      "last_name",
      "phone_number",
      input.organizationHeader,
      input.organizationIdHeader,
      "role",
    ].join(","),
  ];

  for (const contact of input.contacts) {
    const email = contact.email?.trim() ?? "";
    if (!isValidContactEmail(email)) continue;
    if (isEmailUnsubscribed(email, unsubscribedEmails)) continue;
    const key = email.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    lines.push(
      [
        csvCell(email),
        csvCell(contact.firstName),
        csvCell(contact.lastName),
        csvCell(contact.phone),
        csvCell(contact.organization),
        csvCell(contact.organizationId),
        csvCell(contact.role),
      ].join(","),
    );
  }

  return lines.join("\n");
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
