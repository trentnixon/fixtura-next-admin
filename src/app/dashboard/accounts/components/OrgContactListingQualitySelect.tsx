"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OrgContactQualityFilter } from "@/lib/utils/orgContactListingFilters";

const QUALITY_OPTIONS: { value: OrgContactQualityFilter; label: string }[] = [
  { value: "all", label: "All quality" },
  { value: "export_ready", label: "Export ready" },
  { value: "never_scraped", label: "Never scraped" },
  { value: "stale_scrape", label: "Stale scrape (30d+)" },
  { value: "has_scraped", label: "Has scraped people" },
  { value: "no_account", label: "No Fixtura account" },
  { value: "unsubscribed", label: "Unsubscribed email" },
];

type OrgContactListingQualitySelectProps = {
  value: OrgContactQualityFilter;
  onValueChange: (value: OrgContactQualityFilter) => void;
  id?: string;
};

export function OrgContactListingQualitySelect({
  value,
  onValueChange,
  id = "org-contact-quality",
}: OrgContactListingQualitySelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(next) => onValueChange(next as OrgContactQualityFilter)}
    >
      <SelectTrigger
        id={id}
        className="w-full shrink-0 rounded-full bg-white md:w-[200px]"
      >
        <SelectValue placeholder="Quality" />
      </SelectTrigger>
      <SelectContent>
        {QUALITY_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
