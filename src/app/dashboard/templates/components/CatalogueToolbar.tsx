import { ReactNode } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PublishFilter = "all" | "draft" | "published";

export function matchesPublishFilter(publishedAt: string | null, status: PublishFilter): boolean {
  if (status === "draft") return !publishedAt;
  if (status === "published") return Boolean(publishedAt);
  return true;
}

const statusOptions: { value: PublishFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
];

export function FilterChip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs",
        active
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
      )}
    >
      {children}
    </button>
  );
}

export function CatalogueToolbar({
  addLabel,
  onAdd,
  status,
  onStatusChange,
  typeOptions,
  typeValue,
  onTypeChange,
  typeAllLabel = "All types",
  children,
}: {
  addLabel: string;
  onAdd: () => void;
  status: PublishFilter;
  onStatusChange: (status: PublishFilter) => void;
  typeOptions?: { value: string; label: string }[];
  typeValue?: string;
  onTypeChange?: (value: string) => void;
  typeAllLabel?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <FilterChip
              key={option.value}
              active={status === option.value}
              onClick={() => onStatusChange(option.value)}
            >
              {option.label}
            </FilterChip>
          ))}
        </div>
        <Button variant="primary" onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" />
          {addLabel}
        </Button>
      </div>
      {typeOptions && onTypeChange ? (
        <div className="flex flex-wrap gap-2">
          <FilterChip active={typeValue === "all"} onClick={() => onTypeChange("all")}>
            {typeAllLabel}
          </FilterChip>
          {typeOptions.map((option) => (
            <FilterChip
              key={option.value}
              active={typeValue === option.value}
              onClick={() => onTypeChange(option.value)}
            >
              {option.label}
            </FilterChip>
          ))}
        </div>
      ) : null}
      {children}
    </div>
  );
}
