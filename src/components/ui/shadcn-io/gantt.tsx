// "use client";

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
  type FC,
} from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  differenceInDays,
  differenceInMonths,
  differenceInQuarters,
  differenceInWeeks,
  differenceInYears,
  format as formatDate,
  getDaysInMonth,
} from "date-fns";
import throttle from "lodash.throttle";
import { atom, useAtom } from "jotai";
import { cn } from "@/lib/utils";

// Types
export type GanttRange =
  | "daily"
  | "weekly"
  | "monthly"
  | "quarterly"
  | "yearly";

export type GanttFeature = {
  id: string;
  name: string;
  startAt: Date;
  endAt?: Date | null;
  group?: { id: string; name: string } | string;
  status?: { id: string; name: string; color: string } | string;
  owner?: { id: string; name: string; image?: string } | string;
  // Additional optional fields used in UI components
  season?: string;
  sizeCategory?: string;
  weight?: number;
  gradeCount?: number;
  // Allow extra unknown properties
  [key: string]: unknown;
};

export type GanttMarker = {
  id: string;
  date: Date;
  label: string;
  className?: string;
};

type TimelineData = Array<{
  year: number;
  quarters: Array<{
    months: Array<{ days: number }>;
  }>;
}>;

type GanttContextType = {
  zoom: number;
  range: GanttRange;
  headerHeight: number;
  columnWidth: number;
  sidebarWidth: number;
  rowHeight: number;
  onAddItem?: (date: Date) => void;
  timelineData: TimelineData;
  placeholderLength: number;
  ref: React.RefObject<HTMLDivElement | null>;
  scrollToFeature: (feature: GanttFeature) => void;
  timelineStartDate: Date; // Shared reference point for all date calculations
};

const GanttContext = createContext<GanttContextType | null>(null);

export const useGantt = () => {
  const context = useContext(GanttContext);
  if (!context) {
    throw new Error("useGantt must be used within GanttProvider");
  }
  return context;
};

// Helper functions
const getDifferenceIn = (range: GanttRange) => {
  switch (range) {
    case "daily":
      return differenceInDays;
    case "weekly":
      return differenceInWeeks;
    case "monthly":
      return differenceInMonths;
    case "quarterly":
      return differenceInQuarters;
    case "yearly":
      return differenceInYears;
    default:
      return differenceInDays;
  }
};

const calculateInnerOffset = (
  date: Date,
  range: GanttRange,
  columnWidth: number
): number => {
  switch (range) {
    case "daily": {
      const dayOfWeek = date.getDay();
      return (dayOfWeek * columnWidth) / 7;
    }
    case "weekly": {
      const dayOfWeek = date.getDay();
      return (dayOfWeek * columnWidth) / 7;
    }
    case "monthly": {
      const dayOfMonth = date.getDate();
      const daysInMonth = getDaysInMonth(date);
      return ((dayOfMonth - 1) * columnWidth) / daysInMonth;
    }
    case "quarterly": {
      const monthOfQuarter = date.getMonth() % 3;
      const dayOfMonth = date.getDate();
      const daysInMonth = getDaysInMonth(date);
      return (
        (monthOfQuarter * columnWidth) / 3 +
        (dayOfMonth * columnWidth) / (daysInMonth * 3)
      );
    }
    case "yearly": {
      const monthOfYear = date.getMonth();
      const dayOfMonth = date.getDate();
      const daysInMonth = getDaysInMonth(date);
      return (
        (monthOfYear * columnWidth) / 12 +
        (dayOfMonth * columnWidth) / (daysInMonth * 12)
      );
    }
    default:
      return 0;
  }
};

const getOffset = (
  date: Date,
  timelineStartDate: Date,
  context: GanttContextType
): number => {
  const differenceIn = getDifferenceIn(context.range);
  const offset = differenceIn(date, timelineStartDate);
  const innerOffset = calculateInnerOffset(
    date,
    context.range,
    (context.columnWidth * context.zoom) / 100
  );
  return (offset * (context.columnWidth * context.zoom)) / 100 + innerOffset;
};

// Provider Component
export type GanttProviderProps = {
  children: ReactNode;
  className?: string;
  range?: GanttRange;
  zoom?: number;
  onAddItem?: (date: Date) => void;
  earliestDate?: Date;
  latestDate?: Date;
};

const zoomAtom = atom(100);
const rangeAtom = atom<GanttRange>("monthly");

