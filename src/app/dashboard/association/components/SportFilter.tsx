"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SportFilter as SportFilterType } from "@/types/associationInsights";

/**
 * SportFilter Component
 *
 * Dropdown filter for selecting sport (Cricket, AFL, Hockey, Netball, Basketball)
 * Updates the query when changed
 */
interface SportFilterProps {
  selectedSport?: SportFilterType;
  onSportChange: (sport: SportFilterType | undefined) => void;
}

const SPORTS: Array<{ value: SportFilterType; label: string }> = [
  { value: "Cricket", label: "Cricket" },
  { value: "AFL", label: "AFL" },
  { value: "Hockey", label: "Hockey" },
  { value: "Netball", label: "Netball" },
  { value: "Basketball", label: "Basketball" },
];

export default function SportFilterComponent({
  selectedSport,
  onSportChange,
}: SportFilterProps) {
  const handleValueChange = (value: string) => {
    onSportChange(value as SportFilterType);
  };

  return (
    <div className="flex w-full items-end justify-end sm:w-auto">
      <div className="w-full min-w-[220px] space-y-1 sm:w-auto">
        <Label
          htmlFor="sport-filter"
          className="text-xs font-medium uppercase text-slate-500"
        >
          Sport filter
        </Label>
        <Select value={selectedSport} onValueChange={handleValueChange}>
          <SelectTrigger id="sport-filter" className="h-9 w-full sm:w-[220px]">
            <SelectValue placeholder="Select a sport" />
          </SelectTrigger>
          <SelectContent>
            {SPORTS.map((sport) => (
              <SelectItem key={sport.value} value={sport.value}>
                {sport.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
