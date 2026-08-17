import { redirect } from "next/navigation";

interface LegacyNotificationIssuesPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function LegacyNotificationIssuesPage({
  searchParams,
}: LegacyNotificationIssuesPageProps) {
  const params = searchParams != null ? await searchParams : {};
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      for (const item of value) query.append(key, item);
    } else if (value != null) {
      query.set(key, value);
    }
  }

  const suffix = query.toString();
  redirect(`/dashboard/notifications/issues${suffix ? `?${suffix}` : ""}`);
}
