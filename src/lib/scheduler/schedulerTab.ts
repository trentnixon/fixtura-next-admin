export const SCHEDULER_TABS = ["schedule", "live", "analytics"] as const;

export type SchedulerTab = (typeof SCHEDULER_TABS)[number];

function isSchedulerTab(value: string): value is SchedulerTab {
  return SCHEDULER_TABS.some((tab) => tab === value);
}

export function parseSchedulerTab(value: string | null | undefined): SchedulerTab {
  if (value != null && isSchedulerTab(value)) return value;
  return "schedule";
}

export function buildSchedulerTabHref(tab: SchedulerTab): string {
  return `/dashboard/schedulers?tab=${tab}`;
}
