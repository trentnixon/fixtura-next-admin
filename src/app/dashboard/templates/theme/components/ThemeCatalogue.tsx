"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ErrorState from "@/components/ui-library/states/ErrorState";
import LoadingState from "@/components/ui-library/states/LoadingState";
import { cn } from "@/lib/utils";
import { useBrandThemes } from "@/hooks/brand-theme/useBrandTheme";
import { BrandColours, BrandTheme } from "@/types/brand-theme";
import { FilterChip } from "../../components/CatalogueToolbar";
import { StyleCatalogueEmpty } from "../../components/StyleCatalogueCard";

const colourFields = [
  ["primary", "Primary"],
  ["secondary", "Secondary"],
  ["dark", "Dark"],
  ["white", "White"],
] as const;

type VisibilityFilter = "all" | "public" | "private";

const visibilityOptions: { value: VisibilityFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
];

function colourValue(value: string): string {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value) ? value : "transparent";
}

function matchesVisibility(row: BrandTheme, filter: VisibilityFilter): boolean {
  if (filter === "public") return row.isPublic;
  if (filter === "private") return !row.isPublic;
  return true;
}

function matchesQuery(row: BrandTheme, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const colours = colourFields.map(([key]) => row.theme[key]).join(" ");
  return `${row.name} ${row.id} ${row.createdBy ?? ""} ${colours}`.toLowerCase().includes(needle);
}

function ColourStrip({ theme }: { theme: BrandColours }) {
  return (
    <div className="flex h-16">
      {colourFields.map(([key]) => (
        <div key={key} className="h-full flex-1" style={{ backgroundColor: colourValue(theme[key]) }} />
      ))}
    </div>
  );
}

function ColourList({ theme }: { theme: BrandColours }) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {colourFields.map(([key, label]) => (
        <div key={key} className="min-w-0">
          <div className="truncate text-[11px] text-muted-foreground">{label}</div>
          <div className="truncate font-mono text-[11px]">{theme[key] || "—"}</div>
        </div>
      ))}
    </div>
  );
}

export function ThemeCatalogue() {
  const { data, isLoading, isError, error, refetch } = useBrandThemes();
  const [visibility, setVisibility] = useState<VisibilityFilter>("all");
  const [query, setQuery] = useState("");
  const [viewing, setViewing] = useState<BrandTheme | undefined>();

  if (isLoading) return <LoadingState message="Loading themes..." />;
  if (isError) {
    return <ErrorState error={error} title="Failed to load themes" onRetry={() => refetch()} />;
  }

  const rows = data?.data ?? [];
  const visible = rows.filter((row) => matchesVisibility(row, visibility) && matchesQuery(row, query));

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {visibilityOptions.map((option) => (
            <FilterChip
              key={option.value}
              active={visibility === option.value}
              onClick={() => setVisibility(option.value)}
            >
              {option.label}
            </FilterChip>
          ))}
        </div>
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search name or colour"
          className="w-56"
          aria-label="Search themes"
        />
      </div>

      {rows.length === 0 ? (
        <StyleCatalogueEmpty message="No themes yet." />
      ) : visible.length === 0 ? (
        <StyleCatalogueEmpty message="No themes match these filters." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {visible.map((row) => (
            <article key={row.id} className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <button type="button" className="block w-full text-left" onClick={() => setViewing(row)}>
                <ColourStrip theme={row.theme} />
                <div className="space-y-3 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate font-medium">{row.name || "Untitled"}</div>
                      <div className="text-xs text-muted-foreground">
                        #{row.id}
                        {row.createdBy ? ` · user ${row.createdBy}` : ""}
                      </div>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full border px-2 py-0.5 text-[11px]",
                        row.isPublic
                          ? "border-slate-300 text-slate-700"
                          : "border-slate-200 text-muted-foreground",
                      )}
                    >
                      {row.isPublic ? "Public" : "Private"}
                    </span>
                  </div>
                  <ColourList theme={row.theme} />
                </div>
              </button>
            </article>
          ))}
        </div>
      )}

      <Dialog open={Boolean(viewing)} onOpenChange={(open) => !open && setViewing(undefined)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{viewing?.name || "Theme"}</DialogTitle>
            <DialogDescription>
              {viewing
                ? `#${viewing.id}${viewing.createdBy ? ` · created by user ${viewing.createdBy}` : ""} · ${viewing.isPublic ? "Public" : "Private"}`
                : "Brand colours"}
            </DialogDescription>
          </DialogHeader>
          {viewing ? (
            <div className="space-y-3">
              <div className="overflow-hidden rounded-md">
                <ColourStrip theme={viewing.theme} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {colourFields.map(([key, label]) => (
                  <div key={key} className="overflow-hidden rounded-md border border-slate-200">
                    <div className="h-16" style={{ backgroundColor: colourValue(viewing.theme[key]) }} />
                    <div className="px-3 py-2">
                      <div className="text-sm">{label}</div>
                      <div className="font-mono text-xs text-muted-foreground">{viewing.theme[key] || "—"}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
