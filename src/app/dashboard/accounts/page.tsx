import PageContainer from "@/components/scaffolding/containers/PageContainer";
import CreatePageTitle from "@/components/scaffolding/containers/createPageTitle";
import AccountsDashboard from "./components/AccountsDashboard";

export default function AccountsPage() {
  return (
    <>
      <CreatePageTitle
        title="Accounts"
        byLine="Fleet-wide account overview and analytics"
        byLineBottom="Account mix, trials, setup status, and engagement signals"
      />
      <PageContainer padding="xs" spacing="lg">
        <AccountsDashboard />
      </PageContainer>
    </>
  );
}
