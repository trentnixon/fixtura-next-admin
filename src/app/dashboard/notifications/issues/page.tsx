import { auth } from "@clerk/nextjs/server";
import { NotificationIssuesClient } from "./components/NotificationIssuesClient";
import type { NotificationIssuesSearchParamsInput } from "./utils/notificationIssuesUrl";

interface PageProps {
  searchParams?: Promise<NotificationIssuesSearchParamsInput>;
}

export default async function NotificationIssuesPage({
  searchParams,
}: PageProps) {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    redirectToSignIn({
      returnBackUrl: "/dashboard/notifications/issues",
    });
    return null;
  }

  const sp = searchParams != null ? await searchParams : {};

  return <NotificationIssuesClient searchParams={sp} />;
}
