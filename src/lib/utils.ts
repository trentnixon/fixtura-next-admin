import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function daysFromToday(date: string) {
  const today = new Date();
  const updatedAt = new Date(date);
  const diffTime = Math.abs(today.getTime() - updatedAt.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function calculateCompetitionTimeline(
  startDateStr: string | null,
  endDateStr: string | null
) {
  if (!startDateStr || !endDateStr) {
    return {
      status: "unknown",
      daysTotal: null,
      daysElapsed: null,
      daysRemaining: null,
      progressPercent: null,
    };
  }

  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const now = new Date();

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return {
      status: "unknown",
      daysTotal: null,
      daysElapsed: null,
      daysRemaining: null,
      progressPercent: null,
    };
  }

  // Reset hours to start of day for accurate day calculation
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  const totalDuration = end.getTime() - start.getTime();
  // Add 1 day to include both start and end dates
  const daysTotal = Math.ceil(totalDuration / (1000 * 60 * 60 * 24)) + 1;

  if (daysTotal <= 0) {
    return {
      status: "unknown",
      daysTotal: null,
      daysElapsed: null,
      daysRemaining: null,
      progressPercent: null,
    };
  }

  const elapsedDuration = now.getTime() - start.getTime();
  let daysElapsed = Math.ceil(elapsedDuration / (1000 * 60 * 60 * 24));

  // Adjust for inclusive start date if started
  if (daysElapsed >= 0) {
      daysElapsed += 1;
  }

  // Clamp days elapsed
  if (daysElapsed < 0) daysElapsed = 0;
  if (daysElapsed > daysTotal) daysElapsed = daysTotal;

  const daysRemaining = daysTotal - daysElapsed;
  const progressPercent = (daysElapsed / daysTotal) * 100;

  let status = "unknown";
  if (now < start) {
    status = "upcoming";
  } else if (now > end) {
    status = "completed";
  } else {
    status = "in_progress";
  }

  return {
    status,
    daysTotal,
    daysElapsed,
    daysRemaining,
    progressPercent,
  };
}
