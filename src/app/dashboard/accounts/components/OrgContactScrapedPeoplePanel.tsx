"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { OrgContactPerson } from "@/types/orgContactListing";
import { formatOrgContactScrapeDate } from "@/lib/utils/orgContactListingDisplay";

type OrgContactScrapedPeoplePanelProps = {
  contacts: OrgContactPerson[];
  lastOrgContactScrapeAt: string | null;
  colSpan: number;
};

export function OrgContactScrapedPeoplePanel({
  contacts,
  lastOrgContactScrapeAt,
  colSpan,
}: OrgContactScrapedPeoplePanelProps) {
  const people = contacts?.filter(Boolean) ?? [];

  return (
    <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
      <TableCell colSpan={colSpan} className="py-3">
        <div className="space-y-2 px-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Scraped PlayHQ contacts
            {lastOrgContactScrapeAt ? (
              <span className="ml-2 font-normal normal-case">
                Last run {formatOrgContactScrapeDate(lastOrgContactScrapeAt)}
              </span>
            ) : null}
          </p>
          {people.length === 0 ? (
            <p className="text-sm text-muted-foreground">No scraped people yet.</p>
          ) : (
            <ul className="grid gap-2 sm:grid-cols-2">
              {people.map((person, index) => (
                <li
                  key={`${person.email ?? person.name ?? index}`}
                  className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                >
                  <div className="font-medium text-slate-900">
                    {person.name?.trim() || "Unknown"}
                    {person.role?.trim() ? (
                      <span className="font-normal text-muted-foreground">
                        {" "}
                        · {person.role}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-1 flex flex-col gap-0.5 text-xs">
                    {person.email ? (
                      <a
                        href={`mailto:${person.email}`}
                        className="text-primary hover:underline"
                      >
                        {person.email}
                      </a>
                    ) : null}
                    {person.phone ? (
                      <span className="text-muted-foreground">{person.phone}</span>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

type OrgContactExpandToggleProps = {
  expanded: boolean;
  onToggle: () => void;
  contactCount: number;
};

export function OrgContactExpandToggle({
  expanded,
  onToggle,
  contactCount,
}: OrgContactExpandToggleProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0"
      onClick={onToggle}
      aria-expanded={expanded}
      aria-label={
        expanded ? "Hide scraped contacts" : "Show scraped contacts"
      }
    >
      {expanded ? (
        <ChevronDown className="h-4 w-4" aria-hidden />
      ) : (
        <ChevronRight className="h-4 w-4" aria-hidden />
      )}
      {contactCount > 0 ? (
        <span className="sr-only">{contactCount} contacts</span>
      ) : null}
    </Button>
  );
}
