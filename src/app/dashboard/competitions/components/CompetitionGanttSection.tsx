"use client";

import { useMemo, useState } from "react";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import {
  GanttProvider,
  GanttSidebar,
  GanttSidebarItem,
  GanttTimeline,
  GanttHeader,
  GanttFeatureList,
  GanttFeatureItem,
  GanttToday,
  type GanttFeature,
  useGantt,
} from "@/components/ui/shadcn-io/gantt";
import { CompetitionAdminStatsAvailableCompetition } from "@/types/competitionAdminStats";
import {
  GanttChartTooltipProvider,
  GanttTooltip,
} from "@/app/dashboard/competitions/components/CompetitionAdminStats/sections/GanttTooltip";
import { GanttColorLegend } from "@/app/dashboard/competitions/components/CompetitionAdminStats/sections/GanttColorLegend";
import { CompetitionTooltipContent } from "@/app/dashboard/competitions/components/CompetitionAdminStats/sections/CompetitionTooltipContent";
import { LabeledSegmentedControl } from "@/components/ui-library/forms/LabeledSegmentedControl";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { siteNavigationCtaClass } from "@/lib/actions/siteNavigationButtonStyles";
import { cn } from "@/lib/utils";
import { Download, Search } from "lucide-react";
import {
  competitionToGanttFeature,
  computeSportWeightThresholds,
  downloadTimelineCampaignCsv,
  filterCompetitionsForTimelineView,
  hasValidCompetitionTimeline,
  type TimelineCampaignPreset,
} from "./competitionTimelineUtils";

const SORT_OPTIONS = [
  { value: "date", label: "Start date" },
  { value: "name", label: "Name" },
] as const;

const CAMPAIGN_PRESET_OPTIONS = [
  { value: "marketing", label: "Marketing picks" },
  { value: "starting-soon", label: "Starting soon" },
  { value: "high-value", label: "High value" },
  { value: "all", label: "All timelines" },
] as const;

interface CompetitionGanttSectionProps {
  competitions: CompetitionAdminStatsAvailableCompetition[];
  embedded?: boolean;
}

