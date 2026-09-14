"use client";

import Link from "next/link";
import { AssociationDetail } from "@/types/associationInsights";
import { DashboardLinkButton } from "@/app/dashboard/components/live-snapshot/DashboardLinkButton";

const MAX_VISIBLE = 8;

interface AssociationMissingDatesPanelProps {
  associations: AssociationDetail[];
}

export default function AssociationMissingDatesPanel({
  associations,
}: AssociationMissingDatesPanelProps) {
  if (associations.length === 0) return null;

  const visible = associations.slice(0, MAX_VISIBLE);
  const remaining = associations.length - visible.length;

  return (
    <div className="space-y-3">
      <ul className="divide-y divide-slate-100 rounded-md border border-slate-200">
        {visible.map((association) => (
          <li
            key={association.id}
            className="flex flex-wrap items-center justify-between gap-2 px-3 py-2.5 text-sm"
          >
            <div className="min-w-0">
              <p className="truncate font-medium text-slate-800">
                {association.name}
              </p>
              <p className="text-xs text-muted-foreground">
                ID {association.id}
                {association.sport ? ` · ${association.sport}` : ""}
              </p>
            </div>
            <DashboardLinkButton
              href={`/dashboard/association/${association.id}`}
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
          <Link href="#association-table" className="font-medium underline">
            Snapshot
          </Link>{" "}
          tab.
        </p>
      )}
    </div>
  );
}
