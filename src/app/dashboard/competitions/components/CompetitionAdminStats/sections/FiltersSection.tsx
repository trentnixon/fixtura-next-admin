import { Dispatch, SetStateAction } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-end lg:w-auto lg:justify-end">
      <div className="w-full min-w-[180px] space-y-1 sm:w-auto">
        <Label
          htmlFor="association-filter"
          className="text-xs font-medium uppercase text-slate-500"
        >
          Association ID
        </Label>
        <Input
          id="association-filter"
          type="number"
          placeholder="All associations"
          value={associationInput}
          onChange={(event) => setAssociationInput(event.target.value)}
          className="h-9"
          min={0}
        />
        {isAssociationInvalid && (
          <span className="text-xs text-destructive">
            Enter a valid numeric association ID.
          </span>
        )}
      </div>

      <div className="w-full min-w-[180px] space-y-1 sm:w-auto">
        <Label
          htmlFor="season-filter"
          className="text-xs font-medium uppercase text-slate-500"
        >
          Season
        </Label>
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
          <SelectTrigger id="season-filter" className="h-9">
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

      {isFetching && (
        <Badge variant="outline" className="h-9 w-fit bg-slate-50">
          Refreshing...
        </Badge>
      )}
    </div>
  );
}
