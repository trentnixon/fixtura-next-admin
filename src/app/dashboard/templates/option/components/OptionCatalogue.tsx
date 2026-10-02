"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useTemplateOptions } from "@/hooks/template-option/useTemplateOption";
import {
  LEGACY_USE_BACKGROUNDS,
  TEMPLATE_OPTION_LINK_KEYS,
  TEMPLATE_OPTION_LINK_LABELS,
  TemplateOption,
  TemplateOptionLinkKey,
  USE_BACKGROUNDS,
} from "@/types/template-option";
import { FilterChip, matchesPublishFilter, PublishFilter } from "../../components/CatalogueToolbar";
import { StyleCatalogueEmpty } from "../../components/StyleCatalogueCard";
import { activeBackgroundLink, STRUCTURE_LINK_KEYS } from "./optionLinks";

function isLegacyBackground(value: string): value is (typeof LEGACY_USE_BACKGROUNDS)[number] {
  return LEGACY_USE_BACKGROUNDS.some((option) => option === value);
}

function accountTitle(row: TemplateOption): string {
  return row.accountName || (row.accountId ? `Account ${row.accountId}` : "No account");
}

function linkText(row: TemplateOption, key: TemplateOptionLinkKey): string {
  const link = row.links[key];
  if (!link.id) return "";
  return link.name || `#${link.id}`;
}

function matchesQuery(row: TemplateOption, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  const links = TEMPLATE_OPTION_LINK_KEYS.map((key) => `${TEMPLATE_OPTION_LINK_LABELS[key]} ${linkText(row, key)}`).join(" ");
  return `${accountTitle(row)} ${row.accountId ?? ""} ${row.id} ${row.useBackground} ${links}`
    .toLowerCase()
    .includes(needle);
}

function LinkChip({
  label,
  value,
  missing,
}: {
  label: string;
  value: string;
  missing?: boolean;
}) {
  return (
    <span
      className={cn(
        "rounded-full border px-2 py-0.5 text-[11px]",
        missing ? "border-amber-300 text-amber-800" : "border-slate-200 text-slate-600",
      )}
    >
      {label}: {value || "Not set"}
    </span>
  );
}

