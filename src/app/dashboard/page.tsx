import { SchedulerRollupData } from "@/app/dashboard/components/SchedulerRollupData";
import { ByLine, SectionTitle, Title } from "@/components/type/titles";
import { auth } from "@clerk/nextjs/server";
import QuickView from "./components/quickView";

//import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // Retrieve the user's authentication details
  const { userId, redirectToSignIn } = await auth();

  // If the user is not authenticated, redirect to the sign-in page
  if (!userId) {
    redirectToSignIn({ returnBackUrl: "/dashboard" });
    return null; // Avoid rendering anything after redirect
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-3 mb-2">
        <div className="border-b border-slate-200 pb-2 mb-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-0">
              <ByLine>Overview</ByLine>
              <Title>Fixtura Admin Dashboard</Title>
            </div>
          </div>
        </div>
        <section className="flex flex-col gap-4 my-4">
          <SectionTitle>Account Stats</SectionTitle>
          account stats and charts
          <QuickView />
        </section>
        <section className="flex flex-col gap-4 my-4">
          <SectionTitle>Schedulers</SectionTitle>
          <SchedulerRollupData />
        </section>
        <section className="flex flex-col gap-4 my-4">
          <SectionTitle>Renders</SectionTitle>
          [Check Scraper] Check the status of the scraper, to see if any are
          still in the queue
        </section>
        Endpoints /api/account/getAccountSummary api/account/getTodaysAccounts
        api/account/fixturaContentHubAccountDetails/119
      </div>
    </div>
  );
}
