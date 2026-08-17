import { auth } from "@clerk/nextjs/server";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
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
      />
      <PageContainer padding="xs" spacing="md">
        <NotificationHealthDashboard />
      </PageContainer>
    </>
  );
}
