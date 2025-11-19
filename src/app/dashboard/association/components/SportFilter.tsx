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
 * Dropdown filter for selecting sport (All, Cricket, AFL, Hockey, Netball, Basketball)
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
    if (value === "all") {
      onSportChange(undefined);
    } else {
      onSportChange(value as SportFilterType);
    }
  };

  return (
    <div className="justify-end w-full flex items-center">
      <div className="space-y-2 max-w-md min-w-md w-full">
        <Label htmlFor="sport-filter">Filter by Sport</Label>
        <Select
          value={selectedSport || "all"}
          onValueChange={handleValueChange}
        >
          <SelectTrigger id="sport-filter">
            <SelectValue placeholder="Select a sport" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sports</SelectItem>
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
