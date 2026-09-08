/**
 * Default site navigation CTA styles — aligned with sidebar tokens.
 * Labs: `action.button.site-navigation*` · groups reuse `action.button.group-horizontal` shell.
 */

/** Single CTA — transparent bg, sidebar navy text, sidebar fill on hover */
export const siteNavigationCtaClass =
  "rounded-full border border-sidebar-border bg-transparent text-sidebar shadow-sm hover:bg-sidebar hover:text-white active:bg-sidebar active:text-white";

/** Single CTA alt — filled sidebar shell (persistent dark nav) */
export const siteNavigationCtaAltClass =
  "rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-sm hover:bg-sidebar-accent hover:text-white active:bg-sidebar-accent active:text-white";

/** Horizontal group shell — transparent */
export const siteNavigationGroupShellClass =
  "flex w-fit overflow-hidden rounded-full border border-sidebar-border bg-transparent shadow-sm";

/** Horizontal group shell alt — filled sidebar */
export const siteNavigationGroupShellAltClass =
  "flex w-fit overflow-hidden rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-sm";

export const siteNavigationGroupDividerClass =
  "border-r border-sidebar-border";

/** Group item — transparent default, sidebar fill + white text on hover */
export const siteNavigationGroupItemClass =
  "rounded-none border-0 bg-transparent text-sidebar shadow-none hover:bg-sidebar hover:text-white active:bg-sidebar active:text-white focus-visible:z-10";

/** Group item alt — matches in-sidebar menu buttons */
export const siteNavigationGroupItemAltClass =
  "rounded-none border-0 bg-transparent text-sidebar-foreground shadow-none hover:bg-sidebar-accent hover:text-white active:bg-sidebar-accent active:text-white focus-visible:z-10";

/** Section tab list — pair with `TabsList variant="primary"` (`navigation.tabs.section-default`) */
export const sectionTabListClass =
  "flex h-auto flex-wrap justify-start gap-1";

/** Section tab trigger padding — pair with `TabsTrigger variant="section"`; icons use `text-current` */
export const sectionTabTriggerClass = "px-4 py-2";

/** Inverse section tab list — pair with `TabsList variant="sectionInverse"` (`navigation.tabs.section-inverse`) */
export const sectionTabListInverseClass =
  "flex h-auto flex-wrap justify-start gap-0.5 p-1";

/** Inverse trigger extras — compact padding lives on `TabsTrigger variant="sectionInverse"` */
export const sectionTabTriggerInverseClass = "";
