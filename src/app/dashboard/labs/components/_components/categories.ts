import type { LucideIcon } from "lucide-react";
import {
  Type,
  Palette,
  Layout,
  Box,
  FormInput,
  MessageSquare,
  Badge,
  Table,
  Navigation,
  MousePointer,
  Image,
  Wand2,
  BookOpen,
  Sparkles,
  List,
  SquareStack,
  BarChart3,
  FileText,
} from "lucide-react";

export type LabCategorySectionId =
  | "structure"
  | "navigation"
  | "data-display"
  | "interactive"
  | "feedback-status"
  | "overlays-utilities";

export interface LabCategorySection {
  id: LabCategorySectionId;
  label: string;
  description: string;
}

export interface LabCategory {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
  description: string;
  section: LabCategorySectionId;
  /** Anchor on /components/guide (### heading slug) */
  guideSectionAnchor?: string;
  /** Short "use when" from LLM_COMPONENT_GUIDE.md */
  guideUseWhen?: string;
  /** Token registry path hint */
  tokenFileHint?: string;
  keyTokens?: string[];
  showcaseCount?: number;
}

/** Sidebar / overview section order — matches LLM_COMPONENT_GUIDE.md workflow */
export const LAB_CATEGORY_SECTIONS: LabCategorySection[] = [
  {
    id: "structure",
    label: "Structure first",
    description: "Containers, layouts, then foundation tokens",
  },
  {
    id: "navigation",
    label: "Navigation",
    description: "Breadcrumbs, tabs, side nav, workflow, pagination",
  },
  {
    id: "data-display",
    label: "Data display",
    description: "Cards, charts, tables, and lists",
  },
  {
    id: "interactive",
    label: "Interactive",
    description: "Forms and actions",
  },
  {
    id: "feedback-status",
    label: "Feedback & status",
    description: "Loading, empty, error, badges, health",
  },
  {
    id: "overlays-utilities",
    label: "Overlays & utilities",
    description: "Dialogs, formatters, copy, media",
  },
];

export const LAB_OVERVIEW_PATH = "/dashboard/labs/components";
export const LAB_GUIDE_PATH = "/dashboard/labs/components/guide";

