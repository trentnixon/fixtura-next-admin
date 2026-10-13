import { auth } from "@clerk/nextjs/server";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import { DashboardLinkButton } from "@/app/dashboard/components/live-snapshot/DashboardLinkButton";
import { NotificationHealthDashboard } from "./components/NotificationHealthDashboard";

export default async function NotificationsPage() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    redirectToSignIn({ returnBackUrl: "/dashboard/notifications" });
    return null;
  }

  return (
    <>
      <CreatePageTitle
        title="Notification health"
        byLine="Scrape failures"
        byLineBottom="Volume, issue types, and where they show up"
      >
        <DashboardLinkButton
          href="/dashboard?tab=collection"
          trailingIcon="external"
        >
          Dashboard
        </DashboardLinkButton>
      </CreatePageTitle>
      <PageContainer padding="xs" spacing="md">
        <NotificationHealthDashboard />
      </PageContainer>
    </>
  );
}
