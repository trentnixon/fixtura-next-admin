"use client";

import Link from "next/link";
import { ClubInsight } from "@/types/clubInsights";
import { DashboardLinkButton } from "@/app/dashboard/components/live-snapshot/DashboardLinkButton";

const MAX_VISIBLE = 8;

interface ClubMissingDatesPanelProps {
  clubs: ClubInsight[];
}

export default function ClubMissingDatesPanel({
  clubs,
}: ClubMissingDatesPanelProps) {
  if (clubs.length === 0) return null;

  const visible = clubs.slice(0, MAX_VISIBLE);
  const remaining = clubs.length - visible.length;

  return (
    <div className="space-y-3">
      <ul className="divide-y divide-slate-100 rounded-md border border-slate-200">
        {visible.map((club) => (
          <li
            key={club.id}
            className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 text-sm"
          >
            <div className="min-w-0">
              <p className="truncate font-medium text-slate-800">{club.name}</p>
              <p className="text-xs text-muted-foreground">
                ID {club.id}
                {club.sport ? ` · ${club.sport}` : ""}
              </p>
            </div>
            <DashboardLinkButton
              href={`/dashboard/club/${club.id}`}
              trailingIcon="arrow"
              className="shrink-0"
            >
              Open
            </DashboardLinkButton>
          </li>
        ))}
      </ul>
      {remaining > 0 && (
        <p className="text-xs text-muted-foreground">
          and {remaining} more — search in the{" "}
          <Link href="#clubs-table" className="font-medium underline">
            Snapshot
          </Link>{" "}
          tab.
        </p>
      )}
    </div>
  );
}