export function CompetitionGanttSection({
  competitions,
  embedded = false,
}: CompetitionGanttSectionProps) {
  const [hideFinished, setHideFinished] = useState(false);
  const [sortByDate, setSortByDate] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [campaignPreset, setCampaignPreset] =
    useState<TimelineCampaignPreset>("marketing");

  const thresholds = useMemo(
    () => computeSportWeightThresholds(competitions),
    [competitions],
  );

  const filteredCompetitions = useMemo(
    () =>
      filterCompetitionsForTimelineView(competitions, {
        preset: campaignPreset,
        hideFinished,
        searchQuery,
        thresholds,
      }),
    [competitions, campaignPreset, hideFinished, searchQuery, thresholds],
  );

  const ganttFeatures: GanttFeature[] = useMemo(
    () =>
      filteredCompetitions.map((competition) =>
        competitionToGanttFeature(competition, thresholds),
      ),
    [filteredCompetitions, thresholds],
  );

  const sortedFeatures = useMemo(() => {
    if (sortByDate) {
      return [...ganttFeatures].sort(
        (a, b) => a.startAt.getTime() - b.startAt.getTime(),
      );
    }
    return [...ganttFeatures].sort((a, b) => a.name.localeCompare(b.name));
  }, [ganttFeatures, sortByDate]);

  const stats = useMemo(() => {
    const withValidDates = competitions.filter(hasValidCompetitionTimeline)
      .length;

    return {
      withValidDates,
      displayed: ganttFeatures.length,
      hiddenByFilter: withValidDates - ganttFeatures.length,
    };
  }, [competitions, ganttFeatures.length]);

  const getWeightColorDynamic = (weight: number) => {
    const w = Number(weight);

    if (w >= 75) {
      return {
        backgroundColor: "rgba(34, 197, 94, 0.5)",
        borderColor: "rgba(34, 197, 94, 1)",
      };
    }
    if (w >= 50) {
      return {
        backgroundColor: "rgba(234, 179, 8, 0.5)",
        borderColor: "rgba(234, 179, 8, 1)",
      };
    }
    if (w >= 25) {
      return {
        backgroundColor: "rgba(249, 115, 22, 0.5)",
        borderColor: "rgba(249, 115, 22, 1)",
      };
    }
    return {
      backgroundColor: "rgba(100, 116, 139, 0.5)",
      borderColor: "rgba(100, 116, 139, 1)",
    };
  };

  const hasActiveFilters =
    campaignPreset !== "marketing" ||
    hideFinished ||
    !sortByDate ||
    searchQuery.trim().length > 0;

  const handleResetFilters = () => {
    setCampaignPreset("marketing");
    setHideFinished(false);
    setSortByDate(true);
    setSearchQuery("");
  };

  const toolbar = (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 rounded-full border border-slate-200 bg-slate-50/60 px-4 py-2 md:flex-row md:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search competitions on timeline..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="rounded-full border-transparent bg-white pl-9 shadow-none"
          />
        </div>

        <LabeledSegmentedControl
          label="Campaign"
          value={campaignPreset}
          onValueChange={(value) =>
            setCampaignPreset(value as TimelineCampaignPreset)
          }
          options={[...CAMPAIGN_PRESET_OPTIONS]}
          className="shrink-0"
          shellClassName="h-auto max-w-full shrink-0 rounded-full"
        />
      </div>

      <div className="flex flex-col gap-3 rounded-full border border-slate-200 bg-slate-50/60 px-4 py-2 md:flex-row md:flex-wrap md:items-center">
        <LabeledSegmentedControl
          label="Sort"
          value={sortByDate ? "date" : "name"}
          onValueChange={(value) => setSortByDate(value === "date")}
          options={[...SORT_OPTIONS]}
          className="shrink-0"
          shellClassName="h-auto shrink-0 rounded-full"
        />

        <div className="flex shrink-0 items-center gap-3">
          <Label
            htmlFor="competition-gantt-hide-finished"
            className="text-sm font-medium text-slate-700"
          >
            Hide finished
          </Label>
          <Switch
            id="competition-gantt-hide-finished"
            checked={hideFinished}
            onCheckedChange={setHideFinished}
          />
        </div>

        <Button
          variant="ghost"
          size="sm"
          disabled={sortedFeatures.length === 0}
          onClick={() => downloadTimelineCampaignCsv(sortedFeatures)}
          className={cn(siteNavigationCtaClass, "w-full shrink-0 md:w-auto")}
        >
          <Download className="h-4 w-4 shrink-0 text-current" aria-hidden />
          Export CSV
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className={cn(siteNavigationCtaClass, "w-full shrink-0 md:w-auto")}
          >
            Reset filters
          </Button>
        )}
      </div>
    </div>
  );

  const summaryLine = (
    <div className="px-1 text-sm text-muted-foreground">
      Showing {stats.displayed} competition
      {stats.displayed === 1 ? "" : "s"} for outreach
      {stats.hiddenByFilter > 0 &&
        ` (${stats.hiddenByFilter} hidden by filters)`}
      {" · "}
      Click a bar to open detail in a new tab
    </div>
  );

  const emptyState = (
    <div className="space-y-4">
      {toolbar}
      {summaryLine}
      <div className="rounded-md border border-dashed border-slate-200 bg-slate-50/50 px-4 py-10 text-center text-sm text-muted-foreground">
        {hasActiveFilters
          ? "No competitions match the current campaign filters. Try Marketing picks, widen the preset, or reset filters."
          : "No competitions with start dates are available for the current scope."}
      </div>
    </div>
  );

  const chart = (
    <div className="space-y-4">
      {toolbar}
      <GanttColorLegend />
      {summaryLine}
      <div className="relative h-[min(70vh,700px)] min-h-[420px] w-full min-w-0 max-w-full overflow-hidden rounded-md border border-slate-200">
        <GanttProvider
          range="monthly"
          zoom={100}
          className="h-full w-full min-w-0 max-w-full overflow-auto"
          style={{ contain: "layout size" }}
        >
          <GanttJumpToToday />
          <GanttChartTooltipProvider>
            <GanttContent
              sortedFeatures={sortedFeatures}
              getWeightColorDynamic={getWeightColorDynamic}
            />
          </GanttChartTooltipProvider>
        </GanttProvider>
      </div>
    </div>
  );

  const body = ganttFeatures.length === 0 ? emptyState : chart;

  if (embedded) {
    return (
      <SectionContainer
        title="Season timeline"
        description="Prioritized for marketing: competitions starting soon and large grade counts by sport. Export CSV for campaign lists."
        variant="compact"
        className="min-w-0 overflow-hidden"
        contentClassName="min-w-0 overflow-hidden space-y-4"
      >
        {body}
      </SectionContainer>
    );
  }

  return (
    <SectionContainer
      title="Competition timeline"
      description="Gantt view of competition start and end dates."
      className="min-w-0 overflow-hidden"
      contentClassName="min-w-0 overflow-hidden"
    >
      {body}
    </SectionContainer>
  );
}

