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
      returnBackUrl: "/dashboard/data/notifications/issues",
    });
    return null;
  }

  const sp = searchParams != null ? await searchParams : {};

  return (
    <>
      <CreatePageTitle
        title="Data / Notification issues"
        byLine="Scraper failure drill-down"
        byLineBottom="Individual issue rows from notification health — URL, message, job context"
      />
      <PageContainer padding="xs" spacing="md">
        <NotificationIssuesClient searchParams={sp} />
      </PageContainer>
    </>
  );
}