export function OptionCatalogue() {
  const [accountFilter, setAccountFilter] = useState("");
  const [appliedAccountId, setAppliedAccountId] = useState<number | undefined>();
  const { data, isLoading, isError, error, refetch } = useTemplateOptions(appliedAccountId);

  const [viewing, setViewing] = useState<TemplateOption | undefined>();
  const [status, setStatus] = useState<PublishFilter>("all");
  const [backgroundFilter, setBackgroundFilter] = useState("all");
  const [query, setQuery] = useState("");

  const applyFilter = () => {
    const trimmed = accountFilter.trim();
    if (!trimmed) {
      setAppliedAccountId(undefined);
      return;
    }
    const parsed = Number(trimmed);
    if (!Number.isInteger(parsed) || parsed <= 0) {
      toast.error("Account id must be a number");
      return;
    }
    setAppliedAccountId(parsed);
  };

  if (isLoading) return <LoadingState message="Loading style options..." />;
  if (isError) {
    return (
      <ErrorState error={error} title="Failed to load style options" onRetry={() => refetch()} />
    );
  }

  const rows = data?.data ?? [];
  const total = data?.total ?? rows.length;
  const visible = rows.filter(
    (row) =>
      matchesPublishFilter(row.publishedAt, status) &&
      (backgroundFilter === "all" || row.useBackground === backgroundFilter) &&
      matchesQuery(row, query),
  );
  const viewActive = viewing ? activeBackgroundLink(viewing.useBackground) : null;

  return (
    <>
      <div className="mb-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {(
              [
                ["all", "All"],
                ["draft", "Draft"],
                ["published", "Published"],
              ] as const
            ).map(([value, label]) => (
              <FilterChip key={value} active={status === value} onClick={() => setStatus(value)}>
                {label}
              </FilterChip>
            ))}
          </div>
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search account or link"
            className="w-56"
            aria-label="Search style options"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterChip active={backgroundFilter === "all"} onClick={() => setBackgroundFilter("all")}>
            All backgrounds
          </FilterChip>
          {USE_BACKGROUNDS.map((option) => (
            <FilterChip
              key={option}
              active={backgroundFilter === option}
              onClick={() => setBackgroundFilter(option)}
            >
              {option}
            </FilterChip>
          ))}
        </div>
        <form
          className="flex flex-wrap items-end gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            applyFilter();
          }}
        >
          <div className="space-y-1">
            <Label htmlFor="option-account">Load account id</Label>
            <Input
              id="option-account"
              value={accountFilter}
              onChange={(event) => setAccountFilter(event.target.value)}
              className="w-32"
            />
          </div>
          <Button type="submit" variant="outline">
            Load
          </Button>
          {appliedAccountId ? (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setAppliedAccountId(undefined);
                setAccountFilter("");
              }}
            >
              Clear account {appliedAccountId}
            </Button>
          ) : null}
          <p className="text-xs text-muted-foreground">
            {visible.length} shown · {rows.length} loaded of {total}
          </p>
        </form>
      </div>

      {rows.length === 0 ? (
        <StyleCatalogueEmpty message="No style options yet." />
      ) : visible.length === 0 ? (
        <StyleCatalogueEmpty message="No style options match these filters." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((row) => {
            const activeKey = activeBackgroundLink(row.useBackground);
            return (
              <article key={row.id} className="rounded-lg border border-slate-200 bg-white">
                <button type="button" className="block w-full space-y-3 p-3 text-left" onClick={() => setViewing(row)}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate font-medium">{accountTitle(row)}</div>
                      <div className="text-sm text-muted-foreground">
                        {row.useBackground || "No background"}
                        {isLegacyBackground(row.useBackground) ? " · legacy" : ""}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        option #{row.id}
                        {row.accountId ? ` · account #${row.accountId}` : ""}
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full border border-slate-200 px-2 py-0.5 text-[11px] text-muted-foreground">
                      {row.publishedAt ? "Published" : "Draft"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {STRUCTURE_LINK_KEYS.map((key) => (
                      <LinkChip key={key} label={TEMPLATE_OPTION_LINK_LABELS[key]} value={linkText(row, key)} />
                    ))}
                    {activeKey ? (
                      <LinkChip
                        label={TEMPLATE_OPTION_LINK_LABELS[activeKey]}
                        value={linkText(row, activeKey)}
                        missing={!row.links[activeKey].id}
                      />
                    ) : null}
                  </div>
                </button>
              </article>
            );
          })}
        </div>
      )}

      <Dialog open={Boolean(viewing)} onOpenChange={(open) => !open && setViewing(undefined)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{viewing ? accountTitle(viewing) : "Style option"}</DialogTitle>
            <DialogDescription>
              {viewing
                ? `${viewing.useBackground || "No background"}${isLegacyBackground(viewing.useBackground) ? " (legacy)" : ""} · option #${viewing.id} · ${viewing.publishedAt ? "Published" : "Draft"}`
                : "Catalogue links for this account"}
            </DialogDescription>
          </DialogHeader>
          {viewing ? (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {TEMPLATE_OPTION_LINK_KEYS.map((key) => {
                const active = key === viewActive;
                const value = linkText(viewing, key);
                return (
                  <div
                    key={key}
                    className={cn(
                      "rounded-md border px-3 py-2",
                      active ? "border-slate-900" : "border-slate-200",
                    )}
                  >
                    <div className="text-xs text-muted-foreground">
                      {TEMPLATE_OPTION_LINK_LABELS[key]}
                      {active ? " · active background" : ""}
                    </div>
                    <div className="truncate text-sm">{value || "Not set"}</div>
                    {viewing.links[key].id ? (
                      <div className="text-xs text-muted-foreground">#{viewing.links[key].id}</div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
