import { Suspense } from "react";
import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import LoadingState from "@/components/ui-library/states/LoadingState";
import AccountsDashboard from "./components/AccountsDashboard";

export default function AccountsPage() {
  return (
    <>
      <CreatePageTitle
        title="Accounts"
        byLine="Fleet-wide account overview and analytics"
        byLineBottom="Use tabs for overview, operations alerts, and analytics"
      />
      <PageContainer padding="xs" spacing="lg">
        <Suspense
          fallback={
            <LoadingState variant="minimal" message="Loading accounts hub…" />
          }
        >
          <AccountsDashboard />
        </Suspense>
      </PageContainer>
    </>
  );
}
