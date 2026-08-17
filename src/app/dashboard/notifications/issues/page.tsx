import { auth } from "@clerk/nextjs/server";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
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

  return (
    <>
      <CreatePageTitle
        title="Notification issues"
        byLine="Failure investigation inbox"
        byLineBottom="Search issue signals, inspect operational context, and open the affected scraper run"
      />
      <PageContainer padding="xs" spacing="md">
        <NotificationIssuesClient searchParams={sp} />
      </PageContainer>
    </>
  );
}