export const LAB_CATEGORIES: LabCategory[] = [
  {
    id: "containers",
    label: "Containers",
    icon: Box,
    path: "/dashboard/labs/components/containers",
    description: "Data, form, and record panel patterns",
    section: "structure",
    guideSectionAnchor: "containers",
    guideUseWhen:
      "Large working surfaces, title/byline sections, footers with actions or pagination.",
    tokenFileHint: "containerTokens.ts",
    keyTokens: [
      "container.pattern.data-workspace",
      "container.pattern.form-workspace",
      "container.pattern.record-panel",
    ],
    showcaseCount: 4,
  },
  {
    id: "layouts",
    label: "Layouts",
    icon: Layout,
    path: "/dashboard/labs/components/layouts",
    description: "Grids, flex, dividers, spacing",
    section: "structure",
    guideSectionAnchor: "layouts",
    guideUseWhen: "Grids and flex inside containers; stable responsive arrangement.",
    tokenFileHint: "layoutTokens.ts",
    showcaseCount: 7,
  },
  {
    id: "type",
    label: "Type",
    icon: Type,
    path: "/dashboard/labs/components/type",
    description: "Titles, body, links, code",
    section: "structure",
    guideSectionAnchor: "type",
    guideUseWhen: "Page and section hierarchy; supporting copy in containers.",
    tokenFileHint: "typeTokens.ts",
    showcaseCount: 12,
  },
  {
    id: "colors",
    label: "Colors",
    icon: Palette,
    path: "/dashboard/labs/components/colors",
    description: "Brand, semantic, and neutral palettes",
    section: "structure",
    guideSectionAnchor: "colors",
    guideUseWhen: "Semantic state and brand decisions; neutrals carry most surfaces.",
    showcaseCount: 1,
  },
  {
    id: "icons",
    label: "Icons",
    icon: Sparkles,
    path: "/dashboard/labs/components/icons",
    description: "Lucide icon browser and usage",
    section: "structure",
    guideSectionAnchor: "category-selection",
    guideUseWhen: "Buttons, nav items, status blocks — prefer lucide-react.",
    showcaseCount: 1,
  },
  {
    id: "navigation",
    label: "Navigation",
    icon: Navigation,
    path: "/dashboard/labs/components/navigation",
    description: "Breadcrumbs, tabs, side nav, workflow, pagination",
    section: "navigation",
    guideSectionAnchor: "navigation",
    guideUseWhen:
      "Movement between routes, peer sections, workflow steps, or paginated results.",
    tokenFileHint: "navigationTokens.ts",
    keyTokens: [
      "navigation.pattern.breadcrumb-header",
      "navigation.pattern.section-tabs",
      "navigation.pattern.side-nav",
    ],
    showcaseCount: 5,
  },
  {
    id: "data",
    label: "Data cards",
    icon: SquareStack,
    path: "/dashboard/labs/components/data",
    description: "Stat cards, metric grids, operational cards",
    section: "data-display",
    guideSectionAnchor: "data-cards",
    guideUseWhen: "Top-level metrics, quick status, compact summaries above detail.",
    tokenFileHint: "cardTokens.ts",
    keyTokens: [
      "card.stat.modern-overview",
      "card.stat.operations",
      "card.base.compact-kpi",
    ],
    showcaseCount: 3,
  },
  {
    id: "charts",
    label: "Charts",
    icon: BarChart3,
    path: "/dashboard/labs/components/charts",
    description: "Trend, comparison, and summary visualization",
    section: "data-display",
    guideSectionAnchor: "charts",
    guideUseWhen: "Shape, movement, proportion — when a number alone is not enough.",
    tokenFileHint: "chartTokens.ts",
    keyTokens: ["chart.card.with-summary-stats"],
    showcaseCount: 3,
  },
  {
    id: "tables",
    label: "Tables",
    icon: Table,
    path: "/dashboard/labs/components/tables",
    description: "Dense comparable records and review queues",
    section: "data-display",
    guideSectionAnchor: "tables",
    guideUseWhen: "Column comparison, sort/filter datasets, row actions.",
    tokenFileHint: "tableTokens.ts",
    showcaseCount: 3,
  },
  {
    id: "lists",
    label: "Lists",
    icon: List,
    path: "/dashboard/labs/components/lists",
    description: "Feeds, timelines, and grouped records",
    section: "data-display",
    guideSectionAnchor: "lists",
    guideUseWhen: "Feeds and timelines where columns are not the main scan path.",
    tokenFileHint: "listTokens.ts",
    showcaseCount: 4,
  },
  {
    id: "forms",
    label: "Forms",
    icon: FormInput,
    path: "/dashboard/labs/components/forms",
    description: "Inputs, selects, switches, validation",
    section: "interactive",
    guideSectionAnchor: "forms",
    guideUseWhen: "Create, edit, filter, and configuration with validation.",
    tokenFileHint: "formTokens.ts",
    showcaseCount: 6,
  },
  {
    id: "actions",
    label: "Actions",
    icon: MousePointer,
    path: "/dashboard/labs/components/actions",
    description: "Buttons, groups, triggers, toolbars",
    section: "interactive",
    guideSectionAnchor: "actions",
    guideUseWhen: "Save, create, trigger, sync, download, retry, filter commands.",
    tokenFileHint: "actionTokens.ts",
    showcaseCount: 6,
  },
  {
    id: "feedback",
    label: "Feedback",
    icon: MessageSquare,
    path: "/dashboard/labs/components/feedback",
    description: "Loading, empty, error, toast states",
    section: "feedback-status",
    guideSectionAnchor: "feedback",
    guideUseWhen: "Pending data, failures, empty sections, action toasts.",
    tokenFileHint: "feedbackTokens.ts",
    showcaseCount: 4,
  },
  {
    id: "status",
    label: "Status",
    icon: Badge,
    path: "/dashboard/labs/components/status",
    description: "Badges, avatars, health indicators",
    section: "feedback-status",
    guideSectionAnchor: "status",
    guideUseWhen: "Record state, owners, health labels — consistent language.",
    tokenFileHint: "statusTokens.ts",
    showcaseCount: 4,
  },
  {
    id: "overlays",
    label: "Overlays",
    icon: Wand2,
    path: "/dashboard/labs/components/overlays",
    description: "Dialogs, sheets, menus, tooltips",
    section: "overlays-utilities",
    guideSectionAnchor: "overlays",
    guideUseWhen: "Confirmations, secondary controls, icon-only clarifications.",
    tokenFileHint: "overlayTokens.ts",
    showcaseCount: 5,
  },
  {
    id: "utilities",
    label: "Utilities",
    icon: BookOpen,
    path: "/dashboard/labs/components/utilities",
    description: "Copy, time, currency, number, search",
    section: "overlays-utilities",
    guideSectionAnchor: "utilities",
    guideUseWhen: "Shared formatters and copy-to-clipboard — avoid ad hoc formatting.",
    tokenFileHint: "utilityTokens.ts",
    showcaseCount: 5,
  },
  {
    id: "media",
    label: "Media",
    icon: Image,
    path: "/dashboard/labs/components/media",
    description: "Images, video, code blocks, markdown",
    section: "overlays-utilities",
    guideSectionAnchor: "media",
    guideUseWhen: "Asset inspection; avoid decorative media on operational pages.",
    tokenFileHint: "mediaTokens.ts",
    showcaseCount: 4,
  },
];

