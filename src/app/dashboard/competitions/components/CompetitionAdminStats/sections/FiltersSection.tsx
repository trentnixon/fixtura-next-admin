import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import { Dispatch, SetStateAction } from "react";

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
    <div className="flex flex-wrap items-end gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="association-filter">Association ID</Label>
        <Input
          id="association-filter"
          type="number"
          placeholder="All associations"
          value={associationInput}
          onChange={(event) => setAssociationInput(event.target.value)}
          className="w-[180px]"
          min={0}
        />
        {isAssociationInvalid && (
          <span className="text-xs text-destructive">
            Enter a valid numeric association ID.
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="season-filter">Season</Label>
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
          <SelectTrigger id="season-filter" className="w-[180px]">
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
        <Badge variant="outline" className="h-min">
          Refreshing…
        </Badge>
      )}
    </div>
  );
}
