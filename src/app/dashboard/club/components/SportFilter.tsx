"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ClubSportFilter } from "@/types/clubInsights";

/**
 * SportFilter Component
 *
 * Dropdown filter for selecting sport (Cricket, AFL, Hockey, Netball, Basketball)
 * Sport parameter is REQUIRED for club insights (unlike association insights)
 * Updates the query when changed
 */
interface SportFilterProps {
  selectedSport: ClubSportFilter;
  onSportChange: (sport: ClubSportFilter) => void;
}

const SPORTS: Array<{ value: ClubSportFilter; label: string }> = [
  { value: "Cricket", label: "Cricket" },
  { value: "AFL", label: "AFL" },
  { value: "Hockey", label: "Hockey" },
  { value: "Netball", label: "Netball" },
  { value: "Basketball", label: "Basketball" },
];

export default function SportFilter({
  selectedSport,
  onSportChange,
}: SportFilterProps) {
  return (
    <div className="justify-end w-full flex items-center">
      <div className="space-y-2 max-w-md min-w-md w-full">
        <Label htmlFor="sport-filter">Filter by Sport</Label>
        <Select value={selectedSport} onValueChange={onSportChange}>
          <SelectTrigger id="sport-filter">
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
