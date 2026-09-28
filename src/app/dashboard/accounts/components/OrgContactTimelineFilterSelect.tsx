"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ORG_CONTACT_TIMELINE_FILTER_OPTIONS,
  type OrgContactTimelineFilter,
} from "@/lib/constants/timelineCampaignPresets";

type OrgContactTimelineFilterSelectProps = {
  value: OrgContactTimelineFilter;
  onValueChange: (value: OrgContactTimelineFilter) => void;
  disabled?: boolean;
  id?: string;
};

export function OrgContactTimelineFilterSelect({
  value,
  onValueChange,
  disabled = false,
  id = "org-contact-timeline-filter",
}: OrgContactTimelineFilterSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(next) => onValueChange(next as OrgContactTimelineFilter)}
      disabled={disabled}
    >
      <SelectTrigger
        id={id}
        className="w-full shrink-0 rounded-full bg-white md:w-[200px]"
      >
        <SelectValue placeholder="Timeline" />
      </SelectTrigger>
      <SelectContent>
        {ORG_CONTACT_TIMELINE_FILTER_OPTIONS.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
