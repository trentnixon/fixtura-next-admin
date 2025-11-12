/**
 * Invoice creation utilities
 */

/**
 * Gets default dates for invoice creation
 * Start date: today
 * End date: one year from today
 * @returns Object with startDate and endDate in datetime-local format (YYYY-MM-DDTHH:mm)
 */
export function getDefaultInvoiceDates(): {
  startDate: string;
  endDate: string;
} {
  const today = new Date();
  const oneYearLater = new Date(today);
  oneYearLater.setFullYear(today.getFullYear() + 1);

  return {
    startDate: today.toISOString().slice(0, 16),
    endDate: oneYearLater.toISOString().slice(0, 16),
  };
}

/**
 * Gets the due date for invoice creation (hardcoded to today)
 * @returns ISO date string for today
 */
export function getInvoiceDueDate(): string {
  return new Date().toISOString();
}

/**
 * Calculates end date based on start date and days in pass
 * @param startDate - Start date string (datetime-local format: YYYY-MM-DDTHH:mm)
 * @param daysInPass - Number of days to add to start date
 * @returns End date string in datetime-local format, or null if invalid
 */
export function calculateEndDateFromDaysInPass(
  startDate: string,
  daysInPass: number
): string | null {
  if (!startDate || !daysInPass) {
    return null;
  }

  try {
    const start = new Date(startDate);
    if (isNaN(start.getTime())) {
      return null;
    }

    const endDate = new Date(start);
    endDate.setDate(start.getDate() + daysInPass);

    // Format as datetime-local string (YYYY-MM-DDTHH:mm)
    return endDate.toISOString().slice(0, 16);
  } catch (error) {
    console.error("Error calculating endDate:", error);
    return null;
  }
}