function GanttJumpToToday() {
  const gantt = useGantt();

  return (
    <div className="pointer-events-none absolute right-3 top-3 z-10">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn(
          siteNavigationCtaClass,
          "pointer-events-auto bg-white/95 shadow-sm",
        )}
        onClick={() => {
          const today = new Date();
          today.setHours(12, 0, 0, 0);
          gantt.scrollToFeature({
            id: "__today__",
            name: "Today",
            startAt: today,
            endAt: today,
          });
        }}
      >
        Jump to today
      </Button>
    </div>
  );
}

function GanttContent({
  sortedFeatures,
  getWeightColorDynamic,
}: {
  sortedFeatures: GanttFeature[];
  getWeightColorDynamic: (weight: number) => {
    backgroundColor: string;
    borderColor: string;
  };
}) {
  const gantt = useGantt();

  const handleScrollToFeature = (featureId: string) => {
    const feature = sortedFeatures.find((f) => f.id === featureId);
    if (feature) {
      gantt.scrollToFeature(feature);
    }
  };

  const openCompetitionDetail = (competitionId: number) => {
    window.open(
      `/dashboard/competitions/${competitionId}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <>
      <GanttSidebar count={sortedFeatures.length}>
        {sortedFeatures.map((feature) => (
          <GanttSidebarItem
            key={feature.id}
            feature={feature}
            onSelectItem={handleScrollToFeature}
          />
        ))}
      </GanttSidebar>

      <GanttTimeline>
        <GanttHeader />
        <GanttFeatureList>
          {sortedFeatures.map((feature) => {
            const weight = !isNaN(Number(feature.weight))
              ? Number(feature.weight)
              : 0;
            const colors = getWeightColorDynamic(weight);

            return (
              <div
                key={feature.id}
                style={{
                  position: "relative",
                  height: "var(--gantt-row-height)",
                  width: "100%",
                }}
              >
                <GanttTooltip
                  content={<CompetitionTooltipContent feature={feature} />}
                >
                  <GanttFeatureItem
                    feature={feature}
                    className="cursor-pointer"
                    style={{
                      backgroundColor: colors.backgroundColor,
                      borderColor: colors.borderColor,
                      borderWidth: "1px",
                      borderStyle: "solid",
                    }}
                    onClick={() => {
                      const competitionId = feature.competitionId as number;
                      if (competitionId) {
                        openCompetitionDetail(competitionId);
                      }
                    }}
                  >
                    <div className="flex min-w-0 flex-1 flex-col">
                      <p className="truncate text-xs font-medium">
                        {feature.name}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span>
                          {new Date(feature.startAt).toLocaleDateString(
                            "en-AU",
                            { day: "numeric", month: "short" },
                          )}
                        </span>
                        <span>→</span>
                        <span>
                          {feature.endAt
                            ? new Date(feature.endAt).toLocaleDateString(
                                "en-AU",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                    {feature.group && typeof feature.group === "string" && (
                      <span className="ml-2 max-w-[120px] truncate whitespace-nowrap text-[10px] text-muted-foreground">
                        {feature.group}
                      </span>
                    )}
                  </GanttFeatureItem>
                </GanttTooltip>
              </div>
            );
          })}
        </GanttFeatureList>
        <GanttToday />
      </GanttTimeline>
    </>
  );
}