export const GanttProvider: FC<GanttProviderProps> = ({
  children,
  className,
  range: rangeProp = "monthly",
  zoom: zoomProp = 100,
  onAddItem,
}) => {
  const [zoom, setZoom] = useAtom(zoomAtom);
  const [range, setRange] = useAtom(rangeAtom);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setZoom(zoomProp);
  }, [zoomProp, setZoom]);

  useEffect(() => {
    setRange(rangeProp);
  }, [rangeProp, setRange]);

  const headerHeight = 60;
  const columnWidth = 100; // Base width per month column
  const sidebarWidth = 250;
  const rowHeight = 50;

  // Calculate timeline start date once and share it across all components
  const timelineStartDate = useMemo(() => {
    const now = new Date();
    const start = new Date(now);
    start.setMonth(now.getMonth() - 6); // 6 months back
    start.setDate(1); // Start of that month
    start.setHours(0, 0, 0, 0);
    return start;
  }, []);

  const [timelineData] = useState<TimelineData>(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Show 18 months: 6 months back + 12 months forward
    const years: TimelineData = [];
    const monthData: Array<{ year: number; month: number }> = [];
    for (let i = -6; i < 12; i++) {
      const date = new Date(currentYear, currentMonth + i, 1);
      monthData.push({ year: date.getFullYear(), month: date.getMonth() });
    }
    const yearMap = new Map<number, number[]>();
    monthData.forEach(({ year, month }) => {
      if (!yearMap.has(year)) {
        yearMap.set(year, []);
      }
      yearMap.get(year)!.push(month);
    });
    yearMap.forEach((months, year) => {
      const quarters: Array<{ months: Array<{ days: number }> }> = [];
      for (let quarterIndex = 0; quarterIndex < 4; quarterIndex++) {
        const quarterMonths: Array<{ days: number }> = [];
        for (let monthIndex = 0; monthIndex < 3; monthIndex++) {
          const month = quarterIndex * 3 + monthIndex;
          if (months.includes(month)) {
            quarterMonths.push({ days: getDaysInMonth(new Date(year, month, 1)) });
          } else {
            quarterMonths.push({ days: getDaysInMonth(new Date(year, month, 1)) });
          }
        }
        quarters.push({ months: quarterMonths });
      }
      years.push({ year, quarters });
    });
    return years;
  });

  const cssVariables = {
    "--gantt-header-height": `${headerHeight}px`,
    "--gantt-column-width": `${(columnWidth * zoom) / 100}px`,
    "--gantt-sidebar-width": `${sidebarWidth}px`,
    "--gantt-row-height": `${rowHeight}px`,
  } as React.CSSProperties;

  const handleScroll = useCallback(
    (event: Event) => {
      const scrollElement = event.target as HTMLDivElement;
      if (!scrollElement) return;
      // Scroll handling logic (currently disabled infinite scroll)
    },
    []
  );

  const throttledHandleScroll = useMemo(
    () => throttle(handleScroll, 100),
    [handleScroll]
  );

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", throttledHandleScroll as (event: Event) => void);
    }
    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", throttledHandleScroll as (event: Event) => void);
      }
    };
  }, [throttledHandleScroll]);

  const scrollToFeature = useCallback(
    (feature: GanttFeature) => {
      const scrollElement = scrollRef.current;
      if (!scrollElement) return;
      const offset = getOffset(feature.startAt, timelineStartDate, {
        zoom,
        range,
        columnWidth,
        sidebarWidth,
        headerHeight,
        rowHeight,
        onAddItem,
        timelineData,
        placeholderLength: 2,
        ref: scrollRef,
        scrollToFeature: () => { },
        timelineStartDate,
      } as GanttContextType);
      const targetScrollLeft = Math.max(0, offset);
      scrollElement.scrollTo({ left: targetScrollLeft, behavior: "smooth" });
    },
    [timelineData, zoom, range, columnWidth, sidebarWidth, headerHeight, rowHeight, onAddItem, timelineStartDate]
  );

  return (
    <GanttContext.Provider
      value={{
        zoom,
        range,
        headerHeight,
        columnWidth,
        sidebarWidth,
        rowHeight,
        onAddItem,
        timelineData,
        placeholderLength: 2,
        ref: scrollRef,
        scrollToFeature,
        timelineStartDate,
      }}
    >
      <div
        className={cn(
          "gantt relative grid h-full max-w-full select-none overflow-auto rounded-sm bg-secondary",
          range,
          className
        )}
        ref={scrollRef}
        style={{
          ...cssVariables,
          gridTemplateColumns: "var(--gantt-sidebar-width) auto",
        }}
      >
        {children}
      </div>
    </GanttContext.Provider>
  );
};

// Sidebar Components
export type GanttSidebarProps = {
  children: ReactNode;
  className?: string;
  count?: number;
};