/** Prompt template block from LLM_COMPONENT_GUIDE.md for copy-to-clipboard */
export const LAB_LLM_PROMPT_TEMPLATE = `Before building, read:
- src/app/dashboard/labs/components/LLM_COMPONENT_GUIDE.md
- src/app/dashboard/labs/components/[category]/readMe.md for each relevant category
- token files in the selected categories, such as cardTokens.ts, containerTokens.ts, navigationTokens.ts

Build the page using existing Fixtura Admin lab patterns. Select tokens first, then compose the page. Prefer compact dashboard surfaces with title/byline/content/footer regions. Do not invent a new visual system.

Page job:
[describe the user workflow]

Likely patterns:
- [token 1]
- [token 2]
- [token 3]

Data available:
[describe data shape]

Required states:
- loading
- empty
- error
- success/normal`;

export const LAB_PAGE_RECIPES = [
  {
    title: "Dashboard overview",
    tokens: [
      "container.pattern.data-workspace",
      "navigation.pattern.breadcrumb-header",
      "card.stat.modern-overview",
    ],
    categories: ["containers", "navigation", "data", "charts", "tables"],
  },
  {
    title: "Detail page",
    tokens: [
      "navigation.pattern.breadcrumb-header",
      "container.pattern.record-panel",
      "navigation.pattern.section-tabs",
    ],
    categories: ["navigation", "containers", "status", "data"],
  },
  {
    title: "Form or settings",
    tokens: ["container.pattern.form-workspace"],
    categories: ["containers", "forms", "feedback", "actions"],
  },
  {
    title: "Queue or operations",
    tokens: ["card.stat.operations", "navigation.pattern.side-nav"],
    categories: ["data", "navigation", "tables", "feedback"],
  },
] as const;

export const LAB_QUICK_TOKENS = [
  "container.pattern.data-workspace",
  "container.pattern.form-workspace",
  "container.pattern.record-panel",
  "navigation.pattern.breadcrumb-header",
  "navigation.pattern.section-tabs",
  "navigation.pattern.side-nav",
  "card.stat.modern-overview",
  "card.stat.operations",
  "card.base.compact-kpi",
  "card.base.operational-status",
] as const;

export function getCategoriesBySection(
  sectionId: LabCategorySectionId
): LabCategory[] {
  return LAB_CATEGORIES.filter((c) => c.section === sectionId);
}

export function getCategoryById(id: string): LabCategory | undefined {
  return LAB_CATEGORIES.find((c) => c.id === id);
}

export const LAB_GUIDE_NAV = {
  id: "guide",
  label: "LLM build guide",
  icon: FileText,
  path: LAB_GUIDE_PATH,
  description: "Pattern selection, tokens, and page recipes",
} as const;
