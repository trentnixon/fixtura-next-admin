import type { TimelineCampaignPreset } from "@/app/dashboard/club/components/clubTimelineUtils";

export type OrgContactTimelineFilter = TimelineCampaignPreset | "none";

export const ORG_CONTACT_TIMELINE_FILTER_OPTIONS: {
  value: OrgContactTimelineFilter;
  label: string;
}[] = [
  { value: "none", label: "All contacts" },
  { value: "marketing", label: "Marketing picks" },
  { value: "starting-soon", label: "Starting soon" },
  { value: "high-value", label: "High value" },
  { value: "all", label: "All timelines" },
];