export const GanttSidebar: FC<GanttSidebarProps> = ({ children, className, count }) => {
  const gantt = useGantt();
  return (
    <div
      className={cn(
        "sticky left-0 z-10 border-r bg-background flex flex-col",
        className
      )}
    >
      <div
        className="border-b bg-muted px-4 py-2 font-semibold text-sm sticky top-0 z-10 flex items-center justify-between"
        style={{ height: `${gantt.headerHeight}px` }}
      >
        <span>Competition</span>
        {count !== undefined && (
          <span className="text-xs font-normal text-muted-foreground">({count})</span>
        )}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
};

export type GanttSidebarGroupProps = {
  name: string;
  children: ReactNode;
  className?: string;
};

export const GanttSidebarGroup: FC<GanttSidebarGroupProps> = ({ name, children, className }) => (
  <div className={cn("border-b", className)}>
    <div className="px-4 py-2 font-semibold text-sm">{name}</div>
    <div>{children}</div>
  </div>
);

export type GanttSidebarItemProps = {
  feature: GanttFeature;
  onSelectItem?: (id: string) => void;
  className?: string;
};

export const GanttSidebarItem: FC<GanttSidebarItemProps> = ({ feature, onSelectItem, className }) => {
  const gantt = useGantt();
  return (
    <div
      className={cn(
        "px-4 text-sm hover:bg-accent cursor-pointer border-b flex items-center",
        className
      )}
      style={{ height: `${gantt.rowHeight}px` }}
      onClick={() => onSelectItem?.(feature.id)}
    >
      {feature.name}
    </div>
  );
};

// Timeline Components
export type GanttTimelineProps = {
  children: ReactNode;
  className?: string;
};

export const GanttTimeline: FC<GanttTimelineProps> = ({ children, className }) => {
  const gantt = useGantt();
  const columnWidth = (gantt.columnWidth * gantt.zoom) / 100;
  const timelineWidth = 18 * columnWidth;

  return (
    <div
      className={cn("relative flex h-full flex-none overflow-visible", className)}
      style={{ width: `${timelineWidth}px`, minWidth: `${timelineWidth}px` }}
    >
      {children}
    </div>
  );
};

export type GanttHeaderProps = {
  className?: string;
};

export const GanttHeader: FC<GanttHeaderProps> = ({ className }) => {
  const gantt = useGantt();
  const monthsToShow = useMemo(() => {
    const months: Array<{ date: Date; year: number; month: number }> = [];
    for (let i = 0; i < 18; i++) {
      const date = new Date(gantt.timelineStartDate);
      date.setMonth(gantt.timelineStartDate.getMonth() + i);
      date.setDate(1);
      months.push({ date, year: date.getFullYear(), month: date.getMonth() });
    }
    return months;
  }, [gantt.timelineStartDate]);

  const columnWidth = (gantt.columnWidth * gantt.zoom) / 100;
  const totalWidth = 18 * columnWidth;

  return (
    <div
      className={cn("sticky top-0 z-20 border-b bg-background", className)}
      style={{ height: `${gantt.headerHeight}px`, width: `${totalWidth}px`, minWidth: `${totalWidth}px`, maxWidth: `${totalWidth}px` }}
    >
      <div className="relative h-full flex" style={{ width: `${totalWidth}px`, minWidth: `${totalWidth}px` }}>
        {monthsToShow.map(({ date, year, month }, index) => (
          <div
            key={`${year}-${month}-${index}`}
            className="border-r border-b bg-background flex items-center justify-center"
            style={{
              width: `${columnWidth}px`,
              minWidth: `${columnWidth}px`,
              maxWidth: `${columnWidth}px`,
              flexShrink: 0,
              flexGrow: 0,
              height: "100%",
            }}
          >
            <div className="text-xs text-muted-foreground whitespace-nowrap px-2 text-center">
              {formatDate(date, "MMM yyyy")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Feature Components
export type GanttFeatureListProps = {
  children: ReactNode;
  className?: string;
};

export const GanttFeatureList: FC<GanttFeatureListProps> = ({ children, className }) => {
  const gantt = useGantt();
  const columnWidth = (gantt.columnWidth * gantt.zoom) / 100;
  const timelineWidth = 18 * columnWidth;

  return (
    <div
      className={cn("absolute top-0 left-0 h-full w-max", className)}
      style={{
        minHeight: "100%",
        width: `${timelineWidth}px`,
        minWidth: `${timelineWidth}px`,
        marginTop: `${gantt.headerHeight}px`,
      }}
    >
      {children}
    </div>
  );
};

export type GanttFeatureListGroupProps = {
  children: ReactNode;
  className?: string;
};

export const GanttFeatureListGroup: FC<GanttFeatureListGroupProps> = ({ children, className }) => (
  <div className={cn("relative", className)} style={{ minHeight: "var(--gantt-row-height)", margin: "0", padding: "0" }}>
    {children}
  </div>
);

export type GanttFeatureItemProps = {
  feature: GanttFeature;
  onMove?: (id: string, startAt: Date, endAt: Date | null) => void;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
};

export const GanttFeatureItem: FC<GanttFeatureItemProps> = ({ feature, onMove, children, className, style: customStyle, onClick }) => {
  const gantt = useGantt();
  const startOffset = useMemo(() => getOffset(feature.startAt, gantt.timelineStartDate, gantt), [feature.startAt, gantt]);
  const endOffset = useMemo(() => getOffset(feature.endAt as Date, gantt.timelineStartDate, gantt), [feature.endAt, gantt]);
  const width = useMemo(() => {
    const calculatedWidth = endOffset - startOffset;
    const columnWidth = (gantt.columnWidth * gantt.zoom) / 100;
    return Math.max(calculatedWidth, columnWidth / 2);
  }, [startOffset, endOffset, gantt.columnWidth, gantt.zoom]);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: feature.id,
    disabled: !onMove || !!onClick,
  });

  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        position: "absolute",
        left: `${startOffset}px`,
        width: `${width}px`,
        height: `${gantt.rowHeight - 8}px`,
        top: "4px",
        ...customStyle,
      }}
      className={cn(
        "flex items-center gap-2 rounded px-2 py-1 text-xs",
        onMove && !onClick && "cursor-move",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      {...(!onClick ? attributes : {})}
      {...(!onClick ? listeners : {})}
    >
      {children || <span className="truncate">{feature.name}</span>}
    </div>
  );
};

// Marker Components
export type GanttMarkerProps = {
  id: string;
  date: Date;
  label: string;
  className?: string;
  onRemove?: (id: string) => void;
};

export const GanttMarker: FC<GanttMarkerProps> = ({ date, label, className }) => {
  const gantt = useGantt();
  const timelineStartDate = useMemo(() => new Date(gantt.timelineData[0].year, 0, 1), [gantt.timelineData]);
  const offset = useMemo(() => getOffset(date, timelineStartDate, gantt), [date, timelineStartDate, gantt]);
  return (
    <div
      className={cn("pointer-events-none absolute top-0 z-30 flex h-full flex-col items-center", className)}
      style={{ left: `${offset}px` }}
    >
      <div className="sticky top-0 rounded bg-card px-2 py-1 text-xs">{label}</div>
      <div className="h-full w-px bg-border" />
    </div>
  );
};

// Today Marker
export type GanttTodayProps = {
  className?: string;
};

export const GanttToday: FC<GanttTodayProps> = ({ className }) => {
  const gantt = useGantt();
  const [date, setDate] = useState<Date | null>(null);

  useEffect(() => {
    setDate(new Date());
  }, []);

  if (!date) return null;

  const columnWidth = (gantt.columnWidth * gantt.zoom) / 100;
  const monthsDiff = differenceInMonths(date, gantt.timelineStartDate);
  const monthOffset = monthsDiff * columnWidth;
  const daysInMonth = getDaysInMonth(date);
  const dayOfMonth = date.getDate();
  const innerOffset = (dayOfMonth / daysInMonth) * columnWidth;
  const totalOffset = monthOffset + innerOffset;

  return (
    <div
      className={cn(
        "pointer-events-none absolute top-0 left-0 z-20 flex h-full select-none flex-col items-center justify-center overflow-visible",
        className
      )}
      style={{ width: 0, transform: `translateX(${totalOffset}px)` }}
    >
      <div
        className={cn(
          "group pointer-events-auto sticky top-0 flex select-auto flex-col flex-nowrap items-center justify-center whitespace-nowrap rounded-b-md bg-card px-2 py-1 text-foreground text-xs",
          className
        )}
      >
        Today
        <span className="max-h-[0] overflow-hidden opacity-80 transition-all group-hover:max-h-[2rem]">
          {formatDate(date, "MMM dd, yyyy")}
        </span>
      </div>
      <div className={cn("h-full w-px bg-card", className)} />
    </div>
  );
};

// Create Marker Trigger (placeholder implementation)
export type GanttCreateMarkerTriggerProps = {
  onCreate?: (date: Date) => void;
  className?: string;
};

export const GanttCreateMarkerTrigger: FC<GanttCreateMarkerTriggerProps> = () => {
  // Implementation for creating markers on click
  return null;
};
