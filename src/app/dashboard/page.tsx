import { auth } from "@clerk/nextjs/server";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import DashboardTabs from "./components/DashboardTabs";

export default async function DashboardPage() {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    redirectToSignIn({ returnBackUrl: "/dashboard" });
    return null;
  }

  return (
    <>
      <CreatePageTitle
        title="Admin Dashboard"
        byLine="Operations"
        byLineBottom="Schedulers, renders, and data collection health"
      />
      <DashboardTabs />
    </>
  );
}
