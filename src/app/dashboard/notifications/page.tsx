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
        byLine="System failure intelligence"
        byLineBottom="Failure volume, issue patterns, affected services, and scraper context"
      >
        <DashboardLinkButton
          href="/dashboard?tab=collection"
          trailingIcon="external"
        >
          Dashboard
        </DashboardLinkButton>
      </CreatePageTitle>
      <PageContainer padding="xs" spacing="lg">
        <NotificationHealthDashboard />
      </PageContainer>
    </>
  );
}
