"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SectionContainer from "@/components/scaffolding/containers/SectionContainer";
import { EmptyState } from "@/components/ui-library";
import {
  ActivityIcon,
  Check as CheckIcon,
  CheckCircle2Icon,
  ClockIcon,
  DatabaseIcon,
  ExternalLinkIcon,
  EyeIcon,
  ListChecksIcon,
  MinusIcon,
  X as XIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useGlobalContext } from "@/components/providers/GlobalContext";
import { Render } from "@/types/fixturaContentHubAccountDetails";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ListRendersInTable({
  renders,
  accountId,
  sport,
}: {
  schedulerId: number;
  accountId: number;
  sport: string;
  accountType: string;
  renders: Render[];
}) {
  const { Domain, strapiLocation } = useGlobalContext();
  const { contentHub } = Domain;
  //renders order by publishedAt
  const sortedRenders = [...(renders ?? [])].sort((a, b) => b.id - a.id);

  // Parse formatted date string like "Fri 7th November" or "Mon 3rd November"
  const parseFormattedDate = (
    dateStr: string,
    timeStr: string,
  ): Date | null => {
    try {
      // Remove day of week (e.g., "Fri ", "Mon ")
      const withoutDayOfWeek = dateStr.replace(
        /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s+/i,
        "",
      );

      // Extract day number and month name
      // Pattern: "7th November" or "3rd November" or "21st October"
      const match = withoutDayOfWeek.match(/^(\d+)(st|nd|rd|th)\s+(.+)$/i);
      if (!match) return null;

      const day = parseInt(match[1], 10);
      const monthName = match[3].trim();

      // Map month names to numbers
      const monthMap: Record<string, number> = {
        january: 0,
        february: 1,
        march: 2,
        april: 3,
        may: 4,
        june: 5,
        july: 6,
        august: 7,
        september: 8,
        october: 9,
        november: 10,
        december: 11,
      };

      const month = monthMap[monthName.toLowerCase()];
      if (month === undefined) return null;

      // Determine the year - assume current year, but if the date is in the future,
      // it might be from last year (e.g., if it's January and we see November dates)
      const now = new Date();
      const currentYear = now.getFullYear();
      let year = currentYear;

      // Create a date with current year
      const testDate = new Date(year, month, day);

      // If the test date is more than 30 days in the future, it's probably from last year
      // (e.g., if today is early January and we see November dates)
      if (
        testDate > now &&
        testDate.getTime() - now.getTime() > 30 * 24 * 60 * 60 * 1000
      ) {
        year = currentYear - 1;
      }

      // Parse time string (e.g., "08:59")
      let hours = 0;
      let minutes = 0;
      if (timeStr) {
        const timeMatch = timeStr.match(/^(\d{1,2}):(\d{2})$/);
        if (timeMatch) {
          hours = parseInt(timeMatch[1], 10);
          minutes = parseInt(timeMatch[2], 10);
        }
      }

      const parsedDate = new Date(year, month, day, hours, minutes);

      // Validate the date is reasonable
      if (isNaN(parsedDate.getTime())) return null;

      // Check if date is not too far in the past (more than 10 years) or future (more than 1 year)
      const yearsDiff =
        (now.getTime() - parsedDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
      if (yearsDiff > 10 || yearsDiff < -1) return null;

      return parsedDate;
    } catch {
      return null;
    }
  };

  // Calculate days since render
  const getDaysSince = (renderDate: string, renderTime: string) => {
    // Try to parse the formatted date string
    const parsedDate = parseFormattedDate(renderDate, renderTime);

    if (parsedDate) {
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - parsedDate.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      // Validate the result is reasonable
      if (!isNaN(diffDays) && diffDays >= 0 && diffDays < 10000) {
        return diffDays;
      }
    }

    // If parsing failed, return null (will show "N/A")
    return null;
  };

  // Determine if render is active or stale (active if < 7 days, stale if >= 7 days)
  const getRenderStatus = (daysSince: number | null) => {
    if (daysSince === null) {
      return {
        label: "Unknown",
        className: "border-slate-200 bg-slate-50 text-slate-700",
      };
    }
    if (daysSince < 7) {
      return {
        label: "Active",
        className: "border-success-200 bg-success-50 text-success-800",
      };
    }
    return {
      label: "Stale",
      className: "border-warning-200 bg-warning-50 text-warning-800",
    };
  };

  const renderSummaries = sortedRenders.map((render) => {
    const daysSince = getDaysSince(render.created, render.time);
    return {
      ...render,
      daysSince,
      status: getRenderStatus(daysSince),
    };
  });

  const completeCount = renderSummaries.filter(
    (render) => render.Complete,
  ).length;
  const processingCount = renderSummaries.filter(
    (render) => render.Processing,
  ).length;
  const activeCount = renderSummaries.filter(
    (render) => render.daysSince !== null && render.daysSince < 7,
  ).length;
  const latestRender = renderSummaries[0];
  const schedulerCardTone = "border-slate-200 bg-slate-50 text-slate-800";
  const historyStats = [
    {
      label: "Total Renders",
      value: sortedRenders.length,
      meta: latestRender
        ? `Latest: ${latestRender.created} ${latestRender.time}`
        : "No render history",
      icon: ListChecksIcon,
    },
    {
      label: "Complete",
      value: completeCount,
      meta: `${sortedRenders.length - completeCount} incomplete`,
      icon: CheckCircle2Icon,
    },
    {
      label: "Active",
      value: activeCount,
      meta: "Rendered in the last 7 days",
      icon: ActivityIcon,
    },
    {
      label: "Processing",
      value: processingCount,
      meta: "Currently flagged in Strapi",
      icon: ClockIcon,
    },
  ];

  return (
    <SectionContainer
      title="Render History"
      description={`${sortedRenders.length} total renders`}
      variant="compact"
    >
      {sortedRenders.length ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {historyStats.map(({ label, value, meta, icon: Icon }) => (
              <Card
                className={`border shadow-sm ${schedulerCardTone}`}
                key={label}
              >
                <CardContent className="flex items-center gap-3 p-3.5">
                  <div className="rounded-md bg-white/70 p-2">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium opacity-75">
                      {label}
                    </div>
                    <div className="truncate text-lg font-bold leading-tight">
                      {value}
                    </div>
                    <div className="truncate text-xs opacity-75">{meta}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <ScrollArea className="h-[440px] min-w-full">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-slate-50">
                <TableRow>
                  <TableHead>Render</TableHead>
                  <TableHead className="text-center">Freshness</TableHead>
                  <TableHead className="text-center">Complete</TableHead>
                  <TableHead className="text-center">Processing</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderSummaries.map((render) => (
                  <TableRow key={render.id}>
                    <TableCell>
                      <div className="min-w-0">
                        <div className="font-medium text-slate-950">
                          Render #{render.id}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {render.created} at {render.time || "N/A"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center gap-1">
                        <Badge
                          variant="outline"
                          className={`${render.status.className} rounded-full`}
                        >
                          {render.status.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {render.daysSince !== null && !isNaN(render.daysSince)
                            ? `${render.daysSince} day${
                                render.daysSince !== 1 ? "s" : ""
                              }`
                            : "N/A"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <BooleanStatusBadge value={render.Complete} />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <BooleanStatusBadge value={render.Processing} />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-slate-200 bg-slate-50 text-slate-700 shadow-none hover:bg-slate-100 hover:text-slate-900"
                          asChild
                        >
                          <Link href={`/dashboard/renders/${render.id}`}>
                            <EyeIcon className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-brandInfo-200 bg-brandInfo-50 text-brandInfo-800 shadow-none hover:bg-brandInfo-100 hover:text-brandInfo-900"
                          asChild
                        >
                          <Link
                            href={`${contentHub}/${accountId}/${sport.toLowerCase()}/${
                              render.id
                            }`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLinkIcon className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-brandSecondary-200 bg-brandSecondary-50 text-brandSecondary-800 shadow-none hover:bg-brandSecondary-100 hover:text-brandSecondary-900"
                          asChild
                        >
                          <Link
                            href={`${strapiLocation.render}${render.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <DatabaseIcon className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      ) : (
        <EmptyState
          title="No renders available"
          description="This account has no render history yet."
          variant="minimal"
        />
      )}
    </SectionContainer>
  );
}

function BooleanStatusBadge({ value }: { value?: boolean }) {
  if (value === undefined || value === null) {
    return (
      <Badge
        variant="outline"
        className="flex h-6 w-6 items-center justify-center rounded-full border-slate-200 bg-slate-50 p-0 text-slate-600"
      >
        <MinusIcon size="12" />
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className={`flex h-6 w-6 items-center justify-center rounded-full p-0 ${
        value
          ? "border-success-200 bg-success-50 text-success-800"
          : "border-error-200 bg-error-50 text-error-800"
      }`}
    >
      {value ? <CheckIcon size="12" /> : <XIcon size="12" />}
    </Badge>
  );
}
