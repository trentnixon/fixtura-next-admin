import { isBefore, parseISO, startOfDay } from "date-fns";

import { toFixtureDisplayText } from "@/app/dashboard/fixtures/_components/_utils/fixtureDisplayText";
import type { FixtureDisplayField } from "@/types/fixtureInsights";

export type GradeFixtureListGroup = "complete" | "scheduled" | "needs-result";

const COMPLETE_STATUSES = new Set(["finished", "completed", "final"]);
const PRE_GAME_STATUSES = new Set(["upcoming", "scheduled"]);

export function isGradeFixtureListGroup(
  value: string,
): value is GradeFixtureListGroup {
  return (
    value === "complete" || value === "scheduled" || value === "needs-result"
  );
}

/**
 * Complete: a result status is stored.
 * Needs result: the game day is in the past and there is no result status
 * (blank, unknown, or still marked upcoming/scheduled).
 * Scheduled: everything else, including cancelled and in progress.
 */
export function classifyGradeFixture(
  fixture: { date: string | null; status: FixtureDisplayField },
  today: Date,
): GradeFixtureListGroup {
  const status = toFixtureDisplayText(fixture.status, "").toLowerCase();

  if (COMPLETE_STATUSES.has(status)) {
    return "complete";
  }

  if (isGameDayPast(fixture.date, today) && lacksResultStatus(status)) {
    return "needs-result";
  }

  return "scheduled";
}

function lacksResultStatus(status: string): boolean {
  if (!status || status === "unknown" || status === "n/a") return true;
  return PRE_GAME_STATUSES.has(status);
}

function isGameDayPast(date: string | null, today: Date): boolean {
  if (!date) return false;
  const parsed = parseISO(date);
  if (Number.isNaN(parsed.getTime())) return false;
  return isBefore(startOfDay(parsed), startOfDay(today));
}
