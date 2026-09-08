import {
  siteNavigationGroupDividerClass,
  siteNavigationGroupItemClass,
  siteNavigationGroupShellClass,
} from "@/lib/actions/siteNavigationButtonStyles";

/** Labs `action.button.group-horizontal` — segmented control styling for toolbars */
export const accountHealthActionGroupShellClass =
  "flex w-fit overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm";

export const accountHealthActionGroupItemClass =
  "rounded-none border-0 shadow-none focus-visible:z-10";

export const accountHealthActionGroupDividerClass =
  "border-r border-slate-200";

export const accountHealthToolbarLabelClass =
  "text-[10px] font-semibold uppercase tracking-wide text-muted-foreground";

/** Default site nav group — `action.button.site-navigation-group` */
export const accountHealthNavGroupShellClass = siteNavigationGroupShellClass;
export const accountHealthNavGroupDividerClass = siteNavigationGroupDividerClass;
export const accountHealthNavGroupItemClass = siteNavigationGroupItemClass;
