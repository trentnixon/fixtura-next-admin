// Utility to fetch and parse unsubscribed emails from CSV
export async function getUnsubscribedEmails(): Promise<string[]> {
  try {
    const response = await fetch("/unsub/unSub.csv");
    if (!response.ok) {
      throw new Error("Failed to fetch unsubscribed emails CSV");
    }

    const csvText = await response.text();

    // Parse CSV - split by newlines and filter out empty lines
    const emails = csvText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && line.includes("@"))
      .map((email) => email.toLowerCase());

    return emails;
  } catch (error) {
    console.error("Error fetching unsubscribed emails:", error);
    return []; // Return empty array on error
  }
}

// Function to check if an email is unsubscribed
export function isEmailUnsubscribed(
  email: string | null | undefined,
  unsubscribedList: string[]
): boolean {
  if (!email || typeof email !== "string") {
    return false; // Treat null/undefined/empty emails as not unsubscribed
  }
  return unsubscribedList.includes(email.toLowerCase());
}
