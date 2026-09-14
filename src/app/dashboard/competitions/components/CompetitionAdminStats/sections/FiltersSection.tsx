import { Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  segmentedControlLabelClass,
  segmentedControlRowClass,
} from "@/lib/forms/segmentedControlStyles";
import { cn } from "@/lib/utils";

interface FiltersSectionProps {
  associationInput: string;
  setAssociationInput: Dispatch<SetStateAction<string>>;
  seasonFilter: string | undefined;
  setSeasonFilter: Dispatch<SetStateAction<string | undefined>>;
  seasons: string[];
  isFetching: boolean;
  isAssociationInvalid: boolean;
}

export function FiltersSection({
  associationInput,
  setAssociationInput,
  seasonFilter,
  setSeasonFilter,
  seasons,
  isFetching,
  isAssociationInvalid,
}: FiltersSectionProps) {
  return (
    <div
      className={cn(
        "flex w-full max-w-3xl flex-col gap-2 rounded-full border border-slate-200 bg-slate-50/60 px-4 py-2 sm:flex-row sm:flex-wrap sm:items-center",
        isFetching && "opacity-90",
      )}
    >
      <div className={cn(segmentedControlRowClass, "min-w-0 flex-1")}>
        <label
          htmlFor="association-filter"
          className={segmentedControlLabelClass}
        >
          Association ID
        </label>
        <Input
          id="association-filter"
          type="number"
          placeholder="All associations"
          value={associationInput}
          onChange={(event) => setAssociationInput(event.target.value)}
          className="h-9 w-full min-w-[140px] max-w-[200px] rounded-full border-transparent bg-white text-sm shadow-none sm:w-auto"
          min={0}
          aria-invalid={isAssociationInvalid}
        />
      </div>

      <div className={cn(segmentedControlRowClass, "shrink-0")}>
        <label htmlFor="season-filter" className={segmentedControlLabelClass}>
          Season
        </label>
        <Select
          value={seasonFilter ?? "all"}
          onValueChange={(value) => {
            if (value === "all") {
              setSeasonFilter(undefined);
            } else {
              setSeasonFilter(value);
            }
          }}
        >
          <SelectTrigger
            id="season-filter"
            className="h-9 w-[180px] rounded-full border-transparent bg-white shadow-none"
          >
            <SelectValue placeholder="All seasons" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All seasons</SelectItem>
            {seasons.map((season) => (
              <SelectItem key={season} value={season}>
                {season}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isAssociationInvalid && (
        <p className="w-full px-1 text-xs text-destructive lg:w-auto">
          Enter a valid numeric association ID.
        </p>
      )}

      {isFetching && (
        <span className="text-xs font-medium text-slate-500 lg:ml-auto">
          Refreshing…
        </span>
      )}
    </div>
  );
}
