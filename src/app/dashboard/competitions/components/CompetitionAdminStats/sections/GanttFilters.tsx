"use client";

import { useMemo } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";
import { CompetitionAdminStatsAvailableCompetition } from "@/types/competitionAdminStats";

export type GanttFilters = {
  sport: string | null;
  association: string | null;
  season: string | null;
  hideFinished: boolean;
};

interface GanttFiltersProps {
  competitions: CompetitionAdminStatsAvailableCompetition[];
  filters: GanttFilters;
  onFiltersChange: (filters: GanttFilters) => void;
}

/**
 * GanttFilters Component
 *
 * Provides filtering controls for the Gantt chart:
 * - Sport filter
 * - Association filter (future)
 * - Season filter (future)
 */
export function GanttFilters({
  competitions,
  filters,
  onFiltersChange,
}: GanttFiltersProps) {
  // Get unique sports from competitions
  const sportOptions = useMemo(() => {
    const sports = new Set<string>();
    competitions.forEach((competition) => {
      if (competition.sport && competition.sport.trim().length > 0) {
        sports.add(competition.sport);
      }
    });
    return Array.from(sports).sort((a, b) => a.localeCompare(b));
  }, [competitions]);

  const handleSportChange = (value: string) => {
    onFiltersChange({
      ...filters,
      sport: value === "all" ? null : value,
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      sport: null,
      association: null,
      season: null,
      hideFinished: false,
    });
  };

  const hasActiveFilters =
    filters.sport !== null ||
    filters.association !== null ||
    filters.season !== null ||
    filters.hideFinished;

  return (
    <div className="flex flex-wrap items-end gap-4 border-b pb-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="gantt-sport-filter" className="text-sm font-medium">
          Sport
        </Label>
        <Select
          value={filters.sport || "all"}
          onValueChange={handleSportChange}
        >
          <SelectTrigger id="gantt-sport-filter" className="w-[180px]">
            <SelectValue placeholder="All sports" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sports</SelectItem>
            {sportOptions.map((sport) => (
              <SelectItem key={sport} value={sport}>
                {sport}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>





      <div className="flex flex-col gap-2">
        <Label htmlFor="gantt-hide-finished-filter" className="text-sm font-medium">
          Hide Finished
        </Label>
        <div className="flex items-center h-10">
          <Switch
            id="gantt-hide-finished-filter"
            checked={filters.hideFinished}
            onCheckedChange={(checked) =>
              onFiltersChange({ ...filters, hideFinished: checked })
            }
          />
        </div>
      </div>

      {
        hasActiveFilters && (
          <Button
            variant="accent"
            size="sm"
            onClick={handleClearFilters}
            className="ml-auto"
          >
            <X className="mr-2 h-4 w-4" />
            Clear filters
          </Button>
        )
      }
    </div >
  );
}
