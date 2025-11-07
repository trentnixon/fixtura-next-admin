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
  Check as CheckIcon,
  DatabaseIcon,
  ExternalLinkIcon,
  EyeIcon,
  X as XIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  const sortedRenders = renders?.sort((a, b) => b.id - a.id);

  // Parse formatted date string like "Fri 7th November" or "Mon 3rd November"
  const parseFormattedDate = (
    dateStr: string,
    timeStr: string
  ): Date | null => {
    try {
      // Remove day of week (e.g., "Fri ", "Mon ")
      const withoutDayOfWeek = dateStr.replace(
        /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s+/i,
        ""
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
    if (daysSince === null) return { label: "Unknown", color: "bg-slate-500" };
    if (daysSince < 7) return { label: "Active", color: "bg-success-500" };
    return { label: "Stale", color: "bg-warning-500" };
  };

  return (
    <SectionContainer
      title="Render History"
      description={`${sortedRenders.length} total renders`}
      variant="compact"
    >
      {sortedRenders.length ? (
        <ScrollArea className="h-[500px] min-w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-center">Days Since</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Complete</TableHead>
                <TableHead className="text-center">Processing</TableHead>
                <TableHead className="text-center">Hub</TableHead>
                <TableHead className="text-center">Strapi</TableHead>
                <TableHead className="text-center">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRenders.map((render) => {
                const daysSince = getDaysSince(render.created, render.time);
                const status = getRenderStatus(daysSince);
                return (
                  <TableRow key={render.id}>
                    <TableCell>{render.created}</TableCell>
                    <TableCell>{render.time}</TableCell>
                    <TableCell className="text-center font-semibold">
                      {daysSince !== null && !isNaN(daysSince)
                        ? `${daysSince} day${daysSince !== 1 ? "s" : ""}`
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Badge
                          className={`${status.color} text-white border-0 rounded-full`}
                        >
                          {status.label}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Badge
                          className={`${
                            render.Complete ? "bg-success-500" : "bg-error-500"
                          } text-white border-0 rounded-full flex items-center justify-center w-6 h-6 p-0`}
                        >
                          {render.Complete ? (
                            <CheckIcon size="12" />
                          ) : (
                            <XIcon size="12" />
                          )}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center">
                        <Badge
                          className={`${
                            render.Processing
                              ? "bg-success-500"
                              : "bg-error-500"
                          } text-white border-0 rounded-full flex items-center justify-center w-6 h-6 p-0`}
                        >
                          {render.Processing ? (
                            <CheckIcon size="12" />
                          ) : (
                            <XIcon size="12" />
                          )}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="primary" asChild>
                        <Link
                          href={`${contentHub}/${accountId}/${sport.toLowerCase()}/${
                            render.id
                          }`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLinkIcon size="16" />
                        </Link>
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="primary" asChild>
                        <Link
                          href={`${strapiLocation.render}${render.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <DatabaseIcon size="16" />
                        </Link>
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="primary" asChild>
                        <Link href={`/dashboard/renders/${render.id}`}>
                          <EyeIcon size="16" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
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
